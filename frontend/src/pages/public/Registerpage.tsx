import { Link } from 'react-router';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { logo } from '../../utills/image';

const Registerpage = () => {
    return (
        <div className="h-full  flex w-full">
            {/* Left Side - Branding Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-75 items-center justify-center p-12 relative overflow-hidden">
                {/* Background Pattern Layer 1 - Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute inset-0 animate-pattern-grid"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '60px 60px',
                        }}
                    ></div>
                </div>
                {/* Background Pattern Layer 2 - Dots */}
                <div className="absolute inset-0 opacity-15">
                    <div
                        className="absolute inset-0 animate-pattern-dots"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                            backgroundPosition: '20px 20px',
                        }}
                    ></div>
                </div>
                {/* Background Pattern Layer 3 - Diagonal Lines */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0 animate-pattern-diagonal"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 10px,
                                rgba(255, 255, 255, 0.1) 10px,
                                rgba(255, 255, 255, 0.1) 20px
                            )`,
                            backgroundSize: '28px 28px',
                        }}
                    ></div>
                </div>
                <div className="relative z-10 w-full text-center">
                    <div className="flex items-center justify-center">
                        <img
                            src={logo}
                            alt="BKeep Accounting Logo"
                            className="h-20 aspect-[3/4] bg-lightBg p-4 rounded-sm  mb-8 drop-shadow-lg object-contain"
                        />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Get Started
                    </h1>
                    <p className="text-lg text-white/90 mb-8">
                        Create your account and start managing your accounting
                        with our powerful platform.
                    </p>
                    <div className="flex flex-col gap-4 text-white/80 text-sm">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/60"></div>
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/60"></div>
                            <span>24/7 Support Available</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/60"></div>
                            <span>Cloud-Based Platform</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center bg-lightBg p-6 lg:p-12 overflow-auto h-full">
                <div className="w-full max-w-md py-4 h-full">
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <img
                            src={logo}
                            alt="BKeep Accounting Logo"
                            className="h-16 w-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-primary mb-2">
                            Get Started
                        </h1>
                        <p className="text-sm text-primary-75 text-center">
                            Create your account to continue
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-2 shadow-xl p-6 lg:p-8 border border-primary-10">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-primary mb-2">
                                    Create Account
                                </h2>
                                <p className="text-sm text-primary-50">
                                    Fill in your details to create your account
                                </p>
                            </div>
                            <RegisterForm />
                        </div>

                        {/* Footer */}
                        <div className="my-6 text-center">
                            <p className="text-xs text-primary-50">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary-75 font-medium underline"
                                >
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-xs text-primary-50 mt-2">
                                © 2024 BKeep Accounting. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registerpage;
