import React, { forwardRef, useState } from 'react';

type InputFieldProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'className'
> & {
    label?: string;
    icon?: React.ReactNode;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    (
        { id, label, type = 'text', icon, required, placeholder, ...rest },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordField = type === 'password';
        const inputType = isPasswordField && showPassword ? 'text' : type;

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="input-label" htmlFor={id}>
                        {label}
                        {required && (
                            <span className="text-red-500 ml-0">*</span>
                        )}
                    </label>
                )}
                <div className={`relative input-wrap`}>
                    {icon && (
                        <div className="absolute left-2 top-2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={`input ${icon ? 'pl-10' : 'pl-4'} ${
                            isPasswordField ? 'pr-10' : 'pr-4'
                        }`}
                        type={inputType}
                        placeholder={placeholder}
                        required={required}
                        {...rest}
                    />
                    {isPasswordField && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

export const SelectField = forwardRef<
    HTMLSelectElement,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
        label?: string;
        options?: { value: string; label: string }[];
    }
>(({ id, label, required, options = [], ...rest }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="input-label" htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500 ml-0">*</span>}
                </label>
            )}
            <div className="relative input-wrap w-full !px-4">
                <select
                    ref={ref}
                    id={id}
                    className="input appearance-none"
                    required={required}
                    {...rest}
                >
                    <optgroup label={label}>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
});

export const TextareaField = forwardRef<
    HTMLTextAreaElement,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
        label?: string;
    }
>(({ id, label, required, ...rest }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="input-label" htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500 ml-0">*</span>}
                </label>
            )}
            <div className="relative input-wrap !w-full !px-4">
                <textarea
                    ref={ref}
                    id={id}
                    className="input w-full h-20 resize-none"
                    placeholder={label}
                    required={required}
                    {...rest}
                />
            </div>
        </div>
    );
});
