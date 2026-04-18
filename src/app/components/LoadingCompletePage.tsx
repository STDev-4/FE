import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Search } from "lucide-react";

export default function LoadingCompletePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"loading" | "complete">("loading");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("complete"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      <div className="px-6 mt-6">
        <div className="h-[3px] bg-gray-200 rounded-full">
          <div className="h-full w-full bg-[#00D26A] rounded-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-[200px] h-[200px] flex items-center justify-center mb-8">
                <div className="relative w-16 h-16">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[10px] h-[10px] rounded-full bg-[#00D26A]"
                      style={{
                        left: `calc(50% + ${Math.cos((i * Math.PI * 2) / 8) * 24}px)`,
                        top: `calc(50% + ${Math.sin((i * Math.PI * 2) / 8) * 24}px)`,
                        transform: "translate(-50%, -50%)"
                      }}
                      animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
              <h2 className="text-[20px] text-[#1A1A2E] mb-2">소비 데이터를 불러오고 있어요...</h2>
              <p className="text-[14px] text-[#8E8E93]">AI가 지난 2개월간의 소비 패턴을 분석 중이에요</p>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Sparkles */}
              <div className="relative mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-16 h-16 rounded-full bg-[#00D26A] flex items-center justify-center"
                >
                  <CheckCircle size={36} color="white" />
                </motion.div>
              </div>
              <h2 className="text-[24px] text-[#1A1A2E] mb-2">분석 완료!</h2>
              <p className="text-[14px] text-[#8E8E93]">당신의 소비 습관을 파악했어요</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === "complete" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-8"
        >
          <button
            onClick={() => navigate("/app")}
            className="w-full h-[52px] bg-[#00D26A] text-white rounded-xl text-[16px] hover:bg-[#00b85c] transition-colors"
          >
            내 결과 확인하기
          </button>
        </motion.div>
      )}
    </div>
  );
}
