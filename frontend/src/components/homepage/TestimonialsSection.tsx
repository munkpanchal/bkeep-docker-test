import { TESTIMONIALS } from './constants.tsx';

const TestimonialsSection = () => {
    return (
        <section
            id="testimonials"
            className="mx-auto max-w-6xl px-6 py-20 text-white"
        >
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">
                    Trusted by investors worldwide
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Real stories from forward-thinking leaders.
                </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
                {TESTIMONIALS.map((testimonial, index) => (
                    <div
                        key={`${testimonial.name}-${index}`}
                        className="rounded-3xl border border-white/5 bg-[#0b0b0b] p-6 text-left"
                    >
                        <p className="text-sm text-white/70">
                            “{testimonial.quote}”
                        </p>
                        <div className="mt-4 text-sm text-white/60">
                            <p className="font-semibold text-white">
                                {testimonial.name}
                            </p>
                            <p>{testimonial.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
