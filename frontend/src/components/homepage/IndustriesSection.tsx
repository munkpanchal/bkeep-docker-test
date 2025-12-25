import { OUTCOME_CARDS } from './constants.tsx';

export default function IndustriesSection() {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-20 text-white">
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                    Smarter investing. Stronger outcomes.
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    AI that adapts to every market condition.
                </h2>
                <p className="text-base text-white/65">
                    Built for ambitious teams that need complete visibility and
                    confident execution.
                </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
                {OUTCOME_CARDS.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/8 to-transparent p-6"
                    >
                        <h3 className="text-xl font-semibold text-white">
                            {card.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/65">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
