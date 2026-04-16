import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12"
      style={{ background: "linear-gradient(180deg, #0D1B2A 0%, #1B4965 100%)" }}
    >
      <div className="flex flex-col items-center max-w-[480px] w-full flex-1 justify-center gap-8">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-[32px] tracking-tight"
          style={{ textShadow: "0 0 40px rgba(0,210,106,0.3)" }}
        >
          MyAsset
        </motion.h1>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-[200px] h-[200px] flex items-center justify-center"
        >
          <div className="relative">
            {/* Coin stack */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#00D26A] flex items-center justify-center text-[40px] mb-2 shadow-lg">
                🧚
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-14 h-3 rounded bg-yellow-400 shadow-sm" />
                <div className="w-16 h-3 rounded bg-yellow-500 shadow-sm" />
                <div className="w-18 h-3 rounded bg-yellow-600 shadow-sm" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-white text-[28px] mb-3">소비를 게임처럼, 똑똑하게</h2>
          <p className="text-white/70 text-[15px] max-w-[300px] mx-auto leading-relaxed">
            내 소비 데이터를 분석하고, 미션을 클리어하며 소비 습관을 레벨업하세요
          </p>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-[480px] pb-[34px] flex flex-col items-center gap-4"
      >
        <button
          onClick={() => navigate("/signup")}
          className="w-full h-[52px] bg-[#00D26A] text-white rounded-xl text-[16px] hover:bg-[#00b85c] transition-colors"
        >
          시작하기
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-white/60 text-[14px] underline underline-offset-2"
        >
          이미 계정이 있어요
        </button>
      </motion.div>
    </div>
  );
}
