import { supabase } from './config/supabase';

async function runSeed() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Check or Seed User
  const username = 'Nayaka21060112';
  let { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  const userData = {
    username: username,
    email: 'nayakasamuel21@gmail.com',
    full_name: 'Nayaka Samuel Andrean',
    bio: 'Computer Science Student at BINUS University Malang (2024-2028) | Passionate Backend Developer & Tech Enthusiast specializing in Node.js and Modern Architectures.',
    contact_email: 'nayakasamuel21@gmail.com',
    phone: '+6281234567890',
    linkedin_url: 'https://www.linkedin.com/in/nayaka-samuel/',
    github_url: 'https://github.com/Nayaka-Samuell',
    cv_url: null
  };

  if (!user) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to seed User:', insertError.message);
      process.exit(1);
    }
    user = newUser;
    console.log('✅ User seeded successfully');
  } else {
    // Update existing user with exact details
    await supabase.from('users').update(userData).eq('id', user.id);
    console.log('ℹ️ User updated successfully.');
  }

  if (!user) return;

  // Cleanup old dummy data completely to ensure clean state
  console.log('🧹 Cleaning up old records to insert fresh data...');
  await supabase.from('experiences').delete().eq('user_id', user.id);
  await supabase.from('organizations').delete().eq('user_id', user.id);
  await supabase.from('portfolios').delete().eq('user_id', user.id);

  // 2. Seed Experience
  const expData = [
    {
      user_id: user.id,
      company_name: 'Premier Plus Wedding Organizer (Malang)',
      role: 'Event Staff',
      start_date: '2025-01-01',
      end_date: '2026-01-01',
      is_current: false,
      description: `### Ensuring Seamless Wedding Events\n\nAs an Event Staff at Premier Plus Wedding Organizer, my primary responsibility was to guarantee the absolute smoothness of every wedding event handled by our team. Operating in a highly dynamic and fast-paced environment in Malang, I orchestrated seamless communication between vendors, venues, and the bridal party.\n\n**Key Responsibilities:**\n- **Event Logistics Management:** Coordinated the load-in and load-out of equipment, ensuring stage preparations and decor were fully realized according to the client's vision.\n- **Crowd Control & Guest Relations:** Directed hundreds of guests systematically, ensuring RSVP checks and seating arrangements flowed without any bottleneck.\n- **Crisis Management:** Acted as the primary point of contact for troubleshooting sudden on-the-spot technical issues such as audio disruptions and catering delays.\n- **Vendor Synchronization:** Worked intimately with MCs, photographers, and catering staff to ensure the event rundown was followed down to the exact minute.\n\nWorking here honed my ability to perform under extreme pressure, maintain meticulous attention to detail, and communicate effectively to ensure clients experienced their perfect, dream wedding.`
    },
    {
      user_id: user.id,
      company_name: 'Indieast Coffee',
      role: 'Operational Manager',
      start_date: '2025-01-01',
      end_date: '2026-01-01',
      is_current: false,
      description: `### Streamlining Cafe Operations\n\nServing as the Operational Manager for Indieast Coffee, I spearheaded the daily functional aspects of the business, ensuring top-tier service quality, inventory efficiency, and team synergy.\n\n**Key Achievements & Duties:**\n- **Team Leadership & Scheduling:** Managed a team of baristas and waitstaff, organizing fair and efficient shift schedules while conducting routine training to uphold our coffee quality standards.\n- **Inventory & Supply Chain:** Supervised daily stock limits, negotiated with local coffee bean suppliers, and executed strict quality control to minimize material wastage by over 20%.\n- **Financial Tracking:** Monitored daily cash flow, compiled weekly profit-and-loss reports, and proposed seasonal marketing strategies to boost weekend customer footfall.\n- **Customer Experience:** Addressed customer feedback proactively, implementing a refined ordering system that reduced wait times during peak hours.\n\nThis managerial role deeply enhanced my strategic planning, financial literacy, and people management skills, turning daily chaos into an organized, profitable harmony.`
    }
  ];

  const { error: expError } = await supabase.from('experiences').insert(expData);
  if (expError) console.error('❌ Failed to seed Experience:', expError.message);
  else console.log('✅ Experiences seeded successfully');

  // 3. Seed Organizations
  const orgData = [
    {
      user_id: user.id,
      org_name: 'Freshman Leader BINUS Malang',
      role: 'Mentor / Freshman Leader',
      start_date: '2025-08-01',
      end_date: '2025-09-30',
      is_current: false,
      description: `### Guiding the Next Generation\n\nAppointed as a Freshman Leader for the incoming class of BINUS University Malang during the August-September 2025 orientation phase.\n\n- Directed and mentored over 40 new students, facilitating their transition from high school to university life.\n- Conducted campus tours, academic system tutorials, and team-building exercises.\n- Served as a critical support system, providing guidance on academic planning and campus resources.`
    },
    {
      user_id: user.id,
      org_name: 'HIMTI (Himpunan Mahasiswa Teknik Informatika)',
      role: 'Content Division',
      start_date: '2024-01-01',
      is_current: true,
      description: `### Shaping Digital Presence\n\nCurrently serving as an active member of the Content Division in HIMTI. My core focus revolves around elevating the organization's digital footprint and engagement rates.\n\n- **Content Creation:** Designing educational tech carousels, writing compelling copywriting, and managing publication schedules for Instagram and TikTok.\n- **Event Coverage:** Documenting seminars and workshops, translating complex tech events into digestible social media content.\n- **Creative Strategy:** Brainstorming campaign ideas to boost student participation in HIMTI-led hackathons and study groups.`
    }
  ];

  const { error: orgError } = await supabase.from('organizations').insert(orgData);
  if (orgError) console.error('❌ Failed to seed Organization:', orgError.message);
  else console.log('✅ Organizations seeded successfully');

  // 4. Seed Portfolios
  const portData = [
    {
      user_id: user.id,
      title: 'FINPRO Archi',
      description: 'A comprehensive architectural portfolio application showcasing modern designs and blueprints.',
      content: `## The Concept Behind FINPRO Archi\n\n**FINPRO Archi** was born out of the necessity to provide a highly interactive and visually stunning platform for architectural firms to showcase their blueprints, 3D renderings, and completed projects.\n\n### Key Features:\n- **Interactive Gallery:** Utilizing advanced WebGL to render smooth 3D models directly in the browser.\n- **Dynamic Project Filtering:** Built a custom categorization engine allowing users to filter projects by 'Commercial', 'Residential', and 'Industrial'.\n- **Admin Dashboard:** A secured CMS panel for architects to instantly upload new project photos and descriptions without touching the codebase.\n\n### Tech Stack:\n- **Frontend:** React, Tailwind CSS, Three.js\n- **Backend:** Node.js, Express, PostgreSQL\n\nThis project challenged my ability to handle large media files efficiently and optimize database queries for rapid image loading.`,
      project_url: 'https://github.com/Nayaka-Samuell/finpro-archi',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541881451963-3cbaf1c99008?auto=format&fit=crop&q=80'
      ],
      tags: ['React', 'Node.js', 'Architecture', 'CMS']
    },
    {
      user_id: user.id,
      title: 'Mobile Hybrid Application',
      description: 'A cross-platform mobile application designed to bridge the gap between web and native performance.',
      content: `## Revolutionizing Mobile Accessibility\n\nThis **Mobile Hybrid** project aimed to create a seamless, high-performance application deployable on both iOS and Android using a single codebase. The core challenge was maintaining native-like 60fps animations while relying on web technologies.\n\n### Development Journey:\n- **Framework Selection:** Opted for React Native due to its robust ecosystem and bridge capabilities to native modules.\n- **State Management:** Implemented Redux Toolkit for predictable state transitions across complex navigation stacks.\n- **Offline-First Architecture:** Integrated SQLite for local caching, ensuring the app remains fully functional even without internet connectivity.\n\n### Overcoming Hurdles:\nThe biggest hurdle was optimizing the list virtualization for a feed containing thousands of high-res images. By implementing custom rendering logic and aggressive memory management, scrolling performance increased by 40%.\n\n*This app is currently in beta testing with 500+ daily active users.*`,
      project_url: 'https://github.com/Nayaka-Samuell/mobile-hybrid',
      image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80'
      ],
      tags: ['React Native', 'Hybrid', 'Mobile', 'Redux']
    },
    {
      user_id: user.id,
      title: 'Project-1',
      description: 'An introductory flagship system laying the foundation for modular backend microservices.',
      content: `## Project-1: The Genesis\n\n**Project-1** serves as my foundational exploration into building highly scalable and modular backend architectures. Instead of a traditional monolith, this system was architected using decoupled microservices to handle user authentication, data processing, and email notifications independently.\n\n### System Architecture:\n1. **API Gateway:** Routes incoming HTTP requests to the appropriate internal services, acting as a single entry point and enforcing Rate Limiting.\n2. **Auth Service:** A dedicated JWT-based authentication server with role-based access control (RBAC).\n3. **Worker Nodes:** Background processes utilizing Redis queues to handle heavy lifting, such as bulk data exports and automated report generation.\n\n### Security Implementations:\n- Bcrypt hashing for all sensitive credentials.\n- Helmet.js integration to secure HTTP headers.\n- Strict CORS policies limiting access only to whitelisted frontend domains.\n\nThrough Project-1, I gained profound insights into DevOps practices, Docker containerization, and the complexities of inter-service communication.`,
      project_url: 'https://github.com/Nayaka-Samuell/project-1',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80'
      ],
      tags: ['Microservices', 'Node.js', 'Docker', 'Redis']
    }
  ];

  const { error: portError } = await supabase.from('portfolios').insert(portData);
  if (portError) console.error('❌ Failed to seed Portfolios:', portError.message);
  else console.log('✅ Portfolios seeded successfully');

  console.log('🎉 Seeding completed!');
  process.exit(0);
}

runSeed();