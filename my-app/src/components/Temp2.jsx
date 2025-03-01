import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './Temp1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


const Temp2 = () => {
    const [showButtons, setShowButtons] = useState(true);
    const [resume, setResume] = useState({
        name: "Your Name",
        role: "The role you are applying for?",
        phone: "Phone",
        email: "Email",
        linkedin: "Linkedin/Portfolio",
        location: "Location",
        summary: "Briefly explain why you are great fit for this role. Like-I am a strong fit for the web developer role because of my comprehensive understanding of both frontend and backend technologies, including expertise in JavaScript, React, Node.js, and modern web development frameworks. I have experience building responsive, user-friendly applications and working with APIs to create dynamic, scalable solutions. My problem-solving skills, attention to detail, and ability to adapt to new technologies enable ",
        experience: [
            {
                title: 'Your Title',
                companyName: 'Company Name',
                date: 'Date',
                companyLocation: 'Company Location',
                description: 'Company Description. Like- web development company specializes in creating innovative, user-centric digital solutions that elevate brands and businesses. We offer end-to-end services including custom website development, e-commerce solutions, and mobile-responsive designs, ensuring seamless user experiences across all platforms. Leveraging the latest technologies like React, Node.js, and modern design principles, our team is committed to delivering ',
                accomplishment: 'Your accomplishment. Like-In their time at the web development company, this individual has consistently demonstrated exceptional technical skills and leadership, contributing significantly to the successful delivery of numerous high-profile projects. They played a pivotal role in developing scalable, user-friendly web applications, '
            }
        ],
        education: [
            {
                degree: 'Degree and Field of Study. Like- Btech/Information Technology',
                institution: 'School or University',
                duration: 'Date Period',
                grade: "grade or percentage like GPA:8.5"
            }
        ],
        achievements: [
            {
                keyAchievements: 'Your Achievement',
                describe: "Describe what you did ? Like-Your accomplishment. Like-In their time at the web development company, this individual has consistently demonstrated exceptional technical skills and leadership, contributing significantly to the successful delivery of numerous high-profile projects. They played a pivotal role in developing scalable, user-friendly web applications,"
            }
        ],
        certifications: [{
            certificates: 'Course Name',
            link: 'link of your certificate'
        }],
        skills: ['Your skills. Like-HTML , CSS', "Accounting & Budgeting",
            "Proficient with POS systems",
            "Excellent interpersonal and communication skills",
            "Poised under pressure",
            "Experienced in most restaurant positions",
            "Fun and energetic"],
        projects: [{
            pname: 'Project Name',
            pdate: 'Date period',
            psummary: 'Summary of your work.A weather app built with React allows users to view real-time weather information. It fetches data from APIs, displaying current temperature, humidity, and forecasts. React components manage state and UI updates, while hooks like useState and useEffect handle data fetching and UI rendering efficiently.'
        }]
    });



    const [visibleSections, setVisibleSections] = useState({
        summary: true,
        experience: true,
        education: true,
        achievements: true,
        skills: true,
        certifications: true,
        projects: true,
    });



    const [isOpen, setIsOpen] = useState(false);

    const sections = [
      "Summary",
      "Experience",
      "Education",
      "Skills",
      "Projects",
      "Certifications",
      "Achievements",
    ];



    const removeBlock = (block) => {
        setVisibleSections({ ...visibleSections, [block]: false });
    };

    const downloadPdf = async () => {
        // Select buttons to hide
        const buttons = document.querySelectorAll('.download-btn');
        const entryButtons = document.querySelectorAll('.add-btn, .remove-btn');
        const removeSectionButtons = document.querySelectorAll('.remove-section-btn');

        // Hide the buttons
        buttons.forEach(button => button.style.display = 'none');
        entryButtons.forEach(button => button.style.display = 'none');
        removeSectionButtons.forEach(button => button.style.display = 'none');

        // Color mapping for Tailwind classes
        const colorMap = {
            'blue': '#3b82f6',
            'purple': '#9333ea',
            'red': '#ef4444',
            'green': '#22c55e',
            'yellow': '#eab308',
            'gray': '#6b7280',
            'white': '#ffffff',
            'black': '#000000'
        };

        try {
            // Clone the element to avoid modifying the original
            const element = document.getElementById("resumeBody");
            const clone = element.cloneNode(true);

            // Process all elements with potentially problematic styles
            const allElements = clone.querySelectorAll('*');

            allElements.forEach(el => {
                // Handle background colors
                if (el.classList) {
                    el.classList.forEach(className => {
                        // Process bg-color classes
                        if (className.startsWith('bg-')) {
                            // Extract color name (e.g., 'blue' from 'bg-blue-600')
                            const colorParts = className.split('-');
                            if (colorParts.length >= 2) {
                                const colorName = colorParts[1];
                                // Apply a safe color if we have a mapping
                                if (colorMap[colorName]) {
                                    el.style.backgroundColor = colorMap[colorName];
                                    el.classList.remove(className);
                                }
                            }
                        }

                        // Process text color classes
                        if (className.startsWith('text-')) {
                            const colorParts = className.split('-');
                            if (colorParts.length >= 2) {
                                const colorName = colorParts[1];
                                if (colorMap[colorName]) {
                                    el.style.color = colorMap[colorName];
                                    el.classList.remove(className);
                                }
                            }
                        }
                    });
                }
            });

            // Fix header alignment issues
            const headings = clone.querySelectorAll('.headings');
            headings.forEach(heading => {
                // Apply explicit styles to ensure proper alignment
                heading.style.textAlign = 'left';
                heading.style.fontWeight = 'bold';
                heading.style.fontSize = '18px';
                heading.style.marginTop = '15px';
                heading.style.marginBottom = '8px';
                heading.style.borderBottom = '1px solid #ccc';
                heading.style.paddingBottom = '5px';
                heading.style.width = '100%';
                heading.style.display = 'block';
            });

            // Fix first block alignment
            const firstBlock = clone.querySelector('.firstBlock');
            if (firstBlock) {
                firstBlock.style.textAlign = 'left';
                firstBlock.style.marginBottom = '20px';
            }

            // Fix section blocks alignment
            const sectionBlocks = clone.querySelectorAll('.summaryblock, .experienceblock, .educationblock, .achievementblock, .skillsblock, .certificationcourse, .projectblock');
            sectionBlocks.forEach(block => {
                block.style.width = '100%';
                block.style.marginBottom = '15px';
                block.style.textAlign = 'left';
            });

            // Create a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.appendChild(clone);
            document.body.appendChild(tempContainer);

            // Configure html2pdf options
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: "resume.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    // This can help with layout issues
                    windowWidth: 1024,
                    letterRendering: true
                },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "portrait",
                    compress: true
                }
            };

            // Generate PDF
            await html2pdf().from(clone).set(options).save();

            // Clean up
            document.body.removeChild(tempContainer);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert('Error generating PDF: ' + error.message);
        } finally {
            // Show buttons again
            buttons.forEach(button => button.style.display = 'block');
            entryButtons.forEach(button => button.style.display = 'block');
            removeSectionButtons.forEach(button => button.style.display = 'block');
        }
    };





    const handleUserContent = (section, key, value, index = null) => {
        const updatedResume = { ...resume };
        if (Array.isArray(updatedResume[section])) {
            if (index !== null) updatedResume[section][index][key] = value;
        } else {
            updatedResume[section] = value;
        }
        setResume(updatedResume);
    };


    const addNewEntry = (section) => {
        const updatedResume = { ...resume };
        const newEntry = section === "experience" ? {
            title: 'Your Title',
            companyName: 'Company Name',
            date: 'Date',
            companyLocation: 'Company Location',
            description: 'Company Description. Like- web development company specializes in creating innovative, user-centric digital solutions that elevate brands and businesses. We offer end-to-end services including custom website development, e-commerce solutions, and mobile-responsive designs, ensuring seamless user experiences across all platforms. Leveraging the latest technologies like React, Node.js, and modern design principles, our team is committed to delivering ',
            accomplishment: 'Your accomplishment. Like-In their time at the web development company, this individual has consistently demonstrated exceptional technical skills and leadership, contributing significantly to the successful delivery of numerous high-profile projects. They played a pivotal role in developing scalable, user-friendly web applications, '
        } : section === "education" ? {
            degree: 'Degree and Field of Study. Like- Btech/Information Technology',
            institution: 'School or University',
            duration: 'Date Period',
            grade: "grade or percentage like GPA:8.5"
        } :
            section === "certifications" ? {
                certificates: 'Course Name',
                link: 'link of your certificate'
            } :
                section === "projects" ? {
                    pname: 'Project Name',
                    pdate: 'Date period',
                    psummary: 'Summary of your work.A weather app built with React allows users to view real-time weather information. It fetches data from APIs, displaying current temperature, humidity, and forecasts. React components manage state and UI updates, while hooks like useState and useEffect handle data fetching and UI rendering efficiently.'
                } : {
                    keyAchievements: 'Your Achievement',
                    describe: "Describe what you did"
                };

        updatedResume[section].push(newEntry);
        setResume(updatedResume);
    };

    // Remove Entry Function
    const removeEntry = (section, index) => {
        const updatedResume = { ...resume };
        updatedResume[section].splice(index, 1); // Remove the item at the specified index
        setResume(updatedResume);
    };


    return (
        <div className="mainbody">
            <div className="flex flex-wrap gap-3 sm:gap-5 my-3 justify-center">
                <button
                    onClick={downloadPdf}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                >
                    Download PDF
                </button>




                <div className="relative inline-block">
                    {/* Dropdown Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full sm:w-auto"
                    >
                        Enhance with AI ▼
                    </button>

                    {/* Dropdown Menu (No Functionality) */}
                    {isOpen && (
                        <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition duration-200"
                                >
                                    {section}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            

                <button
                    // onClick={createResume}
                    className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-semibold py-2 px-4 sm:px-2 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                >
                    Create Resume
                </button>
            </div>





            <div className="editResume">
                <div id="resumeBody">
                    <div className="firstBlock"
                        contentEditable
                        suppressContentEditableWarning>
                        <div
                            className="user-name"
                            contentEditable
                            suppressContentEditableWarning

                            onBlur={(e) => handleUserContent("name", e.target.textContent)}
                        >
                            <h2 className='res-h2'> {resume.name}</h2>
                        </div>
                        <div
                            className="user-role"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUserContent("role", e.target.textContent)}
                        >
                            {resume.role}
                        </div>
                        <div className="user-contacts">
                            <div
                                className="user-phone"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("phone", e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faPhone} />  {resume.phone} |
                            </div>
                            <div
                                className="user-email"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("email", e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faEnvelope} />  {resume.email} |
                            </div>
                            <div
                                className="user-linkedin"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("linkedin", e.target.textContent)}
                            >
                                {resume.linkedin} |
                            </div>
                            <div
                                className="user-location"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUserContent("location", e.target.textContent)}
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {resume.location}
                            </div>
                        </div>
                    </div>

                    {visibleSections.summary && (
                        <div>
                            <div className="summaryblock">
                                <h3 className="headings">Summary</h3>
                                <div className="user-summary" contentEditable suppressContentEditableWarning onBlur={(e) => handleUserContent("summary", e.target.textContent)}>
                                    {resume.summary}
                                </div>
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto" onClick={() => removeBlock("summary")}>Remove Summary</button>
                        </div>
                    )}



                    {visibleSections.experience && (
                        <div>
                            <div className="experienceblock">
                                <h3 className="headings">Experience</h3>

                                {resume.experience.map((exp, idx) => (
                                    <div key={idx} className="user-experience">
                                        <div className="exp1">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("experience", "companyName", e.target.textContent, idx)}
                                            >
                                                <p className='para1'>{exp.companyName}</p>
                                            </div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("experience", "companyLocation", e.target.textContent, idx)}
                                            >
                                                <p className='para2'>{exp.companyLocation}</p>
                                            </div>
                                        </div>
                                        <div className="exp1">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("experience", "title", e.target.textContent, idx)}
                                            >
                                                <p className='para1'>{exp.title}</p>
                                            </div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("experience", "date", e.target.textContent, idx)}
                                            >
                                                <p className='para2'>{exp.date}</p>
                                            </div>
                                        </div>
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("experience", "description", e.target.textContent, idx)}
                                        >
                                            {exp.description}
                                        </div>
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("experience", "accomplishment", e.target.textContent, idx)}
                                        >
                                            {exp.accomplishment}
                                        </div>
                                        {resume.experience.length > 1 && (
                                            <button onClick={() => removeEntry("experience", idx)}
                                                className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto" >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addNewEntry("experience")} className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                    + New Entry
                                </button>

                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                                onClick={() => removeBlock("experience")} style={{ margin: "10px 0px" }}>Remove Experience</button>
                        </div>
                    )}


                    {visibleSections.education && (
                        <div>
                            <div className="educationblock">
                                <h3 className="headings">Education</h3>

                                {resume.education.map((edu, idx) => (
                                    <div key={idx} className="user-education">
                                        <div className="exp1">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) =>
                                                    handleUserContent("education", "institution", e.target.textContent, idx)
                                                }
                                            >
                                                <p className='para1'>{edu.institution}</p>
                                            </div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("education", "grade", e.target.textContent, idx)}
                                            >
                                                <p className='para3'>{edu.grade}</p>
                                            </div>
                                        </div>

                                        <div className="exp1">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("education", "degree", e.target.textContent, idx)}
                                            >
                                                <p className='para2'>{edu.degree}</p>
                                            </div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("education", "duration", e.target.textContent, idx)}
                                            >
                                                <p className='para3'>{edu.duration}</p>
                                            </div>
                                        </div>

                                        {resume.education.length > 1 && (
                                            <button onClick={() => removeEntry("education", idx)} className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addNewEntry("education")} className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                    + New Entry
                                </button>
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                                onClick={() => removeBlock("education")} style={{ margin: "10px 0px" }}>Remove Education</button>
                        </div>
                    )}

                    {visibleSections.achievements && (
                        <div>
                            <div className="achievementblock">
                                <h3 className="headings">Key Achievements</h3>
                                {resume.achievements.map((ach, idx) => (
                                    <div key={idx} className="user-education">
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("achievements", "keyAchievements", e.target.textContent, idx)}
                                        >
                                            <p className='para2'>{ach.keyAchievements}</p>
                                        </div>

                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("achievements", "describe", e.target.textContent, idx)}
                                        >
                                            <p className='para3'>{ach.describe}</p>
                                        </div>
                                        {resume.achievements.length > 1 && (
                                            <button onClick={() => removeEntry("achievements", idx)} className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addNewEntry("achievements")} className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                    + New Entry
                                </button>
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                                onClick={() => removeBlock("achievements")} style={{ margin: "10px 0px" }}>Remove Achievements</button>
                        </div>)}

                    {visibleSections.skills && (
                        <div className="skillsblock">
                            <h3 className="headings">Skills</h3>
                            <div contentEditable suppressContentEditableWarning onBlur={(e) => handleUserContent("skills", null, e.target.textContent.split(", "))}>
                                {resume.skills.join(", ")}
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                                onClick={() => removeBlock("skills")}>Remove Skills</button>
                        </div>
                    )}

                    {visibleSections.certifications && (
                        <div>
                            <div className="certificationcourse">
                                <h3 className="headings">Certification</h3>
                                {resume.certifications.map((cer, idx) => (
                                    <div key={idx} className="user-certificate">
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("certifications", "certificates", e.target.textContent, idx)}
                                        >
                                            <p className='para2'>{cer.certificates}</p>
                                        </div>

                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("certifications", "link", e.target.textContent, idx)}
                                        >
                                            <p className='para3'>{cer.link}</p>
                                        </div>
                                        {resume.certifications.length > 1 && (
                                            <button onClick={() => removeEntry("certifications", idx)} className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addNewEntry("certifications")} className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                    + New Entry
                                </button>
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto"
                                onClick={() => removeBlock("certifications")} style={{ margin: "10px 0px" }}>Remove Certifications</button>
                        </div>
                    )}

                    {visibleSections.projects && (
                        <div>
                            <div className="projectblock">
                                <h3 className="headings">Projects</h3>
                                {resume.projects.map((prj, idx) => (
                                    <div key={idx} className="user-project">
                                        <div className="exp1">
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) =>
                                                    handleUserContent("projects", "pname", e.target.textContent, idx)
                                                }
                                            >
                                                <p className='para1'>{prj.pname}</p>
                                            </div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleUserContent("projects", "pdate", e.target.textContent, idx)}
                                            >
                                                <p className='para2'>{prj.pdate}</p>
                                            </div>
                                        </div>
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUserContent("projects", "psummary", e.target.textContent, idx)}
                                        >
                                            <p className='para2'>{prj.psummary}</p>
                                        </div>

                                        {resume.projects.length > 1 && (
                                            <button onClick={() => removeEntry("projects", idx)} className="remove-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto ">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addNewEntry("projects")} className="add-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto">
                                    + New Entry
                                </button>
                            </div>
                            <button className="remove-section-btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 ease-in-out  sm:w-auto" onClick={() => removeBlock("projects")} style={{ margin: "10px 0px" }}>Remove Projects</button>
                        </div>)}
                </div>
            </div>
        </div>
    );
};

export default Temp2;
