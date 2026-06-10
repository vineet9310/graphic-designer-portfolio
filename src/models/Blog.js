import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add blog content']
  },
  excerpt: {
    type: String,
    required: [true, 'Please add a short excerpt/summary']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  tags: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&auto=format&fit=crop&q=80'
  },
  readingTime: {
    type: String,
    default: '3 min read'
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from title before saving
blogSchema.pre('save', async function(next) {
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
  const blogsWithSlug = await this.constructor.find({ slug: slugRegex });
  
  if (blogsWithSlug.length > 0) {
    generatedSlug = `${generatedSlug}-${blogsWithSlug.length + 1}`;
  }
  
  this.slug = generatedSlug;
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
