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
