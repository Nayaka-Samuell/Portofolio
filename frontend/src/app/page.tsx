import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import OrganizationsSection from "@/components/OrganizationsSection";
import ContactSection from "@/components/ContactSection";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let profile = null;
  try {
    const res = await fetch("http://localhost:5000/api/profile/nayaka", { cache: "no-store" });
    if (res.ok) {
      profile = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch profile for metadata:", err);
  }

  const name = profile?.full_name || "Nayaka Samuel Andrean";
  const title = `${name} | Portfolio`;
  const description = profile?.headline || "Computer Science Student & Full-Stack Developer";
  const ogImage = profile?.og_image || "https://via.placeholder.com/1200x630.png?text=Portfolio";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  let profile = null;

  try {
    const res = await fetch("http://localhost:5000/api/profile/nayaka", { cache: "no-store" });
    if (res.ok) {
      profile = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  }

  return (
    <>
      <HeroSection 
        name={profile?.full_name} 
        headline={profile?.headline} 
        bio={profile?.bio} 
      />
      <AboutSection 
        bio={profile?.bio} 
      />
      <ExperienceSection 
        experiences={profile?.experiences} 
      />
      <ProjectsSection 
        portfolios={profile?.portfolios} 
      />
      <OrganizationsSection 
        organizations={profile?.organizations} 
      />
      <ContactSection 
        sosmed={profile?.sosmed} 
      />
    </>
  );
}
