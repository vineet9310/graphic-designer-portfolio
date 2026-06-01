import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

const defaultStats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '30+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '100%', label: 'Client Satisfaction' }
];

const defaultSkills = [
  { name: 'Brand Strategy & Identity', percentage: 95 },
  { name: 'UI/UX & Web Design', percentage: 90 },
  { name: 'Vector Illustration', percentage: 85 },
  { name: 'Motion & Promo Graphics', percentage: 80 },
  { name: '3D Modelling & Texturing', percentage: 75 }
];

const defaultTimeline = [
  {
    year: '2023 - Present',
    role: 'Lead Brand & UI/UX Designer',
    company: 'PixelForge Studio',
    description: 'Designing brand guidelines, packaging, and modern high-fidelity web/app interfaces for global scale tech and lifestyle startups.'
  },
  {
    year: '2021 - 2023',
    role: 'Senior Graphic Designer',
    company: 'Apex Agency',
    description: 'Headed the creative direction for social campaigns, vector illustrations, and offline promotional assets for Fortune 500 clients.'
  },
  {
    year: '2019 - 2021',
    role: 'Junior Creative Designer',
    company: 'Vortex Media',
    description: 'Learned industry standards, assisted senior developers, designed monogram proposals, client presentation layouts, and print flyers.'
  },
  {
    year: '2015 - 2019',
    role: 'BFA in Graphic Design',
    company: 'Academy of Fine Arts',
    description: 'Studied core disciplines of visual composition, color theory, typography history, packaging blueprints, and human-centered design.'
  }
];

const defaultServices = [
  {
    title: 'Logo Design',
    description: 'Custom vector logo marks designed from scratch to reflect your core values and make a lasting corporate statement.',
    includes: ['3 Unique Logo Concepts', 'Full Vector File Handover', 'Black & White Variations', 'Icon & Favicon Exports']
  },
  {
    title: 'Brand Identity',
    description: 'Comprehensive design guidelines and complete brand collateral that synchronize your visual appearance across all channels.',
    includes: ['Brand Style Guide Booklet', 'Typography & Palette System', 'Business Card & Letterhead', 'Packaging Blueprints']
  },
  {
    title: 'UI/UX Design',
    description: 'High-fidelity mobile and desktop dashboard layouts built in Figma. Structured to maximize readability and flow.',
    includes: ['Figma Interaction Mockups', 'Component Design System', 'Wireframe Flow Schematics', 'Developer Handoff Spec']
  },
  {
    title: 'Social Media Design',
    description: 'Vibrant, high-contrast banner templates, product display grids, and promo vectors that amplify your digital campaigns.',
    includes: ['12 Instagram Template Grids', 'LinkedIn & Twitter Banners', 'Click-through Banner Assets', 'Editable Source Files']
  }
];

const defaultPackages = [
  {
    name: 'Basic Concept',
    price: '$499',
    description: 'Perfect for small boutiques or personal ventures looking to establish a minimal starter design.',
    features: [
      'Single Logo Concept',
      'Basic Style Guidelines',
      '2 Revision Iterations',
      'Vector Source Files',
      '3 Days Standard Delivery'
    ],
    featured: false
  },
  {
    name: 'Full Identity',
    price: '$1,299',
    description: 'Complete branding suite tailored for active startups ready to compete globally.',
    features: [
      '3 Unique Logo Proposals',
      'Full Branding Book (PDF)',
      'Stationery & Business Cards',
      'Unlimited Revision Iterations',
      'Priority Slack Communication',
      'Social Media Grid Template'
    ],
    featured: true
  },
  {
    name: 'Premium UI + Brand',
    price: '$2,499',
    description: 'All-inclusive premium design packages combining branding guides and full app mockups.',
    features: [
      'Everything in Full Identity',
      'Full UI/UX Web/App Design (Figma)',
      'Design System Toolkit',
      'Interactive Figma Prototypes',
      '10-Pages Flow Mockup',
      '1 Month Ongoing Post-Support'
    ],
    featured: false
  }
];

// GET dynamic settings (Public)
export async function GET() {
  try {
    await connectDB();
    
    let settings = await Settings.findOne({ settingId: 'global' });
    
    if (!settings) {
      console.log('No global settings found. Creating defaults...');
      settings = await Settings.create({
        settingId: 'global',
        stats: defaultStats,
        skills: defaultSkills,
        timeline: defaultTimeline,
        services: defaultServices,
        packages: defaultPackages
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('GET settings API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading settings' },
      { status: 500 }
    );
  }
}

// PUT/POST update settings (Admin only)
export async function PUT(req) {
  try {
    await connectDB();
    
    // Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const body = await req.json();

    let settings = await Settings.findOne({ settingId: 'global' });
    
    if (!settings) {
      settings = new Settings({ settingId: 'global' });
    }

    // Update settings fields safely
    if (body.hero) settings.hero = { ...settings.hero, ...body.hero };
    if (body.about) settings.about = { ...settings.about, ...body.about };
    if (body.stats) settings.stats = body.stats;
    if (body.tools) settings.tools = body.tools;
    if (body.skills) settings.skills = body.skills;
    if (body.timeline) settings.timeline = body.timeline;
    if (body.services) settings.services = body.services;
    if (body.packages) settings.packages = body.packages;
    if (body.contact) settings.contact = { ...settings.contact, ...body.contact };
    if (body.navbar) settings.navbar = { ...settings.navbar, ...body.navbar };

    const updatedSettings = await settings.save();

    return NextResponse.json({
      success: true,
      data: updatedSettings
    });

  } catch (error) {
    console.error('PUT settings API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating settings' },
      { status: 500 }
    );
  }
}
