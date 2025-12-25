import { INVEST_FEATURES } from './constants.tsx';

export default function FeaturesSection() {
    return (
        <section
            id="features"
            className="mx-auto max-w-6xl px-6 py-20 text-white"
        >
            <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">
                        Invest with confidence
                    </p>
                    <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                        Every allocation is backed by real-time intelligence and
                        automated execution.
                    </h2>
                    <p className="text-base text-white/70">
                        BKeep removes the guesswork from multi-asset
                        management—AI surfaces the next opportunity, balances
                        exposure across portfolios, and handles approvals while
                        you stay focused on strategy.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {INVEST_FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/8 to-white/0 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                        >
                            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40">
                                {feature.tag}
                            </span>
                            <h3 className="mt-3 text-lg font-semibold text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm text-white/65">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
