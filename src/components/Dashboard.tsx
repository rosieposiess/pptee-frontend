import { Card } from './ui/card';
import { Activity, Database, Lock, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const modelUsageData = [
  { name: 'GPT-4', value: 45, color: '#3b82f6' },
  { name: 'Claude-3', value: 30, color: '#8b5cf6' },
  { name: 'Llama-3', value: 15, color: '#06b6d4' },
  { name: 'Gemini', value: 10, color: '#ec4899' },
];

const inferenceHistory = [
  { date: '01/16', count: 45 },
  { date: '01/17', count: 52 },
  { date: '01/18', count: 48 },
  { date: '01/19', count: 61 },
  { date: '01/20', count: 55 },
  { date: '01/21', count: 67 },
  { date: '01/22', count: 70 },
];

const recentActivities = [
  { id: 1, model: 'GPT-4', status: 'success', query: '데이터 분석 요청', time: '5분 전' },
  { id: 2, model: 'Claude-3', status: 'success', query: '코드 리뷰', time: '12분 전' },
  { id: 3, model: 'Llama-3', status: 'processing', query: '문서 요약', time: '15분 전' },
  { id: 4, model: 'GPT-4', status: 'success', query: '번역 작업', time: '23분 전' },
];

export function Dashboard() {
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Usage Distribution */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <h3 className="font-semibold mb-4">모델 사용 분포</h3>
          <div style={{ width: '100%', height: '256px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {modelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {modelUsageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Inference History */}
        <Card className="p-6 bg-[#151b2e] border-gray-800">
          <h3 className="font-semibold mb-4">추론 사용 추이</h3>
          <div style={{ width: '100%', height: '256px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inferenceHistory}>
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6 bg-[#151b2e] border-gray-800">
        <h3 className="font-semibold mb-4">최근 활동</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.query}</p>
                <p className="text-sm text-gray-400">
                  {activity.model} • {activity.time}
                </p>
              </div>
              <div>
                {activity.status === 'success' ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">완료</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span className="text-sm">처리 중</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}