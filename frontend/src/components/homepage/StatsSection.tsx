import { PERFORMANCE_STATS } from './constants.tsx';

export default function StatsSection() {
    return (
        <section
            id="metrics"
            className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-white"
        >
            <div className="rounded-[32px] border border-white/5 bg-[#0b0b0b] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
                <div className="grid gap-6 text-center sm:grid-cols-3">
                    {PERFORMANCE_STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="space-y-2 rounded-2 bg-white/5 px-6 py-4"
                        >
                            <p className="text-3xl font-semibold text-white">
                                {stat.value}
                            </p>
                            <p className="text-sm text-white/60">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
