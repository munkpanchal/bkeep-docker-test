import { Link } from 'react-router';
import { APP_TITLE } from '../../constants';
import { logo } from '../../utills/image';

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'FAQ', href: '#faq' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/' },
            { label: 'Blog', href: '/' },
            { label: 'Careers', href: '/' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/' },
            { label: 'Security', href: '/' },
            { label: 'Contact', href: '/' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#050505]">
            <div className="mx-auto max-w-6xl px-6 py-12 text-white/70">
                <div className="grid gap-8 md:grid-cols-[1.2fr,repeat(3,1fr)]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt={APP_TITLE}
                                className="h-9 w-auto object-contain"
                            />
                            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
                                {APP_TITLE}
                            </span>
                        </div>
                        <p className="text-sm text-white/60">
                            Empowering finance teams with AI automation,
                            real-time visibility, and modern execution.
                        </p>
                    </div>
                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
                                {column.title}
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-white/60">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="transition hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} {APP_TITLE}. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/" className="hover:text-white">
                            Privacy
                        </Link>
                        <Link to="/" className="hover:text-white">
                            Terms
                        </Link>
                        <Link to="/" className="hover:text-white">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
