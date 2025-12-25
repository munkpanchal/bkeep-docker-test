// Constants for homepage sections inspired by the Aset layout

export const PAGE_HEADERS = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        subtitle: 'Welcome to your dashboard',
    },
    {
        path: '/transactions',
        title: 'Transactions',
        subtitle: 'View and manage all your financial transactions',
    },
    {
        path: '/reports',
        title: 'Reports',
        subtitle:
            'Deep dive into production, collections, and receivables with intelligent filters.',
    },
    {
        path: '/reports/income-statement',
        title: 'Income Statement',
        subtitle: 'View your revenue, expenses, and net income',
    },
    {
        path: '/reports/balance-sheet',
        title: 'Balance Sheet',
        subtitle: 'View your assets, liabilities, and equity',
    },
    {
        path: '/chart-of-accounts',
        title: 'Chart of Accounts',
        subtitle: 'Manage your accounts and track balances',
    },
    {
        path: '/settings',
        title: 'Settings',
        subtitle: 'Manage your account settings and preferences',
    },
    {
        path: '/settings/profile',
        title: 'Profile Settings',
        subtitle: 'Manage your personal information and account details',
    },
    {
        path: '/settings/tenants',
        title: 'Tenants Management',
        subtitle: 'Manage your organization tenants and workspaces',
    },
    {
        path: '/settings/users',
        title: 'Users Management',
        subtitle: 'Manage users, roles, and permissions for your organization',
    },
    {
        path: '/settings/roles',
        title: 'Roles Management',
        subtitle: 'Configure and manage user roles and permissions',
    },
    {
        path: '/settings/security',
        title: 'Security Settings',
        subtitle: 'Manage your account security, passwords, and authentication',
    },
    {
        path: '/settings/data',
        title: 'Data & Privacy',
        subtitle: 'Manage your data privacy settings and preferences',
    },
    {
        path: '/settings/notifications',
        title: 'Notification Settings',
        subtitle: 'Configure your notification preferences and alerts',
    },
    {
        path: '/invoices',
        title: 'Invoices',
        subtitle: 'Create and manage your invoices',
    },
    {
        path: '/expenses',
        title: 'Expenses',
        subtitle: 'Track and manage your business expenses',
    },
    {
        path: '/documents',
        title: 'Documents',
        subtitle: 'Upload and manage your documents',
    },
    {
        path: '/client-review',
        title: 'Client Review',
        subtitle: 'Review and categorize transactions that need your input',
    },
];

export const TRUSTED_LOGOS = [
    'Wealthro',
    'Finyon',
    'Aegra',
    'Portivio',
    'Vaultic',
    'Altoris',
    'Quantora',
    'Fundara',
];

export const HERO_METRICS = [
    { value: '98.7%', label: 'Client retention rate' },
    { value: '$250M+', label: 'Assets managed with BKeep AI' },
    { value: '120+', label: 'Automated strategies live' },
];

export const PERFORMANCE_STATS = [
    { value: '98.7%', label: 'Client retention rate' },
    { value: '$250M+', label: 'Capital actively managed' },
    { value: '120+', label: 'Automated AI strategies' },
];

export const INVEST_FEATURES = [
    {
        title: 'Precision-driven portfolio growth',
        description:
            'Every allocation is data backed with real-time signals so you can scale faster with conviction.',
        tag: 'Portfolio Intelligence',
    },
    {
        title: 'Diversified assets on autopilot',
        description:
            'Blend equities, credit, and digital assets with automated rebalancing tuned to your risk profile.',
        tag: 'Adaptive Allocation',
    },
    {
        title: 'Insights in milliseconds',
        description:
            'Live dashboards track performance, exposure, and cash flow so your next move is always informed.',
        tag: 'Live Analytics',
    },
    {
        title: 'Maximize returns with less effort',
        description:
            'Let autonomous execution handle the busywork while you stay focused on strategy and relationships.',
        tag: 'Autonomous Execution',
    },
];

export const CAPABILITY_FEATURES = [
    {
        title: 'Transparent performance tracking',
        description:
            'Monitor every portfolio move with intuitive analytics, benchmark overlays, and exported reports.',
        metric: 'Real-time analytics',
    },
    {
        title: 'Seamless asset allocation',
        description:
            'Balance across asset classes with guardrails that adapt instantly to market volatility.',
        metric: 'Dynamic allocation',
    },
    {
        title: 'Smart risk management',
        description:
            'AI scans volatility, liquidity, and macro signals to adjust exposure before risk compounds.',
        metric: 'Adaptive hedging',
    },
];

export const OUTCOME_CARDS = [
    {
        title: 'AI-powered strategies',
        description:
            'Adaptive models trained on millions of market data points deliver institutional-grade precision.',
    },
    {
        title: 'Real-time insights',
        description:
            'See how every desk, entity, or client is performing with streaming analytics you can trust.',
    },
    {
        title: 'Automated execution',
        description:
            'Go from signal to trade without latency thanks to automated approvals and routing.',
    },
    {
        title: 'Adaptive risk controls',
        description:
            'Reduce drawdowns with AI that tightens or widens exposure as volatility shifts.',
    },
];

export const PRICING_PLANS = [
    {
        name: 'Core',
        price: '$99',
        cadence: 'Billed monthly',
        description: 'Perfect for lean finance teams modernizing client work.',
        features: [
            '0.4% management fee',
            'AI rebalancing & tracking',
            'Market insights feed',
            'Advisor support',
        ],
    },
    {
        name: 'Vision',
        price: '$2,099',
        cadence: 'Billed monthly',
        description: 'Best for global firms scaling automation at speed.',
        highlight: 'Best value',
        features: [
            '0.2%–0.4% management fee',
            'Advanced AI strategies',
            '2.75% cash interest',
            'Investment team access',
            'Priority onboarding & support',
        ],
    },
];

export const TESTIMONIALS = [
    {
        quote: 'BKeep AI gave us clarity and automation across every treasury workflow. It feels like an institutional desk in a single platform.',
        name: 'Olivia Bennett',
        role: 'Product Manager',
    },
    {
        quote: 'I fine-tune portfolio strategies in minutes now. The live analytics and automation easily save hours every week.',
        name: 'Ethan Carter',
        role: 'Wealth Advisor',
    },
    {
        quote: 'As a founder, I finally have a treasury dashboard that is just as intuitive as it is intelligent.',
        name: 'Jenna Wallace',
        role: 'Startup Founder',
    },
    {
        quote: 'The AI insights helped us balance risk across both traditional and crypto assets without adding headcount.',
        name: 'Marcus Reed',
        role: 'Crypto Analyst',
    },
];

export const FAQ_ITEMS = [
    {
        question: 'How is BKeep different from legacy investment tools?',
        answer: 'BKeep combines real-time AI models, automated execution, and transparent analytics so you can adapt instantly. No manual exports or disconnected spreadsheets.',
    },
    {
        question: 'Is BKeep suitable for new teams or individual investors?',
        answer: 'Yes. We designed the experience to feel approachable for new investors while still offering the controls that institutional teams expect.',
    },
    {
        question: 'Can I customize strategies and risk preferences?',
        answer: 'Every workspace supports bespoke risk bands, hedging logic, and approval policies so your automation mirrors how your firm already operates.',
    },
    {
        question: 'How secure is my data?',
        answer: 'Customer data is encrypted in transit and at rest, and every workspace includes audit trails, SSO, and granular access controls.',
    },
];
