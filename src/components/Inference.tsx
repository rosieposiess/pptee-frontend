import { useState } from 'react';
import { useParams } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Send, Loader2, CheckCircle, Lock, Shield, Cloud, Server, Settings, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InferenceStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: any;
  color: string;
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
  const [response, setResponse] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<InferenceStep[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [port, setPort] = useState('8080');
  const [endpoint, setEndpoint] = useState('https://api.example.com');
  const [maxTokens, setMaxTokens] = useState('2048');
  const [temperature, setTemperature] = useState('0.7');

  const currentModel = modelId ? modelData[modelId] : null;

  const handleSaveSettings = () => {
    toast.success('설정이 저장되었습니다!');
    setSettingsOpen(false);
  };

  const inferenceSteps: InferenceStep[] = [
    { 
      id: '1', 
      label: 'Device 암호화', 
      description: '로컬에서 쿼리 암호화',
      status: 'pending', 
      icon: Lock, 
      color: 'blue' 
    },
    { 
      id: '2', 
      label: '전송', 
      description: '암호화된 데이터 전송',
      status: 'pending', 
      icon: Send, 
      color: 'purple' 
    },
    { 
      id: '3', 
      label: 'Cloud 처리', 
      description: 'TEE 환경에서 추론',
      status: 'pending', 
      icon: Cloud, 
      color: 'green' 
    },
    { 
      id: '4', 
      label: 'Device 복호화', 
      description: '결과 복호화 및 표시',
      status: 'pending', 
      icon: CheckCircle, 
      color: 'emerald' 
    },
  ];

  const handleInference = async () => {
    if (!currentModel || !query.trim()) {
      toast.error('모델을 선택하고 쿼리를 입력해주세요');
      return;
    }

    setIsProcessing(true);
    setResponse('');
    setProcessingSteps(inferenceSteps);

    // BACKEND CALL 1: cmd_submit_text_input (쿼리 제출)
    // await invoke("cmd_submit_text_input", { text: query, meta: null })
    // 응답 예시: "OK"
    // 상태 전환: EnvReady -> InputReceived
    
    // BACKEND CALL 2: cmd_start_secure_task (추론 시작)
    // const result = await invoke("cmd_start_secure_task")
    // 응답 예시: "COMPLETED" (성공) 또는 "ABORTED" (중단됨)
    // 상태 전환: InputReceived -> TaskRunning -> Completed
    
    // 백엔드에서 cmd_start_secure_task가 실행되는 동안
    // 4단계 보안 처리가 내부적으로 진행됨 (UI로 단계별 표시)

    // Simulate step-by-step processing
    for (let i = 0; i < inferenceSteps.length; i++) {
      setProcessingSteps((prev) =>
        prev.map((step, idx) =>
          idx === i
            ? { ...step, status: 'processing' }
            : idx < i
            ? { ...step, status: 'completed' }
            : step
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setProcessingSteps((prev) => prev.map((step) => ({ ...step, status: 'completed' })));

    // Simulate response
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockResponse = `안녕하세요! ${query}에 대한 답변입니다.\n\n선택하신 ${
      currentModel.name
    } 모델을 통해 안전하게 처리되었습니다. 모든 데이터는 TEE(Trusted Execution Environment) 환경에서 암호화되어 처리되었으며, 귀하의 프라이버시가 완전히 보호되었습니다.\n\n추가 질문이 있으시면 언제든지 문의해주세요!`;

    setResponse(mockResponse);
    setIsProcessing(false);

    // BACKEND CALL 3: cmd_retrieve_result (결과 가져오기)
    // const finalResult = await invoke("cmd_retrieve_result")
    // 응답: { text: "...", meta: null }
    // 상태 전환: Completed -> EnvReady
    
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
    <div className="space-y-6 text-gray-100">
      {/* Model Info Header */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex items-start justify-between">
          <div>
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

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
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
                  <Label htmlFor="maxTokens">최대 토큰 수</Label>
                  <Input
                    id="maxTokens"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveSettings}>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">쿼리 입력</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="모델에게 질문을 입력하세요..."
              className="min-h-[120px] bg-gray-800/50 border-gray-700 text-gray-100 resize-none"
              disabled={isProcessing}
            />
          </div>
          <Button
            onClick={handleInference}
            disabled={isProcessing || !query.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                추론 시작
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Processing Steps - Horizontal Flow */}
      {isProcessing && processingSteps.length > 0 && (
        <Card className="p-8 bg-[#151b2e] border-gray-800">
          <h3 className="font-semibold mb-8 text-lg text-center">보안 처리 플로우</h3>
          
          {/* Horizontal Steps */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000"
                style={{ 
                  width: `${(processingSteps.filter(s => s.status === 'completed').length / processingSteps.length) * 100}%` 
                }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-4 relative">
              {processingSteps.map((step, index) => {
                const Icon = step.icon;
                const isProcessing = step.status === 'processing';
                const isCompleted = step.status === 'completed';
                const isPending = step.status === 'pending';

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className="relative z-10 mb-4">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCompleted
                            ? 'bg-green-600 shadow-lg shadow-green-600/50 scale-100'
                            : isProcessing
                            ? 'bg-blue-600 shadow-lg shadow-blue-600/50 scale-110 animate-pulse'
                            : 'bg-gray-700 scale-95'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-12 h-12 text-white" />
                        ) : isProcessing ? (
                          <Loader2 className="w-12 h-12 text-white animate-spin" />
                        ) : (
                          <Icon className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Pulse ring for processing */}
                      {isProcessing && (
                        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <p
                        className={`font-semibold mb-1 transition-colors ${
                          isCompleted
                            ? 'text-green-400'
                            : isProcessing
                            ? 'text-blue-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs ${
                          isCompleted || isProcessing
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-8 text-center">
            {processingSteps.find(s => s.status === 'processing') && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-blue-400">
                  {processingSteps.find(s => s.status === 'processing')?.label} 진행 중...
                </span>
              </div>
            )}
            {processingSteps.every(s => s.status === 'completed') && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">
                  모든 보안 처리 완료
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Response Section */}
      {response && (
        <Card className="p-6 bg-[#151b2e] border-gray-800 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-lg">보안 처리된 응답</h3>
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 ml-auto">
              <CheckCircle className="w-3 h-3 mr-1" />
              처리 완료
            </Badge>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{response}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
