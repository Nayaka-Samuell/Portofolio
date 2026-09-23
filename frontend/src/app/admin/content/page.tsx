"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Users, FolderKanban, Upload, Plus, LogOut } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [activeTab, setActiveTab] = useState("about");

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
  });

  // Forms state
  const [expForm, setExpForm] = useState({ role: "", company: "", period: "", description: "" });
  const [orgForm, setOrgForm] = useState({ name: "", role: "", period: "", description: "" });
  
  // Project Form state
  const [projectForm, setProjectForm] = useState({ title: "", description: "", category: "", content: "" });
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (authRes.ok || (username === "Nayaka21060112" && password === "Akuganteng_21")) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert("Invalid Username or Password!");
      }
    } catch (err) {
      console.error(err);
      if (username === "Nayaka21060112" && password === "Akuganteng_21") {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert("Invalid Username or Password!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile/nayaka`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          full_name: data.full_name || "",
          headline: data.headline || "",
          bio: data.bio || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Saving Profile...");
    try {
      const res = await fetch(`${API_URL}/api/profile/nayaka`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus(res.ok ? "Profile updated successfully!" : "Failed to update profile.");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Adding Experience...");
    try {
      const res = await fetch(`${API_URL}/api/experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expForm),
      });
      setStatus(res.ok ? "Experience Added!" : "Failed to add.");
      if (res.ok) setExpForm({ role: "", company: "", period: "", description: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Adding Organization...");
    try {
      const res = await fetch(`${API_URL}/api/organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgForm),
      });
      setStatus(res.ok ? "Organization Added!" : "Failed to add.");
      if (res.ok) setOrgForm({ name: "", role: "", period: "", description: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFile) {
      alert("Please upload a thumbnail image!");
      return;
    }
    setLoading(true);
    setStatus("Uploading Project...");
    
    const formDataObj = new FormData();
    formDataObj.append("title", projectForm.title);
    formDataObj.append("description", projectForm.description);
    formDataObj.append("content", projectForm.content);
    formDataObj.append("category", projectForm.category);
    formDataObj.append("thumbnail", projectFile); // File Blob

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        body: formDataObj, // Browser otomatis set Content-Type multipart/form-data
      });
      setStatus(res.ok ? "Project Uploaded Successfully!" : "Upload failed.");
      if(res.ok) {
        setProjectForm({ title: "", description: "", category: "", content: "" });
        setProjectFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <form onSubmit={handleLogin} className="glassmorphism p-8 rounded-xl max-w-sm w-full shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-main/20 rounded-full blur-3xl -z-10"></div>
          <h2 className="text-2xl font-bold text-white mb-6 font-space text-center">CMS Access</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-light transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-blue-light transition-all"
          />
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-main hover:bg-blue-light disabled:bg-blue-dark text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: "about", label: "About Me", icon: <User size={20} /> },
    { id: "experience", label: "Work Experience", icon: <Briefcase size={20} /> },
    { id: "organizations", label: "Organizations", icon: <Users size={20} /> },
    { id: "projects", label: "Projects", icon: <FolderKanban size={20} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="glassmorphism p-6 rounded-2xl sticky top-28 border border-blue-main/20">
            <h1 className="text-xl font-bold text-white font-space mb-6 flex items-center gap-2">
              <span className="text-blue-main">Admin</span> Dashboard
            </h1>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab.id 
                      ? "bg-blue-main text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                      : "text-gray-400 hover:bg-blue-dark/40 hover:text-white"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            <hr className="my-6 border-blue-main/20" />
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center justify-center gap-3 w-full p-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-medium text-sm">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glassmorphism p-8 rounded-2xl relative overflow-hidden border border-blue-main/20">
          {/* Subtle Background Glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-main/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          
          {/* Header & Status Indicator */}
          <div className="flex justify-between items-center mb-8 border-b border-blue-main/20 pb-5">
            <h2 className="text-2xl font-bold text-white font-space flex items-center gap-3">
              {tabs.find(t => t.id === activeTab)?.icon}
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {status && (
              <span className="px-4 py-1.5 bg-blue-dark/50 text-blue-light text-sm rounded-full font-medium border border-blue-main/30 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                {status}
              </span>
            )}
          </div>

          {/* TAB CONTENT: ABOUT ME */}
          {activeTab === "about" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Headline</label>
                  <input
                    name="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio / About Me</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={6}
                  className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light resize-none transition-all"
                />
              </div>
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-main hover:bg-blue-light disabled:bg-blue-dark text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* TAB CONTENT: WORK EXPERIENCE */}
          {activeTab === "experience" && (
            <form onSubmit={handleExpSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Job Role / Position</label>
                  <input
                    value={expForm.role}
                    onChange={(e) => setExpForm({...expForm, role: e.target.value})}
                    placeholder="e.g. Full-Stack Developer"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                  <input
                    value={expForm.company}
                    onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                    placeholder="e.g. Tech Solutions Inc."
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Period</label>
                  <input
                    value={expForm.period}
                    onChange={(e) => setExpForm({...expForm, period: e.target.value})}
                    placeholder="e.g. Jan 2023 - Present"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={expForm.description}
                  onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                  rows={4}
                  placeholder="Describe your responsibilities..."
                  className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light resize-none transition-all"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-main hover:bg-blue-light disabled:bg-blue-dark text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Plus size={18} /> Add Experience
              </button>
            </form>
          )}

          {/* TAB CONTENT: ORGANIZATIONS */}
          {activeTab === "organizations" && (
            <form onSubmit={handleOrgSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Organization Name</label>
                  <input
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}
                    placeholder="e.g. BINUS Computer Club"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <input
                    value={orgForm.role}
                    onChange={(e) => setOrgForm({...orgForm, role: e.target.value})}
                    placeholder="e.g. Lead Developer"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Period</label>
                  <input
                    value={orgForm.period}
                    onChange={(e) => setOrgForm({...orgForm, period: e.target.value})}
                    placeholder="e.g. 2023 - 2024"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={orgForm.description}
                  onChange={(e) => setOrgForm({...orgForm, description: e.target.value})}
                  rows={4}
                  placeholder="Describe your role and impact..."
                  className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light resize-none transition-all"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-main hover:bg-blue-light disabled:bg-blue-dark text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Plus size={18} /> Add Organization
              </button>
            </form>
          )}

          {/* TAB CONTENT: PROJECTS (ADVANCED FORM) */}
          {activeTab === "projects" && (
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              
              {/* Image Upload Area - Custom Drag-and-Drop Style UI */}
              <div 
                className="w-full border-2 border-dashed border-blue-main/40 hover:border-blue-light rounded-xl p-8 flex flex-col items-center justify-center text-center bg-blue-dark/10 hover:bg-blue-dark/20 transition-all cursor-pointer group" 
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProjectFile(e.target.files[0]);
                    }
                  }} 
                />
                {projectFile ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <img src={URL.createObjectURL(projectFile)} alt="Preview" className="h-40 object-contain rounded-lg mb-4 shadow-lg ring-2 ring-blue-main/30" />
                    <p className="text-blue-light font-medium text-sm">{projectFile.name}</p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Upload size={14}/> Click to change thumbnail</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-blue-main group-hover:text-blue-light transition-colors py-4">
                    <div className="w-16 h-16 rounded-full bg-blue-main/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="font-bold text-lg text-white mb-1">Upload Project Thumbnail</p>
                    <p className="text-sm text-gray-400">Click to browse or drag and drop (PNG, JPG, WEBP)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
                  <input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    placeholder="e.g. AI-Powered Analytics Dashboard"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light text-lg font-semibold transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category (Optional)</label>
                  <input
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    placeholder="e.g. Web Development, AI/ML, Backend"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Project Short Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={3}
                  placeholder="Explain what the project does in a few sentences..."
                  className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light resize-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Case Study (Markdown Supported)</label>
                <div className="relative">
                  <textarea
                    value={projectForm.content}
                    onChange={(e) => setProjectForm({...projectForm, content: e.target.value})}
                    rows={12}
                    placeholder="# Project Overview&#10;&#10;Write your deep-dive case study here...&#10;&#10;## Technologies Used&#10;- React&#10;- Next.js"
                    className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light resize-none transition-all font-mono text-sm"
                  />
                  <div className="absolute top-3 right-4 text-xs text-blue-light font-bold opacity-50 pointer-events-none">MARKDOWN</div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-main to-blue-light hover:from-blue-light hover:to-blue-main disabled:from-blue-dark disabled:to-blue-dark text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-1">
                <Upload size={22} /> Publish Project
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
