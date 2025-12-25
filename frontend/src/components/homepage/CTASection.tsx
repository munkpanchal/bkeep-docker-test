import { Link } from 'react-router';
import Button from '../typography/Button';

export default function CTASection() {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-24">
            <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-r from-[#ff7a42] via-[#ff4b1f] to-[#2b0c05] px-8 py-12 text-white shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
                <div className="space-y-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">
                        Start investing smarter today
                    </p>
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        Harness the power of AI to grow portfolios with
                        confidence and clarity.
                    </h2>
                    <p className="text-base text-white/80">
                        Launch in minutes, invite your team, and see why firms
                        worldwide trust BKeep to automate their investment
                        intelligence.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link to="/register">
                            <Button
                                variant="primary"
                                className="bg-white text-[#1b0f0a] hover:bg-white/90"
                            >
                                Get started
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="border-white/40 text-white hover:bg-white/10"
                        >
                            Talk to sales
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
