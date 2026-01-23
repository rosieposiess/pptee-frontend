import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Lock, Key, CheckCircle, AlertTriangle, XCircle, ArrowRight, Server, Database } from 'lucide-react';
import { Progress } from './ui/progress';

const securityMetrics = [
  { label: 'TEE 환경 무결성', value: 100, status: 'excellent' },
  { label: '암호화 강도', value: 98, status: 'excellent' },
  { label: '키 관리', value: 95, status: 'excellent' },
  { label: '네트워크 보안', value: 92, status: 'good' },
];

const teeStatus = [
  { name: 'Device TEE', type: 'device', status: 'active', uptime: '99.9%', lastCheck: '5분 전', attestation: 'Verified ✓', encKey: 'Key A' },
  { name: 'Cloud TEE', type: 'cloud', status: 'active', uptime: '99.8%', lastCheck: '3분 전', attestation: 'Verified ✓', encKey: 'Key A, B' },
];

const securityEvents = [
  { id: 1, type: 'success', message: 'TEE 환경 무결성 검증 완료', time: '5분 전' },
  { id: 2, type: 'success', message: '암호화 키 갱신 완료', time: '1시간 전' },
  { id: 3, type: 'info', message: '보안 업데이트 적용', time: '3시간 전' },
  { id: 4, type: 'success', message: '모든 TEE 환경 정상 작동 확인', time: '6시간 전' },
];

const encryptionInfo = [
  { label: '암호화 알고리즘', value: 'AES-256-GCM' },
  { label: '키 교환', value: 'ECDH P-384' },
  { label: '해시 함수', value: 'SHA-384' },
  { label: '인증', value: 'HMAC-SHA256' },
];

const dataFlowSteps = [
  { 
    id: 1, 
    location: 'Device TEE', 
    action: 'enc_A(q)', 
    description: '사용자 쿼리를 키 A로 암호화',
    color: 'orange',
    icon: Lock
  },
  { 
    id: 2, 
    location: '보안 채널', 
    action: '전송', 
    description: '암호화된 데이터 전송',
    color: 'purple',
    icon: ArrowRight
  },
  { 
    id: 3, 
    location: 'Cloud TEE', 
    action: 'dec_A(enc_A(q))', 
    description: 'Cloud TEE에서 복호화',
    color: 'green',
    icon: Key
  },
  { 
    id: 4, 
    location: 'Cloud TEE', 
    action: 'RAG + LLM', 
    description: '안전한 환경에서 추론',
    color: 'green',
    icon: Database
  },
  { 
    id: 5, 
    location: 'Cloud TEE', 
    action: 'enc_B(enc_A(r))', 
    description: '응답을 이중 암호화',
    color: 'green',
    icon: Shield
  },
  { 
    id: 6, 
    location: '보안 채널', 
    action: '전송', 
    description: '이중 암호화된 응답 전송',
    color: 'purple',
    icon: ArrowRight
  },
  { 
    id: 7, 
    location: 'Device TEE', 
    action: 'dec_A, dec_B', 
    description: '이중 복호화하여 결과 표시',
    color: 'orange',
    icon: CheckCircle
  },
];

export function Security() {
  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">보안 상태</h2>
        <p className="text-gray-400 mt-1">TEE 환경 및 암호화 상태를 모니터링합니다</p>
      </div>

      {/* Overall Security Score */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">전체 보안 점수</h3>
            <p className="text-sm text-gray-400">시스템 보안 수준이 우수합니다</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400">98%</div>
            <Badge className="mt-2 bg-green-600/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              우수
            </Badge>
          </div>
        </div>
        <Progress value={98} className="h-3" />
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.label} className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-sm">{metric.label}</h3>
            </div>
            <div className="text-2xl font-bold mb-2">{metric.value}%</div>
            <Progress value={metric.value} className="h-2" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TEE Status */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">TEE 환경 상태</h3>
          </div>
          <div className="space-y-4">
            {teeStatus.map((tee) => (
              <div
                key={tee.name}
                className="p-4 bg-gray-800/50 rounded-lg border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">{tee.name}</span>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                    {tee.status === 'active' ? '활성' : '비활성'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">가동률</span>
                    <span className="text-gray-300">{tee.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">마지막 검증</span>
                    <span className="text-gray-300">{tee.lastCheck}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">인증</span>
                    <span className="text-gray-300">{tee.attestation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">암호화 키</span>
                    <span className="text-gray-300">{tee.encKey}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Encryption Info */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">암호화 정보</h3>
          </div>
          <div className="space-y-4">
            {encryptionInfo.map((info) => (
              <div
                key={info.label}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <span className="text-sm text-gray-400">{info.label}</span>
                <span className="text-sm font-medium text-gray-300">{info.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-400 text-sm">종단간 암호화 활성화</p>
                <p className="text-xs text-gray-400 mt-1">
                  모든 데이터가 전송 및 처리 과정에서 암호화됩니다
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Events */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <h3 className="font-semibold mb-4">보안 이벤트 로그</h3>
        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.type === 'success'
                    ? 'bg-green-600/20'
                    : event.type === 'warning'
                    ? 'bg-yellow-600/20'
                    : 'bg-blue-600/20'
                }`}
              >
                {event.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : event.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Shield className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{event.message}</p>
                <p className="text-sm text-gray-400 mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Recommendations */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <h3 className="font-semibold mb-4">보안 권장사항</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-green-400">시스템이 안전하게 운영되고 있습니다</p>
              <p className="text-sm text-gray-400 mt-1">모든 보안 요구사항이 충족되었습니다</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Flow */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold">Multi-TEE 데이터 흐름</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          사용자 쿼리부터 응답까지의 보안 처리 과정
        </p>
        <div className="space-y-2">
          {dataFlowSteps.map((step, idx) => (
            <div key={step.id}>
              <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  step.color === 'orange' ? 'bg-orange-600/20' :
                  step.color === 'purple' ? 'bg-purple-600/20' :
                  step.color === 'green' ? 'bg-green-600/20' :
                  'bg-blue-600/20'
                }`}>
                  <step.icon className={`w-5 h-5 ${
                    step.color === 'orange' ? 'text-orange-400' :
                    step.color === 'purple' ? 'text-purple-400' :
                    step.color === 'green' ? 'text-green-400' :
                    'text-blue-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${
                      step.color === 'orange' ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' :
                      step.color === 'purple' ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' :
                      step.color === 'green' ? 'bg-green-600/20 text-green-400 border-green-500/30' :
                      'bg-blue-600/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {step.location}
                    </Badge>
                    <span className="text-xs font-mono text-gray-400">{step.action}</span>
                  </div>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
              </div>
              {idx < dataFlowSteps.length - 1 && (
                <div className="flex justify-start ml-5 my-1">
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}