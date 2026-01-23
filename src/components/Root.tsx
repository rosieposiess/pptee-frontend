import { Outlet, NavLink, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Home, Box, Shield, Settings, LogOut, Bell, HelpCircle, Brain, Cog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Root() {
  const { logout, teeStatus } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { to: '/', icon: Home, label: '홈', end: true },
    { to: '/setup', icon: Cog, label: '환경 구축' },
    { to: '/models', icon: Box, label: '모델 관리', requireTee: true },
    { to: '/security', icon: Shield, label: '보안 상태' },
    { to: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151b2e] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">PP-TEE</h1>
              <p className="text-xs text-gray-400">Privacy Preserving TEE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.requireTee && teeStatus !== 'ready';
            
            if (isDisabled) {
              return (
                <div 
                  key={item.to}
                  className="relative group"
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 cursor-not-allowed opacity-50">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50">
                    <div className="bg-gray-900 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-yellow-400 whitespace-nowrap shadow-lg">
                      TEE 환경 구축이 필요합니다
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-gray-200">사용자</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#151b2e] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-100">
              {navItems.find((item) => item.to === window.location.pathname)?.label || '대시보드'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}