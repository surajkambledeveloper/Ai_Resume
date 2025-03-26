import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCog, FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";

export const Temp7 = () => {
  const [resume, setResume] = useState({
    name: "NITHYA SREE",
    designation: "Graphic Designer | Logo Design Specialist | UX Optimization",
    contact: "+91 9876543210  |  nithya@gmail.com  |  www.linkedin.com/in/nithya",
    summary: [
      "Creative and skilled Graphic Designer with over 3 years of experience in logo design, posters, flyers, business cards, and invitations.",
      "Proficient in using various design tools to create visually compelling designs that align with clients' needs and brand identity.",
      "Passionate about developing unique visual concepts and delivering impactful design solutions."
    ],
    skills: ["User -Centered Design", "Adobe Illustrator", "Adobe Photoshop", "Wireframing & Prototyping"],
    experience: [
      {
        title: "Junior Graphic Designer",
        company: "XYZ Design Studio",
        dates: { from: "March 2021", to: "Present" },
        details: "Designed branding materials, improving brand identity for clients."
      }
    ],
    achievements: [
      {
        title: "Best Junior Graphic Designer",
        achievements: [
          "Designed branding materials, improving brand identity for clients.",
          "Developed a new branding strategy for a startup, resulting in a 25% rise in customer engagement."
        ]
      }
    ],
    education: [
      { degree: "Bachelor of Fine Arts in Graphic Design", date: "June 2020", school: "Madras University, Chennai" }
    ],
    courses: [
      { title: "Graphic Design Specialization", issuedby: "Google", date: "January 2020" },
    ],
    languages: [],
    projects: []

  });

  const [resumeSections, setResumeSections] = useState([]);
  
  const handleAddSection = (sectionid) => {
    setResumeSections((prevSections) => [...prevSections, sectionid]);
  };  
  

  const [activeSection, setActiveSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    designation: true,
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    title: true,
    company: true,
    dates: true,
    details: true,
    achievements: true,
    education: true,
    degree: true,
    school: true,
    issuedby: true
  });

  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateType, setDateType] = useState("from");
  const [presentChecked, setPresentChecked] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);
  const [showExperienceSettings, setShowExperienceSettings] = useState(false);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(null);
  const [showEducationSettings, setShowEducationSettings] = useState(false);
  const [showAchievementsSettings, setShowAchievementsSettings] = useState(false);
  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(null);
  const [showCoursesSettings, setShowCoursesSettings] = useState(false);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowExperienceSettings(null);
        setShowAchievementsSettings(false);
        setShowEducationSettings(false);
        setShowCoursesSettings(false);
        setShowSettings(false);
      }
      
    };
     // Fetch resume data from backend
    const email = "neel.grey@example.com";  // Replace with actual user email
    axios.get(`http://localhost:5000/api/resume/load?email=${email}`)
      .then(response => setResume(response.data))
      .catch(error => console.error("Error fetching resume:", error));

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

const saveResume = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/resume/save", {
      resumeData: resume
    });
    if (response.data?.data?._id) {
      setResume(prev => ({ ...prev, _id: response.data.data._id }));
      alert("Resume saved successfully!");
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    alert("Failed to save resume.");
  }
};

const enhanceSingleField = async (category, fieldName, userInput) => {
  try {
    const prompt = `Enhance this ${category} field '${fieldName}': ${userInput}`;
    const result = await geminiModel.generateContent([prompt]);
    return result.response.text().trim();
  } catch (error) {
    return userInput;
  }
};


const downloadPdf = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/resume/generate-pdf",
      { resumeData: resume },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Download failed:", error);
    alert("PDF generation failed.");
  }
};

  const handleSelectSection = (section) => {
    console.log("Selected Section:", section);
  };

  const handleToggleField = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...resume.skills];
    updatedSkills[index] = value;
    setResume({ ...resume, skills: updatedSkills });
  };

  const addSkill = () => {
    setResume({ ...resume, skills: [...resume.skills, "New Skill"] });
  };

  const removeSkill = (index) => {
    if (index !== null && resume.skills.length > 0) {
      const updatedSkills = [...resume.skills];
      updatedSkills.splice(index, 1);
      setResume({ ...resume, skills: updatedSkills });
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        { title: "New Position", company: "New Company", dates: { from: "MM/YYYY", to: "MM/YYYY" }, details: "Details here" }
      ]
    });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index)
    });
  };

  const updateDate = (date, index) => {
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace(",", "");
    const updatedExperience = [...resume.experience];
    updatedExperience[index].dates[dateType] = formattedDate;
    if (dateType === "to" && presentChecked) {
      updatedExperience[index].dates.to = "Present";
    }
    setResume({ ...resume, experience: updatedExperience });
  };

  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [
        ...resume.achievements,
        { title: "New Achievement", achievements: ["Achievement details"] }
      ]
    });
  };

  const removeAchievement = (index) => {
    setResume({
      ...resume,
      achievements: resume.achievements.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        { degree: "New Degree", dates: { from: "MM/YYYY", to: "MM/YYYY" }, school: "New School" }
      ]
    });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  const addCourses = () => {
    setResume({
      ...resume,
      courses: [
        ...resume.courses,
        { title: "New title", issuedby: "New Issued by", dates: { from: "MM/YYYY", to: "MM/YYYY" } }
      ]
    });
  };

  const removeCourses = (index) => {
    setResume({
      ...resume,
      courses: resume.courses.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="resume-main-container flex justify-center py-10" onClick={() => {
      setActiveSection(null);
      setShowSettings(false);
    }}>
      <Sidebar 
        onAddSection={handleAddSection} 
        onSelectSection={handleSelectSection}
        downloadPdf={downloadPdf}
      />
  
      {/* Main Content Area */}
      <div className="resume-wrapper flex bg-white shadow-lg rounded-lg w-[1000px] ml-[250px] p-8 relative">
        {activeSection === "name" && (
          <FaCog
            className="absolute top-4 right-4 cursor-pointer text-gray-500 text-xl"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
          />
        )}
  
        <div className="resume-content-container flex-1"></div>
        {resumeSections.map((section) => (
          <div key={section.id} className="resume-section">
            <h2 className="font-bold text-lg">{section.title}</h2>
            <div>{section.content}</div>
          </div>
        ))}
  
        <div id="resume-content">
          {/* Name Section */}
          <div className="name-section text-left pb-6" onClick={(e) => {
            e.stopPropagation();
            setActiveSection("name");
          }}>
            {visibleFields.name && (
              <div className="resume-name-input font-bold text-3xl" contentEditable suppressContentEditableWarning>
                {resume.name}
              </div>
            )}
            {visibleFields.designation && (
              <div className="resume-designation-input text-lg text-blue-700" contentEditable suppressContentEditableWarning>
                {resume.designation}
              </div>
            )}
            {visibleFields.contact && (
              <div className="resume-contact-input text-sm text-black-500" contentEditable suppressContentEditableWarning>
                {resume.contact}
              </div>
            )}
          </div>
  
          {/* Settings Popup */}
          {showSettings && (
            <div className="settings-popup p-4 bg-gray-100 rounded-lg shadow-lg absolute top-12 right-4" onClick={(e) => e.stopPropagation()}>
              {[
                { field: "name", label: "Show Name" },
                { field: "designation", label: "Show Designation" },
                { field: "contact", label: "Show Contact" }
              ].map(({ field, label }) => (
                <div key={field} className="toggle-row flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  
                  {/* Toggle Switch */}
                  <label className="relative inline-block w-10 h-5">
                    <input
                      type="checkbox"
                      checked={visibleFields[field]}
                      onChange={() => handleToggleField(field)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition ${
                        visibleFields[field] ? "bg-green-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition transform ${
                          visibleFields[field] ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </span>
                  </label>
  
                </div>
              ))}
            </div>
          )}

          {/* Profile & Skills Section */}
          <div className="resume-summary-skills-container grid grid-cols-2 gap-6">
            {/* Profile Section */}
            {visibleFields.summary && (
                <div className="resume-summary-section pb-4" onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("profile");
                }}>
                  <h3 className="text-lg font-bold uppercase border-b pb-2">Profile</h3>
                  <div contentEditable suppressContentEditableWarning className="text-gray-700 mt-2">
                    {resume.summary.join("\n")}
                  </div>
                </div>
              )}
  
              {/* Key Skills Section */}
              {visibleFields.skills && (
                <div className="resume-skills-section pb-4" onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("skills");
                }}>
                  <h3 className="text-lg font-bold uppercase border-b pb-2">Key Skills</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2">
                    {resume.skills.map((skill, index) => (
                      <li key={index} className="skill-item">
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSkillChange(index, e.target.textContent)}
                          className="inline-block"
                        >
                          {skill}
                        </div>
                      </li>
                    ))}

                    {/* Add/Remove Skill Actions */}
                    {activeSection === "skills" && (
                      <div className="flex gap-3 mt-3">
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded shadow"
                          onClick={addSkill}
                        >
                          <FaPlus className="icon" />
                          <span>New Skill</span>
                          <FaTrash
                            className="icon ml-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering addSkill when clicking delete
                              removeSkill(selectedSkillIndex);
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </ul>
                </div>
              )}
          </div>
              
          <div className="resume-experience-achievements-container grid grid-cols-2 gap-6">
            {/* Work Experience Section */}
            <div
              className="resume-experience-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("experience");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">WORK EXPERIENCE</h3>
              {resume.experience.map((exp, index) => (
                <div key={index} className="experience-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  {visibleFields.title && (
                    <div className="text-lg font-semibold" contentEditable>
                      {exp.title}
                    </div>
                  )}
                  {visibleFields.company && (
                    <div className="text-gray-700 mt-2" contentEditable>
                      {exp.company}
                    </div>
                  )}
                  {visibleFields.dates && exp.dates ? (
                    <div className="text-gray-700 mt-2 text-sm">
                      {exp.dates.from || "N/A"} - {exp.dates.to || "N/A"}
                    </div>
                  ) : null}
                  {visibleFields.details && (
                    <div className="text-gray-700" contentEditable>
                      {exp.details}
                    </div>
                  )}

                  {activeSection === "experience" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addExperience}
                      >
                        <FaPlus className="icon" />
                        <span>New Experience</span>
                      </button>

                      <button
                        className="px-3 py-2 bg-red-500 text-white rounded-full shadow-md"
                        onClick={() => {
                          console.log("Deleting index:", index);  // Debugging index
                          removeExperience(index);
                        }}
                      >
                        <FaTrash className="icon" />
                      </button>

                      <button
                        className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked calendar for index:", index);
                          setShowDatePicker((prev) => (prev === index ? null : index));
                        }}
                      >
                        <FaCalendarAlt className="icon" />
                      </button>
              
                      <button
                        className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked settings for index:", index);
                          setShowExperienceSettings((prev) => (prev === index ? null : index));
                        }}
                      >
                        <FaCog className="icon" />
                      </button>
                    </div>
                  )}

                
                  {showExperienceSettings === index && (
                    <div  ref={settingsRef} className="absolute left-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
                      {["title", "company", "dates", "details"].map((field) => (
                        <div key={field} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleFields[field]}
                              onChange={() => handleToggleField(field)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
                              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>  
                  )}

                  {/* Date Picker */}
                  {showDatePicker === index && (
                    <div className="mt-2 p-4 border rounded-lg shadow-md bg-gray-100 w-full">
                      <div className="flex gap-2 mb-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setDateType("from")}>
                          From
                        </button>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setDateType("to")}>
                          To
                        </button>
                      </div>
                      <DatePicker
                        selected={exp.dates?.[dateType] && exp.dates[dateType] !== "Present" ? new Date(exp.dates[dateType]) : null}
                        onChange={(date) => updateDate(date, index)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                      />
                      {dateType === "to" && (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={presentChecked}
                            onChange={() => setPresentChecked(!presentChecked)}
                          />
                          <label>Present</label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>


           {/* Key Achievements Section */}
            <div
              className="resume-achievements-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("achievements");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">KEY ACHIEVEMENTS</h3>
              {resume.achievements.map((ach, index) => (
                <div
                  key={index}
                  className="achievements-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full"
                  onClick={() => setSelectedAchievementIndex(index)}
                >
                  {visibleFields.title && (
                    <div className="text-lg font-semibold" contentEditable>
                      {ach.title}
                    </div>
                  )}
                  {visibleFields.achievements && (
                    <ul className="text-gray-700 mt-2">
                      {ach.achievements.map((achievement, i) => (
                        <li key={i} contentEditable>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeSection === "achievements" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addAchievement}
                      >
                        <FaPlus className="icon" />
                        <span>New Achievement</span>
                      </button>

                      <button
                        className="px-3 py-2 bg-red-500 text-white rounded-full shadow-md"
                        onClick={() => {
                          if (selectedAchievementIndex !== null) {
                            removeAchievement(selectedAchievementIndex);
                          }
                        }}
                      >
                        <FaTrash className="icon" />
                      </button>

                      <button
                        className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked settings for index:", index);
                          setShowAchievementsSettings((prev) => (prev === index ? null : index));
                        }}
                      >
                        <FaCog className="icon" />
                      </button>
                    </div>
                  )}

                  {/* Settings Panel */}
                  {showAchievementsSettings === index && (
                    <div ref={settingsRef} className="absolute right-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
                      {["title", "achievements"].map((field) => (
                        <div key={field} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleFields[field]}
                              onChange={() => handleToggleField(field)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
                              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="resume-education-courses-container grid grid-cols-2 gap-6">
            { /* Education Section */}
            <div
              className="resume-education-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("education");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">EDUCATION</h3>
              {resume.education.map((edu, index) => (
                <div key={index} className="education-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  {visibleFields.degree && (
                    <div className="text-lg font-semibold" contentEditable>
                      {edu.degree}
                    </div>
                  )}
                  {visibleFields.school && (
                    <div className="text-gray-600" contentEditable>
                      {edu.school}
                    </div>
                  )}
                  {visibleFields.dates && edu.dates ? (
                    <div className="text-gray-500 text-sm">
                      {edu.dates.from || "N/A"} - {edu.dates.to || "N/A"}
                    </div>
                  ) : null}

                  {activeSection === "education" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addEducation}
                      >
                        <FaPlus className="icon" />
                        <span>New Education</span>
                      </button>

                      <button
                        className="px-3 py-2 bg-red-500 text-white rounded-full shadow-md"
                        onClick={() => removeEducation(index)}
                      >
                        <FaTrash className="icon" />
                      </button>

                      <button
                        className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked settings for index:", index);
                          setShowEducationSettings((prev) => (prev === index ? null : index));
                        }}
                      >
                        <FaCog className="icon" />
                      </button>
                    </div>
                  )}

                  {/* Settings Panel */}
                  {showEducationSettings === index && (
                    <div ref={settingsRef} className="absolute left-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
                      {["degree", "school"].map((field) => (
                        <div key={field} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleFields[field]}
                              onChange={() => handleToggleField(field)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
                              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
        
            { /* Courses Section */ }
            <div
              className="resume-courses-section w-full pb-4"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("courses");
              }}
            >
              <h3 className="text-lg font-bold uppercase border-b pb-2 w-full">COURSES</h3>
              {resume.courses.map((cou, index) => (
                <div key={index} className="course-entry p-4 mb-4 bg-white shadow-md rounded-lg w-full">
                  {visibleFields.title && (
                    <div className="text-lg font-semibold" contentEditable>
                      {cou.title}
                    </div>
                  )}
                  {visibleFields.issuedby && (
                    <div className="text-gray-600" contentEditable>
                      {cou.issuedby}
                    </div>
                  )}
                  {visibleFields.dates && cou.dates ? (
                    <div className="text-gray-500 text-sm">
                      {cou.dates.from || "N/A"} - {cou.dates.to || "N/A"}
                    </div>
                  ) : null}

                  {activeSection === "courses" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white shadow-lg"
                        onClick={addCourses}
                      >
                        <FaPlus className="icon" />
                        <span>New Course</span>
                      </button>

                      <button
                        className="px-3 py-2 bg-red-500 text-white rounded-full shadow-md"
                        onClick={() => removeCourses(index)}
                      >
                        <FaTrash className="icon" />
                      </button>

                      <button
                        className="px-3 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked settings for index:", index);
                          setShowCoursesSettings((prev) => (prev === index ? null : index));
                        }}
                      >
                        <FaCog className="icon" />
                      </button>
                    </div>
                  )}

                  {/* Settings Panel */}
                  {showCoursesSettings === index && (
                    <div ref={settingsRef} className="absolute right-10 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
                      {["title", "issuedby"].map((field) => (
                        <div key={field} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Show {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleFields[field]}
                              onChange={() => handleToggleField(field)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 relative">
                            <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp7;