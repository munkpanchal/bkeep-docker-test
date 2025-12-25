type ChipsProps = {
    label: string;
    variant:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info';
    className?: string;
};

const Chips = ({ label, variant, className = '' }: ChipsProps) => {
    const variantClasses = {
        primary: 'bg-primary-10 text-primary-700',
        secondary: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
    };
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
        >
            {label}
        </span>
    );
};

export default Chips;
