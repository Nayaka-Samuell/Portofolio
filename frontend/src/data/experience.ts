export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: "exp1",
    role: "Operational Manager",
    company: "Indieast Coffee",
    period: "2025 - 2026",
    description: "Memimpin dan mengelola operasional harian kafe guna memastikan efisiensi bisnis dan standar kualitas layanan yang prima. Bertanggung jawab penuh dalam pendelegasian tugas tim, manajemen inventaris, penyusunan strategi operasional, serta menjaga konsistensi Standard Operating Procedure (SOP) demi kepuasan pelanggan secara optimal.",
    technologies: ["Operations Management", "Team Leadership", "Quality Control", "Customer Service", "Inventory Management"]
  },
  {
    id: "exp2",
    role: "Event Staff",
    company: "Premier Plus Wedding Organizer (Malang)",
    period: "2025 - 2026",
    description: "Berperan krusial dalam mengorkestrasi kelancaran seluruh rangkaian acara dari persiapan hingga penutupan. Menerapkan manajemen waktu yang ketat, koordinasi lintas divisi, dan kemampuan problem-solving yang cepat serta tepat di lapangan untuk memitigasi risiko secara real-time, memastikan setiap detail rundown berjalan dengan sempurna.",
    technologies: ["Event Management", "Time Management", "Problem Solving", "Communication", "Coordination"]
  }
];
