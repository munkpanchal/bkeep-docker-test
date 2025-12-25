import toast from 'react-hot-toast';
import { FaXmark } from 'react-icons/fa6';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        icon: '✅',
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        icon: <FaXmark className="text-primary" />,
    });
};

export const showLoadingToast = (message: string) => {
    return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

export const updateToast = (
    toastId: string,
    type: 'success' | 'error',
    message: string
) => {
    toast[type](message, { id: toastId });
};
