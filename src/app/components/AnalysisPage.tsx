import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronUp, Zap, Sliders, Shield, Bell, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const categories = [
  { name: "카페", emoji: "☕", pct: 32.4, amount: 52700, color: "#FF6B6B" },
  { name: "배달·외식", emoji: "🍔", pct: 28.3, amount: 46000, color: "#A855F7" },
  { name: "온라인 쇼핑", emoji: "🛒", pct: 17.0, amount: 27600, color: "#3B82F6" },
  { name: "교통", emoji: "🚗", pct: 12.1, amount: 19700, color: "#F59E0B" },
  { name: "여가", emoji: "🎮", pct: 6.2, amount: 10100, color: "#10B981" },
  { name: "기타", emoji: "📦", pct: 4.0, amount: 6500, color: "#C7C7CC" },
];

const insights = [
  {
    id: "reward-bias",
    title: "즉시 보상 편향",
    description: "피곤할 때 작은 즐거움을 위해 소비가 늘어날 수 있어요. 힘든 날엔 미리 준비한 대체 활동으로 보상을 주세요.",
    Icon: Zap,
    color: "#EF4444",
    bgColor: "#FFF1F1",
    tips: [
      "퇴근 후 산책·스트레칭으로 스트레스 해소하기",
      "피곤한 날을 위한 저비용 취미 목록 미리 만들기",
      "소비 충동이 느껴지면 10분 타이머 맞추기",
    ],
  },
  {
    id: "default-effect",
    title: "기본값 효과",
    description: "결제가 너무 쉬우면 생각 없이 쓰게 될 수 있어요. 자주 사용하는 앱에서 간편결제를 해제해보세요.",
    Icon: Sliders,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    tips: [
      "배달 앱 간편결제 해제하기",
      "앱카드 자동 충전 금액 낮추기",
      "결제 전 비밀번호 입력 설정으로 변경하기",
    ],
  },
  {
    id: "friction",
    title: "마찰비용 늘리기",
    description: "소비 전 한 번 더 생각하는 시간을 만들어보세요. '장바구니에 담고 하루 기다리기' 규칙을 실천해보세요.",
    Icon: Shield,
    color: "#10B981",
    bgColor: "#ECFDF5",
    tips: [
      "장바구니에 담고 24시간 후 재확인하기",
      "스마트폰 홈 화면에서 쇼핑 앱 삭제하기",
      "월 2회 이상 구매는 메모장에 기록 후 결정하기",
    ],
  },
  {
    id: "trigger",
    title: "소비 트리거 인식",
    description: "밤 10시 이후 배달 주문이 많아요. SNS를 보다가 무의식적으로 소비하고 있진 않나요?",
    Icon: Bell,
    color: "#A855F7",
    bgColor: "#FAF5FF",
    tips: [
      "밤 10시 이후 앱 사용 제한 설정하기",
      "SNS 피드 스크롤 전 목표 확인하기",
      "충동구매 패턴 일기 쓰기",
    ],
  },
];

export default function AnalysisPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="pb-4 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E] text-center">분석</h2>
      </div>

      {/* ══ Section 1: 소비 패턴 ══ */}
      <div className="px-4 pt-6 pb-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-[#1A1A2E]">당신의 소비 패턴</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          {/* Donut chart */}
          <div className="flex justify-center mb-5">
            <div className="relative w-[160px] h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="pct"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {categories.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#8E8E93] font-medium">지난 달</span>
                <span className="text-[15px] font-bold text-[#1A1A2E] leading-tight mt-0.5">162,600원</span>
              </div>
            </div>
          </div>

          {/* Full category list */}
          <div className="border-t border-gray-50 pt-4 space-y-3">
            {categories.map((c, i) => (
              <button key={c.name} className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-[#C7C7CC] w-4 text-right shrink-0 font-medium">{i + 1}</span>
                  <span className="text-[14px] text-[#1A1A2E] font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini bar */}
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <span className="text-[12px] text-[#8E8E93] w-9 text-right">{c.pct}%</span>
                  <span className="text-[13px] font-semibold text-[#1A1A2E] w-20 text-right">
                    {c.amount.toLocaleString()}원
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Section 2: 인사이트 ══ */}
      <div className="px-4 pt-7 pb-1">
        <div className="mb-4">
          <h3 className="text-[17px] font-bold text-[#1A1A2E]">심리학 기반 행동과학 인사이트</h3>
          <p className="text-[13px] text-[#8E8E93] mt-1 font-medium">소비 심리를 이해하고 더 현명하게 관리하세요</p>
        </div>

        <div className="space-y-3">
          {insights.map(({ id, title, description, Icon, color, bgColor, tips }) => {
            const isOpen = expandedId === id;
            return (
              <div
                key={id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                style={{ border: isOpen ? `1.5px solid ${color}30` : "1.5px solid transparent" }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: bgColor }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#1A1A2E] mb-1">{title}</p>
                      <p className="text-[13px] text-[#3A3A3C] leading-relaxed">{description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isOpen ? null : id)}
                    className="flex items-center gap-1 mt-3 ml-[52px]"
                    style={{ color }}
                  >
                    <span className="text-[13px] font-bold">실천 방법 보기</span>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-4 pt-3 pb-4 pl-[64px] space-y-2"
                        style={{ backgroundColor: bgColor + "88", borderTop: `1px solid ${bgColor}` }}
                      >
                        {tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[12px] font-bold mt-0.5 shrink-0" style={{ color }}>✓</span>
                            <p className="text-[13px] text-[#3A3A3C] leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
