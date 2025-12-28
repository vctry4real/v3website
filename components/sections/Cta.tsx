import { ArrowRight } from 'lucide-react';

const Cta = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-transparent">
            {/* Gradient Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="bg-bg-light/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-16 hover:border-primary/50 transition-colors duration-300">
                    <h2 className="text-3xl md:text-5xl font-bold text-text mb-6">
                        Ready to elevate your digital presence?
                    </h2>
                    <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                        Let's collaborate to build something exceptional. Whether you have a clear vision or just an idea, I'm here to help you bring it to life.
                    </p>
                    <a
                        href="/appointments"
                        className="inline-flex items-center space-x-3 bg-primary hover:bg-primary/90 text-bg-dark px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]"
                    >
                        <span>Start Your Project</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Cta;