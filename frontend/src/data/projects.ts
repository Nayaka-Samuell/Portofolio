export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  thumbnail: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "E-Commerce Microservices",
    description: "A full-fledged e-commerce backend built with microservices architecture, RabbitMQ for event-driven messaging, and Redis for caching.",
    techStack: ["Node.js", "Express", "RabbitMQ", "Redis", "PostgreSQL"],
    category: "Backend",
    thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    githubUrl: "#",
  },
  {
    id: "p2",
    title: "AI Chat Assistant",
    description: "Intelligent chatbot interface leveraging large language models to help users analyze datasets efficiently.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI API"],
    category: "AI/ML",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "p3",
    title: "Finance Tracker Mobile",
    description: "A mobile application to track daily expenses, manage budgets, and visualize financial goals.",
    techStack: ["React Native", "Firebase", "Redux"],
    category: "Mobile",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    githubUrl: "#",
  },
  {
    id: "p4",
    title: "Portfolio Website v1",
    description: "My previous personal portfolio website with a minimalist design and blog integration.",
    techStack: ["React", "CSS Modules", "Vite"],
    category: "Web",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    demoUrl: "#",
    githubUrl: "#",
  }
];
