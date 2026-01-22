import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Activity,
  Calendar,
} from 'lucide-react';

interface InferenceHistory {
  id: string;
  model: string;
  query: string;
  status: 'success' | 'failed' | 'processing';
  timestamp: string;
  duration: string;
  tokensUsed: number;
}

const mockHistory: InferenceHistory[] = [
  {
    id: '1',
    model: 'GPT-4',
    query: '데이터 분석 요청: 2024년 1분기 매출 트렌드 분석',
    status: 'success',
    timestamp: '2024-01-22 14:32',
    duration: '2.3초',
    tokensUsed: 450,
  },
  {
    id: '2',
    model: 'Claude-3',
    query: '코드 리뷰 요청: React 컴포넌트 최적화',
    status: 'success',
    timestamp: '2024-01-22 14:15',
    duration: '3.1초',
    tokensUsed: 680,
  },
  {
    id: '3',
    model: 'Llama-3',
    query: '문서 요약: 프로젝트 제안서 핵심 내용 추출',
    status: 'processing',
    timestamp: '2024-01-22 14:08',
    duration: '-',
    tokensUsed: 0,
  },
  {
    id: '4',
    model: 'GPT-4',
    query: '번역 작업: 기술 문서 한영 번역',
    status: 'success',
    timestamp: '2024-01-22 13:45',
    duration: '1.8초',
    tokensUsed: 320,
  },
  {
    id: '5',
    model: 'Claude-3',
    query: '창의적 글쓰기: 마케팅 카피 생성',
    status: 'success',
    timestamp: '2024-01-22 13:20',
    duration: '4.2초',
    tokensUsed: 890,
  },
  {
    id: '6',
    model: 'Llama-3',
    query: '질문 답변: 인공지능 윤리에 대한 설명',
    status: 'failed',
    timestamp: '2024-01-22 12:55',
    duration: '0.5초',
    tokensUsed: 0,
  },
  {
    id: '7',
    model: 'GPT-4',
    query: '프로그래밍 도움: Python 알고리즘 최적화',
    status: 'success',
    timestamp: '2024-01-22 12:30',
    duration: '2.9초',
    tokensUsed: 520,
  },
  {
    id: '8',
    model: 'Claude-3',
    query: '데이터 분석: 사용자 행동 패턴 분석',
    status: 'success',
    timestamp: '2024-01-22 11:45',
    duration: '3.5초',
    tokensUsed: 740,
  },
];

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterModel, setFilterModel] = useState<string>('all');

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesModel = filterModel === 'all' || item.model === filterModel;
    return matchesSearch && matchesStatus && matchesModel;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">완료</Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600/20 text-red-400 border-red-500/30">실패</Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">처리 중</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">사용 이력</h2>
          <p className="text-gray-400 mt-1">추론 실행 기록을 확인하고 관리하세요</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          내보내기
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">전체 추론</p>
              <p className="text-2xl font-bold">{mockHistory.length}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">성공</p>
              <p className="text-2xl font-bold text-green-400">
                {mockHistory.filter((h) => h.status === 'success').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">처리 중</p>
              <p className="text-2xl font-bold text-yellow-400">
                {mockHistory.filter((h) => h.status === 'processing').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">실패</p>
              <p className="text-2xl font-bold text-red-400">
                {mockHistory.filter((h) => h.status === 'failed').length}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="쿼리 검색..."
                className="pl-10 bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">모든 상태</SelectItem>
              <SelectItem value="success" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">완료</SelectItem>
              <SelectItem value="processing" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">처리 중</SelectItem>
              <SelectItem value="failed" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">실패</SelectItem>
            </SelectContent>
          </Select>

          {/* Model Filter */}
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="모델 필터" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">모든 모델</SelectItem>
              <SelectItem value="GPT-4" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">GPT-4</SelectItem>
              <SelectItem value="Claude-3" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">Claude-3</SelectItem>
              <SelectItem value="Llama-3" className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">Llama-3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* History List */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="mt-1">{getStatusIcon(item.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-medium">{item.query}</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{item.model}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.duration}</span>
                    </div>
                    {item.tokensUsed > 0 && (
                      <div>
                        <span>{item.tokensUsed.toLocaleString()} 토큰</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}