import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Unique identifier to ensure only one document exists
  settingId: {
    type: String,
    required: true,
    unique: true,
    default: 'global'
  },
  hero: {
    subtitle: { type: String, default: 'Graphic & Brand Designer' },
    title: { type: String, default: 'I design things that make people stop scrolling.' },
    description: { type: String, default: 'Crafting premium visual identities, digital products, and high-impact designs for bold brands worldwide.' }
  },
  about: {
    bioParagraph1: { type: String, default: "Hello! I'm the lead designer behind VividForge, a creative agency and multidisciplinary design studio. With over 5 years of professional design experience, we specialize in transforming conceptual projects into highly engaging, modern visual assets." },
    bioParagraph2: { type: String, default: "My philosophy revolves around minimalism, high contrast, and grid-based composition. I believe a brand identity should not just represent a company, but command attention and make viewers stop scrolling. Whether it's a sleek logo, an intricate SaaS dashboard, or vector posters, I approach every project with raw artistic intent and absolute precision." },
    resumeUrl: { type: String, default: '' },
    portraitImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80' }
  },
  stats: [
    {
      value: { type: String, required: true },
      label: { type: String, required: true }
    }
  ],
  tools: {
    type: [String],
    default: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 'Blender 3D', 'Cinema 4D', 'Procreate', 'InDesign', 'Premiere Pro']
  },
  skills: [
    {
      name: { type: String, required: true },
      percentage: { type: Number, required: true }
    }
  ],
  timeline: [
    {
      year: { type: String, required: true },
      role: { type: String, required: true },
      company: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  services: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      includes: { type: [String], default: [] },
      visible: { type: Boolean, default: true }
    }
  ],
  packages: [
    {
      name: { type: String, required: true },
      price: { type: String, required: true },
      description: { type: String, required: true },
      features: { type: [String], default: [] },
      featured: { type: Boolean, default: false }
    }
  ],
  contact: {
    email: { type: String, default: 'designer@example.com' },
    location: { type: String, default: 'New York City, NY' },
    phone: { type: String, default: '' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    behanceUrl: { type: String, default: 'https://behance.net' },
    linkedinUrl: { type: String, default: 'https://linkedin.com' }
  },
  navbar: {
    home: { type: Boolean, default: true },
    portfolio: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    blogs: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
