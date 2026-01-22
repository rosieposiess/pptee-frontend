import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { CheckCircle, XCircle, Lock, Cpu, AlertTriangle, Loader2, ShieldX, Server } from 'lucide-react';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import imgLoading from "figma:asset/e0ae4361470bbad559aeee28d32786070ca3dc39.png";

interface Model {
  id: string;
  name: string;
  provider: string;
  status: 'ready' | 'not-configured' | 'configuring';
  teeConfigured: boolean;
  usage: number;
  description: string;
}

type TEECheckStatus = 'idle' | 'checking' | 'supported' | 'not-supported' | 'setting-up';

const mockModels: Model[] = [
  {
    id: '1',
    name: 'GPT-4',
    provider: 'OpenAI',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: '고급 언어 모델, 복잡한 추론 및 창의적 작업에 최적화',
  },
  {
    id: '2',
    name: 'Claude-3',
    provider: 'Anthropic',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: '안전성과 정확도가 높은 모델, 장문 컨텍스트 처리 가능',
  },
  {
    id: '3',
    name: 'Llama-3',
    provider: 'Meta',
    status: 'not-configured',
    teeConfigured: false,
    usage: 0,
    description: '오픈소스 모델, 다양한 작업에 활용 가능',
  },
];

export function Models() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [configuringModel, setConfiguringModel] = useState<string | null>(null);
  const [teeCheckStatus, setTeeCheckStatus] = useState<TEECheckStatus>('idle');
  const [showTeeDialog, setShowTeeDialog] = useState(false);

  const handleConfigureTEE = async (modelId: string) => {
    setConfiguringModel(modelId);
    setShowTeeDialog(true);
    setTeeCheckStatus('checking');

    // BACKEND CALL 1: cmd_login (최초 1회, 세션 시작)
    // await invoke("cmd_login", { payload: "demo" })
    
    // BACKEND CALL 2: cmd_check_device_capability (기기 능력 확인)
    // const capability = await invoke("cmd_check_device_capability")
    // 응답 예시: { sgx: true, sev: false, tdx: true, notes: "..." }
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // BACKEND CALL 3: cmd_run_dummy_tee_test (TEE 테스트 실행)
    // const testResult = await invoke("cmd_run_dummy_tee_test", { tee_type: "sev" })
    // 응답 예시: { tee_type: "sev", exit_code: 0, stdout: "...", stderr: "", timed_out: false }
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // exit_code가 0이 아니면 미지원으로 처리
    const isSupported = Math.random() > 0.2; // 실제로는 testResult.exit_code === 0 으로 판단

    if (!isSupported) {
      setTeeCheckStatus('not-supported');
      setModels((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, status: 'not-configured' as const } : m))
      );
      return;
    }

    // Step 2: TEE 지원 확인 완료 (UI 전환)
    setTeeCheckStatus('supported');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 3: 환경 설정 중
    setTeeCheckStatus('setting-up');
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, status: 'configuring' as const } : m))
    );

    // BACKEND CALL 4: cmd_prepare_environment (보안 환경 준비)
    // await invoke("cmd_prepare_environment")
    // 응답 예시: "OK"
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 4: 완료 (EnvReady 상태)
    setModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? { ...m, status: 'ready' as const, teeConfigured: true }
          : m
      )
    );
    setConfiguringModel(null);
    setShowTeeDialog(false);
    setTeeCheckStatus('idle');

    toast.success('TEE 환경 구축이 완료되었습니다!');
  };

  const handleCloseDialog = () => {
    if (teeCheckStatus === 'not-supported') {
      setShowTeeDialog(false);
      setTeeCheckStatus('idle');
      setConfiguringModel(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* TEE Check Dialog */}
      <Dialog open={showTeeDialog} onOpenChange={(open) => {
        if (!open && teeCheckStatus === 'not-supported') {
          handleCloseDialog();
        }
      }}>
        <DialogContent className="bg-gradient-to-br from-[#1a1f35] to-[#0f1419] border-gray-700 max-w-md p-0 overflow-hidden">
          {teeCheckStatus === 'checking' && (
            <div className="p-10 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
                  <Lock className="w-10 h-10 text-blue-400 absolute" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3 text-center">
                TEE 환경 지원 확인 중
              </h3>
              <p className="text-sm text-gray-400 text-center mb-2">
                디바이스의 보안 환경을 검사하고 있습니다
              </p>
              <p className="text-xs text-blue-400 text-center">
                최초 1회만 진행됩니다
              </p>
              <div className="mt-6 w-full max-w-xs">
                <Progress value={undefined} className="h-1" />
              </div>
            </div>
          )}

          {teeCheckStatus === 'supported' && (
            <div className="p-10 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-16 h-16 text-green-400" strokeWidth={2} />
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-500/10 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3 text-center">
                TEE 환경 지원 확인 완료!
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                디바이스가 안전한 실행 환경을 지원합니다
                <br />
                이제 모델 환경을 구축하겠습니다
              </p>
              <div className="flex gap-2 text-xs text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>AMD SEV 지원</span>
              </div>
            </div>
          )}

          {teeCheckStatus === 'not-supported' && (
            <div className="p-10 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 flex items-center justify-center">
                  <ShieldX className="w-16 h-16 text-red-400" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3 text-center">
                TEE 환경 미지원
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                현재 디바이스는 신뢰 실행 환경을 지원하지 않습니다
                <br />
                보안 추론을 위해서는 TEE 지원 기기가 필요합니다
              </p>
              <div className="space-y-2 text-xs text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>AMD SEV 미지원</span>
                </div>
              </div>
              <Button
                onClick={handleCloseDialog}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                확인
              </Button>
            </div>
          )}

          {teeCheckStatus === 'setting-up' && (
            <div className="p-10 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" />
                  <Server className="w-10 h-10 text-purple-400 absolute" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3 text-center">
                환경 구축 중
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                보안 환경을 설정하고 있습니다
              </p>
              <div className="w-full max-w-xs space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-gray-400">1.</span>
                  <span>클라우드 환경 구축</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-gray-400">2.</span>
                  <span>사용자 디바이스 환경 구축</span>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <Progress value={undefined} className="h-1" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <Link to={`/inference/${model.id}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  추론 시작
                </Button>
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}