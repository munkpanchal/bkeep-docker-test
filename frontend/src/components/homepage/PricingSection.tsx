import { PRICING_PLANS } from './constants.tsx';

const PricingSection = () => {
    return (
        <section
            id="pricing"
            className="mx-auto max-w-6xl px-6 py-20 text-white"
        >
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">
                    Pricing options
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Choose the subscription that fits your strategy.
                </h2>
                <p className="text-base text-white/65">
                    Monthly or annual billing, transparent fees, and dedicated
                    onboarding for every workspace.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
                {PRICING_PLANS.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-3xl border border-white/5 p-8 ${
                            plan.highlight
                                ? 'bg-gradient-to-br from-[#ff7a42]/30 to-[#1a0f0b]'
                                : 'bg-[#0b0b0b]'
                        }`}
                    >
                        {plan.highlight && (
                            <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                                {plan.highlight}
                            </span>
                        )}
                        <div className="mt-4 flex items-end gap-3">
                            <p className="text-4xl font-semibold text-white">
                                {plan.price}
                            </p>
                            <p className="text-sm text-white/60">
                                {plan.cadence}
                            </p>
                        </div>
                        <p className="mt-4 text-sm text-white/70">
                            {plan.description}
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-white/70">
                            {plan.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="rounded-2 border border-white/5 bg-white/5 px-4 py-2"
                                >
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-6 w-full rounded-2 border border-white/10 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                            {plan.name === 'Core'
                                ? 'Get started'
                                : 'Upgrade now'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
