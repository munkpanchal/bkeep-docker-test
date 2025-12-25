import { TRUSTED_LOGOS } from './constants.tsx';

const TrustedSection = () => {
    return (
        <section
            id="trusted"
            className="mx-auto max-w-6xl px-6 pb-12 text-white/60"
        >
            <p className="text-center text-xs uppercase tracking-[0.4em] text-white/40">
                Trusted by 1.2k+ forward-thinking teams
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm sm:grid-cols-4 md:grid-cols-8">
                {TRUSTED_LOGOS.map((logo) => (
                    <span
                        key={logo}
                        className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-white/50"
                    >
                        {logo}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TrustedSection;
