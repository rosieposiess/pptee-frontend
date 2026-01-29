import { Outlet, NavLink, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Home, Box, Shield, Settings, LogOut, Bell, HelpCircle, Brain, Cog, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Root() {
  const { logout, teeStatus } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100 relative">
      {/* Sidebar */}
      <aside className={`bg-[#151b2e] border-r border-gray-800 flex flex-col transition-all duration-300 relative ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0 relative">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-lg text-white whitespace-nowrap">PP-TEE</h1>
                <p className="text-xs text-gray-400 whitespace-nowrap">Privacy Preserving TEE</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              {/* 접혔을 때는 로고 아이콘 숨김 */}
            </div>
          )}
          
          {/* Toggle Button */}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            size="icon"
            className={`h-8 w-8 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500 hover:bg-blue-600/20 absolute ${
              sidebarOpen ? 'right-4 top-6' : 'left-1/2 -translate-x-1/2 top-6'
            }`}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.requireTee && teeStatus !== 'ready';
            
            if (isDisabled) {
              return (
                <div 
                  key={item.to}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredItem(JSON.stringify({ 
                      label: `${item.label} (TEE 환경 구축 필요)`, 
                      top: rect.top + rect.height / 2, 
                      left: rect.right, 
                      type: 'warning' 
                    }));
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center rounded-lg text-gray-600 cursor-not-allowed opacity-50 ${
                    sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-3 py-3'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </div>
              );
            }
            
            return (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {({ isActive }) => (
                  <div
                    onMouseEnter={(e) => {
                      if (!sidebarOpen) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredItem(JSON.stringify({ 
                          label: item.label, 
                          top: rect.top + rect.height / 2, 
                          left: rect.right, 
                          type: 'normal' 
                        }));
                      }
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center rounded-lg transition-colors ${
                      sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-3 py-3'
                    } ${
                      isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800 space-y-2 flex-shrink-0">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-200">사용자</p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">user@example.com</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="whitespace-nowrap">로그아웃</span>
              </Button>
            </>
          ) : (
            <div className="relative group">
              <div className="flex justify-center py-3 rounded-lg bg-gray-800/50">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute left-full ml-2 bottom-0 scale-0 group-hover:scale-100 transition-transform origin-left z-50 pointer-events-none">
                <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 whitespace-nowrap shadow-lg">
                  사용자
                </div>
              </div>
            </div>
          )}
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

      {/* Floating Tooltip - sidebar 밖에 렌더링 */}
      {hoveredItem && !sidebarOpen && (() => {
        const data = JSON.parse(hoveredItem);
        return (
          <div 
            className="fixed z-[100] pointer-events-none"
            style={{
              top: `${data.top}px`,
              left: `${data.left + 8}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className={`rounded-lg px-3 py-2 text-sm whitespace-nowrap shadow-lg border ${
              data.type === 'warning' 
                ? 'bg-gray-900 border-yellow-500/30 text-yellow-400'
                : 'bg-gray-900 border-gray-700 text-gray-300'
            }`}>
              {data.label}
            </div>
          </div>
        );
      })()}
    </div>
  );
}