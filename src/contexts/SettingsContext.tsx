import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsData {
  general: {
    storeName: string;
    storeAddress: string;
    logoUrl: string;
    timezone: string;
    language: string;
  };
  printer: {
    enabled: boolean;
    type: 'usb' | 'network';
    autoPrint: boolean;
  };
  paymentMethods: {
    cash: boolean;
    card: boolean;
    qris: boolean;
    transfer: boolean;
    qrCodeUrl: string;
    instructions: string;
  };
  notifications: {
    lowStockAlert: boolean;
    defaultReorderThreshold: number;
  };
}

interface SettingsContextType {
  settings: SettingsData;
  updateSettings: (section: keyof SettingsData, field: string, value: any) => void;
  saveSettings: () => Promise<void>;
  hasChanges: boolean;
}

const initialSettings: SettingsData = {
  general: {
    storeName: 'MelaTea',
    storeAddress: 'Jl. Raya No. 123, Jakarta',
    logoUrl: '',
    timezone: 'Asia/Jakarta',
    language: 'English'
  },
  printer: {
    enabled: true,
    type: 'usb',
    autoPrint: true
  },
  paymentMethods: {
    cash: true,
    card: true,
    qris: true,
    transfer: false,
    qrCodeUrl: '',
    instructions: 'Please scan the QR code to complete payment'
  },
  notifications: {
    lowStockAlert: true,
    defaultReorderThreshold: 10
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setHasChanges(false);
        resolve();
      }, 1500);
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, hasChanges }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}