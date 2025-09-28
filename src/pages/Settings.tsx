import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const Settings: React.FC = () => {
  const { state, dispatch } = useTaskContext();
  const navigate = useNavigate();
  const [colorSettings, setColorSettings] = useState(state.settings.themeColors);

  const handleToggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const handleColorChange = (colorKey: keyof typeof colorSettings, value: string) => {
    setColorSettings(prev => ({ ...prev, [colorKey]: value }));
  };

  const saveColorSettings = () => {
    dispatch({ type: 'UPDATE_THEME_COLORS', payload: colorSettings });
  };

  const resetToDefault = () => {
    const defaultColors = {
      rosewater: '#e8b4b8',
      dustyRose: '#eed6d3',
      coffeePotLight: '#a49393',
      coffeePotDark: '#67595e'
    };
    setColorSettings(defaultColors);
    dispatch({ type: 'UPDATE_THEME_COLORS', payload: defaultColors });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Boards
        </button>
      </div>

      <div className="settings-content">
        <div className="setting-section">
          <h2>Appearance</h2>
          
          <div className="setting-item">
            <div className="setting-label">
              <h3>Dark Mode</h3>
              <p>Toggle between light and dark theme</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={state.settings.darkMode}
                  onChange={handleToggleDarkMode}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="setting-section">
          <h2>Theme Colors</h2>
          <p>Customize the color scheme of your application</p>
          
          <div className="color-settings">
            <div className="color-setting">
              <label>Rosewater</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={colorSettings.rosewater}
                  onChange={(e) => handleColorChange('rosewater', e.target.value)}
                />
                <span>{colorSettings.rosewater}</span>
              </div>
            </div>

            <div className="color-setting">
              <label>Dusty Rose</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={colorSettings.dustyRose}
                  onChange={(e) => handleColorChange('dustyRose', e.target.value)}
                />
                <span>{colorSettings.dustyRose}</span>
              </div>
            </div>

            <div className="color-setting">
              <label>Coffee Pot Light</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={colorSettings.coffeePotLight}
                  onChange={(e) => handleColorChange('coffeePotLight', e.target.value)}
                />
                <span>{colorSettings.coffeePotLight}</span>
              </div>
            </div>

            <div className="color-setting">
              <label>Coffee Pot Dark</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={colorSettings.coffeePotDark}
                  onChange={(e) => handleColorChange('coffeePotDark', e.target.value)}
                />
                <span>{colorSettings.coffeePotDark}</span>
              </div>
            </div>
          </div>

          <div className="color-actions">
            <button onClick={saveColorSettings} className="btn-primary">
              Save Colors
            </button>
            <button onClick={resetToDefault} className="btn-secondary">
              Reset to Default
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Data Management</h2>
          
          <div className="setting-item">
            <div className="setting-label">
              <h3>Clear All Data</h3>
              <p>Remove all boards, columns, and tasks (this action cannot be undone)</p>
            </div>
            <div className="setting-control">
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="btn-delete"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;