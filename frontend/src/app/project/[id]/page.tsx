import { Metadata } from "next";
import Link from "next/link";
/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Code as Github, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  const fallbackProjects = [
    {
      id: "p1",
      title: "Software Architecture Lab (Final Project)",
      description: "Proyek akhir implementasi design pattern dan arsitektur software yang terukur dan efisien.",
      techStack: ["Node.js", "Software Architecture"],
      category: "Backend",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/FINPRO-Software-Archi-LAB",
    },
    {
      id: "p2",
      title: "Hybrid Mobile Solutions",
      description: "Aplikasi mobile cross-platform dengan performa optimal dan UI intuitif.",
      techStack: ["React Native/Flutter", "Mobile Dev"],
      category: "Mobile",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/FINPRO-Mobile-Hybrid-Solutions",
    },
    {
      id: "p3",
      title: "Fundamental Web Project",
      description: "Proyek pondasi web development yang berfokus pada struktur logika dan UI/UX dasar.",
      techStack: ["Web Fundamentals", "JavaScript"],
      category: "Web",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/Project-1-",
    }
  ];

  let project = null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${API_URL}/api/profile/nayaka`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const profile = await res.json();
      project = profile.portfolios?.find((p: any) => p.id === id || p._id === id);
    }
  } catch {
    // Silently ignore
  }

  // Fallback
  if (!project) {
    project = fallbackProjects.find((p: any) => p.id === id);
  }

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

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  const fallbackProjects = [
    {
      id: "p1",
      title: "Software Architecture Lab (Final Project)",
      description: "Proyek akhir implementasi design pattern dan arsitektur software yang terukur dan efisien.",
      techStack: ["Node.js", "Software Architecture"],
      category: "Backend",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/FINPRO-Software-Archi-LAB",
    },
    {
      id: "p2",
      title: "Hybrid Mobile Solutions",
      description: "Aplikasi mobile cross-platform dengan performa optimal dan UI intuitif.",
      techStack: ["React Native/Flutter", "Mobile Dev"],
      category: "Mobile",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/FINPRO-Mobile-Hybrid-Solutions",
    },
    {
      id: "p3",
      title: "Fundamental Web Project",
      description: "Proyek pondasi web development yang berfokus pada struktur logika dan UI/UX dasar.",
      techStack: ["Web Fundamentals", "JavaScript"],
      category: "Web",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      githubUrl: "https://github.com/Nayaka-Samuell/Project-1-",
    }
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  let project: any = null;
  try {
    const res = await fetch(`${API_URL}/api/profile/nayaka`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const profile = await res.json();
      project = profile.portfolios?.find((p: Record<string, unknown>) => p.id === id || p._id === id);
    }
  } catch {
    // Silently ignore
  }

  if (!project) {
    project = fallbackProjects.find((p) => p.id === id);
  }

  if (!project) {
    return (
      <div className="min-h-[100dvh] bg-blue-base flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-8">The project you are looking for is currently unavailable or doesn&apos;t exist.</p>
        <Link href="/#projects" className="px-6 py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold transition-all">Back to Projects</Link>
      </div>
    );
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
