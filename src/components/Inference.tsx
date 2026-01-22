import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Loader2, CheckCircle, Lock, Shield, Cloud, Server } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Progress } from './ui/progress';

interface InferenceStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed';
  icon: any;
}

const availableModels = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'claude-3', name: 'Claude-3', provider: 'Anthropic' },
  { id: 'llama-3', name: 'Llama-3', provider: 'Meta' },
];

export function Inference() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<InferenceStep[]>([]);

  const inferenceSteps: InferenceStep[] = [
    { id: '1', label: 'Device TEE에서 쿼리 암호화', status: 'pending', icon: Lock },
    { id: '2', label: '암호화된 쿼리 전송', status: 'pending', icon: Send },
    { id: '3', label: 'Cloud TEE에서 복호화', status: 'pending', icon: Cloud },
    { id: '4', label: 'RAG 처리 및 모델 추론', status: 'pending', icon: Server },
    { id: '5', label: '결과 암호화 및 반환', status: 'pending', icon: Shield },
    { id: '6', label: 'Device에서 최종 복호화', status: 'pending', icon: CheckCircle },
  ];

  const handleInference = async () => {
    if (!selectedModel || !query.trim()) {
      toast.error('모델을 선택하고 쿼리를 입력해주세요');
      return;
    }

    setIsProcessing(true);
    setResponse('');
    setProcessingSteps(inferenceSteps);

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
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setProcessingSteps((prev) => prev.map((step) => ({ ...step, status: 'completed' })));

    // Simulate response
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockResponse = `안녕하세요! ${query}에 대한 답변입니다.\n\n선택하신 ${
      availableModels.find((m) => m.id === selectedModel)?.name
    } 모델을 통해 안전하게 처리되었습니다. 모든 데이터는 TEE(Trusted Execution Environment) 환경에서 암호화되어 처리되었으며, 귀하의 프라이버시가 완전히 보호되었습니다.\n\n이 응답은 다음 단계를 거쳐 생성되었습니다:\n1. Device TEE에서 쿼리 암호화\n2. 암호화된 데이터를 클라우드로 전송\n3. Cloud TEE에서 안전하게 복호화\n4. RAG 처리 및 모델 추론 실행\n5. 결과를 암호화하여 반환\n6. Device에서 최종 복호화\n\n추가 질문이 있으시면 언제든지 문의해주세요!`;

    setResponse(mockResponse);
    setIsProcessing(false);
    toast.success('추론이 완료되었습니다!');
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">추론 실행</h2>
        <p className="text-gray-400 mt-1">안전한 TEE 환경에서 LLM 추론을 실행하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <h3 className="font-semibold mb-4">쿼리 입력</h3>

            {/* Model Selection */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">모델 선택</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="모델을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {availableModels.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        <span className="text-xs text-gray-400">({model.provider})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Query Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">질문 또는 요청</label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="추론할 내용을 입력하세요..."
                className="min-h-[200px] bg-gray-800 border-gray-700 resize-none"
                disabled={isProcessing}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleInference}
              disabled={isProcessing || !selectedModel || !query.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  추론 중...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  추론 시작
                </>
              )}
            </Button>
          </Card>

          {/* Response Section */}
          {response && (
            <Card className="p-6 bg-[#151b2e] border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold">응답 결과</h3>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">보안 처리 단계</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              모든 데이터는 TEE 환경에서 암호화되어 처리됩니다
            </p>

            <div className="space-y-3">
              {(processingSteps.length > 0 ? processingSteps : inferenceSteps).map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      step.status === 'processing'
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : step.status === 'completed'
                        ? 'bg-green-600/10 border border-green-500/20'
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        step.status === 'processing'
                          ? 'bg-blue-600/30'
                          : step.status === 'completed'
                          ? 'bg-green-600/30'
                          : 'bg-gray-700'
                      }`}
                    >
                      {step.status === 'processing' ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      ) : step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Icon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{step.label}</p>
                      {step.status === 'processing' && (
                        <Progress value={50} className="h-1 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Security Info */}
          <Card className="p-6 bg-[#151b2e] border-gray-800">
            <h3 className="font-semibold mb-3">보안 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-400">종단간 암호화</p>
                  <p className="text-xs text-gray-400">모든 데이터가 암호화됩니다</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-400">TEE 보호</p>
                  <p className="text-xs text-gray-400">격리된 실행 환경</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-400">무결성 보장</p>
                  <p className="text-xs text-gray-400">데이터 변조 방지</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}