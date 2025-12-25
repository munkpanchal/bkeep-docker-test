import {
    BenefitsSection,
    CTASection,
    FAQSection,
    FeaturesSection,
    Footer,
    HeroSection,
    IndustriesSection,
    Navigation,
    PricingSection,
    StatsSection,
    TestimonialsSection,
    TrustedSection,
} from '../../components/homepage';
import '../../components/homepage/styles.css';

export default function Homepage() {
    return (
        <div className="min-h-screen w-full bg-[#050505] text-white">
            <Navigation />
            <HeroSection />
            <TrustedSection />
            <StatsSection />
            <FeaturesSection />
            <BenefitsSection />
            <IndustriesSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
}
