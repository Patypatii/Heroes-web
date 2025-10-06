import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    Shield,
    Bell,
    Database,
    Mail,
    Smartphone,
    Globe,
    Lock,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    Save,
    RefreshCw
} from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        system: {
            maintenanceMode: false,
            registrationEnabled: true,
            emailNotifications: true,
            smsNotifications: true,
            autoBackup: true,
            debugMode: false
        },
        security: {
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            requireTwoFactor: false,
            passwordExpiry: 90,
            ipWhitelist: false
        },
        notifications: {
            newUserRegistration: true,
            loanApplication: true,
            paymentReceived: true,
            overdueLoans: true,
            systemAlerts: true
        },
        api: {
            rateLimit: 100,
            timeout: 30,
            corsEnabled: true,
            apiKeyRequired: true
        }
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        // Reset to default values
        setSettings({
            system: {
                maintenanceMode: false,
                registrationEnabled: true,
                emailNotifications: true,
                smsNotifications: true,
                autoBackup: true,
                debugMode: false
            },
            security: {
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                requireTwoFactor: false,
                passwordExpiry: 90,
                ipWhitelist: false
            },
            notifications: {
                newUserRegistration: true,
                loanApplication: true,
                paymentReceived: true,
                overdueLoans: true,
                systemAlerts: true
            },
            api: {
                rateLimit: 100,
                timeout: 30,
                corsEnabled: true,
                apiKeyRequired: true
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                            <p className="text-gray-600">Configure system preferences and security settings</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-primary-600 hover:bg-primary-700"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {saved && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-800">Settings saved successfully!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* System Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5" />
                                <span>System Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                                    <p className="text-sm text-gray-500">Temporarily disable user access</p>
                                </div>
                                <Switch
                                    id="maintenance"
                                    checked={settings.system.maintenanceMode}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'maintenanceMode', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="registration">User Registration</Label>
                                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                                </div>
                                <Switch
                                    id="registration"
                                    checked={settings.system.registrationEnabled}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'registrationEnabled', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email Notifications</Label>
                                    <p className="text-sm text-gray-500">Send email notifications</p>
                                </div>
                                <Switch
                                    id="email"
                                    checked={settings.system.emailNotifications}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'emailNotifications', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="sms">SMS Notifications</Label>
                                    <p className="text-sm text-gray-500">Send SMS notifications</p>
                                </div>
                                <Switch
                                    id="sms"
                                    checked={settings.system.smsNotifications}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'smsNotifications', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="backup">Auto Backup</Label>
                                    <p className="text-sm text-gray-500">Automatically backup data</p>
                                </div>
                                <Switch
                                    id="backup"
                                    checked={settings.system.autoBackup}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'autoBackup', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="debug">Debug Mode</Label>
                                    <p className="text-sm text-gray-500">Enable debug logging</p>
                                </div>
                                <Switch
                                    id="debug"
                                    checked={settings.system.debugMode}
                                    onCheckedChange={(checked) => handleSettingChange('system', 'debugMode', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Security Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="timeout">Session Timeout (minutes)</Label>
                                <Input
                                    id="timeout"
                                    type="number"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attempts">Max Login Attempts</Label>
                                <Input
                                    id="attempts"
                                    type="number"
                                    value={settings.security.maxLoginAttempts}
                                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="twofactor">Two-Factor Authentication</Label>
                                    <p className="text-sm text-gray-500">Require 2FA for all users</p>
                                </div>
                                <Switch
                                    id="twofactor"
                                    checked={settings.security.requireTwoFactor}
                                    onCheckedChange={(checked) => handleSettingChange('security', 'requireTwoFactor', checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiry">Password Expiry (days)</Label>
                                <Input
                                    id="expiry"
                                    type="number"
                                    value={settings.security.passwordExpiry}
                                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="whitelist">IP Whitelist</Label>
                                    <p className="text-sm text-gray-500">Restrict access to specific IPs</p>
                                </div>
                                <Switch
                                    id="whitelist"
                                    checked={settings.security.ipWhitelist}
                                    onCheckedChange={(checked) => handleSettingChange('security', 'ipWhitelist', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <span>Notification Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="newuser">New User Registration</Label>
                                    <p className="text-sm text-gray-500">Notify on new user signup</p>
                                </div>
                                <Switch
                                    id="newuser"
                                    checked={settings.notifications.newUserRegistration}
                                    onCheckedChange={(checked) => handleSettingChange('notifications', 'newUserRegistration', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="loanapp">Loan Applications</Label>
                                    <p className="text-sm text-gray-500">Notify on loan applications</p>
                                </div>
                                <Switch
                                    id="loanapp"
                                    checked={settings.notifications.loanApplication}
                                    onCheckedChange={(checked) => handleSettingChange('notifications', 'loanApplication', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="payment">Payment Received</Label>
                                    <p className="text-sm text-gray-500">Notify on payments</p>
                                </div>
                                <Switch
                                    id="payment"
                                    checked={settings.notifications.paymentReceived}
                                    onCheckedChange={(checked) => handleSettingChange('notifications', 'paymentReceived', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="overdue">Overdue Loans</Label>
                                    <p className="text-sm text-gray-500">Notify on overdue loans</p>
                                </div>
                                <Switch
                                    id="overdue"
                                    checked={settings.notifications.overdueLoans}
                                    onCheckedChange={(checked) => handleSettingChange('notifications', 'overdueLoans', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="alerts">System Alerts</Label>
                                    <p className="text-sm text-gray-500">Notify on system issues</p>
                                </div>
                                <Switch
                                    id="alerts"
                                    checked={settings.notifications.systemAlerts}
                                    onCheckedChange={(checked) => handleSettingChange('notifications', 'systemAlerts', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Globe className="h-5 w-5" />
                                <span>API Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="ratelimit">Rate Limit (requests/hour)</Label>
                                <Input
                                    id="ratelimit"
                                    type="number"
                                    value={settings.api.rateLimit}
                                    onChange={(e) => handleSettingChange('api', 'rateLimit', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeout">API Timeout (seconds)</Label>
                                <Input
                                    id="timeout"
                                    type="number"
                                    value={settings.api.timeout}
                                    onChange={(e) => handleSettingChange('api', 'timeout', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="cors">CORS Enabled</Label>
                                    <p className="text-sm text-gray-500">Allow cross-origin requests</p>
                                </div>
                                <Switch
                                    id="cors"
                                    checked={settings.api.corsEnabled}
                                    onCheckedChange={(checked) => handleSettingChange('api', 'corsEnabled', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="apikey">API Key Required</Label>
                                    <p className="text-sm text-gray-500">Require API key for access</p>
                                </div>
                                <Switch
                                    id="apikey"
                                    checked={settings.api.apiKeyRequired}
                                    onCheckedChange={(checked) => handleSettingChange('api', 'apiKeyRequired', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
