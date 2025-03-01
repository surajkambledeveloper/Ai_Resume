import React, { useState, useRef } from 'react';
import axios from 'axios';
import "../App.css";  

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState({
    name: 'Aditya Tiwary',
    role: 'Experienced Business Analyst | Supply Chain Optimization | Data Analytics',
    phone: '+44 20 7123 4567',
    email: 'aditya@40gmail.com',
    linkedin: 'linkedin.com',
    location: 'Birmingham',
    summary:
      'With over 9 years of experience in business analysis, supply chain management, and logistics, I have a proven record of reducing costs while enhancing efficiency and customer satisfaction. My expertise includes running advanced business models, financial reporting, and streamlining processes to refine supply chain operations. I am eager to contribute to your commitment to sustainability and the journey to net zero.',
    experience: [
      {
        title: 'Supply Chain Analyst',
        companyName: 'Unilever',
        date: '01/2019 - 12/2022',
        companyLocation: 'London, UK',
        description:
          'Led a cross-functional team to streamline logistics processes, reducing overall supply chain costs by 15% within 12 months.',
        accomplishment: 'Optimized inventory levels and supplier performance.'
      }
    ],
    education: [
      {
        degree: 'MSc Supply Chain and Logistics Management',
        institution: 'University of Warwick',
        duration: '01/2011 - 01/2012',
        grade: 'First Class'
      }
    ],
    achievements: [
      {
        keyAchievements: 'Team Lead for Sustainability Project',
        describe: 'Spearheaded an initiative to reduce carbon footprint by 15%.'
      },
      {
        keyAchievements: 'Award for Logistics Excellence',
        describe: 'Recognized for outstanding logistics coordination.'
      }
    ],
    courses: [
      {
        title: 'Advanced Excel for Productivity',
        description: 'Certification by Corporate Finance Institute.'
      }
    ],
    skills: [
      'Supply Chain Management',
      'Logistics Planning',
      'Microsoft Office'
    ],
    projects: [
      {
        title: 'Supply Chain Optimization Project',
        description: 'Developed a model to optimize supply chain operations, reducing costs by 15%.',
        duration: '01/2021 - 12/2021'
      },
      {
        title: 'Sustainability Initiative',
        description: 'Led a project to reduce carbon footprint by 20% across the supply chain.',
        duration: '06/2020 - 12/2020'
      }
    ]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showEnhancementOptions, setShowEnhancementOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [sectionSettings, setSectionSettings] = useState({
    header: { showTitle: true, showPhone: true, showEmail: true, showLink: true, showLocation: true, uppercaseName: false },
    summary: { showSummary: true },
    experience: { showExperience: true },
    education: { showEducation: true },
    achievements: { showAchievements: true },
    skills: { showSkills: true },
    courses: { showCourses: true },
    projects: { showProjects: true },
  });

  const [activeSection, setActiveSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [sectionsOrder, setSectionsOrder] = useState([
    'summary',
    'experience',
    'education',
    'achievements',
    'skills',
    'courses',
    'projects'
  ]);
  // Define sections state properly
  const [sections, setSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    achievements: true,
    courses: true,
    projects: true,
  });
  
  const handleRemoveSection = (section, index) => {
    if (index !== undefined) {
      setResumeData(prevData => {
        const updatedSection = [...prevData[section]];
        updatedSection.splice(index, 1);
        return { ...prevData, [section]: updatedSection };
      });
    } else {
      setSectionSettings(prevSettings => ({
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          [`show${section.charAt(0).toUpperCase() + section.slice(1)}`]: false,
        },
      }));
    }
  };

  // Refs
  const resumeRef = useRef(null);
  
  const handleAIEnhancement = async () => {
    if (!resumeData._id) {
      await createResume();
      alert("Resume created. Click AI Assistant again.");
      return;
    }
    setLoading(true); // Start loading
    setShowEnhancementOptions(true);
    setLoading(false); // End loading (remove this line if you want to show loading during the enhancement options display)
  };

  const handleInputChange = (section, field, value, index) => {
    setResumeData((prevData) => {
      if (section && index !== undefined) {
        const updatedSection = [...prevData[section]];
        updatedSection[index][field] = value;
        return { ...prevData, [section]: updatedSection };
      } else if (section) {
        return { ...prevData, [section]: value };
      } else {
        return { ...prevData, [field]: value };
      }
    });
  };
  const handleAddSection = (section, itemToDuplicate) => {
    let newItem = {};
    if (itemToDuplicate) {
      newItem = JSON.parse(JSON.stringify(itemToDuplicate));
    } else {
      switch (section) {
        case 'experience':
          newItem = {
            title: 'New Title',
            companyName: 'New Company',
            date: 'MM/YYYY - MM/YYYY',
            companyLocation: 'City, Country',
            description: 'Describe your responsibilities and achievements.',
            accomplishment: 'Highlight a key accomplishment.'
          };
          break;
        case 'education':
          newItem = { degree: 'Degree Name', institution: 'Institution Name', duration: 'YYYY - YYYY', grade: 'Grade' };
          break;
        case 'achievements':
          newItem = { keyAchievements: 'Achievement Title', describe: 'Describe the achievement.' };
          break;
        case 'courses':
          newItem = { title: 'Course Title', description: 'Course description.' };
          break;
        case 'skills':
          newItem = "New Skill";
          break;
        case 'projects':
          newItem = { title: 'Project Title', description: 'Project description.', duration: 'YYYY - YYYY' };
          break;
        default:
          return;
      }
    }

    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
  
      // Send API request to generate PDF
      const response = await axios.post(
        "http://localhost:5000/api/resume/generate-pdf",
        { resumeData },
        {
          responseType: "blob",  // Ensures response is treated as a file
          headers: { "Content-Type": "application/json" }
        }
      );
  
      // Validate Blob response
      if (!response || !response.data || !(response.data instanceof Blob)) {
        throw new Error("Invalid PDF response");
      }
  
      // Create and trigger download
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setLoading(false);
      }, 100);
  
    } catch (error) {
      console.error("Download failed:", error);
      alert("PDF generation failed. Please check your resume data.");
      setLoading(false);
    }
  };
  
  
  const handleSectionHover = (section) => {
    setHoveredSection(section);
  };
  
  const handleSectionLeave = () => {
    setHoveredSection(null);
  };
  
  const handleSectionClick = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };
  
  const handleSettingChange = (section, key) => {
    setSectionSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: !prevSettings[section][key],
      },
    }));
  };

  const createResume = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/resume/create', { resumeData });

        if (response.data?.data?._id) {
            setResumeData(prev => ({ ...prev, _id: response.data.data._id }));
            alert("✅ Resume created successfully!");
        } else {
            console.error("❌ No _id returned from server:", response.data);
        }
    } catch (error) {
        console.error("❌ Resume Creation Error:", error.response ? error.response.data : error.message);
    }
};

  const saveResume = async () => {
    if (!resumeData) {
      alert("No resume data to save!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/resume/save", {
        resumeData
    });
      if (response.data) {
        alert("Resume saved successfully!");
        console.log("✅ Resume saved:", response.data);
      }
    } catch (error) {
      console.error("❌ Error saving resume:", error);
      alert("Failed to save resume.");
    }
  };

  const enhanceSingleField = async (field) => {
    if (!resumeData._id) {
        alert("Please save your resume before enhancing a field.");
        return;
    }
    try {
        setLoading(true); // Start loading
        console.log("Enhancing field:", field, "with resume ID:", resumeData._id);
        const response = await axios.post('http://localhost:5000/api/resume/enhanceField', { resumeId: resumeData._id, field });

        if (response.data?.data) {
            setResumeData(response.data.data);
            alert(`${field} enhanced successfully!`);
        }
    } catch (error) {
        console.error(`Error enhancing ${field}:`, error);
    } finally {
        setLoading(false); // End loading
    }
};

  return (
    <div className="flex">
        <div className="resume-editor">
        {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* Added z-index: 50 */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Loading...</p>
              </div>
            </div>
        )}
      <div className="w-64 bg-gray-800 text-white p-4 fixed h-screen overflow-y-auto">
        <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={handleAIEnhancement}>
          🤖 AI Assistant
        </button>
        {showEnhancementOptions && (
          <div className="ai-field-enhancement">
            <h4>Enhance Specific Field</h4>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("summary")}>
              Enhance Summary
            </button>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("skills")}>
              Enhance Skills
            </button>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("experience")}>
              Enhance Experience
            </button>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("achievements")}>
              Enhance Achievements
            </button>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("courses")}>
              Enhance Courses
            </button>
            <button className="w-full bg-gray-700 text-white p-2 mb-2 rounded hover:bg-gray-600 transition-colors" onClick={() => enhanceSingleField("projects")}>
              Enhance Projects
            </button>
          </div>
        )}
        <button className="w-full bg-blue-500 text-white p-2 mb-2 rounded hover:bg-blue-600 transition-colors" onClick={saveResume}>
          Save Resume 
        </button>
        <button className="w-full bg-yellow-500 text-white p-2 mb-2 rounded hover:bg-yellow-600 transition-colors" onClick={downloadPDF}>
⬇️ Download
        </button>
      </div>

      <div className="ml-64 p-4">
        <div ref={resumeRef} className="w-3/5 mx-auto my-5 p-5 border border-gray-300 rounded-lg bg-gray-50 resume-container">    
        <div className="text-center mb-5 py-4 min-h-[100px]">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleInputChange(null, 'name', e.target.innerText)}
              className={`text-4xl font-bold leading-normal py-2 break-words ${sectionSettings.header.uppercaseName ? 'uppercase' : ''}`}
              onClick={() => handleSectionClick('header')}
              onMouseEnter={() => handleSectionHover('header')}
              onMouseLeave={handleSectionLeave}
            >
              {resumeData.name}
            </h1>
            {sectionSettings.header.showTitle && (
              <p contentEditable onBlur={(e) => handleInputChange(null, 'role', e.target.textContent)} className="text-lg text-gray-600">
                {resumeData.role}
              </p>
            )}
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              
              {sectionSettings.header.showPhone && (
                <span contentEditable onBlur={(e) => handleInputChange(null, 'phone', e.target.textContent)} className="text-sm text-gray-700">
                  {resumeData.phone}
                </span>
              )}
              {sectionSettings.header.showEmail && (
                <span contentEditable onBlur={(e) => handleInputChange(null, 'email', e.target.textContent)} className="text-sm text-gray-700">
                  {resumeData.email}
                </span>
              )}
              {sectionSettings.header.showLink && (
                <span contentEditable onBlur={(e) => handleInputChange(null, 'linkedin', e.target.textContent)} className="text-sm text-gray-700">
                  {resumeData.linkedin}
                </span>
              )}
              {sectionSettings.header.showLocation && (
                <span contentEditable onBlur={(e) => handleInputChange(null, 'location', e.target.textContent)} className="text-sm text-gray-700">
                  {resumeData.location}
                </span>
              )}
            </div>
          </div>
          {sectionsOrder.map((section) => {
            if (section === 'summary' && sectionSettings.summary.showSummary) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('summary')}
                    onMouseEnter={() => handleSectionHover('summary')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Summary
                  </h2>
                  <p contentEditable onBlur={(e) => handleInputChange(null, 'summary', e.target.textContent)} className="text-sm text-gray-700">
                    {resumeData.summary}
                  </p>
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('summary')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                   )}
                </div>
              );
            }
            if (section === 'experience' && sectionSettings.experience.showExperience) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('experience')}
                    onMouseEnter={() => handleSectionHover('experience')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Experience
              
                  </h2>
                  {(resumeData.experience || []).map((exp, idx) => (
                    <div key={idx} className="mb-4">
                      <div>
                        <h3
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'companyName', e.target.textContent, idx)}
                          className="text-lg font-semibold"
                        >
                          {exp.companyName}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'title', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {exp.title}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'date', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {exp.date}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'companyLocation', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {exp.companyLocation}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'description', e.target.textContent, idx)}
                          className="text-sm text-gray-700"
                        >
                          {exp.description}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('experience', 'accomplishment', e.target.textContent, idx)}
                          className="text-sm text-gray-700"
                        >
                          {exp.accomplishment}
                        </p>
                      </div>
                      {showButtons && (
                        <button onClick={() => handleRemoveSection('experience', idx)} className="text-sm text-red-500 hover:text-red-700">
                          Remove Experience
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button onClick={() => handleAddSection('experience')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Experience
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('experience')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                  )}
                </div>
              );
            }
            if (section === 'education' && sectionSettings.education.showEducation) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('education')}
                    onMouseEnter={() => handleSectionHover('education')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Education
                  </h2>
                  {(resumeData.education || []).map((edu, idx) => (
                    <div key={idx} className="mb-4">
                      <div>
                        <h3
                          contentEditable
                          onBlur={(e) => handleInputChange('education', 'institution', e.target.textContent, idx)}
                          className="text-lg font-semibold"
                        >
                          {edu.institution}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('education', 'degree', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {edu.degree}
                        </p>
                      </div>
                      <div>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('education', 'duration', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {edu.duration}
                        </p>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('education', 'grade', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {edu.grade}
                        </p>
                      </div>
                      {showButtons && (
                        <button onClick={() => handleRemoveSection('education', idx)} className="text-sm text-red-500 hover:text-red-700">
                          Remove Education
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button onClick={() => handleAddSection('education')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Education
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('education')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                  )}
                </div>
              );
            }
            if (section === 'achievements' && sectionSettings.achievements.showAchievements) {
              return (
                <div className="resume-section achievements-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('achievements')}
                    onMouseEnter={() => handleSectionHover('achievements')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Key Achievements
                  </h2>
                  {(resumeData.achievements || []).map((achievement, idx) => (
                    <div key={idx} className="mb-4">
                      <h3
                        contentEditable
                        onBlur={(e) =>
                          handleInputChange('achievements', 'keyAchievements', e.target.textContent, idx)
                        }
                        className="text-lg font-semibold"
                      >
                        {achievement.keyAchievements}
                      </h3>
                      <p
                        contentEditable
                        onBlur={(e) => handleInputChange('achievements', 'describe', e.target.textContent, idx)}
                        className="text-sm text-gray-700"
                      >
                        {achievement.describe}
                      </p>
                      {showButtons && (
                        <button onClick={() => handleRemoveSection('achievements', idx)} className="text-sm text-red-500 hover:text-red-700">
                          Remove Achievement
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button onClick={() => handleAddSection('achievements')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Achievement
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('achievements')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                  )}
                </div>
              );
            }
            if (section === 'skills' && sectionSettings.skills.showSkills) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('skills')}
                    onMouseEnter={() => handleSectionHover('skills')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Skills
                  </h2>
                  <ul className="list-disc pl-5">
                    {(resumeData.skills || []).map((skill, idx) => (
                      <li key={`${skill}-${idx}`} className="mb-2">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const updatedSkills = [...resumeData.skills];
                            updatedSkills[idx] = e.target.textContent;
                            setResumeData({ ...resumeData, skills: updatedSkills });
                          }}
                          className="text-sm text-gray-700"
                        >
                          {skill}
                        </span>
                        {showButtons && (
                          <button
                            onClick={() => handleRemoveSection('skills', idx)}
                            className="text-sm text-red-500 hover:text-red-700 ml-2"
                          >
                            Remove Skill
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {showButtons && (
                    <button onClick={() => handleAddSection('skills')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Skill
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('skills')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                  )}
                </div>
              );
            }
            if (section === 'courses' && sectionSettings.courses.showCourses) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('courses')}
                    onMouseEnter={() => handleSectionHover('courses')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Courses
                  </h2>
                  {(resumeData.courses || []).map((course, idx) => (
                    <div key={idx} className="mb-4">
                      <h3
                        contentEditable
                        onBlur={(e) => handleInputChange('courses', 'title', e.target.textContent, idx)}
                        className="text-lg font-semibold"
                      >
                        {course.title}
                      </h3>
                      <p
                        contentEditable
                        onBlur={(e) => handleInputChange('courses', 'description', e.target.textContent, idx)}
                        className="text-sm text-gray-700"
                      >
                        {course.description}
                      </p>
                      {showButtons && (
                        <button onClick={() => handleRemoveSection('courses', idx)} className="text-sm text-red-500 hover:text-red-700">
                          Remove Course
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button onClick={() => handleAddSection('courses')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Course
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('courses')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                  )}
                </div>
              );
            }
            if (section === 'projects' && sectionSettings.projects.showProjects) {
              return (
                <div className="resume-section mb-5 relative" key={section}>
                  <h2
                    onClick={() => handleSectionClick('projects')}
                    onMouseEnter={() => handleSectionHover('projects')}
                    onMouseLeave={handleSectionLeave}
                    className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2"
                  >
                    Projects
                  </h2>
                  {(resumeData.projects || []).map((project, idx) => (
                    <div key={idx} className="mb-4">
                      <div>
                        <h3
                          contentEditable
                          onBlur={(e) => handleInputChange('projects', 'title', e.target.textContent, idx)}
                          className="text-lg font-semibold"
                        >
                          {project.title}
                        </h3>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('projects', 'description', e.target.textContent, idx)}
                          className="text-sm text-gray-700"
                        >
                          {project.description}
                        </p>
                      </div>
                      <div>
                        <p
                          contentEditable
                          onBlur={(e) => handleInputChange('projects', 'duration', e.target.textContent, idx)}
                          className="text-sm text-gray-600"
                        >
                          {project.duration}
                        </p>
                      </div>
                      {showButtons && (
                        <button onClick={() => handleRemoveSection('projects', idx)} className="text-sm text-red-500 hover:text-red-700">
                          Remove Project
                        </button>
                      )}
                    </div>
                  ))}
                  {showButtons && (
                    <button onClick={() => handleAddSection('projects')} className="text-sm text-blue-500 hover:text-blue-700">
                      Add Project
                    </button>
                  )}
                  {showButtons && (
                    <button
                        onClick={() => handleRemoveSection('projects')}
                        className="absolute top-0 right-0 text-xs text-red-500 hover:text-red-700 p-1"
                    >
                        X
                    </button>
                   )}
                </div>
              );
            }
            return null;
          })}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;