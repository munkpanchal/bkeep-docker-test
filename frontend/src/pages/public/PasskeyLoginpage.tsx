import { Link } from 'react-router';
import { PasskeyLoginForm } from '../../components/auth/PasskeyLoginForm';
import { APP_TITLE } from '../../constants';
import { logo } from '../../utills/image';

const PasskeyLoginpage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img
                            src={logo}
                            alt={APP_TITLE}
                            className="h-10 mx-auto"
                        />
                    </Link>
                    <h1 className="text-2xl font-semibold text-primary">
                        Let's get you in to {APP_TITLE}
                    </h1>
                </div>

                {/* Login Form Card */}
                <div className="bg-white">
                    <PasskeyLoginForm />
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link
                            to="/legal"
                            className="text-primary hover:underline"
                        >
                            Legal
                        </Link>
                        <Link
                            to="/privacy"
                            className="text-primary hover:underline"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/security"
                            className="text-primary hover:underline"
                        >
                            Security
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasskeyLoginpage;
