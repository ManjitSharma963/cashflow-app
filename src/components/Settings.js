import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    defaultCategory: 'Regular',
    autoBackup: true,
    notifications: true,
    theme: 'light'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({});

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTempSettings(parsed);
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSettings(tempSettings);
    localStorage.setItem('appSettings', JSON.stringify(tempSettings));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      defaultCategory: 'Regular',
      autoBackup: true,
      notifications: true,
      theme: 'light'
    };
    setSettings(defaultSettings);
    setTempSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  const exportData = () => {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '{}');
    
    const data = {
      customers,
      transactions,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-ledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.customers && data.transactions) {
            if (window.confirm('This will replace all existing data. Are you sure?')) {
              localStorage.setItem('customers', JSON.stringify(data.customers));
              localStorage.setItem('transactions', JSON.stringify(data.transactions));
              alert('Data imported successfully! Please refresh the page.');
            }
          } else {
            alert('Invalid backup file format.');
          }
        } catch (error) {
          alert('Error reading backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your app preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-header">
            <h2>General Settings</h2>
            <div className="section-actions">
              {!isEditing ? (
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Settings
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="settings-grid">
            <div className="setting-item">
              <label>Currency</label>
              <select
                value={isEditing ? tempSettings.currency : settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                disabled={!isEditing}
                className="setting-input"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Date Format</label>
              <select
                value={isEditing ? tempSettings.dateFormat : settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                disabled={!isEditing}
                className="setting-input"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Default Category</label>
              <select
                value={isEditing ? tempSettings.defaultCategory : settings.defaultCategory}
                onChange={(e) => handleSettingChange('defaultCategory', e.target.value)}
                disabled={!isEditing}
                className="setting-input"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            <div className="setting-item">
              <label>Theme</label>
              <select
                value={isEditing ? tempSettings.theme : settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                disabled={!isEditing}
                className="setting-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          <div className="settings-grid">
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isEditing ? tempSettings.autoBackup : settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  disabled={!isEditing}
                />
                Auto Backup
              </label>
              <span className="setting-description">Automatically backup data weekly</span>
            </div>

            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isEditing ? tempSettings.notifications : settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                />
                Notifications
              </label>
              <span className="setting-description">Show payment reminders and alerts</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>Data Management</h2>
          </div>
          
          <div className="data-actions">
            <div className="action-group">
              <h3>Backup & Restore</h3>
              <p>Export your data for safekeeping or import from a previous backup.</p>
              <div className="action-buttons">
                <button className="btn-secondary" onClick={exportData}>
                  📤 Export Data
                </button>
                <label className="btn-secondary import-btn">
                  📥 Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="action-group">
              <h3>Reset & Clear</h3>
              <p>Reset settings to default or clear all data (use with caution).</p>
              <div className="action-buttons">
                <button className="btn-secondary" onClick={handleReset}>
                  🔄 Reset Settings
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm('This will permanently delete ALL data. Are you absolutely sure?')) {
                      localStorage.clear();
                      alert('All data has been cleared. Please refresh the page.');
                    }
                  }}
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>App Information</h2>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">App Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated</span>
              <span className="info-value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data Storage</span>
              <span className="info-value">Local Storage</span>
            </div>
            <div className="info-item">
              <span className="info-label">Framework</span>
              <span className="info-value">React 19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 