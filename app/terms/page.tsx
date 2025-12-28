import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - vctry4real',
    description: "Freelancer Terms & Conditions for Victory Johnson's services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            FREELANCER TERMS & CONDITIONS
                        </h2>
                        <p className="text-gray-400">
                            Last updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">1. Commencement of Agreement</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    This agreement becomes effective once both parties confirm acceptance. The effective date will be noted at the top of the agreement.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">2. Independent Contractor Status</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    I operate as an independent contractor, not an employee. I provide my own tools, manage my own process, and deliver services as agreed.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">3. Scope of Work</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    The scope of services, deliverables, and timelines will be clearly defined at the start of each project. Any work outside this scope will be treated as a separate engagement and quoted accordingly.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">4. Payment Terms</h3>
                                <ul className="text-gray-300 leading-relaxed space-y-2 ml-6">
                                    <li>• A 60% deposit is required before any work begins.</li>
                                    <li>• Milestone payments are due upon completion of agreed stages.</li>
                                    <li>• Final deliverables are released once the balance is paid in full.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">5. Project Timelines</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Each milestone or deliverable will have a defined deadline. If information, materials, or feedback from the client are delayed, timelines will shift accordingly.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">6. Revisions</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    The project includes a specified number of revisions, outlined in the project proposal. Additional revisions beyond this number will be billed separately.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">7. Ownership and Rights</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Ownership of the final deliverables transfers to the client only after full payment is received. Until then, all rights remain with me. Drafts and unused concepts suggested by me are not included in ownership transfer and may be repurposed.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">8. Confidentiality</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    All confidential information shared during the project will remain private. I will not disclose or use such information outside the scope of this agreement.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">9. Cancellation and Early Termination</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    If the client cancels before project completion, the deposit is non-refundable. Payment for work completed up to the cancellation date will also be due. Either party may terminate this agreement with seven (7) days written notice.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">10. Governing Law</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    This agreement shall be governed by the laws of my country of residence, unless otherwise agreed in writing.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">11. Amendments</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Any changes to this agreement must be made in writing and approved by both parties.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-white mb-4">12. Communication</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    All communication regarding the project will be conducted via email or other agreed channels. I am available during standard business hours and will respond promptly to project-related matters.
                                </p>
                            </section>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                        <p className="text-gray-400 text-sm">
                            For questions about these terms, please contact{' '}
                            <a
                                href="mailto:victoryjohnson@vctry4real.dev"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                                victoryjohnson@vctry4real.dev
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
