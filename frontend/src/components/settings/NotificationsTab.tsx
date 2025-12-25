import { FaSave } from 'react-icons/fa';
import Button from '../typography/Button';
import { SettingsFormData } from './types';

interface NotificationsTabProps {
    formData: SettingsFormData;
    onFormDataChange: (data: SettingsFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const NotificationsTab = ({
    formData,
    onFormDataChange,
    onSubmit,
}: NotificationsTabProps) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
                Notification Preferences
            </h3>
            <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-4 border border-primary-10 rounded-2"
                    >
                        <div>
                            <div className="font-medium text-primary capitalize">
                                {key} Notifications
                            </div>
                            <div className="text-sm text-primary-50">
                                Receive notifications via {key}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        notifications: {
                                            ...formData.notifications,
                                            [key]: e.target.checked,
                                        },
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-primary-10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-primary-10">
                <Button onClick={onSubmit} variant="primary">
                    <FaSave className="mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default NotificationsTab;
