export interface Organization {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
}

export const organizations: Organization[] = [
  {
    id: "org3",
    name: "BINUS @Malang",
    role: "Freshman Leader",
    period: "August 2025 - September 2025",
    description: "Bertindak sebagai koordinator dan pendamping utama bagi mahasiswa baru. Membimbing, memotivasi, serta memastikan kelancaran seluruh rangkaian kegiatan orientasi agar para mahasiswa baru dapat beradaptasi dengan baik di lingkungan kampus yang baru.",
    logo: "/images/freshman-baru.jpeg"
  },
  {
    id: "org4",
    name: "HIMTI",
    role: "Content Division",
    period: "2024 - Present",
    description: "Mengembangkan, merencanakan, dan memproduksi berbagai konten kreatif serta edukatif untuk keperluan publikasi dan media sosial organisasi. Berkolaborasi secara aktif dalam membangun strategi komunikasi digital untuk meningkatkan engagement mahasiswa.",
    logo: "/images/himti.jpeg"
  },
  {
    id: "org1",
    name: "BINUS Computer Club",
    role: "Head of Web Development Division",
    period: "2023 - Present",
    description: "Leading a team of 15 members to build internal web applications and hosting workshops about modern web technologies.",
  },
  {
    id: "org2",
    name: "Google Developer Student Clubs",
    role: "Core Team (Technical)",
    period: "2022 - 2023",
    description: "Organized technical study jams, mentored members in React and Node.js, and contributed to the community showcase projects.",
  }
];
