import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronUp, Zap, Sliders, Shield, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analysisApi } from "../lib/services";
import type { AnalysisInsightItemResponse, SpendResponse } from "../lib/types";
import { formatKrw, categoryEmoji } from "../lib/format";

const CATEGORY_COLORS = [
  "#FF6B6B",
  "#A855F7",
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#14B8A6",
  "#C7C7CC",
];

const COLOR_MAP: Record<string, { color: string; bgColor: string }> = {
  PRIMARY: { color: "#3B82F6", bgColor: "#EFF6FF" },
  POSITIVE: { color: "#10B981", bgColor: "#ECFDF5" },
  WARNING: { color: "#EF4444", bgColor: "#FFF1F1" },
  NEUTRAL: { color: "#A855F7", bgColor: "#FAF5FF" },
};
const INSIGHT_ICONS = [Zap, Sliders, Shield, Bell];

export default function AnalysisPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [spend, setSpend] = useState<SpendResponse | null>(null);
  const [insights, setInsights] = useState<AnalysisInsightItemResponse[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const results = await Promise.allSettled([analysisApi.spending(), analysisApi.insights()]);
      if (cancelled) return;
      if (results[0].status === "fulfilled") setSpend(results[0].value);
      if (results[1].status === "fulfilled") setInsights(results[1].value);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (!spend) return [];
    const total = spend.totalAmount || spend.categories.reduce((a, c) => a + c.amount, 0);
    return [...spend.categories]
      .sort((a, b) => b.amount - a.amount)
      .map((c, i) => ({
        name: c.category,
        emoji: categoryEmoji(c.category),
        amount: c.amount,
        pct: total > 0 ? Number(((c.amount / total) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }));
  }, [spend]);

  return (
    <div className="pb-4 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E] text-center">분석</h2>
      </div>

      {/* Section 1: 소비 패턴 */}
      <div className="px-4 pt-6 pb-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-[#1A1A2E]">당신의 소비 패턴</h3>
          {spend?.yearMonth && (
            <span className="text-[12px] text-[#8E8E93]">{spend.yearMonth}</span>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          {loading && (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">불러오는 중...</div>
          )}
          {!loading && categories.length === 0 && (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">집계된 소비 내역이 없어요</div>
          )}
          {!loading && categories.length > 0 && (
            <>
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
                    <span className="text-[15px] font-bold text-[#1A1A2E] leading-tight mt-0.5">
                      {formatKrw(spend?.totalAmount)}
                    </span>
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
            </>
          )}
        </div>
      </div>

      {/* Section 2: 인사이트 */}
      <div className="px-4 pt-7 pb-1">
        <div className="mb-4">
          <h3 className="text-[17px] font-bold text-[#1A1A2E]">심리학 기반 행동과학 인사이트</h3>
          <p className="text-[13px] text-[#8E8E93] mt-1 font-medium">소비 심리를 이해하고 더 현명하게 관리하세요</p>
        </div>

        <div className="space-y-3">
          {loading && (
            <div className="py-6 text-center text-[13px] text-[#8E8E93]">인사이트 불러오는 중...</div>
          )}
          {!loading && (insights?.length ?? 0) === 0 && (
            <div className="py-6 text-center text-[13px] text-[#8E8E93]">표시할 인사이트가 없어요</div>
          )}
          {(insights ?? []).map((item, idx) => {
            const id = String(item.insightId);
            const isOpen = expandedId === id;
            const palette = COLOR_MAP[item.colorType] || COLOR_MAP.PRIMARY;
            const Icon = INSIGHT_ICONS[idx % INSIGHT_ICONS.length];
            return (
              <div
                key={id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                style={{ border: isOpen ? `1.5px solid ${palette.color}30` : "1.5px solid transparent" }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: palette.bgColor }}
                    >
                      <Icon size={18} style={{ color: palette.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#1A1A2E] mb-1">{item.title}</p>
                      <p className="text-[13px] text-[#3A3A3C] leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {item.actionTips?.length > 0 && (
                    <button
                      onClick={() => setExpandedId(isOpen ? null : id)}
                      className="flex items-center gap-1 mt-3 ml-[52px]"
                      style={{ color: palette.color }}
                    >
                      <span className="text-[13px] font-bold">실천 방법 보기</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
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
                        style={{ backgroundColor: palette.bgColor + "88", borderTop: `1px solid ${palette.bgColor}` }}
                      >
                        {item.actionTips.map((tip, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span className="text-[12px] font-bold mt-0.5 shrink-0" style={{ color: palette.color }}>
                              ✓
                            </span>
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
