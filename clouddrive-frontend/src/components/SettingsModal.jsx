import { useState, useEffect } from 'react';

function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      desktop: true
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: false
    },
    storage: {
      autoCleanup: true,
      cleanupDays: 30
    }
  });

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('clouddrive_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('clouddrive_settings', JSON.stringify(settings));
    onClose();
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleThemeChange = (value) => {
    setSettings(prev => ({ ...prev, theme: value }));
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleLanguageChange = (value) => {
    setSettings(prev => ({ ...prev, language: value }));
    // TODO: Implement language switching
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-outline-variant rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h2 className="font-h2 text-h2 text-on-surface">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant">
          {['general', 'notifications', 'privacy', 'storage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-lg py-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-lg overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'general' && (
            <div className="space-y-lg">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-sm">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">System</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-sm">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-lg">
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Notification Preferences</h3>
              
              <div className="space-y-md">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Email notifications</span>
                </label>

                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Push notifications</span>
                </label>

                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.desktop}
                    onChange={(e) => handleSettingChange('notifications', 'desktop', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Desktop notifications</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-lg">
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Privacy Settings</h3>
              
              <div className="space-y-md">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showOnlineStatus}
                    onChange={(e) => handleSettingChange('privacy', 'showOnlineStatus', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Show online status</span>
                </label>

                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showLastSeen}
                    onChange={(e) => handleSettingChange('privacy', 'showLastSeen', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Show last seen time</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-lg">
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Storage Management</h3>
              
              <div className="space-y-md">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.storage.autoCleanup}
                    onChange={(e) => handleSettingChange('storage', 'autoCleanup', e.target.checked)}
                    className="w-4 h-4 text-primary border border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-body-md text-on-surface">Auto-cleanup trash</span>
                </label>

                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-sm">
                    Delete files from trash after (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.storage.cleanupDays}
                    onChange={(e) => handleSettingChange('storage', 'cleanupDays', parseInt(e.target.value))}
                    disabled={!settings.storage.autoCleanup}
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-sm px-lg py-md border-t border-outline-variant bg-surface-container-low">
          <button
            onClick={onClose}
            className="px-md py-sm bg-surface-container text-on-surface-container rounded-lg font-semibold hover:bg-surface-container-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
