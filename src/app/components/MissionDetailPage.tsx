import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Brain, Calculator } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface MissionDetail {
  id: string;
  title: string;
  emoji: string;
  description: string;
  whyTitle: string;
  whyLines: string[];
  mathTitle: string;
  mathLines: string[];
}

const missionData: Record<string, MissionDetail> = {
  s1: {
    id: "s1",
    title: "오늘 카페 안 가기",
    emoji: "☕",
    description: "하루 동안 카페 지출 0원 달성하기. 집에서 커피 내려 마시면 승리!",
    whyTitle: "행동학에서는..",
    whyLines: [
      "반복적인 소액 소비는 체감이 적어 통제하기 어렵습니다.",
      "이 미션은 자동적 소비 반응을 줄이고 충동성을 낮추는 데 도움을 줍니다.",
      "행동경제학에서 '현상 유지 편향'을 깨는 첫 걸음입니다.",
    ],
    mathTitle: "더 자세히 알아볼까요?",
    mathLines: [
      "카페 소비가 줄어들면 특정 항목에 집중된 지출 비율이 낮아집니다.",
      "즉, 소비 편중도가 완화됩니다.",
      "현재 카페 비중 32.4% → 목표 25% 이하로 정상화.",
    ],
  },
  s2: {
    id: "s2",
    title: "배달 1회 줄이기",
    emoji: "🍕",
    description: "오늘 배달 앱 주문을 어제보다 1회 줄이기. 직접 해먹으면 보너스!",
    whyTitle: "행동학에서는..",
    whyLines: [
      "배달 앱은 '선택 과부하'를 유발하여 무의식적 주문을 촉진합니다.",
      "한 번의 절제가 자기 효능감을 높이고, 다음 절제를 쉽게 만듭니다.",
      "심리학에서 말하는 '작은 승리(small wins)' 효과입니다.",
    ],
    mathTitle: "더 자세히 알아볼까요?",
    mathLines: [
      "배달 1회 평균 비용 15,200원 기준, 월 30회 → 29회로 줄이면",
      "월 15,200원, 연 182,400원 절약 가능.",
      "배달·외식 비중 28.3% → 약 26.5%로 감소 효과.",
    ],
  },
  b1: {
    id: "b1",
    title: "교통비 절약",
    emoji: "🚶",
    description: "2정거장 이내 거리는 걸어서 이동하기. 건강도 챙기고 돈도 아끼자!",
    whyTitle: "행동학에서는..",
    whyLines: [
      "짧은 거리 택시/버스 이용은 '편의 중독' 패턴의 시작입니다.",
      "걷기는 도파민 분비를 촉진하여 충동 소비 욕구를 줄여줍니다.",
      "신체 활동이 전두엽 기능을 활성화시켜 합리적 판단을 돕습니다.",
    ],
    mathTitle: "더 자세히 알아볼까요?",
    mathLines: [
      "2정거장 버스비 1,400원 × 주 5회 = 주 7,000원 절약.",
      "월 28,000원, 연 336,000원의 숨은 절약 효과.",
      "교통 비중 12.1% → 약 10.4%로 감소.",
    ],
  },
  b2: {
    id: "b2",
    title: "충동구매 방지",
    emoji: "🛡️",
    description: "장바구니에 담은 상품, 24시간 후에 다시 확인하기. 진짜 필요한 것만 남긴다!",
    whyTitle: "행동학에서는..",
    whyLines: [
      "충동구매의 88%는 24시간 후 후회한다는 연구 결과가 있습니다.",
      "'쿨링 오프' 시간을 두면 감정적 구매가 이성적 판단으로 전환됩니다.",
      "이 미션은 '지연 할인(delay discounting)' 능력을 훈련합니다.",
    ],
    mathTitle: "더 자세히 알아볼까요?",
    mathLines: [
      "충동구매 평균 단가 32,000원, 월 3회 발생 시 96,000원.",
      "24시간 지연 규칙 적용 시 약 70% 취소 → 월 67,200원 절약.",
      "온라인 쇼핑 비중 17.0% → 약 12.8%로 대폭 감소.",
    ],
  },
};

export default function MissionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const mission = missionData[id || "s1"] || missionData["s1"];

  return (
    <div className="pb-36 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 rounded-xl active:bg-gray-50">
          <ArrowLeft size={22} className="text-[#1A1A2E]" />
        </button>
        <h2 className="flex-1 text-center text-[18px] font-semibold text-[#1A1A2E]">미션 상세</h2>
        <div className="w-[30px]" />
      </div>

      {/* Mission Hero */}
      <div
        className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(249,115,22,0.3)]"
        style={{ background: "linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)" }}
      >
        <div className="p-6 flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8" />


          <h3 className="text-[22px] font-bold text-white mb-2 relative z-10">{mission.title}</h3>
          <p className="text-[14px] text-white/80 leading-relaxed relative z-10">{mission.description}</p>

          {/* Reward badge */}
          <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 relative z-10">
            <span className="text-[13px] font-bold text-white">+5P 달성 보상</span>
          </div>
        </div>
      </div>

      {/* Psychology Section */}
      <div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
            <Brain size={16} className="text-[#8B5CF6]" />
          </div>
          <h4 className="text-[15px] font-bold text-[#1A1A2E]">{mission.whyTitle}</h4>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          {mission.whyLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-3 p-3.5 bg-[#F5F3FF] rounded-xl"
            >
              <span className="text-[#8B5CF6] font-bold text-[13px] shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-[13px] text-[#4C1D95] leading-relaxed">{line}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Math Section */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Calculator size={16} className="text-[#3B82F6]" />
          </div>
          <h4 className="text-[15px] font-bold text-[#1A1A2E]">{mission.mathTitle}</h4>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          {mission.mathLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-start gap-3 p-3.5 bg-[#EFF6FF] rounded-xl"
            >
              <span className="text-[#3B82F6] font-bold text-[13px] shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-[13px] text-[#1E40AF] leading-relaxed">{line}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-6 pt-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-20">
        {started ? (
          <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC]">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path d="M2 8L7.5 13.5L18 2" stroke="#00D26A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[15px] font-bold text-[#16A34A]">미션 진행 중!</span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setStarted(true)}
            className="w-full py-4 rounded-2xl text-white text-[16px] font-bold shadow-[0_4px_16px_rgba(0,210,106,0.35)]"
            style={{ background: "linear-gradient(135deg, #00D26A, #00A854)" }}
          >
            미션 시작하기
          </motion.button>
        )}
      </div>
    </div>
  );
}
