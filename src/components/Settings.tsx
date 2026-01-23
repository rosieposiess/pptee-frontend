import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Server, Lock, Sliders, Bell, User, Palette, Database, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  // Server Settings
  const [serverIp, setServerIp] = useState('192.168.1.100');
  const [serverPort, setServerPort] = useState('8443');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com');

  // Inference Settings
  const [defaultTemperature, setDefaultTemperature] = useState('0.7');
  const [defaultMaxTokens, setDefaultMaxTokens] = useState('2048');
  const [defaultTopP, setDefaultTopP] = useState('0.9');
  const [streamingEnabled, setStreamingEnabled] = useState(true);

  // Security Settings
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState('AES-256-GCM');
  const [keyRotationDays, setKeyRotationDays] = useState('30');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-384');

  // RAG Settings
  const [ragEnabled, setRagEnabled] = useState(false);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-ada-002');
  const [chunkSize, setChunkSize] = useState('512');
  const [topK, setTopK] = useState('5');

  // Notification Settings
  const [inferenceComplete, setInferenceComplete] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  // User Settings
  const [userName, setUserName] = useState('사용자');
  const [userEmail, setUserEmail] = useState('user@example.com');

  // Load settings from localStorage
  useEffect(() => {
    const savedServerIp = localStorage.getItem('pp-tee-server-ip');
    const savedServerPort = localStorage.getItem('pp-tee-server-port');
    const savedApiEndpoint = localStorage.getItem('pp-tee-api-endpoint');
    
    if (savedServerIp) setServerIp(savedServerIp);
    if (savedServerPort) setServerPort(savedServerPort);
    if (savedApiEndpoint) setApiEndpoint(savedApiEndpoint);

    // Load other settings
    const savedTemperature = localStorage.getItem('pp-tee-default-temperature');
    const savedMaxTokens = localStorage.getItem('pp-tee-default-max-tokens');
    const savedTopP = localStorage.getItem('pp-tee-default-top-p');
    
    if (savedTemperature) setDefaultTemperature(savedTemperature);
    if (savedMaxTokens) setDefaultMaxTokens(savedMaxTokens);
    if (savedTopP) setDefaultTopP(savedTopP);
  }, []);

  const handleSaveSettings = () => {
    // Save server settings
    localStorage.setItem('pp-tee-server-ip', serverIp);
    localStorage.setItem('pp-tee-server-port', serverPort);
    localStorage.setItem('pp-tee-api-endpoint', apiEndpoint);

    // Save inference settings
    localStorage.setItem('pp-tee-default-temperature', defaultTemperature);
    localStorage.setItem('pp-tee-default-max-tokens', defaultMaxTokens);
    localStorage.setItem('pp-tee-default-top-p', defaultTopP);

    toast.success('설정이 저장되었습니다');
  };

  const handleResetSettings = () => {
    setServerIp('192.168.1.100');
    setServerPort('8443');
    setApiEndpoint('https://api.example.com');
    setDefaultTemperature('0.7');
    setDefaultMaxTokens('2048');
    setDefaultTopP('0.9');
    setEncryptionAlgorithm('AES-256-GCM');
    setKeyRotationDays('30');
    setHashAlgorithm('SHA-384');
    setRagEnabled(false);
    setEmbeddingModel('text-embedding-ada-002');
    setChunkSize('512');
    setTopK('5');

    toast.info('설정이 초기화되었습니다');
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold">설정</h2>
        <p className="text-gray-400 mt-1">
          시스템 및 사용자 설정을 관리합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">서버 설정</h3>
              <p className="text-xs text-gray-400">TEE 서버 연결 정보</p>
            </div>
          </div>

          <div className="space-y-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API 엔드포인트
              </label>
              <Input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com"
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
            </div>
          </div>
        </Card>

        {/* Inference Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Sliders className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">추론 설정</h3>
              <p className="text-xs text-gray-400">LLM 모델 기본 파라미터</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temperature
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={defaultTemperature}
                onChange={(e) => setDefaultTemperature(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                응답의 창의성 (0.0 ~ 2.0)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Tokens
              </label>
              <Input
                type="number"
                step="1"
                min="1"
                max="32000"
                value={defaultMaxTokens}
                onChange={(e) => setDefaultMaxTokens(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                최대 생성 토큰 수
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Top-p
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={defaultTopP}
                onChange={(e) => setDefaultTopP(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                누적 확률 임계값 (0.0 ~ 1.0)
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">스트리밍 응답</p>
                <p className="text-xs text-gray-500">실시간으로 응답 표시</p>
              </div>
              <button
                onClick={() => setStreamingEnabled(!streamingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  streamingEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    streamingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">보안 설정</h3>
              <p className="text-xs text-gray-400">암호화 및 보안 정책</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                암호화 알고리즘
              </label>
              <select
                value={encryptionAlgorithm}
                onChange={(e) => setEncryptionAlgorithm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
              >
                <option value="AES-256-GCM">AES-256-GCM</option>
                <option value="AES-192-GCM">AES-192-GCM</option>
                <option value="AES-128-GCM">AES-128-GCM</option>
                <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                키 교체 주기 (일)
              </label>
              <Input
                type="number"
                step="1"
                min="1"
                max="365"
                value={keyRotationDays}
                onChange={(e) => setKeyRotationDays(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                암호화 키 자동 교체 주기
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                해시 알고리즘
              </label>
              <select
                value={hashAlgorithm}
                onChange={(e) => setHashAlgorithm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
              >
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-512">SHA-512</option>
                <option value="BLAKE2b">BLAKE2b</option>
              </select>
            </div>

            <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-sm text-green-300">
                  <p className="font-medium mb-1">종단간 암호화 활성</p>
                  <p className="text-green-400/80">
                    모든 데이터는 TEE 환경에서 암호화되어 전송됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* RAG Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">RAG 설정</h3>
              <p className="text-xs text-gray-400">검색 증강 생성 설정</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">RAG 활성화</p>
                <p className="text-xs text-gray-500">문서 기반 응답 생성</p>
              </div>
              <button
                onClick={() => setRagEnabled(!ragEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  ragEnabled ? 'bg-cyan-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    ragEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {ragEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    임베딩 모델
                  </label>
                  <select
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
                  >
                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                    <option value="text-embedding-3-small">text-embedding-3-small</option>
                    <option value="text-embedding-3-large">text-embedding-3-large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    청크 크기 (토큰)
                  </label>
                  <Input
                    type="number"
                    step="1"
                    min="128"
                    max="2048"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    문서 분할 단위
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Top-K 검색
                  </label>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    max="20"
                    value={topK}
                    onChange={(e) => setTopK(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    검색할 관련 문서 수
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">알림 설정</h3>
              <p className="text-xs text-gray-400">시스템 알림 관리</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">추론 완료 알림</p>
                <p className="text-xs text-gray-500">모델 추론이 완료되면 알림</p>
              </div>
              <button
                onClick={() => setInferenceComplete(!inferenceComplete)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  inferenceComplete ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    inferenceComplete ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">보안 경고</p>
                <p className="text-xs text-gray-500">보안 이벤트 발생 시 알림</p>
              </div>
              <button
                onClick={() => setSecurityAlerts(!securityAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityAlerts ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securityAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">시스템 업데이트</p>
                <p className="text-xs text-gray-500">새 업데이트 알림</p>
              </div>
              <button
                onClick={() => setSystemUpdates(!systemUpdates)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  systemUpdates ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    systemUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* User Settings */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">사용자 정보</h3>
              <p className="text-xs text-gray-400">프로필 및 계정 정보</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이름
              </label>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <Input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-gray-100"
              />
            </div>

            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">계정 타입</span>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                  프리미엄
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">가입일</span>
                <span className="text-sm text-gray-300">2024년 1월 1일</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          onClick={handleResetSettings}
          variant="outline"
          className="border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </Button>
        <Button
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}
