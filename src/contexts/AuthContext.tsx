import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 자동 로그인 체크
  useEffect(() => {
    const checkAuth = async () => {
      const savedAuth = localStorage.getItem('pp-tee-auth');
      
      if (savedAuth === 'true') {
        // BACKEND CALL: 세션 유효성 검증
        // const isValid = await invoke("cmd_check_session")
        // if (isValid) setIsAuthenticated(true)
        
        // 임시로 localStorage 값 신뢰
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('pp-tee-auth', 'true');
  };

  const logout = () => {
    // BACKEND CALL: cmd_logout (세션 종료)
    // await invoke("cmd_logout")
    // 응답 예시: "OK"
    // 상태 전환: Any -> Idle
    setIsAuthenticated(false);
    localStorage.removeItem('pp-tee-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}