"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const ref = useRef<HTMLElement>(null);

  const fadeInUp = (selector: string, delay = 0) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
      }
    );
  };

  const fadeInLeft = (selector: string, delay = 0) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
      }
    );
  };

  const fadeInRight = (selector: string, delay = 0) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        x: 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
      }
    );
  };

  const staggerFadeIn = (selector: string, stagger = 0.1) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
      }
    );
  };

  const scrollReveal = (selector: string, delayOrTrigger?: number | string) => {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    let stagger = 0;
    let trigger = selector;

    if (typeof delayOrTrigger === 'number') {
      stagger = delayOrTrigger;
    } else if (typeof delayOrTrigger === 'string') {
      trigger = delayOrTrigger;
    }

    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: stagger,
        scrollTrigger: {
          trigger: trigger,
          start: isMobile ? 'top 95%' : 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play none none reverse',
          // Mobile-friendly settings
          markers: false,
          onEnter: () => {
            // Ensure the element is visible when animation starts
            gsap.set(selector, { visibility: 'visible' });
          },
        },
      }
    );
  };

  const scrollRevealMobile = (selector: string, trigger?: string) => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || selector,
          start: 'top 98%',
          end: 'bottom 5%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            gsap.set(selector, { visibility: 'visible' });
          },
        },
      }
    );
  };

  return {
    ref,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerFadeIn,
    scrollReveal,
    scrollRevealMobile,
  };
};