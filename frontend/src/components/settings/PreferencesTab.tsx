import { FaSave } from 'react-icons/fa';
import Button from '../typography/Button';
import { SettingsFormData } from './types';

interface PreferencesTabProps {
    formData: SettingsFormData;
    onFormDataChange: (data: SettingsFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const PreferencesTab = ({
    formData,
    onFormDataChange,
    onSubmit,
}: PreferencesTabProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
                Preferences
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        Timezone
                    </label>
                    <select
                        value={formData.timezone}
                        onChange={(e) =>
                            onFormDataChange({
                                ...formData,
                                timezone: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                    >
                        <option value="America/New_York">
                            Eastern Time (ET)
                        </option>
                        <option value="America/Chicago">
                            Central Time (CT)
                        </option>
                        <option value="America/Denver">
                            Mountain Time (MT)
                        </option>
                        <option value="America/Los_Angeles">
                            Pacific Time (PT)
                        </option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        Currency
                    </label>
                    <select
                        value={formData.currency}
                        onChange={(e) =>
                            onFormDataChange({
                                ...formData,
                                currency: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        Date Format
                    </label>
                    <select
                        value={formData.dateFormat}
                        onChange={(e) =>
                            onFormDataChange({
                                ...formData,
                                dateFormat: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2 border border-primary-10 rounded-2 text-sm text-primary focus:outline-none focus:border-primary"
                    >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-primary-10">
                <Button type="submit" variant="primary">
                    <FaSave className="mr-2" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default PreferencesTab;
