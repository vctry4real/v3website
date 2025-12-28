"use client"

const TrustedBy: React.FC = () => {
    const companies = [
        { name: 'MugDevs', logo: '/assets/logos/mugdevs.png' }, // Verify if exists, otherwise text
        { name: 'Softvenix', logo: '/assets/logos/softvenix.webp' },
        { name: 'FoodCrate', logo: '/assets/logos/foodcrate.png' },
        { name: 'Retailbox', logo: '/assets/logos/retailbox.webp' },
        { name: 'Nexus', logo: null }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            {/* Section Title */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em]">
                    Trusted By
                </h3>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Company Logos Grid */}
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 ease-in-out transform hover:scale-105"
                        >
                            {/* We will rely on text if logo fails to load or is null, simpler for now to just show text if we aren't sure of assets, but let's try image first */}
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="h-8 md:h-10 w-auto object-contain brightness-200 contrast-0 group-hover:brightness-100 group-hover:contrast-100"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <span className={`${company.logo ? 'hidden' : ''} text-2xl md:text-3xl font-bold font-serif text-text-muted tracking-tight group-hover:text-white`}>
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
