require("dotenv").config();
const ResumeEditorModern = require("../models/myTempModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const mongoose = require("mongoose");

const saveResume = async (req, res) => {
  try {
    const { _id, ...resumeData } = req.body;

    if (_id) {
      // Check if _id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      // Update existing resume
      const savedResume = await ResumeEditorModern.findByIdAndUpdate(
        _id,
        resumeData,
        { new: true }
      );
      if (!savedResume) {
        return res.status(404).json({ message: "Resume not found for update" });
      }
      return res
        .status(200)
        .json({ message: "Resume updated successfully", data: savedResume });
    } else {
      // Create new resume if _id is not provided
      const newResume = new ResumeEditorModern(resumeData);
      const savedResume = await newResume.save();
      return res
        .status(200)
        .json({ message: "Resume saved successfully", data: savedResume });
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    res
      .status(500)
      .json({ message: "Error saving resume", error: error.message });
  }
};

const enhanceField = async (req, res) => {
  try {
    const { resumeId, field, data } = req.body;
    if (!resumeId || !field || !data) {
      return res
        .status(400)
        .json({ message: "Resume ID, field, and data are required" });
    }

    const resume = await ResumeEditorModern.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    let prompt;
    switch (field) {
      case "summary":
        prompt = `Enhance the 'summary' section of a professional resume.
                  - Keep it concise and impactful.
                   - Improve wording to sound more professional.
                  - Optimize for ATS with keywords.
                  User Input: ${JSON.stringify(data)}
                  Return only valid JSON: {"${field}": ""}`;
        break;

      case "experience":
        prompt = `You are a resume expert. Enhance ONLY the "accomplishment" arrays in each experience object. Do not change other fields.

Each experience object includes:
- title
- companyName
- date
- companyLocation
- accomplishment: array of 2–5 short bullet points

📝 Instructions:
- DO NOT remove or skip any experience items.
- DO NOT change order of array or bullet points.
- Only enhance the text of each bullet point inside "accomplishment".
- Output MUST be a JSON array with all objects (even if input has 1 object).
- No explanation. Only JSON.

Input:
${JSON.stringify(data)}

Output format:
[
  {
    "title": "...",
    "companyName": "...",
    "date": "...",
    "companyLocation": "...",
    "accomplishment": [
      "Enhanced point 1",
      "Enhanced point 2"
    ]
  }
]
`;
        break;

      case "achievements":
        prompt = `Enhance the 'achievements' section of a professional resume.
  - Improve wording to sound more professional.
  - Highlight key accomplishments and recognition.
  - Include relevant details like the organization or issuer if applicable.
  User Input: ${JSON.stringify(data)}
  Return only valid JSON: {"achievements": []}`;

        break;

      default:
        prompt = `Enhance the '${field}' section of a professional resume.
                  - Keep it concise and impactful.
                  - Optimize for ATS with keywords.
                  User Input: ${JSON.stringify(data)}
                  Return only valid JSON: {"${field}": ""}`;
        break;
    }

    const result = await geminiModel.generateContent([prompt]);
    const responseText = result.response.text().trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");
    const cleanResponse = jsonMatch[0];
    const enhancedData = JSON.parse(cleanResponse);

    // Enhance the field based on AI response
    if (field === "experience") {
      // Map over existing experiences and update accomplishment only if enhanced version found
      resume.experience = resume.experience.map((exp) => {
        // Find matching enhanced experience by unique key (title + companyName)
        const enhancedExp = enhancedData.find(
          (e) => e.title === exp.title && e.companyName === exp.companyName
        );

        return {
          ...exp,
          accomplishment: enhancedExp?.accomplishment || exp.accomplishment,
        };
      });
    } else if (field === "achievements") {
      const transformedAchievements = (enhancedData.achievements || []).map(
        (item) => ({
          keyAchievements: item.title,
          describe: item.description,
          
        })
      );

      resume.achievements = transformedAchievements;
      console.log(
        "Enhanced Achievements Transformed:",
        transformedAchievements
      );
    } else {
      resume[field] = enhancedData[field] || resume[field];
    }

    // const updatedResume = await resume.save();
    const updatedResume = await ResumeEditorModern.findByIdAndUpdate(
      resumeId,
      {
        experience: resume.experience,
        achievements: resume.achievements,
        [field]: resume[field],
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: `${field} enhanced successfully`, data: updatedResume });
  } catch (error) {
    console.error("Error enhancing field:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

// getResume api for fetch data
const getResume = async (req, res) => {
  try {
    const resume = await ResumeEditorModern.findById(req.params.id); // ya .findById(req.params.id)
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res
      .status(500)
      .json({ message: "Error fetching resume", error: error.message });
  }
};

module.exports = { saveResume, enhanceField, getResume };
