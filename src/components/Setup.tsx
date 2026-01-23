import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, Lock, Server, CheckCircle, XCircle, Loader2, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

type SetupStatus = 'idle' | 'checking-device' | 'device-ready' | 'device-failed' | 'checking-cloud' | 'cloud-ready' | 'cloud-failed' | 'preparing' | 'completed';

const setupSteps = [
  { id: 1, title: 'Device TEE 확인', description: '로컬 디바이스의 TEE 환경을 검사합니다' },
  { id: 2, title: 'Device TEE 구축', description: '디바이스에 보안 환경을 설정합니다' },
  { id: 3, title: 'Cloud TEE 확인', description: '클라우드 서버의 TEE 환경을 검사합니다' },
  { id: 4, title: 'Cloud TEE 구축', description: '클라우드에 보안 환경을 설정합니다' },
  { id: 5, title: '환경 준비 완료', description: '모든 보안 환경이 준비되었습니다' },
];

export function Setup() {
  const { teeStatus, setTeeReady } = useAuth();
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('idle');
  const [deviceTeeReady, setDeviceTeeReady] = useState(false);
  const [cloudTeeReady, setCloudTeeReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [deviceCapability, setDeviceCapability] = useState<any>(null);
  const [cloudCapability, setCloudCapability] = useState<any>(null);

  const isCompleted = teeStatus === 'ready';

  const handleStartSetup = async () => {
    // Step 1: Device TEE 확인
    setSetupStatus('checking-device');
    setCurrentStep(1);

    // BACKEND CALL 1: cmd_check_device_capability
    // const capability = await invoke("cmd_check_device_capability")
    // 응답 예시: { sgx: true, sev: false, tdx: true, notes: "Intel SGX supported" }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const deviceSupported = Math.random() > 0.1;
    if (!deviceSupported) {
      setSetupStatus('device-failed');
      toast.error('Device TEE 환경이 지원되지 않습니다');
      return;
    }

    setDeviceCapability({ sgx: true, sev: false, tdx: true, notes: 'Intel SGX supported' });

    // BACKEND CALL 2: cmd_run_dummy_tee_test (Device)
    // const testResult = await invoke("cmd_run_dummy_tee_test", { tee_type: "sgx" })
    // 응답 예시: { tee_type: "sgx", exit_code: 0, stdout: "...", stderr: "", timed_out: false }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Device TEE 구축 완료
    setCurrentStep(2);
    setSetupStatus('device-ready');
    setDeviceTeeReady(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Cloud TEE 확인
    setSetupStatus('checking-cloud');
    setCurrentStep(3);

    // BACKEND CALL 3: cmd_check_cloud_capability (새로운 커맨드)
    // const cloudCap = await invoke("cmd_check_cloud_capability")
    // 응답 예시: { sgx: true, sev: true, tdx: false, notes: "AMD SEV supported" }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cloudSupported = Math.random() > 0.1;
    if (!cloudSupported) {
      setSetupStatus('cloud-failed');
      toast.error('Cloud TEE 환경이 지원되지 않습니다');
      return;
    }

    setCloudCapability({ sgx: true, sev: true, tdx: false, notes: 'AMD SEV supported' });

    // BACKEND CALL 4: cmd_run_dummy_tee_test (Cloud)
    // const cloudTestResult = await invoke("cmd_run_dummy_tee_test", { tee_type: "sev" })
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Cloud TEE 구축 완료
    setCurrentStep(4);
    setSetupStatus('cloud-ready');
    setCloudTeeReady(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 5: 최종 환경 준비
    setSetupStatus('preparing');
    setCurrentStep(5);

    // BACKEND CALL 5: cmd_prepare_environment
    // await invoke("cmd_prepare_environment")
    // 응답 예시: "OK"
    // 상태 전환: LoggedIn -> EnvReady
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSetupStatus('completed');
    setTeeReady();
    toast.success('TEE 환경 구축이 완료되었습니다!');
  };

  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">TEE 환경 구축</h2>
        <p className="text-gray-400 mt-1">
          Device와 Cloud의 Trusted Execution Environment를 설정합니다
        </p>
      </div>

      {/* Overall Status */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">전체 상태</h3>
              <p className="text-sm text-gray-400">
                {setupStatus === 'idle' && 'TEE 환경 구축을 시작하세요'}
                {setupStatus === 'checking-device' && 'Device TEE 환경을 확인하는 중...'}
                {setupStatus === 'device-ready' && 'Device TEE 구축 완료, Cloud 확인 진행 중...'}
                {setupStatus === 'device-failed' && 'Device TEE 환경 구축 실패'}
                {setupStatus === 'checking-cloud' && 'Cloud TEE 환경을 확인하는 중...'}
                {setupStatus === 'cloud-ready' && 'Cloud TEE 구축 완료, 최종 준비 중...'}
                {setupStatus === 'cloud-failed' && 'Cloud TEE 환경 구축 실패'}
                {setupStatus === 'preparing' && '보안 환경을 최종 준비하는 중...'}
                {setupStatus === 'completed' && '모든 TEE 환경 구축 완료'}
              </p>
            </div>
          </div>
          <div>
            {isCompleted ? (
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                구축 완료
              </Badge>
            ) : setupStatus === 'device-failed' || setupStatus === 'cloud-failed' ? (
              <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-lg px-4 py-2">
                <XCircle className="w-5 h-5 mr-2" />
                실패
              </Badge>
            ) : setupStatus !== 'idle' ? (
              <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                진행 중
              </Badge>
            ) : (
              <Button
                onClick={handleStartSetup}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                구축 시작
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Setup Flow */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <h3 className="font-semibold mb-6">구축 플로우</h3>
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';

            return (
              <div key={step.id}>
                <div
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600/20 border-2 border-blue-500/50'
                      : isCompleted
                      ? 'bg-green-600/10 border border-green-500/20'
                      : 'bg-gray-800/30 border border-gray-700/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-10 h-10 bg-green-600/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    ) : isActive ? (
                      <div className="w-10 h-10 bg-blue-600/30 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-700/30 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-semibold">{step.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                {index < setupSteps.length - 1 && (
                  <div className="ml-9 my-2">
                    <ArrowRight
                      className={`w-5 h-5 ${
                        isCompleted ? 'text-green-400' : 'text-gray-600'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* TEE Environment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device TEE */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Device TEE</h3>
              <p className="text-xs text-gray-400">로컬 디바이스 보안 환경</p>
            </div>
            {deviceTeeReady && (
              <Badge className="ml-auto bg-green-600/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                활성
              </Badge>
            )}
          </div>

          {deviceCapability ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Intel SGX</span>
                  <Badge className={deviceCapability.sgx ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}>
                    {deviceCapability.sgx ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">AMD SEV</span>
                  <Badge className={deviceCapability.sev ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {deviceCapability.sev ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Intel TDX</span>
                  <Badge className={deviceCapability.tdx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {deviceCapability.tdx ? '지원' : '미지원'}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400">{deviceCapability.notes}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Device TEE 확인이 필요합니다</p>
            </div>
          )}
        </Card>

        {/* Cloud TEE */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Cloud TEE</h3>
              <p className="text-xs text-gray-400">클라우드 서버 보안 환경</p>
            </div>
            {cloudTeeReady && (
              <Badge className="ml-auto bg-green-600/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                활성
              </Badge>
            )}
          </div>

          {cloudCapability ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Intel SGX</span>
                  <Badge className={cloudCapability.sgx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.sgx ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">AMD SEV</span>
                  <Badge className={cloudCapability.sev ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.sev ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Intel TDX</span>
                  <Badge className={cloudCapability.tdx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.tdx ? '지원' : '미지원'}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-lg">
                <p className="text-xs text-purple-400">{cloudCapability.notes}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Server className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Cloud TEE 확인이 필요합니다</p>
            </div>
          )}
        </Card>
      </div>

      {/* Security Notes */}
      {isCompleted && (
        <Card className="p-6 bg-green-600/10 border-green-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
            <div>
              <h3 className="font-semibold text-green-400 mb-2">TEE 환경 구축 완료</h3>
              <p className="text-sm text-gray-300 mb-3">
                Device와 Cloud의 TEE 환경이 모두 준비되었습니다. 이제 안전하게 LLM 모델을 사용할 수 있습니다.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Device에서 데이터 암호화</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Cloud에서 안전한 복호화 및 추론</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>종단간 암호화 보장</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {(setupStatus === 'device-failed' || setupStatus === 'cloud-failed') && (
        <Card className="p-6 bg-red-600/10 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
            <div>
              <h3 className="font-semibold text-red-400 mb-2">TEE 환경 구축 실패</h3>
              <p className="text-sm text-gray-300 mb-3">
                {setupStatus === 'device-failed'
                  ? 'Device TEE 환경이 지원되지 않습니다.'
                  : 'Cloud TEE 환경이 지원되지 않습니다.'}
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>Intel SGX, AMD SEV, 또는 Intel TDX 지원 필요</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>BIOS에서 보안 기능 활성화 확인</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>최신 펌웨어 및 드라이버 업데이트</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
