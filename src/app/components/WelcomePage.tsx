import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 슬라이드 데이터 - 첨부해주신 이미지들을 사용하도록 설정
const SLIDES = [
  {
    id: 1,
    title: "나의 소비 습관 분석",
    description: "나의 소비 패턴을\n심리적으로 분석해요.",
    icon: (
      <div className="w-56 h-64 flex items-center justify-center">
        {/* 블렌드 모드를 적용하여 이미지의 흰 배경이 연두색 배경에 자연스럽게 묻히도록 합성 */}
        <img src="/images/welcome-asset.png" alt="자산 분석" className="w-full h-full object-contain mix-blend-multiply" />
      </div>
    ),
  },
  {
    id: 2,
    title: "성취감 넘치는 데일리 미션",
    description: "매일 주어지는 퀘스트를 달성하고\n보상을 획득하세요.",
    icon: (
      <div className="w-64 h-64 flex items-center justify-center drop-shadow-xl hover:scale-105 transition-transform">
        <img src="/images/welcome-mission.png" alt="미션" className="w-full h-full object-contain scale-110" />
      </div>
    ),
  },
  {
    id: 3,
    title: "함께 꾸준히 성장",
    description: "티어를 올리며\n건강한 소비 습관을 만들어요.",
    icon: (
      <div className="w-64 h-64 flex items-center justify-center drop-shadow-xl hover:scale-105 transition-transform">
        <img src="/images/welcome-trophy.png" alt="트로피" className="w-full h-full object-contain scale-110" />
      </div>
    ),
  },
  {
    id: 4,
    title: "나만의 귀여운 캐릭터",
    description: "나만의 특별한 캐릭터와 함께 성장해 보세요.",
    icon: (
      <div className="w-48 h-64 flex items-center justify-center hover:scale-105 transition-transform">
        <img src="/images/welcome-character.png" alt="캐릭터" className="w-full h-full object-contain mix-blend-multiply" />
      </div>
    ),
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 40 : -40,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      {/* 화면 밖은 회색/흰색 톤, 화면 안은 느낌있는 귀여운 연두색 적용 */}
      <div className="flex flex-col items-center max-w-[480px] w-full min-h-screen justify-between px-6 py-12 bg-[#E8F8EE] shadow-sm relative overflow-hidden">

        <div className="flex flex-col items-center w-full flex-1 justify-center relative">
          <div className="flex gap-2 mb-10 h-6 items-center">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-[#00D26A]" : "w-2 bg-[#00D26A]/20"
                  }`}
              />
            ))}
          </div>

          <div className="w-full relative h-[380px] flex items-center justify-center">
            <button
              onClick={handlePrev}
              className="absolute -left-2 z-10 p-2 text-black/20 hover:text-[#00D26A] transition-colors"
            >
              <ChevronLeft size={36} strokeWidth={1.5} />
            </button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute w-full flex flex-col items-center text-center px-12"
              >
                <div className="flex items-center justify-center mb-2">
                  {SLIDES[currentIndex].icon}
                </div>

                <h2 className="text-[#101F18] text-[24px] font-bold mb-3 tracking-tight">
                  {SLIDES[currentIndex].title}
                </h2>
                <p className="text-[#4F6358] text-[15px] whitespace-pre-line leading-relaxed h-[45px]">
                  {SLIDES[currentIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleNext}
              className="absolute -right-2 z-10 p-2 text-black/20 hover:text-[#00D26A] transition-colors"
            >
              <ChevronRight size={36} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full pb-0 flex flex-col gap-3"
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full h-[56px] bg-[#00D26A] text-white font-extrabold rounded-2xl text-[16px] shadow-[0_4px_24px_0_rgba(0,210,106,0.25)] hover:bg-[#00c262] hover:scale-[0.98] transition-all"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full h-[56px] bg-white border-2 border-[#00D26A]/10 text-[#00D26A] font-bold rounded-2xl text-[16px] hover:bg-gray-50 hover:scale-[0.98] transition-all"
          >
            회원가입
          </button>
        </motion.div>
      </div>
    </div>
  );
}
