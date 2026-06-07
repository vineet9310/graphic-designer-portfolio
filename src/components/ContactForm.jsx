"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const { name, email, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error('Please enter name, email, and message');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting message...');

    try {
      const response = await api('/contact', {
        method: 'POST',
        body: formData
      });

      if (response.success) {
        toast.success('Thank you! Your message has been sent successfully.', { id: toastId });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Contact Form Submit Error:', error.message);
      toast.error(`Error: ${error.message || 'Something went wrong. Please try again.'}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      
      {/* Name */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Enter name here..."
          disabled={loading}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Enter email here..."
          disabled={loading}
        />
      </div>

      {/* Subject Dropdown */}
      <div className="form-group">
        <label htmlFor="subject" className="form-label">What do you need help with?</label>
        <select
          id="subject"
          name="subject"
          value={subject}
          onChange={handleChange}
          className="form-select"
          disabled={loading}
          required
        >
          <option value="" disabled hidden>Select subject here...</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Logo Design">Logo Design</option>
          <option value="Brand Identity">Brand Identity</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Social Media Design">Social Media Design</option>
          <option value="Illustration">Illustration</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="message" className="form-label">Your Message</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={handleChange}
          required
          className="form-textarea"
          placeholder="Enter message here..."
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary contact-submit-btn"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
