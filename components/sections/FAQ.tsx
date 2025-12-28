'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "What is your typical project timeline?",
        answer: "Timelines vary by scope. A standard brochure website typically takes 4-6 weeks, while custom web applications or complex platforms can take 8-16 weeks. I provide a detailed schedule during our strategy phase."
    },
    {
        question: "Do you handle hosting and maintenance?",
        answer: "Yes. I can set up secure, scalable hosting on platforms like Vercel or AWS. I also offer ongoing maintenance packages to ensure your site remains secure, fast, and up-to-date."
    },
    {
        question: "What is your payment structure?",
        answer: "Typically, I work with a 50% deposit to secure your slot and start work, with the remaining 50% due upon project completion and launch. For larger projects, we can break this into milestones (e.g., 30/30/40)."
    },
    {
        question: "Will I be able to update the website myself?",
        answer: "Absolutely. I build most websites with a user-friendly CMS (like Sanity, Strapi, or tailored admin panels) so you can easily edit text, images, and blog posts without touching code."
    },
    {
        question: "Do you offer SEO services?",
        answer: "All my sites are built with technical SEO best practices (fast load times, proper tags, mobile responsiveness) from day one. For ongoing content SEO and ranking strategies, I can recommend partners or add-on services."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-bg relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-text mb-4">Frequently Asked Questions</h2>
                    <p className="text-text-muted text-lg">Common questions about the process and deliverables.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-border/40 rounded-2xl bg-bg-light/50 overflow-hidden">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-light transition-colors duration-200"
                            >
                                <span className="text-lg font-bold text-text">{faq.question}</span>
                                <span className={`p-2 rounded-full ${openIndex === index ? 'bg-primary/20 text-primary' : 'bg-bg-dark text-text-muted'}`}>
                                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="p-6 pt-0 text-text-muted leading-relaxed border-t border-border/20">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
