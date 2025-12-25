import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from '../typography/Button';
import { APP_TITLE } from '../../constants';
import { logo } from '../../utills/image';

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`homepage-nav fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-colors duration-300 ${
                isScrolled
                    ? 'bg-[#050505]/90 backdrop-blur-md'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt={APP_TITLE}
                        className="h-9 w-auto object-contain"
                    />
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
                        {APP_TITLE}
                    </span>
                </Link>

                <div className="hidden items-center gap-8 text-sm md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-white/70 transition hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        to="/login"
                        className="text-white/70 hover:text-white"
                    >
                        Sign in
                    </Link>
                    <Link to="/register">
                        <Button
                            variant="primary"
                            size="md"
                            className="bg-gradient-to-r from-[#ff6a3a] to-[#ff3412] text-white border-none"
                        >
                            Get started
                        </Button>
                    </Link>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="rounded-lg p-2 text-white md:hidden"
                    aria-label="Toggle navigation"
                >
                    {isMobileMenuOpen ? (
                        <FaTimes className="h-6 w-6" />
                    ) : (
                        <FaBars className="h-6 w-6" />
                    )}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="border-t border-white/5 bg-[#050505] px-6 py-6 md:hidden">
                    <div className="flex flex-col gap-4 text-white/80">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-lg border border-white/5 px-4 py-2 text-sm hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-lg border border-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-lg bg-gradient-to-r from-[#ff6a3a] to-[#ff3412] px-4 py-2 text-center text-sm font-semibold text-white"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
