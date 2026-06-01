import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a project description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: {
      values: ['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration', 'Other'],
      message: '{VALUE} is not a supported category'
    }
  },
  tools: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from title before saving
projectSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  // Basic slugify function
  let generatedSlug = this.title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -

  // Ensure slug is unique by appending counter if needed
  const slugRegex = new RegExp(`^${generatedSlug}(-\\d+)?$`, 'i');
  const projectsWithSlug = await this.constructor.find({ slug: slugRegex });
  
  if (projectsWithSlug.length > 0) {
    generatedSlug = `${generatedSlug}-${projectsWithSlug.length + 1}`;
  }
  
  this.slug = generatedSlug;
  next();
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
