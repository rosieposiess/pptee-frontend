import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Lock, Cpu, AlertTriangle } from 'lucide-react';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface Model {
  id: string;
  name: string;
  provider: string;
  status: 'ready' | 'not-configured' | 'configuring';
  teeConfigured: boolean;
  usage: number;
  description: string;
}

const mockModels: Model[] = [
  {
    id: '1',
    name: 'GPT-4',
    provider: 'OpenAI',
    status: 'ready',
    teeConfigured: true,
    usage: 523,
    description: '고급 언어 모델, 복잡한 추론 및 창의적 작업에 최적화',
  },
  {
    id: '2',
    name: 'Claude-3',
    provider: 'Anthropic',
    status: 'ready',
    teeConfigured: true,
    usage: 387,
    description: '안전성과 정확도가 높은 모델, 장문 컨텍스트 처리 가능',
  },
  {
    id: '3',
    name: 'Llama-3',
    provider: 'Meta',
    status: 'ready',
    teeConfigured: true,
    usage: 195,
    description: '오픈소스 모델, 다양한 작업에 활용 가능',
  },
  {
    id: '4',
    name: 'Gemini Pro',
    provider: 'Google',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: 'Google의 멀티모달 AI 모델',
  },
  {
    id: '5',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: '효율적인 MoE 아키텍처 모델',
  },
  {
    id: '6',
    name: 'PaLM 2',
    provider: 'Google',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: '향상된 추론 및 다국어 지원',
  },
];

export function Models() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [configuringModel, setConfiguringModel] = useState<string | null>(null);

  const handleConfigureTEE = async (modelId: string) => {
    setConfiguringModel(modelId);
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, status: 'configuring' as const } : m))
    );

    toast.info('모델 추론을 위한 기본 환경 구축 중입니다...');

    // Simulate TEE configuration process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? { ...m, status: 'ready' as const, teeConfigured: true }
          : m
      )
    );
    setConfiguringModel(null);

    toast.success('TEE 환경 구축이 완료되었습니다!');
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">모델 관리</h2>
          <p className="text-gray-400 mt-1">사용 가능한 LLM 모델을 관리하고 TEE 환경을 구축하세요</p>
        </div>
      </div>

      {/* TEE Status Summary */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <Lock className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="font-semibold">TEE 환경 상태</h3>
            <p className="text-sm text-gray-400">
              Trusted Execution Environment가 구축된 모델만 추론을 실행할 수 있습니다
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress
              value={(models.filter((m) => m.teeConfigured).length / models.length) * 100}
              className="h-2"
            />
          </div>
          <span className="text-sm text-gray-400">
            {models.filter((m) => m.teeConfigured).length} / {models.length} 구축 완료
          </span>
        </div>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
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
              {model.status === 'ready' ? (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  사용 가능
                </Badge>
              ) : model.status === 'configuring' ? (
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  구축 중
                </Badge>
              ) : (
                <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30">
                  <XCircle className="w-3 h-3 mr-1" />
                  미구축
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-4">{model.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">TEE 환경</span>
                {model.teeConfigured ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    구축 완료
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <XCircle className="w-4 h-4" />
                    미구축
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">사용 횟수</span>
                <span className="text-gray-300">{model.usage.toLocaleString()}회</span>
              </div>
            </div>

            {!model.teeConfigured && (
              <Button
                onClick={() => handleConfigureTEE(model.id)}
                disabled={model.status === 'configuring'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {model.status === 'configuring' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    환경 구축 중...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    TEE 환경 구축
                  </>
                )}
              </Button>
            )}

            {model.teeConfigured && (
              <Button
                onClick={() => toast.success('추론 페이지로 이동합니다')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                추론 시작
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}