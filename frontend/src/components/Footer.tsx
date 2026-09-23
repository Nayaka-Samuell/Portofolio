import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-blue-main/10 mt-10">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-500 text-sm">
          &copy; <Link href="/admin/content" className="cursor-default">{currentYear}</Link> Nayaka Samuel Andrean. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Built with Next.js, Tailwind CSS & Framer Motion.
        </p>
      </div>
    </footer>
  );
}
