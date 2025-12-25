import React from 'react';

type ButtonProps = {
    variant?: 'primary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
    isRounded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            onClick,
            disabled = false,
            icon,
            loading = false,
            children,
            className,
            isRounded = false,
            ...rest
        },
        ref
    ) => {
        // Define base classes for all buttons
        const baseClasses =
            'inline-flex gap-2 uppercase items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-95 ' +
            (isRounded ? 'rounded-full' : 'rounded-2');

        // Define size-specific classes
        const sizeClasses = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-1 text-sm',
            lg: 'h-12 px-6 py-2 text-base',
        };

        // Define variant-specific classes
        const variantClasses = {
            primary: 'bg-primary hover:bg-primary-75 text-white ',

            outline:
                'bg-white text-primary border border-primary hover:bg-primary hover:text-white  active:bg-primary',
        };

        // Combine all classes
        const buttonClasses = [
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            loading && 'cursor-not-allowed',
            className,
        ]
            .filter(Boolean)
            .join(' ')
            .trim();

        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                className={buttonClasses}
                onClick={isDisabled ? undefined : onClick}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                {...rest}
            >
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {icon && icon}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
