import {useState, useEffect, useCallback} from 'react';
import {AppSettings, DEFAULT_APP_SETTINGS} from '../../modules/settings/settingsTypes';

const API_BASE_URL = 'http://localhost:5000/api';

// In-memory global store to share settings across screens instantly
let globalSettings: AppSettings = {...DEFAULT_APP_SETTINGS};
const listeners = new Set<(settings: AppSettings) => void>();

export const notifyListeners = (newSettings: AppSettings) => {
  globalSettings = newSettings;
  listeners.forEach(fn => fn(globalSettings));
};

export const fetchSettingsFromApi = async (): Promise<AppSettings> => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (res.ok) {
      const data = await res.json();
      const merged = {...DEFAULT_APP_SETTINGS, ...data};
      notifyListeners(merged);
      return merged;
    }
  } catch (_e) {}
  return globalSettings;
};

export const saveSettingsToApi = async (partial: Partial<AppSettings>): Promise<AppSettings> => {
  const merged = {...globalSettings, ...partial};
  notifyListeners(merged);
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(merged),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.settings) {
        notifyListeners(data.settings);
        return data.settings;
      }
    }
  } catch (_e) {}
  return merged;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(globalSettings);

  useEffect(() => {
    listeners.add(setSettings);
    // Fetch initial on mount
    fetchSettingsFromApi().then(s => setSettings(s));

    return () => {
      listeners.delete(setSettings);
    };
  }, []);

  const update = useCallback(async (newVals: Partial<AppSettings>) => {
    return await saveSettingsToApi(newVals);
  }, []);

  return {settings, updateSettings: update, reloadSettings: fetchSettingsFromApi};
};
