import { CAPABILITY_FEATURES } from './constants.tsx';

export default function BenefitsSection() {
    return (
        <section
            id="benefits"
            className="mx-auto max-w-6xl px-6 py-20 text-white"
        >
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">
                    Smarter investing starts here
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Control every detail—from allocation to analytics—in one
                    intelligent dashboard.
                </h2>
                <p className="text-base text-white/65">
                    Transparent tracking, seamless allocation, and proactive
                    risk management powered by AI.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
                {CAPABILITY_FEATURES.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-[28px] border border-white/5 bg-[#0b0b0b] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
                    >
                        <span className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                            {feature.metric}
                        </span>
                        <h3 className="mt-3 text-xl font-semibold text-white">
                            {feature.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/65">
                            {feature.description}
                        </p>
                        <button className="mt-6 text-sm font-semibold text-[#ff7a42] transition hover:text-white">
                            Learn more →
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
