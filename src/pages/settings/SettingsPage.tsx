import React, { useState } from 'react';
import { 
  Save, 
  Upload, 
  Printer, 
  CreditCard, 
  Bell, 
  Globe, 
  Store, 
  Settings as SettingsIcon,
  User,
  Check,
  X,
  Eye,
  Wifi,
  Usb,
  QrCode,
  AlertTriangle,
  Monitor
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import UserDropdown from '../../components/UserDropdown';

const timezones = [
  'Asia/Jakarta',
  'Asia/Makassar',
  'Asia/Jayapura',
  'UTC',
  'America/New_York',
  'Europe/London'
];

const languages = [
  { code: 'English', label: 'English' },
  { code: 'Indonesian', label: 'Bahasa Indonesia' }
];

type SettingsSection = 'general' | 'printer' | 'payment' | 'notifications';

const settingsSections = [
  { id: 'general' as SettingsSection, label: 'General', icon: Store },
  { id: 'printer' as SettingsSection, label: 'Printer', icon: Printer },
  { id: 'payment' as SettingsSection, label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const { settings, updateSettings, saveSettings, hasChanges } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await saveSettings();
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const fakeUrl = URL.createObjectURL(file);
      updateSettings('general', 'logoUrl', fakeUrl);
    }
  };

  const handleQRCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const fakeUrl = URL.createObjectURL(file);
      updateSettings('paymentMethods', 'qrCodeUrl', fakeUrl);
    }
  };

  const ReceiptPreview = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 max-w-xs mx-auto">
      <div className="text-center border-b border-gray-200 pb-3 mb-3">
        {settings.general.logoUrl ? (
          <img 
            src={settings.general.logoUrl} 
            alt="Logo" 
            className="w-16 h-16 mx-auto mb-2 object-contain"
          />
        ) : (
          <div className="w-16 h-16 mx-auto mb-2 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Store className="w-8 h-8 text-emerald-600" />
          </div>
        )}
        <h3 className="font-bold text-lg">{settings.general.storeName}</h3>
        {settings.general.storeAddress && (
          <p className="text-xs text-gray-600">{settings.general.storeAddress}</p>
        )}
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Invoice:</span>
          <span>INV-20250628-001</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>28 Jun 2025, 14:30</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span>Airlangga W.</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Thai Milk Tea x2</span>
          <span>Rp 58,000</span>
        </div>
        <div className="flex justify-between">
          <span>Classic Tea x1</span>
          <span>Rp 20,000</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-xs font-bold">
        <div className="flex justify-between">
          <span>Total:</span>
          <span>Rp 78,000</span>
        </div>
        <div className="flex justify-between">
          <span>Paid:</span>
          <span>Rp 80,000</span>
        </div>
        <div className="flex justify-between">
          <span>Change:</span>
          <span>Rp 2,000</span>
        </div>
      </div>
      
      <div className="text-center mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">Thank you for your visit!</p>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Name
        </label>
        <input
          type="text"
          value={settings.general.storeName}
          onChange={(e) => updateSettings('general', 'storeName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter store name"
        />
      </div>

      {/* Store Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Address <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          value={settings.general.storeAddress}
          onChange={(e) => updateSettings('general', 'storeAddress', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter store address"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Logo
        </label>
        <div className="flex items-center space-x-4">
          {settings.general.logoUrl ? (
            <img 
              src={settings.general.logoUrl} 
              alt="Store Logo" 
              className="w-16 h-16 rounded-lg object-cover border border-stone-200"
            />
          ) : (
            <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 200x200px, PNG or JPG
            </p>
          </div>
        </div>
      </div>

      {/* Timezone and Language */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone <span className="text-gray-500">(Optional)</span>
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => updateSettings('general', 'language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderPrinterSettings = () => (
    <div className="space-y-6">
      {/* Enable Printer */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-800">Enable Printer</h4>
          <p className="text-sm text-gray-600">Allow printing of receipts and reports</p>
        </div>
        <button
          onClick={() => updateSettings('printer', 'enabled', !settings.printer.enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.printer.enabled ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.printer.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.printer.enabled && (
        <>
          {/* Printer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Printer Type
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings('printer', 'type', 'usb')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  settings.printer.type === 'usb'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Usb className="w-6 h-6" />
                <span className="font-medium">USB Printer</span>
              </button>
              
              <button
                onClick={() => updateSettings('printer', 'type', 'network')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  settings.printer.type === 'network'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Wifi className="w-6 h-6" />
                <span className="font-medium">Network Printer</span>
              </button>
            </div>
          </div>

          {/* Auto Print */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Auto Print After Payment</h4>
              <p className="text-sm text-gray-600">Automatically print receipt when payment is completed</p>
            </div>
            <button
              onClick={() => updateSettings('printer', 'autoPrint', !settings.printer.autoPrint)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.printer.autoPrint ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.printer.autoPrint ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Receipt Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Receipt Preview
              </label>
              <button
                onClick={() => setShowReceiptPreview(!showReceiptPreview)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">{showReceiptPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
            </div>
            
            {showReceiptPreview && (
              <div className="bg-stone-50 rounded-lg p-4">
                <ReceiptPreview />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      {/* Payment Method Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries({
          cash: 'Cash',
          card: 'Card',
          qris: 'QRIS',
          transfer: 'Bank Transfer'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-800">{label}</span>
            </div>
            <button
              onClick={() => updateSettings('paymentMethods', key, !settings.paymentMethods[key as keyof typeof settings.paymentMethods])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.paymentMethods[key as keyof typeof settings.paymentMethods] ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.paymentMethods[key as keyof typeof settings.paymentMethods] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* QRIS Settings */}
      {settings.paymentMethods.qris && (
        <div className="bg-blue-50 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-medium text-blue-800 flex items-center space-x-2">
            <QrCode className="w-4 h-4" />
            <span>QRIS Configuration</span>
          </h4>
          
          {/* QR Code Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Image
            </label>
            <div className="flex items-center space-x-4">
              {settings.paymentMethods.qrCodeUrl ? (
                <img 
                  src={settings.paymentMethods.qrCodeUrl} 
                  alt="QR Code" 
                  className="w-20 h-20 rounded-lg object-cover border border-stone-200"
                />
              ) : (
                <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200">
                  <QrCode className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <label
                  htmlFor="qr-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-300"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload QR Code</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your QRIS payment QR code
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Instructions
            </label>
            <textarea
              value={settings.paymentMethods.instructions}
              onChange={(e) => updateSettings('paymentMethods', 'instructions', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter instructions for customers"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-800">Enable Low Stock Alert</h4>
          <p className="text-sm text-gray-600">Get notified when inventory items are running low</p>
        </div>
        <button
          onClick={() => updateSettings('notifications', 'lowStockAlert', !settings.notifications.lowStockAlert)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.notifications.lowStockAlert ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notifications.lowStockAlert ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.notifications.lowStockAlert && (
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-medium text-amber-800">Alert Configuration</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Reorder Threshold
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={settings.notifications.defaultReorderThreshold}
                onChange={(e) => updateSettings('notifications', 'defaultReorderThreshold', parseInt(e.target.value) || 0)}
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
              />
              <span className="text-sm text-gray-600">units</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Alert when stock falls below this threshold
            </p>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Alert Method</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Alerts will be displayed as on-screen banners in the dashboard
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'printer':
        return renderPrinterSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-600">Configure your POS system preferences</p>
        </div>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
          <UserDropdown />
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-white border-r border-stone-200 flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Settings Categories
            </h3>
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-4xl">
              {/* Section Header */}
              <div className="mb-8">
                {(() => {
                  const currentSection = settingsSections.find(s => s.id === activeSection);
                  const Icon = currentSection?.icon || Store;
                  
                  return (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{currentSection?.label}</h3>
                        <p className="text-gray-600">
                          {activeSection === 'general' && 'Configure basic store information and preferences'}
                          {activeSection === 'printer' && 'Set up receipt printing and printer configuration'}
                          {activeSection === 'payment' && 'Manage available payment methods and options'}
                          {activeSection === 'notifications' && 'Configure alerts and notification preferences'}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Section Content */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 z-10">
        <div className="flex space-x-2 overflow-x-auto">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                <span className="text-xs font-medium">{section.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}