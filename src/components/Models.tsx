import { Link } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Cpu, Shield, AlertTriangle, Settings, Server } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Model {
  id: string;
  name: string;
  provider: string;
  usage: number;
  description: string;
}

const mockModels: Model[] = [
  {
    id: '1',
    name: 'GPT-4',
    provider: 'OpenAI',
    usage: 0,
    description: '고급 언어 모델, 복잡한 추론 및 창의적 작업에 최적화',
  },
  {
    id: '2',
    name: 'Claude-3',
    provider: 'Anthropic',
    usage: 0,
    description: '안전성과 정확도가 높은 모델, 장문 컨텍스트 처리 가능',
  },
  {
    id: '3',
    name: 'Llama-3',
    provider: 'Meta',
    usage: 0,
    description: '오픈소스 모델, 다양한 작업에 활용 가능',
  },
];

export function Models() {
  const { teeInitialized, teeStatus } = useAuth();
  
  // localStorage에서 서버 정보 가져오기
  const serverIp = localStorage.getItem('pp-tee-server-ip') || 'N/A';
  const serverPort = localStorage.getItem('pp-tee-server-port') || 'N/A';

  // TEE가 준비되지 않았을 때 안내 화면
  if (!teeInitialized) {
    return (
      <div className="space-y-6 text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">모델 관리</h2>
            <p className="text-gray-400 mt-1">사용 가능한 LLM 모델을 관리하세요</p>
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="p-8 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-yellow-600/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">
              TEE 환경 구축이 필요합니다
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              모델을 사용하기 전에 Device와 Cloud의 TEE(Trusted Execution Environment) 환경을 먼저 구축해야 합니다.
            </p>
            <Link to="/setup">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 text-lg">
                <Settings className="w-5 h-5 mr-2" />
                환경 구축하러 가기
              </Button>
            </Link>
          </div>
        </Card>

        {/* Locked Models Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
          {mockModels.map((model) => (
            <Card key={model.id} className="p-6 bg-[#151b2e] border-gray-800 relative">
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">TEE 환경 구축 필요</p>
                </div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <p className="text-sm text-gray-400">{model.provider}</p>
                  </div>
                </div>
                <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30">
                  <XCircle className="w-3 h-3 mr-1" />
                  잠김
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-4">{model.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">모델 관리</h2>
          <p className="text-gray-400 mt-1">사용 가능한 LLM 모델을 관리하세요</p>
        </div>
      </div>

      {/* TEE Status Summary */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">TEE 환경 상태</h3>
            <p className="text-sm text-gray-400">
              Trusted Execution Environment가 준비되었습니다
            </p>
          </div>
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            구축 완료
          </Badge>
        </div>
      </Card>

      {/* Server Info */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center gap-4">
          <Server className="w-5 h-5 text-purple-400" />
          <div className="flex-1">
            <p className="text-sm font-medium">연결된 서버</p>
            <p className="text-xs text-gray-400">{serverIp}:{serverPort}</p>
          </div>
        </div>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockModels.map((model) => (
          <Card key={model.id} className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.provider}</p>
                </div>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                사용 가능
              </Badge>
            </div>

            <p className="text-sm text-gray-400 mb-4">{model.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TEE 환경</span>
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  구축 완료
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">사용 횟수</span>
                <span className="text-gray-300">{model.usage.toLocaleString()}회</span>
              </div>
            </div>

            <Link to={`/inference/${model.id}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                추론 시작
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}