import { FAQ_ITEMS } from './constants.tsx';

const FAQSection = () => {
    return (
        <section id="faq" className="mx-auto max-w-5xl px-6 pb-20 text-white">
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/40">
                    FAQ
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Answers for every stage of your journey.
                </h2>
            </div>
            <div className="mt-10 space-y-4">
                {FAQ_ITEMS.map((item) => (
                    <details
                        key={item.question}
                        className="group rounded-2 border border-white/5 bg-[#0b0b0b] p-5"
                    >
                        <summary className="flex cursor-pointer items-center justify-between text-left text-base font-semibold text-white">
                            {item.question}
                            <span className="text-white/50 transition group-open:rotate-45">
                                +
                            </span>
                        </summary>
                        <p className="mt-3 text-sm text-white/65">
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
