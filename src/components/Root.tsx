import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Box, Cpu, Shield, History, Bell, HelpCircle, User } from 'lucide-react';
import { Button } from './ui/button';

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/models', label: '모델 관리', icon: Box },
    { path: '/inference', label: '추론 실행', icon: Cpu },
    { path: '/security', label: '보안 상태', icon: Shield },
    { path: '/history', label: '사용 이력', icon: History },
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
              <h1 className="font-bold text-lg text-white">SecureLLM</h1>
              <p className="text-xs text-gray-400">Trusted Execution</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-gray-200">사용자</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#151b2e] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-100">
              {navItems.find((item) => item.path === location.pathname)?.label || '대시보드'}
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