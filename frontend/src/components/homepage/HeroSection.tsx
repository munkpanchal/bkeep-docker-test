import { useEffect } from 'react';
import { Link } from 'react-router';
import Button from '../typography/Button';
import { HERO_METRICS } from './constants.tsx';

export default function HeroSection() {
    useEffect(() => {
        localStorage.setItem(
            'passkeyUser',
            JSON.stringify({
                email: 'user@example.com',
                lastAccessed: 'Nov 21, 2025',
                device: 'Chrome on Windows',
            })
        );
    }, []);
    return (
        <section className="relative isolate overflow-hidden bg-[#050505] pt-28 text-white">
            <div className="absolute inset-0 -z-10 opacity-60">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f0c] via-[#0b0b0b] to-[#050505]" />
                <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-[#ff4b1f]/40 blur-3xl" />
                <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ff8f53]/40 blur-3xl" />
            </div>
            <div className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
                <div className="space-y-8">
                    <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                        AI Wealth Platform
                    </span>
                    <div className="space-y-6">
                        <h1 className="text-4xl font-semibold leading-[1.15] text-white sm:text-5xl lg:text-[56px]">
                            Empowering your investments with intelligent
                            automation.
                        </h1>
                        <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                            BKeep analyzes millions of market data points in
                            real time, unlocking faster decisions, transparent
                            tracking, and automated execution for modern finance
                            teams.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register">
                            <Button
                                variant="primary"
                                className="bg-gradient-to-r from-[#ff6a3a] to-[#ff3412] px-8 text-white shadow-[0_0_40px_rgba(255,106,58,0.35)]"
                            >
                                Get started
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/10"
                        >
                            See how it works
                        </Button>
                    </div>
                    <div className="grid gap-6 rounded-2 border border-white/5 bg-white/5 p-6 backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                            Performance you can measure
                        </p>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {HERO_METRICS.map((metric) => (
                                <div key={metric.label} className="space-y-1.5">
                                    <p className="text-2xl font-semibold text-white">
                                        {metric.value}
                                    </p>
                                    <p className="text-xs text-white/60">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative rounded-[32px] border border-white/5 bg-[#0d0d0d]/80 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)] backdrop-blur">
                        <div className="flex items-center justify-between text-xs text-white/50">
                            <span>Strategy Monitor</span>
                            <span>Live</span>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2 border border-white/5 bg-white/5 p-4">
                                <p className="text-sm text-white/60">
                                    Alpha Mix
                                </p>
                                <p className="text-2xl font-semibold text-white">
                                    +12.4%
                                </p>
                                <div className="mt-4 h-24 rounded-2 bg-gradient-to-br from-[#ff813f]/30 to-[#ff4b1f]/10" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2 border border-white/5 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        Signals
                                    </p>
                                    <p className="mt-3 text-lg font-semibold text-white">
                                        28 Live
                                    </p>
                                    <p className="text-xs text-white/50">
                                        Updated 2 mins ago
                                    </p>
                                </div>
                                <div className="rounded-2 border border-white/5 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        Risk
                                    </p>
                                    <p className="mt-3 text-lg font-semibold text-white">
                                        Stable
                                    </p>
                                    <p className="text-xs text-white/50">
                                        Exposure 42%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -left-4 hidden w-40 rounded-2 border border-white/5 bg-white/5 p-4 text-xs text-white/70 shadow-2xl lg:block">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">
                            Trusted
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                            1.2k+
                        </p>
                        <p className="text-white/50">Forward-thinking teams</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
