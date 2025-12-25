import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import AcceptInvitationForm from '../../components/auth/AcceptInvitationForm';
import { APP_TITLE } from '../../constants';
import { logo } from '../../utills/image';

const AcceptInvitationpage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex w-full bg-lightBg">
            {/* Right Side - Accept Invitation Form Section */}
            <div className="w-full lg:w-1/2 mx-auto flex items-center justify-center  p-6 lg:p-12 overflow-auto min-h-screen">
                <div className="w-full">
                    {/* Mobile Logo - Only visible on small screens */}
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="BKeep Accounting Logo"
                                className="h-16 w-auto mb-4"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-primary mb-2">
                            Welcome to {APP_TITLE}
                        </h1>
                        <p className="text-sm text-primary-75 text-center">
                            Complete your account setup to get started
                        </p>
                    </div>

                    {/* Accept Invitation Form Card */}
                    <div className="bg-white rounded-2 shadow-xl p-6 lg:p-8 border border-primary-10">
                        <AcceptInvitationForm />
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-primary-50 mt-2">
                            © {new Date().getFullYear()} {APP_TITLE}. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcceptInvitationpage;
