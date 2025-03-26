// import { enhanceWithGemini } from "../services/geminiService.js";
const enhanceWithGemini = require("../services/geminiService.js");
const puppeteer = require('puppeteer');
// import Resume from "../models/resumeModel.js";
const ResumeTemp3 = require("../models/resumeModel.js");

 const enhanceResume = async (req, res) => {
  try {
    const { section, content, experienceTitle, experienceYears, skills, education } = req.body;

    console.log("Received API request for enhancement:", req.body);

    if (!section || !content) {
      return res.status(400).json({ error: "Missing section or content" });
    }

    let enhancedContent;

    if (section === "profile") {
      // ✅ Pass full data to AI for profile enhancement
      enhancedContent = await enhanceWithGemini(section, {
        content,
        experienceTitle,
        experienceYears,
        skills,
        education
      });
    } 
    else if (section === "experience" || section === "projects") {
      // ✅ Enhance experiences/projects properly
      enhancedContent = await Promise.all(
        content.map(async (item) => {
          const enhancedText = await enhanceWithGemini(section, item.description || item.bullets);
          return {
            id: item.id,
            ...(section === "experience" ? { bullets: enhancedText } : { description: enhancedText })
          };
        })
      );
    } 
    else {
      return res.status(400).json({ error: "Invalid section provided" });
    }

    // ✅ Ensure AI response is valid
    if (!enhancedContent || (Array.isArray(enhancedContent) && enhancedContent.length === 0)) {
      console.error("Unexpected AI response:", enhancedContent);
      return res.status(500).json({ error: "AI returned an invalid response" });
    }

    console.log("Sending AI-enhanced response:", enhancedContent);
    res.json({ section, enhancedContent });

  } catch (error) {
    console.error("Error enhancing resume:", error);
    res.status(500).json({ error: "Failed to enhance resume", details: error.message });
  }
};



//  const handleGeneratePdf = async (req, res) => {
//   try {
//     const { clientURL } = req.body;
//     if (!clientURL) {
//       return res.status(400).json({ message: "Client URL is required" });
//     }

//     console.log("✅ Received request to generate PDF from:", clientURL);

//     // 1️⃣ Launch Puppeteer and open the frontend URL
//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.goto(clientURL, { waitUntil: "networkidle2" });

//     // 2️⃣ Remove the Left Section and Hide Sidebars/Buttons
//     await page.waitForSelector("#resume-container", { visible: true });

//     await page.evaluate(async () => {
//       const leftSection = document.querySelector(".left-section"); // Change selector if needed
//       if (leftSection) leftSection.remove(); // Completely remove left section

//       document.querySelectorAll("button, .sidebar, .nav").forEach(el => {
//         el.style.display = "none"; // Hide buttons and sidebars
//       });
//       return new Promise((resolve) => {
//         setTimeout(resolve, 2000); // Wait 3 seconds for state updates
//       });
//     })
//     ;

//     // 3️⃣ Get the resume section's exact dimensions
//     const resumeElement = await page.$("#resume-container");
//     if (!resumeElement) {
//       throw new Error("Resume container not found!");
//     }

//     const boundingBox = await resumeElement.boundingBox();
//     if (!boundingBox) {
//       throw new Error("Unable to get bounding box of resume container.");
//     }

//     // 4️⃣ Generate PDF with only the resume section
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       clip: {
//         x: boundingBox.x,
//         y: boundingBox.y,
//         width: boundingBox.width,
//         height: boundingBox.height,
//       },
//     });

//     await browser.close();

//     // 5️⃣ Send the generated PDF
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=resume.pdf",
//       "Content-Length": pdfBuffer.length,
//     });
//     res.end(pdfBuffer);
//   } catch (error) {
//     console.error("❌ PDF Generation Error:", error);
//     res.status(500).json({ message: "PDF generation failed", error: error.message });
//   };



const handleGeneratePdf = async (req, res) => {
  try {
    const { clientURL } = req.body;
    if (!clientURL) {
      return res.status(400).json({ message: "Client URL is required" });
    }

    console.log("✅ Received request to generate PDF from:", clientURL);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    console.log("Navigating to URL:", clientURL);
    await page.goto(clientURL, { waitUntil: "networkidle2" });

    await page.screenshot({ path: "screenshot.png" });
    console.log("Screenshot saved as screenshot.png");

    console.log("Waiting for #resume-container...");
    await page.waitForSelector("#resume-container", { visible: true, timeout: 60000 });

    console.log("Adding a 2-second delay...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.evaluate(() => {
      const leftSection = document.querySelector(".left-section");
      if (leftSection) leftSection.remove();

      document.querySelectorAll("button, .sidebar, .nav").forEach((el) => {
        el.style.display = "none";
      });
    });

    const resumeElement = await page.$("#resume-container");
    if (!resumeElement) {
      throw new Error("Resume container not found!");
    }

    const boundingBox = await resumeElement.boundingBox();
    if (!boundingBox) {
      throw new Error("Unable to get bounding box of resume container.");
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

const saveResume = async (req, res) => {
  try {
    const { profileSectionText, experiences, projects, education, certifications, skills } =
      req.body;

    console.log("Received data to save:", req.body);

    let resume = await ResumeTemp3.findOne();
    if (!resume) {
      resume = new ResumeTemp3({});
    }

    resume.profile = profileSectionText;
    resume.experiences = experiences;
    resume.projects = projects;
    resume.education = education;
    resume.certifications = certifications;
    resume.skills = skills;

    await resume.save();
    res.json({ message: "Resume saved successfully!" });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Failed to save resume", details: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await ResumeTemp3.findOne();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};


module.exports = {getResume, enhanceResume, handleGeneratePdf, saveResume} ;