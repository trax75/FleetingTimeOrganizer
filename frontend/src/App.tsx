import { useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { TimerProvider, useTimers } from './context/TimerContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';

function AppContent() {
  const { settings, updateSettings, isDarkMode, toggleDarkMode } = useSettings();
  const { resetToDefaults } = useTimers();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <Dashboard />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        onResetTimers={resetToDefaults}
      />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          UltimateTimer — All data stored locally.{' '}
          <span className="text-gray-400 dark:text-gray-500">
            No accounts, no tracking.
          </span>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <TimerProvider>
        <AppContent />
      </TimerProvider>
    </SettingsProvider>
  );
}
