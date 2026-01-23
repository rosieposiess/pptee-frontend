import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Activity, Database, Lock, CheckCircle, Shield, Server, Loader2, XCircle, AlertTriangle, Play, Search, Settings, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

type SetupStatus = 'config' | 'idle' | 'checking-capability' | 'capability-checked' | 'capability-failed' | 'building-tee' | 'tee-built' | 'build-failed' | 'completed';

export function Home() {
  const { teeStatus, setTeeReady } = useAuth();
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('config');
  const [deviceCapability, setDeviceCapability] = useState<any>(null);
  const [cloudCapability, setCloudCapability] = useState<any>(null);
  
  // Server configuration
  const [serverIp, setServerIp] = useState('192.168.1.100');
  const [serverPort, setServerPort] = useState('8443');
  const [isConfigured, setIsConfigured] = useState(false);

  // Log states
  const [deviceCapLog, setDeviceCapLog] = useState<string[]>([]);
  const [cloudCapLog, setCloudCapLog] = useState<string[]>([]);
  const [deviceBuildLog, setDeviceBuildLog] = useState<string[]>([]);
  const [cloudBuildLog, setCloudBuildLog] = useState<string[]>([]);
  
  // Expand states for logs
  const [expandDeviceCap, setExpandDeviceCap] = useState(false);
  const [expandCloudCap, setExpandCloudCap] = useState(false);
  const [expandDeviceBuild, setExpandDeviceBuild] = useState(false);
  const [expandCloudBuild, setExpandCloudBuild] = useState(false);

  // Step completion states
  const [deviceCapChecked, setDeviceCapChecked] = useState(false);
  const [cloudCapChecked, setCloudCapChecked] = useState(false);
  const [deviceBuilt, setDeviceBuilt] = useState(false);
  const [cloudBuilt, setCloudBuilt] = useState(false);

  const isCompleted = teeStatus === 'ready';
  const capabilityCheckComplete = deviceCapChecked && cloudCapChecked;
  const teeBuiltComplete = deviceBuilt && cloudBuilt;

  // TEE가 이미 완료된 경우 상태 복원
  useEffect(() => {
    if (teeStatus === 'ready') {
      setSetupStatus('completed');
      setIsConfigured(true);
      setDeviceCapChecked(true);
      setCloudCapChecked(true);
      setDeviceBuilt(true);
      setCloudBuilt(true);
      
      const savedDeviceCap = localStorage.getItem('pp-tee-device-cap');
      const savedCloudCap = localStorage.getItem('pp-tee-cloud-cap');
      const savedServerIp = localStorage.getItem('pp-tee-server-ip');
      const savedServerPort = localStorage.getItem('pp-tee-server-port');
      
      if (savedDeviceCap) setDeviceCapability(JSON.parse(savedDeviceCap));
      if (savedCloudCap) setCloudCapability(JSON.parse(savedCloudCap));
      if (savedServerIp) setServerIp(savedServerIp);
      if (savedServerPort) setServerPort(savedServerPort);
    }
  }, [teeStatus]);

  const handleConfigureServer = () => {
    if (!serverIp || !serverPort) {
      toast.error('서버 IP와 포트를 모두 입력해주세요');
      return;
    }
    
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(serverIp)) {
      toast.error('올바른 IP 주소 형식을 입력해주세요');
      return;
    }

    setIsConfigured(true);
    setSetupStatus('idle');
    localStorage.setItem('pp-tee-server-ip', serverIp);
    localStorage.setItem('pp-tee-server-port', serverPort);
    toast.success('서버 설정이 완료되었습니다');
  };

  // Phase 1: TEE 지원 확인
  const handleCheckCapability = async () => {
    setSetupStatus('checking-capability');
    setDeviceCapLog([]);
    setCloudCapLog([]);
    
    // Step 1: Device TEE 지원 확인
    toast.info('Device TEE 지원 여부를 확인하는 중...');
    setDeviceCapLog(prev => [...prev, '[INFO] Device TEE capability check started']);
    setDeviceCapLog(prev => [...prev, '[INFO] Scanning hardware features...']);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeviceCapLog(prev => [...prev, '[INFO] Checking Intel SGX support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeviceCapLog(prev => [...prev, '[SUCCESS] Intel SGX: Supported']);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeviceCapLog(prev => [...prev, '[INFO] Checking AMD SEV support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeviceCapLog(prev => [...prev, '[INFO] AMD SEV: Not Available']);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeviceCapLog(prev => [...prev, '[INFO] Checking Intel TDX support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeviceCapLog(prev => [...prev, '[SUCCESS] Intel TDX: Supported']);

    const deviceSupported = Math.random() > 0.05;
    if (!deviceSupported) {
      setSetupStatus('capability-failed');
      setDeviceCapLog(prev => [...prev, '[ERROR] Device TEE not supported']);
      toast.error('Device TEE 환경이 지원되지 않습니다');
      return;
    }

    const deviceCap = { sgx: true, sev: false, tdx: true, notes: 'Intel SGX supported' };
    setDeviceCapability(deviceCap);
    setDeviceCapChecked(true);
    localStorage.setItem('pp-tee-device-cap', JSON.stringify(deviceCap));
    setDeviceCapLog(prev => [...prev, '[SUCCESS] Device TEE capability check completed']);
    toast.success('Device TEE 지원 확인 완료');

    // Step 2: Cloud TEE 지원 확인
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.info('Cloud TEE 지원 여부를 확인하는 중...');
    setCloudCapLog(prev => [...prev, `[INFO] Connecting to server ${serverIp}:${serverPort}...`]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCloudCapLog(prev => [...prev, '[INFO] Connection established']);
    setCloudCapLog(prev => [...prev, '[INFO] Cloud TEE capability check started']);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[INFO] Checking Intel SGX support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[SUCCESS] Intel SGX: Supported']);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[INFO] Checking AMD SEV support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[SUCCESS] AMD SEV: Supported']);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[INFO] Checking Intel TDX support...']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCloudCapLog(prev => [...prev, '[INFO] Intel TDX: Not Available']);

    const cloudSupported = Math.random() > 0.05;
    if (!cloudSupported) {
      setSetupStatus('capability-failed');
      setCloudCapLog(prev => [...prev, '[ERROR] Cloud TEE not supported']);
      toast.error('Cloud TEE 환경이 지원되지 않습니다');
      return;
    }

    const cloudCap = { sgx: true, sev: true, tdx: false, notes: 'AMD SEV supported' };
    setCloudCapability(cloudCap);
    setCloudCapChecked(true);
    localStorage.setItem('pp-tee-cloud-cap', JSON.stringify(cloudCap));
    setCloudCapLog(prev => [...prev, '[SUCCESS] Cloud TEE capability check completed']);
    
    setSetupStatus('capability-checked');
    toast.success('모든 TEE 지원 확인 완료! 이제 TEE 구축을 시작할 수 있습니다');
  };

  // Phase 2: TEE 구축
  const handleBuildTee = async () => {
    setSetupStatus('building-tee');
    setDeviceBuildLog([]);
    setCloudBuildLog([]);
    
    // Step 3: Device TEE 구축
    toast.info('Device TEE 구축 중...');
    setDeviceBuildLog(prev => [...prev, '[INFO] Device TEE build started']);
    setDeviceBuildLog(prev => [...prev, '[INFO] Initializing secure enclave...']);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeviceBuildLog(prev => [...prev, '[INFO] Loading cryptographic keys...']);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeviceBuildLog(prev => [...prev, '[SUCCESS] Keys loaded successfully']);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeviceBuildLog(prev => [...prev, '[INFO] Setting up attestation service...']);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeviceBuildLog(prev => [...prev, '[SUCCESS] Attestation service ready']);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeviceBuildLog(prev => [...prev, '[INFO] Configuring encryption policies...']);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeviceBuildLog(prev => [...prev, '[SUCCESS] Encryption policies configured']);

    const deviceBuildSuccess = Math.random() > 0.05;
    if (!deviceBuildSuccess) {
      setSetupStatus('build-failed');
      setDeviceBuildLog(prev => [...prev, '[ERROR] Device TEE build failed']);
      toast.error('Device TEE 구축 실패');
      return;
    }

    setDeviceBuilt(true);
    setDeviceBuildLog(prev => [...prev, '[SUCCESS] Device TEE build completed']);
    toast.success('Device TEE 구축 완료');

    // Step 4: Cloud TEE 구축
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.info('Cloud TEE 구축 중...');
    setCloudBuildLog(prev => [...prev, `[INFO] Connecting to server ${serverIp}:${serverPort}...`]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCloudBuildLog(prev => [...prev, '[INFO] Connection established']);
    setCloudBuildLog(prev => [...prev, '[INFO] Cloud TEE build started']);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCloudBuildLog(prev => [...prev, '[INFO] Initializing secure VM...']);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCloudBuildLog(prev => [...prev, '[SUCCESS] Secure VM initialized']);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCloudBuildLog(prev => [...prev, '[INFO] Setting up RAG environment...']);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCloudBuildLog(prev => [...prev, '[SUCCESS] RAG environment ready']);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCloudBuildLog(prev => [...prev, '[INFO] Loading LLM models...']);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCloudBuildLog(prev => [...prev, '[SUCCESS] LLM models loaded']);
    
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCloudBuildLog(prev => [...prev, '[INFO] Establishing secure channel...']);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCloudBuildLog(prev => [...prev, '[SUCCESS] Secure channel established']);

    const cloudBuildSuccess = Math.random() > 0.05;
    if (!cloudBuildSuccess) {
      setSetupStatus('build-failed');
      setCloudBuildLog(prev => [...prev, '[ERROR] Cloud TEE build failed']);
      toast.error('Cloud TEE 구축 실패');
      return;
    }

    setCloudBuilt(true);
    setCloudBuildLog(prev => [...prev, '[SUCCESS] Cloud TEE build completed']);
    toast.success('Cloud TEE 구축 완료');

    // Step 5: 최종 환경 준비
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.info('보안 환경을 최종 준비하는 중...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSetupStatus('completed');
    setTeeReady();
    toast.success('TEE 환경 구축이 완료되었습니다!');
  };

  // 서버 설정 화면
  if (setupStatus === 'config') {
    return (
      <div className="space-y-6 text-gray-100">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">총 추론 횟수</p>
                <p className="text-3xl font-bold text-gray-100">1,247</p>
                <p className="text-xs text-green-400 mt-2">+12% 이번 주</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

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

          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">TEE 환경</p>
                <p className="text-3xl font-bold">6</p>
                <p className="text-xs text-green-400 mt-2">구축 완료</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">보안 점수</p>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-xs text-green-400 mt-2">우수</p>
              </div>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Server Configuration */}
        <Card className="p-8 bg-[#151b2e] border-gray-800 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">서버 설정</h3>
              <p className="text-sm text-gray-400">TEE 환경을 구축할 클라우드 서버를 설정하세요</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                서버 IP 주소
              </label>
              <Input
                type="text"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                placeholder="예: 192.168.1.100"
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                TEE 환경이 구축될 클라우드 서버의 IP 주소를 입력하세요
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                포트 번호
              </label>
              <Input
                type="text"
                value={serverPort}
                onChange={(e) => setServerPort(e.target.value)}
                placeholder="예: 8443"
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                서버 연결에 사용할 포트 번호를 입력하세요
              </p>
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">보안 연결 안내</p>
                  <p className="text-blue-400/80">
                    모든 데이터는 TEE 환경 내에서 암호화되어 전송됩니다. 
                    서버 IP는 신뢰할 수 있는 클라우드 인프라의 주소를 입력해주세요.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleConfigureServer}
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
            >
              <Settings className="w-5 h-5 mr-2" />
              서버 설정 완료
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">총 추론 횟수</p>
              <p className="text-3xl font-bold text-gray-100">1,247</p>
              <p className="text-xs text-green-400 mt-2">+12% 이번 주</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

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

        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">TEE 환경</p>
              <p className="text-3xl font-bold">6</p>
              <p className="text-xs text-green-400 mt-2">구축 완료</p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">보안 점수</p>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-xs text-green-400 mt-2">우수</p>
            </div>
            <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* TEE Environment Setup Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">TEE 환경 구축</h3>
        <p className="text-gray-400 mb-6">
          Device와 Cloud의 Trusted Execution Environment를 설정합니다
        </p>
      </div>

      {/* Server Info */}
      {isConfigured && (
        <Card className="p-4 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium">연결된 서버</p>
                <p className="text-xs text-gray-400">{serverIp}:{serverPort}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSetupStatus('config');
                setIsConfigured(false);
              }}
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
            >
              변경
            </Button>
          </div>
        </Card>
      )}

      {/* Phase 1: TEE 지원 확인 섹션 */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Phase 1: TEE 지원 확인</h3>
              <p className="text-sm text-gray-400">
                Device와 Cloud의 TEE 지원 여부를 검사합니다
              </p>
            </div>
          </div>
          {capabilityCheckComplete ? (
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              완료
            </Badge>
          ) : setupStatus === 'checking-capability' ? (
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              진행 중
            </Badge>
          ) : (
            <Button
              onClick={handleCheckCapability}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={setupStatus === 'checking-capability'}
            >
              <Search className="w-4 h-4 mr-2" />
              지원 확인 시작
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Device TEE Capability Check */}
          <div className={`p-4 rounded-lg border ${deviceCapChecked ? 'bg-green-600/10 border-green-500/20' : 'bg-gray-800/30 border-gray-700/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deviceCapChecked ? 'bg-green-600/30' : 'bg-gray-700/30'}`}>
                  {deviceCapChecked ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <span className="text-gray-500 font-semibold">1</span>
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${deviceCapChecked ? 'text-green-400' : 'text-gray-300'}`}>
                    Device TEE 지원 확인
                  </h4>
                  <p className="text-xs text-gray-500">로컬 디바이스의 TEE 지원 여부</p>
                </div>
              </div>
              {deviceCapLog.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandDeviceCap(!expandDeviceCap)}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  자세히 보기
                  {expandDeviceCap ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </Button>
              )}
            </div>
            
            {expandDeviceCap && deviceCapLog.length > 0 && (
              <div className="mt-3 p-3 bg-black/30 rounded border border-gray-700 font-mono text-xs max-h-64 overflow-y-auto">
                {deviceCapLog.map((log, idx) => (
                  <div key={idx} className={`py-0.5 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-gray-400'}`}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {deviceCapability && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">Intel SGX</p>
                  <Badge className={deviceCapability.sgx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {deviceCapability.sgx ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">AMD SEV</p>
                  <Badge className={deviceCapability.sev ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {deviceCapability.sev ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">Intel TDX</p>
                  <Badge className={deviceCapability.tdx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {deviceCapability.tdx ? '지원' : '미지원'}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Cloud TEE Capability Check */}
          <div className={`p-4 rounded-lg border ${cloudCapChecked ? 'bg-green-600/10 border-green-500/20' : 'bg-gray-800/30 border-gray-700/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cloudCapChecked ? 'bg-green-600/30' : 'bg-gray-700/30'}`}>
                  {cloudCapChecked ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <span className="text-gray-500 font-semibold">2</span>
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${cloudCapChecked ? 'text-green-400' : 'text-gray-300'}`}>
                    Cloud TEE 지원 확인
                  </h4>
                  <p className="text-xs text-gray-500">클라우드 서버의 TEE 지원 여부</p>
                </div>
              </div>
              {cloudCapLog.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandCloudCap(!expandCloudCap)}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  자세히 보기
                  {expandCloudCap ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </Button>
              )}
            </div>
            
            {expandCloudCap && cloudCapLog.length > 0 && (
              <div className="mt-3 p-3 bg-black/30 rounded border border-gray-700 font-mono text-xs max-h-64 overflow-y-auto">
                {cloudCapLog.map((log, idx) => (
                  <div key={idx} className={`py-0.5 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-gray-400'}`}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {cloudCapability && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">Intel SGX</p>
                  <Badge className={cloudCapability.sgx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.sgx ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">AMD SEV</p>
                  <Badge className={cloudCapability.sev ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.sev ? '지원' : '미지원'}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded">
                  <p className="text-xs text-gray-400 mb-1">Intel TDX</p>
                  <Badge className={cloudCapability.tdx ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                    {cloudCapability.tdx ? '지원' : '미지원'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Phase 2: TEE 구축 섹션 */}
      {capabilityCheckComplete && (
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Phase 2: TEE 구축</h3>
                <p className="text-sm text-gray-400">
                  Device와 Cloud에 보안 환경을 구축합니다
                </p>
              </div>
            </div>
            {isCompleted ? (
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                완료
              </Badge>
            ) : setupStatus === 'building-tee' ? (
              <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                진행 중
              </Badge>
            ) : (
              <Button
                onClick={handleBuildTee}
                className="bg-green-600 hover:bg-green-700"
                disabled={setupStatus === 'building-tee'}
              >
                <Play className="w-4 h-4 mr-2" />
                구축 시작
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Device TEE Build */}
            <div className={`p-4 rounded-lg border ${deviceBuilt ? 'bg-green-600/10 border-green-500/20' : 'bg-gray-800/30 border-gray-700/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deviceBuilt ? 'bg-green-600/30' : 'bg-gray-700/30'}`}>
                    {deviceBuilt ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className="text-gray-500 font-semibold">3</span>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${deviceBuilt ? 'text-green-400' : 'text-gray-300'}`}>
                      Device TEE 구축
                    </h4>
                    <p className="text-xs text-gray-500">디바이스에 보안 환경 설정</p>
                  </div>
                </div>
                {deviceBuildLog.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandDeviceBuild(!expandDeviceBuild)}
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    자세히 보기
                    {expandDeviceBuild ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>
                )}
              </div>
              
              {expandDeviceBuild && deviceBuildLog.length > 0 && (
                <div className="mt-3 p-3 bg-black/30 rounded border border-gray-700 font-mono text-xs max-h-64 overflow-y-auto">
                  {deviceBuildLog.map((log, idx) => (
                    <div key={idx} className={`py-0.5 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-gray-400'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cloud TEE Build */}
            <div className={`p-4 rounded-lg border ${cloudBuilt ? 'bg-green-600/10 border-green-500/20' : 'bg-gray-800/30 border-gray-700/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cloudBuilt ? 'bg-green-600/30' : 'bg-gray-700/30'}`}>
                    {cloudBuilt ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className="text-gray-500 font-semibold">4</span>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${cloudBuilt ? 'text-green-400' : 'text-gray-300'}`}>
                      Cloud TEE 구축
                    </h4>
                    <p className="text-xs text-gray-500">클라우드에 보안 환경 설정</p>
                  </div>
                </div>
                {cloudBuildLog.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandCloudBuild(!expandCloudBuild)}
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    자세히 보기
                    {expandCloudBuild ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>
                )}
              </div>
              
              {expandCloudBuild && cloudBuildLog.length > 0 && (
                <div className="mt-3 p-3 bg-black/30 rounded border border-gray-700 font-mono text-xs max-h-64 overflow-y-auto">
                  {cloudBuildLog.map((log, idx) => (
                    <div key={idx} className={`py-0.5 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-gray-400'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

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

      {(setupStatus === 'capability-failed' || setupStatus === 'build-failed') && (
        <Card className="p-6 bg-red-600/10 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
            <div>
              <h3 className="font-semibold text-red-400 mb-2">
                {setupStatus === 'capability-failed' ? 'TEE 지원 확인 실패' : 'TEE 구축 실패'}
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                {setupStatus === 'capability-failed'
                  ? 'Device 또는 Cloud TEE 환경이 지원되지 않습니다.'
                  : 'TEE 환경 구축 중 오류가 발생했습니다.'}
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
