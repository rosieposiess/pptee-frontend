import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Shield, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);

    // BACKEND CALL: cmd_login (세션 시작)
    // await invoke("cmd_login", { payload: "demo" })
    // 응답 예시: "OK"
    // 상태 전환: Idle -> LoggedIn
    
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success('로그인 되었습니다!');
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#151b2e] to-[#0a0e1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">PP-TEE</h1>
          <p className="text-gray-400">Privacy Preserving TEE</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-[#151b2e] border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">로그인</h2>
          <p className="text-gray-400 mb-6">안전한 TEE 환경에 접속하세요</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  로그인 중...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  로그인
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Security Features */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>종단간 암호화 보안</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>TEE 기반 안전한 실행 환경</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>프라이버시 완전 보호</span>
          </div>
        </div>
      </div>
    </div>
  );
}