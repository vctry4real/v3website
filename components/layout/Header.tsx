"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '/about', isLink: true },
    { label: 'Services', href: '/services', isLink: true },
    { label: 'Portfolio', href: '/portfolio', isLink: true },
    // { label: 'Experience', href: '#experience', isLink: false },
    { label: 'Blog', href: '/blog', isLink: true },
    { label: 'Appointments', href: '/appointments', isLink: true },
    // { label: 'Contact', href: '#contact', isLink: false },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.isLink) {
      // For external links (or full page navs), navigate using Next Router
      router.push(item.href);
    } else {
      // For section links, check if we're on home page
      if (pathname === '/') {
        // On home page, scroll to section
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Not on home page, navigate to home page with hash
        router.push(`/${item.href}`);
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-bg-dark/95 backdrop-blur-sm border-b border-border'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <h1 className="text-xl font-bold text-text hover:text-primary transition-colors duration-200 cursor-pointer">
                Victory Johnson
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="text-text-muted hover:text-text transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">

            <Link href="/appointments">
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-muted hover:text-text transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-bg-dark/95 backdrop-blur-sm border-t border-border">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className="block w-full text-left px-3 py-2 text-text-muted hover:text-text transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">

                <Link href="/appointments" className="block">
                  <Button size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Call
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};