import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useFood } from './hooks/useFood';
import FoodEntry from './components/FoodEntry';
import Timeline from './components/Timeline';
import CalendarView from './components/CalendarView';
import Stats from './components/Stats';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import { Home, Clock, Calendar, Settings as SettingsIcon, LogOut, Moon, Sun, User, Globe } from 'lucide-react';
import { Toaster } from 'sonner';

type Tab = 'home' | 'timeline' | 'calendar' | 'settings';

function MainApp() {
  const { user, logout } = useAuth();
  const { entries, addEntry, deleteEntry, todayCount, streak, groupedEntries, sortedDates, loading } = useFood();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('heynom-theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('heynom-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (loading) return <LoadingSpinner text="Loading your diary..." />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🍽️</span>
          <span className="header-title">HeyNom</span>
        </div>
      </header>

      <main className="app-container">
        {activeTab === 'home' && (
          <div className="home-page">
            <Stats todayCount={todayCount} streak={streak} />
            <FoodEntry onAdd={addEntry} />
            <Timeline groupedEntries={groupedEntries} sortedDates={sortedDates} onDelete={deleteEntry} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-page">
            <h2 className="page-title">Timeline</h2>
            <Timeline groupedEntries={groupedEntries} sortedDates={sortedDates} onDelete={deleteEntry} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-page">
            <h2 className="page-title">Calendar</h2>
            <CalendarView entries={entries} onDelete={deleteEntry} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-page">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Settings</h2>

            <div className="settings-group">
              <div className="settings-group-title">Preferences</div>
              <div className="settings-row" onClick={() => setIsDark(!isDark)}>
                <div className="settings-row-left">
                  <div className="settings-icon-box green">
                    {isDark ? <Moon size={16} /> : <Sun size={16} />}
                  </div>
                  <div>
                    <div className="settings-row-label">Dark Mode</div>
                    <div className="settings-row-desc">Easier on eyes at night</div>
                  </div>
                </div>
                <div className={`toggle-switch ${isDark ? 'active' : ''}`} />
              </div>
              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-icon-box orange">
                    <Globe size={16} />
                  </div>
                  <div>
                    <div className="settings-row-label">Language</div>
                    <div className="settings-row-desc">English</div>
                  </div>
                </div>
                <span className="settings-badge">EN</span>
              </div>
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Account</div>
              {user && (
                <div className="settings-row">
                  <div className="settings-row-left">
                    <div className="settings-icon-box green">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="settings-row-label">{user.email}</div>
                      <div className="settings-row-desc">Signed in</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="settings-row settings-row-danger" onClick={logout}>
                <div className="settings-row-left">
                  <div className="settings-icon-box danger">
                    <LogOut size={16} />
                  </div>
                  <div>
                    <div className="settings-row-label" style={{ color: 'var(--danger)' }}>Sign Out</div>
                    <div className="settings-row-desc">Log out of your account</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        {([
          { tab: 'home' as Tab, icon: Home, label: 'Home' },
          { tab: 'timeline' as Tab, icon: Clock, label: 'Timeline' },
          { tab: 'calendar' as Tab, icon: Calendar, label: 'Calendar' },
          { tab: 'settings' as Tab, icon: SettingsIcon, label: 'Settings' },
        ]).map(({ tab, icon: Icon, label }) => (
          <button
            key={tab}
            className={`bottom-nav__item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}

function AppGate() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner text="Loading..." />;
  if (!user) return <Login />;
  return <MainApp />;
}
