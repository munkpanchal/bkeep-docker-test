import Button from '../typography/Button';

const DataPrivacyTab = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
                Data & Privacy
            </h3>
            <div className="space-y-4">
                <div className="p-4 border border-primary-10 rounded-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="font-medium text-primary">
                                Export Data
                            </div>
                            <div className="text-sm text-primary-50">
                                Download a copy of your data
                            </div>
                        </div>
                        <Button variant="outline">Export</Button>
                    </div>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-red-700">
                                Delete Account
                            </div>
                            <div className="text-sm text-red-600">
                                Permanently delete your account and all data
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPrivacyTab;
