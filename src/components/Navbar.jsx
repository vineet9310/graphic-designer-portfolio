"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/', visible: settings?.navbar?.home !== false },
    { name: 'Portfolio', path: '/portfolio', visible: settings?.navbar?.portfolio !== false },
    { name: 'About', path: '/about', visible: settings?.navbar?.about !== false },
    { name: 'Services', path: '/services', visible: settings?.navbar?.services !== false },
    { name: 'Blogs', path: '/blogs', visible: settings?.navbar?.blogs !== false },
    { name: 'Contact', path: '/contact', visible: settings?.navbar?.contact !== false }
  ].filter(link => link.visible);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <span>V</span>ividForge.
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-menu">
            {navLinks.map((link) => {
              const isActive = link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="navbar-active-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-btn"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu-overlay"
          >
            {navLinks.map((link) => {
              const isActive = link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`mobile-navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
