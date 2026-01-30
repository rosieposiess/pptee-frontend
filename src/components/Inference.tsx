import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Send, Loader2, CheckCircle, Lock, Shield, Cloud, Server, Settings, ArrowRight, User, Bot, ChevronDown, ChevronUp, Key, FileText, Database } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InferenceStep {
  id: string;
  label: string;
  description: string;
  detailLogs: string[];
  status: 'pending' | 'processing' | 'completed';
  icon: any;
  color: string;
  encryptedData?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  processingLogs?: InferenceStep[];
}

const modelData: Record<string, { name: string; provider: string; description: string }> = {
  '1': { name: 'GPT-4', provider: 'OpenAI', description: '고급 언어 모델, 복잡한 추론 및 창의적 작업에 최적화' },
  '2': { name: 'Claude-3', provider: 'Anthropic', description: '안전성과 정확도가 높은 모델, 장문 컨텍스트 처리 가능' },
  '3': { name: 'Llama-3', provider: 'Meta', description: '오픈소스 모델, 다양한 작업에 활용 가능' },
};

export function Inference() {
  const { modelId } = useParams<{ modelId: string }>();
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messagesByModel, setMessagesByModel] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('pp-tee-messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        return parsed;
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  const [processingSteps, setProcessingSteps] = useState<InferenceStep[]>([]);
  const [expandedMessageLog, setExpandedMessageLog] = useState<number | null>(null);
  const [expandedLiveLog, setExpandedLiveLog] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [port, setPort] = useState('8080');
  const [endpoint, setEndpoint] = useState('https://api.example.com');
  const [maxTokens, setMaxTokens] = useState('2048');
  const [temperature, setTemperature] = useState('0.7');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentModel = modelId ? modelData[modelId] : null;
  const messages = modelId ? (messagesByModel[modelId] || []) : [];

  useEffect(() => {
    localStorage.setItem('pp-tee-messages', JSON.stringify(messagesByModel));
  }, [messagesByModel]);

  // 자동 스크롤 제거 - 사용자가 위로 스크롤하면 방해하지 않음

  const handleSaveSettings = () => {
    toast.success('설정이 저장되었습니다!');
    setSettingsOpen(false);
  };

  // 암호화된 데이터 생성 함수
  const generateEncryptedData = (text: string, prefix: string = 'enc_A') => {
    // btoa는 한글을 처리하지 못하므로 간단한 hex 변환 사용
    const hexString = Array.from(text.substring(0, 20))
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    const shortened = hexString.substring(0, 32) + '...' + hexString.substring(hexString.length - 8);
    return `${prefix}(${shortened})`;
  };

  // Icon 컴포넌트 매핑
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'User': User,
      'Lock': Lock,
      'Send': Send,
      'Key': Key,
      'Database': Database,
      'Bot': Bot,
      'Shield': Shield,
      'CheckCircle': CheckCircle,
    };
    return iconMap[iconName] || User;
  };

  // 날짜 변경 확인 함수
  const shouldShowDateSeparator = (currentMessage: Message, prevMessage?: Message) => {
    if (!prevMessage) return true; // 첫 메시지는 항상 날짜 표시
    
    const currentDate = currentMessage.timestamp.toDateString();
    const prevDate = prevMessage.timestamp.toDateString();
    
    return currentDate !== prevDate;
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = date.toDateString();
    
    if (dateStr === today.toDateString()) {
      return '오늘';
    } else if (dateStr === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const inferenceSteps: InferenceStep[] = [
    { 
      id: '1', 
      label: '① 요청 암호화 및 서버 전송', 
      description: 'Device TEE에서 쿼리를 암호화하여 Cloud로 안전하게 전송',
      detailLogs: [],
      status: 'pending', 
      icon: 'Lock', 
      color: 'orange' 
    },
    { 
      id: '2', 
      label: '② Cloud TEE에서 안전하게 처리', 
      description: '격리된 환경에서 복호화, RAG, LLM 추론 후 재암호화',
      detailLogs: [],
      status: 'pending', 
      icon: 'Shield', 
      color: 'green' 
    },
    { 
      id: '3', 
      label: '③ 암호화된 응답 수신 및 복호화', 
      description: 'Device TEE에서 이중 암호화된 응답을 복호화하여 표시',
      detailLogs: [],
      status: 'pending', 
      icon: 'CheckCircle', 
      color: 'blue' 
    },
  ];

  const handleInference = async () => {
    if (!currentModel || !query.trim() || !modelId) {
      toast.error('모델을 선택하고 쿼리를 입력해주세요');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    
    const currentMessages = messagesByModel[modelId] || [];
    setMessagesByModel((prev) => ({
      ...prev,
      [modelId]: [...currentMessages, userMessage],
    }));
    
    const userQuery = query;
    setQuery('');
    setIsProcessing(true);
    
    // Deep copy without losing icon functions
    const stepsWithLogs = inferenceSteps.map(step => ({
      ...step,
      detailLogs: [...step.detailLogs],
      status: step.status as 'pending' | 'processing' | 'completed'
    }));
    setProcessingSteps(stepsWithLogs);

    // 홈 화면에서 저장된 attestation 정보 가져오기
    const savedDeviceCap = localStorage.getItem('pp-tee-device-cap');
    const savedCloudCap = localStorage.getItem('pp-tee-cloud-cap');
    const deviceAttestation = savedDeviceCap ? JSON.parse(savedDeviceCap) : null;
    const cloudAttestation = savedCloudCap ? JSON.parse(savedCloudCap) : null;

    // Step 1: 요청 암호화 및 서버 전송
    stepsWithLogs[0].status = 'processing';
    stepsWithLogs[0].detailLogs = [
      '[INFO] User query received in Device TEE',
      `[DATA] Raw query: "${userQuery}"`,
      '[INFO] Initializing encryption with key A...',
      '[INFO] Loading Device TEE encryption module',
    ];
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    stepsWithLogs[0].detailLogs.push('[INFO] Encrypting query with AES-256-GCM...');
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const encryptedQuery = generateEncryptedData(userQuery, 'enc_A');
    stepsWithLogs[0].encryptedData = encryptedQuery;
    stepsWithLogs[0].detailLogs.push(`[ENCRYPTED] ${encryptedQuery}`);
    stepsWithLogs[0].detailLogs.push('[INFO] Establishing secure channel to Cloud TEE...');
    stepsWithLogs[0].detailLogs.push('[INFO] TLS 1.3 connection established');
    stepsWithLogs[0].detailLogs.push(`[SEND] Transmitting ${encryptedQuery}`);
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    stepsWithLogs[0].detailLogs.push('[SUCCESS] Encrypted query transmitted to Cloud TEE');
    stepsWithLogs[0].status = 'completed';
    setProcessingSteps([...stepsWithLogs]);

    // Step 2: Cloud TEE에서 안전하게 처리 (복호화 + RAG + LLM + 암호화)
    stepsWithLogs[1].status = 'processing';
    stepsWithLogs[1].detailLogs = [
      '[INFO] Cloud TEE received encrypted data',
      '[INFO] Verifying TEE attestation...',
    ];
    
    // Attestation 정보 추가
    if (cloudAttestation) {
      stepsWithLogs[1].detailLogs.push('[SUCCESS] ✓ Attestation verified');
      stepsWithLogs[1].detailLogs.push(`[INFO] TEE Environment: SGX=${cloudAttestation.sgx ? 'Yes' : 'No'}, SEV=${cloudAttestation.sev ? 'Yes' : 'No'}`);
    } else {
      stepsWithLogs[1].detailLogs.push('[SUCCESS] ✓ Attestation verified');
    }
    
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 복호화
    stepsWithLogs[1].detailLogs.push('[INFO] Loading decryption key A from secure enclave...');
    stepsWithLogs[1].detailLogs.push(`[DECRYPT] Processing ${encryptedQuery}`);
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    stepsWithLogs[1].detailLogs.push(`[DECRYPTED] Query retrieved in Cloud TEE`);
    stepsWithLogs[1].detailLogs.push('[INFO] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // RAG 처리
    stepsWithLogs[1].detailLogs.push('[INFO] Starting RAG (Retrieval-Augmented Generation)');
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    stepsWithLogs[1].detailLogs.push('[INFO] Searching vector database...');
    await new Promise((resolve) => setTimeout(resolve, 600));
    stepsWithLogs[1].detailLogs.push('[INFO] Found 5 relevant documents');
    stepsWithLogs[1].detailLogs.push('[SUCCESS] RAG context prepared');
    stepsWithLogs[1].detailLogs.push('[INFO] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    setProcessingSteps([...stepsWithLogs]);
    
    // LLM 추론
    stepsWithLogs[1].detailLogs.push(`[INFO] Loading ${currentModel.name} model...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    stepsWithLogs[1].detailLogs.push('[INFO] Model loaded in Cloud TEE');
    stepsWithLogs[1].detailLogs.push('[INFO] Running inference...');
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    stepsWithLogs[1].detailLogs.push('[INFO] Generated 247 tokens');
    stepsWithLogs[1].detailLogs.push('[SUCCESS] Inference completed');
    stepsWithLogs[1].detailLogs.push('[INFO] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 이중 암호화
    stepsWithLogs[1].detailLogs.push('[INFO] Encrypting response for secure transmission...');
    stepsWithLogs[1].detailLogs.push('[INFO] First encryption with key A (enc_A)...');
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const encA = generateEncryptedData('response', 'enc_A');
    stepsWithLogs[1].detailLogs.push(`[ENCRYPTED] ${encA}`);
    stepsWithLogs[1].detailLogs.push('[INFO] Second encryption with key B (enc_B)...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const doubleEncrypted = `enc_B(${encA})`;
    stepsWithLogs[1].encryptedData = doubleEncrypted;
    stepsWithLogs[1].detailLogs.push(`[ENCRYPTED] ${doubleEncrypted}`);
    stepsWithLogs[1].detailLogs.push('[SUCCESS] Double encryption completed');
    stepsWithLogs[1].detailLogs.push('[INFO] Sending encrypted response to Device...');
    stepsWithLogs[1].status = 'completed';
    setProcessingSteps([...stepsWithLogs]);

    // Step 3: 암호화된 응답 수신 및 복호화
    await new Promise((resolve) => setTimeout(resolve, 500));
    stepsWithLogs[2].status = 'processing';
    stepsWithLogs[2].detailLogs = [
      '[INFO] Device TEE received encrypted response',
      `[RECV] ${doubleEncrypted}`,
      '[INFO] Starting decryption process...',
      '[INFO] First decryption with key B (dec_B)...',
    ];
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    stepsWithLogs[2].detailLogs.push(`[DECRYPTED] ${encA}`);
    stepsWithLogs[2].detailLogs.push('[INFO] Second decryption with key A (dec_A)...');
    setProcessingSteps([...stepsWithLogs]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    stepsWithLogs[2].detailLogs.push('[DECRYPTED] Final response retrieved');
    stepsWithLogs[2].detailLogs.push('[SUCCESS] ✓ All decryption completed');
    stepsWithLogs[2].detailLogs.push('[SUCCESS] ✓ Response ready for display');
    stepsWithLogs[2].status = 'completed';
    setProcessingSteps([...stepsWithLogs]);

    // Simulate response
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockResponse = `안녕하세요! "${userQuery}"에 대한 답변입니다.\n\n선택하신 ${currentModel.name} 모델을 통해 안전하게 처리되었습니다. \n\n🔒 **보안 처리 과정:**\n• Device TEE에서 쿼리 암호화 (enc_A)\n• Cloud TEE에서 격리된 환경에서 처리\n  - 안전한 복호화 및 Attestation 검증\n  - RAG 처리 및 LLM 추론 실행\n  - 이중 암호화 (enc_B ∘ enc_A)\n• Device에서 이중 복호화 (dec_B ∘ dec_A)\n\n모든 데이터는 Multi-TEE 환경에서 종단간 암호화되어 처리되었으며, Cloud TEE는 네트워크로부터 격리되어 귀하의 프라이버시가 완전히 보호되었습니다.\n\n추가 질문이 있으시면 언제든지 문의해주세요!`;

    const assistantMessage: Message = {
      role: 'assistant',
      content: mockResponse,
      timestamp: new Date(),
      processingLogs: stepsWithLogs,
    };
    setMessagesByModel((prev) => ({
      ...prev,
      [modelId]: [...(prev[modelId] || []), assistantMessage],
    }));
    
    setIsProcessing(false);
    setProcessingSteps([]);
    toast.success('추론이 완료되었습니다!');
  };

  if (!currentModel) {
    return (
      <div className="text-center text-gray-400">
        <p>모델을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] text-gray-100">
      {/* Model Info Header */}
      <Card className="p-6 bg-[#151b2e] border-gray-800 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentModel.name}</h2>
                <p className="text-sm text-gray-400">{currentModel.provider}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{currentModel.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* TEE Status Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-600/10 border border-green-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
              <div className="text-xs">
                <p className="text-green-400 font-medium">Multi-TEE 활성</p>
                <p className="text-green-500/70">종단간 암호화</p>
              </div>
            </div>

            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 bg-transparent">
                  <Settings className="w-4 h-4" />
                  설정
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#151b2e] border-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle>추론 설정</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    모델 추론 파라미터를 조정하세요
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="endpoint">API 엔드포인트</Label>
                    <Input
                      id="endpoint"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="port">포트</Label>
                    <Input
                      id="port"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxTokens">최대 토큰</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isProcessing && (
          <div className="text-center text-gray-500 mt-20">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">대화를 시작하세요</p>
            <p className="text-sm mt-2">모든 대화는 Multi-TEE 환경에서 암호화되어 처리됩니다</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index}>
            {/* 날짜 구분선 */}
            {shouldShowDateSeparator(message, index > 0 ? messages[index - 1] : undefined) && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-700/50"></div>
                <span className="text-xs text-gray-500 px-3 py-1 bg-gray-800/50 rounded-full">
                  {formatDate(message.timestamp)}
                </span>
                <div className="flex-1 h-px bg-gray-700/50"></div>
              </div>
            )}

            {/* 메시지 */}
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className={`p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'bg-[#1e2840] border border-gray-700'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{message.timestamp.toLocaleTimeString('ko-KR')}</span>
                      {message.role === 'assistant' && message.processingLogs && (
                        <>
                          <span>•</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedMessageLog(expandedMessageLog === index ? null : index)}
                            className="h-auto py-0 px-2 text-xs text-blue-400 hover:text-blue-300"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Multi-TEE 처리 과정 자세히 보기
                            {expandedMessageLog === index ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Processing Logs Detail */}
                    {message.role === 'assistant' && message.processingLogs && expandedMessageLog === index && (
                      <Card className="mt-3 p-4 bg-black/30 border-gray-700">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          Multi-TEE 보안 처리 과정
                        </h4>
                        <div className="space-y-3">
                          {message.processingLogs.map((step, stepIdx) => {
                            const StepIcon = getIconComponent(step.icon);
                            return (
                              <div key={stepIdx} className="border-l-2 border-green-500/30 pl-4 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <StepIcon className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-medium text-green-400">{step.label}</span>
                                  <Badge className="bg-green-600/20 text-green-400 text-xs">완료</Badge>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                                {step.detailLogs.length > 0 && (
                                  <div className="mt-2 p-2 bg-black/50 rounded border border-gray-800 font-mono text-xs space-y-0.5">
                                    {step.detailLogs.map((log, logIdx) => (
                                      <div key={logIdx} className={`
                                        ${log.includes('[ERROR]') ? 'text-red-400' : ''}
                                        ${log.includes('[SUCCESS]') ? 'text-green-400' : ''}
                                        ${log.includes('[ENCRYPTED]') || log.includes('[DECRYPTED]') ? 'text-yellow-400' : ''}
                                        ${log.includes('[INFO]') ? 'text-gray-400' : ''}
                                        ${log.includes('[DATA]') || log.includes('[SEND]') || log.includes('[RECV]') ? 'text-cyan-400' : ''}
                                      `}>
                                        {log}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {step.encryptedData && (
                                  <div className="mt-2 p-2 bg-yellow-600/10 border border-yellow-500/20 rounded">
                                    <p className="text-xs text-yellow-400 font-mono break-all">
                                      🔐 {step.encryptedData}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Live Processing Steps */}
        {isProcessing && processingSteps.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-3xl w-full">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <Card className="flex-1 p-4 bg-[#1e2840] border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold">Multi-TEE 보안 처리 중...</h4>
                  </div>
                  <div className="space-y-3">
                    {processingSteps.map((step, index) => {
                      const StepIcon = getIconComponent(step.icon);
                      const isExpanded = expandedLiveLog === step.id;
                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg border transition-all ${
                            step.status === 'completed'
                              ? 'bg-green-600/10 border-green-500/30'
                              : step.status === 'processing'
                              ? 'bg-blue-600/10 border-blue-500/30'
                              : 'bg-gray-800/30 border-gray-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 ${
                              step.status === 'processing' ? 'animate-pulse' : ''
                            }`}>
                              {step.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : step.status === 'processing' ? (
                                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                              ) : (
                                <StepIcon className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${
                                    step.status === 'completed' ? 'text-green-400' :
                                    step.status === 'processing' ? 'text-blue-400' :
                                    'text-gray-500'
                                  }`}>
                                    {step.label}
                                  </span>
                                  {step.status === 'processing' && (
                                    <Badge className="bg-blue-600/20 text-blue-400 text-xs">진행 중</Badge>
                                  )}
                                </div>
                                {step.detailLogs.length > 0 && step.status !== 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedLiveLog(isExpanded ? null : step.id)}
                                    className="h-auto py-0 px-2 text-xs text-gray-400 hover:text-blue-400"
                                  >
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                              
                              {/* 암호화된 데이터만 항상 표시 */}
                              {step.encryptedData && (
                                <div className="mt-2 p-2 bg-yellow-600/10 border border-yellow-500/20 rounded">
                                  <p className="text-xs text-yellow-400 font-mono break-all">
                                    🔐 {step.encryptedData}
                                  </p>
                                </div>
                              )}
                              
                              {/* 자세히 보기 클릭 시에만 로그 표시 */}
                              {isExpanded && step.detailLogs.length > 0 && (
                                <div className="mt-2 p-2 bg-black/50 rounded border border-gray-800 font-mono text-xs space-y-0.5 max-h-32 overflow-y-auto">
                                  {step.detailLogs.map((log, logIdx) => (
                                    <div key={logIdx} className={`
                                      ${log.includes('[ERROR]') ? 'text-red-400' : ''}
                                      ${log.includes('[SUCCESS]') ? 'text-green-400' : ''}
                                      ${log.includes('[ENCRYPTED]') || log.includes('[DECRYPTED]') ? 'text-yellow-400' : ''}
                                      ${log.includes('[INFO]') ? 'text-gray-400' : ''}
                                      ${log.includes('[DATA]') || log.includes('[SEND]') || log.includes('[RECV]') ? 'text-cyan-400' : ''}
                                    `}>
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0f1419] border-t border-gray-800 flex-shrink-0">
        <div className="flex gap-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleInference();
              }
            }}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            className="flex-1 min-h-[60px] max-h-[200px] bg-gray-800/50 border-gray-700 resize-none"
            disabled={isProcessing}
          />
          <Button
            onClick={handleInference}
            disabled={isProcessing || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>모든 대화는 TEE 환경에서 암호화되어 처리됩니다</span>
        </div>
      </div>
    </div>
  );
}