"use client";

import React from 'react';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/vctry4real/', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/vctry4real', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/__vctry?t=U-jP5riW_RBO1VSpgmbI7A&s=09', label: 'Twitter' },
    { icon: Mail, href: 'mailto:vctry4real@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' }, // Renamed from Works/Work
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }, // Replaces Appointments in generic footer, but can keep Appointments if preferred. I'll stick to standard "Links"
  ];

  return (
    <footer className="bg-transparent border-t border-border/30 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-text block">
              Victory Johnson
            </Link>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Full-stack software engineer crafting exceptional digital experiences with precision and passion.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-text mb-6">Explore</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-text mb-6">Contact</h4>
            <div className="space-y-3 text-text-muted">
              <a href="mailto:vctry4real@gmail.com" className="block hover:text-primary transition-colors duration-300">
                vctry4real@gmail.com
              </a>
              <p className="text-sm opacity-80">
                Available for new opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p className="flex items-center">
            © {currentYear} Victory Johnson. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;