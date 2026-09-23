import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let project = null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API_URL}/api/profile/nayaka`, { cache: "no-store" });
    if (res.ok) {
      const profile = await res.json();
      project = profile.portfolios?.find((p: any) => p.id === params.id || p._id === params.id);
    }
  } catch (e) {}

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.thumbnail || project.image || "https://via.placeholder.com/1200x630?text=Project"],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  let project = null;
  try {
    // Attempting to find the project from profile endpoint
    const res = await fetch(`${API_URL}/api/profile/nayaka`, { cache: "no-store" });
    if (res.ok) {
      const profile = await res.json();
      project = profile.portfolios?.find((p: any) => p.id === params.id || p._id === params.id);
    }
  } catch (e) {
    console.error(e);
  }

  if (!project) {
    // If not found, simulate a 404
    notFound();
  }

  // Fallback markdown if empty
  const markdownContent = project.content || `
# ${project.title}
*Case study coming soon...*

${project.description}
`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Back Button */}
        <Link href="/#projects" className="inline-flex items-center gap-2 text-blue-light hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Projects
        </Link>

        {/* Hero Section of the Article */}
        <div className="glassmorphism p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden border border-blue-main/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-main/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-dark/50 text-blue-light text-xs font-bold uppercase tracking-wider rounded-full border border-blue-main/30">
              {project.category || "Project"}
            </span>
            {(project.created_at || project.date) && (
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={14} /> {new Date(project.created_at || project.date).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white font-space mb-6 leading-tight">
            {project.title}
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {(project.githubUrl || project.github) && (
              <a href={project.githubUrl || project.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-dark/50 hover:bg-blue-dark border border-blue-main/30 text-white rounded-xl font-medium transition-all flex items-center gap-2 group">
                <Github size={20} className="group-hover:text-blue-light transition-colors" /> Source Code
              </a>
            )}
            {(project.demoUrl || project.link) && (
              <a href={project.demoUrl || project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-main hover:bg-blue-light text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transform hover:-translate-y-1">
                Live Demo <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="w-full rounded-3xl overflow-hidden mb-16 shadow-2xl border border-blue-main/10 group">
          <img 
            src={project.thumbnail || project.image || "https://via.placeholder.com/1200x600?text=No+Image"} 
            alt={project.title} 
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
          />
        </div>

        {/* Markdown Content rendered via react-markdown + Tailwind Typography */}
        <div className="glassmorphism p-8 md:p-12 rounded-3xl border border-blue-main/20">
          <article className="prose prose-invert prose-blue max-w-none prose-headings:font-space prose-headings:font-bold prose-a:text-blue-main hover:prose-a:text-blue-light prose-img:rounded-xl">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </article>
        </div>
        
        {/* Technologies / Tags Bottom Section */}
        {((project.techStack || project.technologies) && (project.techStack || project.technologies).length > 0) && (
          <div className="mt-12 p-8 border border-blue-main/20 rounded-3xl glassmorphism">
            <h3 className="text-xl font-bold text-white font-space mb-4 flex items-center gap-2">
              <Tag size={20} className="text-blue-main" /> Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.techStack || project.technologies).map((tech: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-blue-dark/30 text-blue-100 rounded-lg text-sm border border-blue-light/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
