import { useState } from 'react';
import axios from "axios"
const Form = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    githubLink: '',
    skills: [],
    apiExperience: '',
    carbonDataset: '',
    blockchainProject: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState({
    cv: null,
    assignment: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        skills: checked 
          ? [...prev.skills, value] 
          : prev.skills.filter(skill => skill !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: fileList[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
  
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('githubLink', formData.githubLink || '');
      
      formData.skills.forEach(skill => {
        formDataToSend.append('skills', skill);
      });
  
      formDataToSend.append('apiExperience', formData.apiExperience);
      formDataToSend.append('carbonDataset', formData.carbonDataset);
      formDataToSend.append('blockchainProject', formData.blockchainProject);
  
      if (files.cv) {
        formDataToSend.append('cv', files.cv);
      }
      if (files.assignment) {
        formDataToSend.append('assignment', files.assignment);
      }
  
      const response = await axios.post("http://localhost:4000/upload", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });
  
      if (response.data.success) {
        setShowSuccess(true);
      } else {
        setError(response.data.message || 'Submission failed');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error submitting application');
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto mt-10">
        <div className="bg-green-100 rounded-full p-3 inline-flex items-center justify-center">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mt-4">Application Submitted Successfully!</h2>
        <p className="mt-3 text-gray-600">Thank you for your application. We'll review your information and get back to you shortly.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            AI & Blockchain Developer Application
          </h1>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Join shokuba.net - Technology Partner for Carbon MRV and CBAM Solutions by GreenMark International
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Section 1: Personal Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-200 text-blue-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">GitHub/Portfolio Link</label>
                <input 
                  type="url" 
                  id="githubLink" 
                  name="githubLink" 
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Technical Skills */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-200 text-blue-800">Technical Skills</h2>
            <p className="text-sm mb-4 text-gray-600">Select all that apply:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "HTML/CSS", "JavaScript", "React", "Node.js", "Python", 
                "Solidity", "Web3.js", "API Integration", "Database Management"
              ].map(skill => (
                <div key={skill} className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
                  <input 
                    type="checkbox" 
                    name="skills" 
                    value={skill}
                    checked={formData.skills.includes(skill)}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  /> 
                  <label htmlFor={skill} className="ml-2 text-sm text-gray-700">{skill}</label>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Role-Specific Questions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-200 text-blue-800">Role-Specific Questions</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="apiExperience" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe your experience with API integration for SaaS platforms.
                </label>
                <textarea 
                  id="apiExperience" 
                  name="apiExperience" 
                  value={formData.apiExperience}
                  onChange={handleChange}
                  rows="4" 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                ></textarea>
              </div>
              <div>
                <label htmlFor="carbonDataset" className="block text-sm font-medium text-gray-700 mb-1">
                  How would you design a structured dataset for Carbon MRV reporting?
                </label>
                <textarea 
                  id="carbonDataset" 
                  name="carbonDataset" 
                  value={formData.carbonDataset}
                  onChange={handleChange}
                  rows="4" 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                ></textarea>
              </div>
              <div>
                <label htmlFor="blockchainProject" className="block text-sm font-medium text-gray-700 mb-1">
                  Explain a blockchain project you've worked on or would propose for CBAM compliance.
                </label>
                <textarea 
                  id="blockchainProject" 
                  name="blockchainProject" 
                  value={formData.blockchainProject}
                  onChange={handleChange}
                  rows="4" 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                ></textarea>
              </div>
            </div>
          </section>

          {/* File Uploads */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-200 text-blue-800">Submissions</h2>
            <div className="mb-5">
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF) *</label>
              <div className="mt-1 flex items-center">
                <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 transition">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span className="mt-2 text-sm">Select a file</span>
                  <input 
                    type="file" 
                    id="cv" 
                    name="cv" 
                    accept=".pdf" 
                    required 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {files.cv && (
                  <span className="ml-4 text-sm text-gray-700">
                    <span className="font-medium">{files.cv.name}</span>
                    <span className="text-gray-500 ml-2">({Math.round(files.cv.size / 1024)} KB)</span>
                  </span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Assignment (ZIP or GitHub Link in a Text File)
              </label>
              <div className="mt-1 flex items-center">
                <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 transition">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span className="mt-2 text-sm">Select a file</span>
                  <input 
                    type="file" 
                    id="assignment" 
                    name="assignment" 
                    accept=".zip,.txt" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {files.assignment && (
                  <span className="ml-4 text-sm text-gray-700">
                    <span className="font-medium">{files.assignment.name}</span>
                    <span className="text-gray-500 ml-2">({Math.round(files.assignment.size / 1024)} KB)</span>
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            >
              Submit Application
            </button>
          </div>
        </form>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 shokuba.net. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">This site complies with GDPR. View our <a href="#" className="underline hover:text-white">Privacy Policy</a>.</p>
          <p className="mt-1 text-sm text-gray-400">Contact: <a href="mailto:info@shokuba.net" className="underline hover:text-white">info@shokuba.net</a> | <a href="https://shokuba.net" className="underline hover:text-white">shokuba.net</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Form;