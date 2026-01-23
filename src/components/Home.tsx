import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Activity, 
  Database, 
  Lock, 
  Settings, 
  Shield, 
  CheckCircle,
  XCircle,
  Play,
  ArrowRight,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const navigate = useNavigate();
  const { teeStatus } = useAuth();
  const isReady = teeStatus === 'ready';

  // localStorage에서 통계 가져오기
  const savedMessages = localStorage.getItem('pp-tee-messages');
  let totalInferences = 0;
  if (savedMessages) {
    try {
      const parsed = JSON.parse(savedMessages);
      Object.values(parsed).forEach((msgs: any) => {
        totalInferences += msgs.filter((m: any) => m.role === 'user').length;
      });
    } catch {}
  }

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">홈</h2>
        <p className="text-gray-400 mt-1">
          PP-TEE 플랫폼에 오신 것을 환영합니다
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Inferences */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">총 추론 횟수</p>
              <p className="text-3xl font-bold">{totalInferences.toLocaleString()}</p>
              {totalInferences > 0 && (
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% 이번 주
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Active Models */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">활성 모델</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs text-gray-400 mt-2">사용 가능</p>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        {/* TEE Status */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">TEE 환경</p>
              <p className="text-3xl font-bold">{isReady ? '6' : '0'}</p>
              <p className="text-xs text-gray-400 mt-2">
                {isReady ? '구축 완료' : '구축 필요'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isReady ? 'bg-green-600/20' : 'bg-gray-600/20'
            }`}>
              <Lock className={`w-6 h-6 ${isReady ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
          </div>
        </Card>

        {/* Security Level */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">보안 점수</p>
              <p className="text-3xl font-bold">{isReady ? '98%' : '-'}</p>
              <p className="text-xs text-green-400 mt-2">우수</p>
            </div>
            <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* TEE Setup Alert */}
      {!isReady && (
        <Card className="p-6 bg-yellow-600/10 border-yellow-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-400 mb-1">TEE 환경 구축이 필요합니다</h3>
              <p className="text-sm text-gray-300 mb-4">
                안전한 LLM 모델 사용을 위해 Device와 Cloud의 TEE 환경을 구축해주세요.
              </p>
              <Button
                onClick={() => navigate('/setup')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Play className="w-4 h-4 mr-2" />
                환경 구축 시작하기
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">빠른 실행</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Environment Setup */}
          <Card
            className={`p-6 border-gray-800 transition-all cursor-pointer group ${
              isReady 
                ? 'bg-green-600/10 border-green-500/20 hover:bg-green-600/20' 
                : 'bg-[#151b2e] hover:bg-gray-800/50'
            }`}
            onClick={() => navigate('/setup')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                isReady ? 'bg-green-600/20' : 'bg-yellow-600/20'
              }`}>
                <Shield className={`w-7 h-7 ${isReady ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
              {isReady ? (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  완료
                </Badge>
              ) : (
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  필요
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-lg mb-2">환경 구축</h4>
            <p className="text-sm text-gray-400 mb-4">
              {isReady 
                ? 'TEE 환경이 구축되어 있습니다. 설정을 확인하거나 변경할 수 있습니다.'
                : 'Device와 Cloud의 TEE 환경을 설정하고 Multi-TEE 보안을 활성화합니다.'}
            </p>
            <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300">
              {isReady ? '설정 확인' : '구축 시작'}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Model Management */}
          <Card
            className={`p-6 border-gray-800 transition-all group ${
              isReady 
                ? 'bg-[#151b2e] hover:bg-gray-800/50 cursor-pointer' 
                : 'bg-gray-800/30 opacity-60 cursor-not-allowed'
            }`}
            onClick={() => isReady && navigate('/models')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                isReady ? 'bg-purple-600/20' : 'bg-gray-600/20'
              }`}>
                <Database className={`w-7 h-7 ${isReady ? 'text-purple-400' : 'text-gray-500'}`} />
              </div>
              {!isReady && (
                <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30">
                  <XCircle className="w-3 h-3 mr-1" />
                  잠김
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-lg mb-2">모델 관리</h4>
            <p className="text-sm text-gray-400 mb-4">
              LLM 모델을 관리하고 새로운 모델을 추가하거나 설정을 변경합니다.
            </p>
            <div className={`flex items-center text-sm ${
              isReady ? 'text-blue-400 group-hover:text-blue-300' : 'text-gray-500'
            }`}>
              모델 관리
              <ArrowRight className={`w-4 h-4 ml-1 ${isReady ? 'group-hover:translate-x-1' : ''} transition-transform`} />
            </div>
            {!isReady && (
              <p className="text-xs text-yellow-400 mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                TEE 환경 구축 후 사용 가능
              </p>
            )}
          </Card>

          {/* Security Status */}
          <Card
            className="p-6 bg-[#151b2e] border-gray-800 hover:bg-gray-800/50 transition-all cursor-pointer group"
            onClick={() => navigate('/security')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
              {isReady && (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  활성
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-lg mb-2">보안 상태</h4>
            <p className="text-sm text-gray-400 mb-4">
              TEE 환경의 보안 상태를 실시간으로 모니터링하고 이벤트 로그를 확인합니다.
            </p>
            <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300">
              상태 확인
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Settings */}
          <Card
            className="p-6 bg-[#151b2e] border-gray-800 hover:bg-gray-800/50 transition-all cursor-pointer group"
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gray-600/20 rounded-lg flex items-center justify-center">
                <Settings className="w-7 h-7 text-gray-400" />
              </div>
            </div>
            <h4 className="font-semibold text-lg mb-2">설정</h4>
            <p className="text-sm text-gray-400 mb-4">
              플랫폼 설정을 관리하고 사용자 프로필을 업데이트합니다.
            </p>
            <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300">
              설정 열기
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </div>

      {/* Multi-TEE Info */}
      {isReady && (
        <Card className="p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-purple-300">Multi-TEE 보안이 활성화되었습니다</h3>
              <p className="text-sm text-gray-300 mb-3">
                Device와 Cloud의 TEE 환경이 완벽하게 구축되어 있습니다. 이제 모든 LLM 추론은 종단간 암호화되어 안전하게 처리됩니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Device TEE 암호화</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Cloud TEE 격리 처리</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>종단간 보안 보장</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
