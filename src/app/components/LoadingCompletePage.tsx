import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import { codefApi, missionsApi } from "../lib/services";

type Phase = "syncing" | "missions" | "complete" | "failed";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export default function LoadingCompletePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("syncing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const minSyncingDisplay = Date.now() + 1000;

    const pollSync = async (): Promise<boolean> => {
      for (;;) {
        if (cancelled) return false;
        try {
          const { status } = await codefApi.syncStatus();
          if (cancelled) return false;
          console.log("[loading] sync status:", status);
          if (status === "COMPLETED") return true;
          if (status === "FAILED") {
            setError("소비 내역을 불러오지 못했어요. 다시 시도해 주세요.");
            setPhase("failed");
            return false;
          }
        } catch (e) {
          console.warn("[loading] sync poll error", e);
        }
        await sleep(1500);
      }
    };

    // Call /api/missions/recommended exactly once. BE synchronously generates
    // via GPT and returns the list. If the call fails or returns empty, we
    // proceed anyway — MissionsPage will handle the fallback on entry.
    const fetchRecommendations = async (): Promise<boolean> => {
      try {
        const list = await missionsApi.recommended();
        if (cancelled) return false;
        console.log(`[loading] recommended: ${list.length} items`);
        return list.length > 0;
      } catch (e) {
        console.warn("[loading] recommended error", e);
        return false;
      }
    };

    (async () => {
      // Phase 1: wait for CODEF sync to complete (polling).
      const synced = await pollSync();
      if (!synced || cancelled) return;

      // Ensure the spinner shows at least 1s so the UI doesn't flash.
      const leftover = minSyncingDisplay - Date.now();
      if (leftover > 0) await sleep(leftover);
      if (cancelled) return;

      // Phase 2: trigger GPT-generated mission recommendations (single call).
      setPhase("missions");
      const generated = await fetchRecommendations();
      if (cancelled) return;
      if (!generated) {
        // GPT call failed or returned empty. Proceed anyway — MissionsPage handles fallback.
        console.warn("[loading] recommendations not populated, continuing");
      }

      // Phase 3: show the success screen for a moment, then move on.
      setPhase("complete");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== "complete") return;
    const timer = setTimeout(() => navigate("/app"), 3000);
    return () => clearTimeout(timer);
  }, [phase, navigate]);

  const isLoadingPhase = phase === "syncing" || phase === "missions";

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === "failed" ? (
            <motion.div
              key="failed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="text-[20px] text-[#1A1A2E] mb-2">문제가 생겼어요</h2>
              <p className="text-[14px] text-[#8E8E93] mb-6">{error}</p>
              <button
                onClick={() => navigate("/bank")}
                className="h-[48px] px-6 rounded-xl bg-[#00D26A] text-white text-[15px]"
              >
                다시 시도하기
              </button>
            </motion.div>
          ) : isLoadingPhase ? (
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
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
              {phase === "syncing" ? (
                <>
                  <h2 className="text-[20px] text-[#1A1A2E] mb-2">소비 내역을 불러오고 있어요...</h2>
                  <p className="text-[14px] text-[#8E8E93]">AI가 소비 패턴을 분석 중이에요</p>
                </>
              ) : (
                <>
                  <h2 className="text-[20px] text-[#1A1A2E] mb-2">맞춤 미션을 준비하고 있어요...</h2>
                  <p className="text-[14px] text-[#8E8E93]">당신에게 꼭 맞는 절약 미션을 만드는 중이에요</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
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
              <h2 className="text-[24px] text-[#1A1A2E] mb-2">준비 완료!</h2>
              <p className="text-[14px] text-[#8E8E93]">맞춤 미션이 준비됐어요</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
