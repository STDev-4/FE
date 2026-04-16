# MyAsset — Figma Make 프롬프트 모음

> **컨셉:** 사용자의 실제 소비 데이터를 기반으로 통계적 분석과 행동심리학을 적용하여 소비 습관을 개선하는 게임화 플랫폼
> **레퍼런스 톤:** 말해보카 (깔끔한 카드 UI, 게이미피케이션 요소, 친근한 톤)
> **디자인 시스템:** 모바일 퍼스트 (390×844), max-width 480px, 라운드 카드 기반, 다크/라이트 대응

---

## Page 0-1 · 랜딩 / 웰컴

```
Design a mobile welcome/onboarding screen for a fintech gamification app called "MyAsset".

Layout:
- No GNB. Full-bleed gradient background (deep navy #0D1B2A → electric blue #1B4965).
- Center-aligned content, max-width 480px.

Top section:
- MyAsset logo (wordmark, white, bold) centered at top with subtle glow effect.
- Below logo: a friendly illustrated character (simple, geometric, 말해보카-style mascot) standing on a coin stack, waving. Approx 200×200px.

Middle section:
- Headline: "소비를 게임처럼, 똑똑하게" (Bold 28px, white)
- Subtext: "내 소비 데이터를 분석하고, 미션을 클리어하며 소비 습관을 레벨업하세요" (Regular 15px, white 70% opacity, max-width 300px, center)

Bottom section:
- Primary CTA button: "시작하기" — full-width, rounded 12px, bright accent green (#00D26A), bold white text 16px, height 52px.
- Below button: "이미 계정이 있어요" — text link, white 60% opacity, underline, 14px, center.
- Bottom safe area padding 34px.

Style: Clean, modern, 말해보카-inspired. Rounded shapes, friendly, trustworthy. No clutter.
```

---

## Page 0-2 · 회원가입 — 기본 정보

```
Design a mobile sign-up screen for "MyAsset" app.

Layout:
- Top: Back arrow (←) left-aligned. No other nav.
- Progress bar at top: step 1 of 3, thin line (3px), accent green fill 33%.

Title section:
- "계정을 만들어 볼까요?" (Bold 24px, dark gray #1A1A2E)
- Subtitle: "간단한 정보만 입력하면 끝!" (Regular 14px, gray #8E8E93)

Form fields — vertical stack, 16px gap between fields:
1. Email — text input, placeholder "이메일 주소", left icon: envelope
2. Password — password input, placeholder "비밀번호 (8자 이상)", left icon: lock, right icon: eye toggle
3. Password confirm — password input, placeholder "비밀번호 확인", left icon: lock
4. Nickname — text input, placeholder "닉네임", left icon: person
5. Birth date — date picker style input, placeholder "생년월일 (YYYY.MM.DD)", left icon: calendar

Input style: height 52px, rounded 12px, light gray border #E5E5EA, 16px horizontal padding, font 15px. Focus state: border accent blue #007AFF.

Bottom (sticky):
- "다음" button — full-width, rounded 12px, accent green #00D26A, bold white 16px, height 52px.
- Disabled state when fields are incomplete: gray #D1D1D6 background.

Style: White background, minimal, generous spacing. 말해보카-style clean form aesthetic.
```

---

## Page 0-3 · 금융기관 연결 — 은행

```
Design a mobile bank connection screen for "MyAsset" app.

Layout:
- Top: Back arrow (←) left-aligned.
- Progress bar: step 2 of 3, accent green fill 66%.

Title section:
- "주거래 은행을 연결해 주세요" (Bold 24px, dark gray #1A1A2E)
- Subtitle: "소비 데이터를 분석하기 위해 필요해요" (Regular 14px, gray #8E8E93)

Bank selection grid — 2 columns × 3 rows, 12px gap:
Each bank card:
- Rounded 16px card, white background, subtle shadow (0 2px 8px rgba(0,0,0,0.06))
- Height ~100px, center-aligned content
- Bank logo (48×48px circle placeholder) at top
- Bank name below logo (Medium 13px, dark gray)
- Selected state: accent green border 2px, light green background tint (#00D26A at 8%), small green checkmark badge top-right corner

Banks displayed:
Row 1: 국민은행 | 신한은행 | (empty or "+더보기")
Row 2: 우리은행 | 하나은행
Row 3: 농협은행 | 기업은행

Actually, make it a proper 2×3 grid:
Row 1: 국민은행, 신한은행
Row 2: 우리은행, 하나은행
Row 3: 농협은행, 기업은행

Below grid:
- "다른 은행 찾기" text link, gray, 14px, center.

Bottom (sticky):
- "연결하기" button — full-width, accent green, disabled until a bank is selected.

Style: Clean card grid, satisfying tap feedback implied by selected state. Friendly and non-intimidating for financial UX.
```

---

## Page 0-4 · 연결 완료 / 데이터 로딩

```
Design a mobile loading/success screen for "MyAsset" app after bank connection.

Layout:
- Full screen, center-aligned content, no nav bar.
- Progress bar: step 3 of 3, accent green fill 100%.

Center content — vertically centered:
- Animated illustration placeholder: the MyAsset mascot character looking through a magnifying glass at floating receipt/card icons. Approx 240×240px area.
- Below illustration:
  Phase 1 (Loading state):
    "소비 데이터를 불러오고 있어요..." (Bold 20px, dark gray)
    "AI가 지난 2개월간의 소비 패턴을 분석 중이에요" (Regular 14px, gray #8E8E93)
    Subtle loading spinner or progress dots animation placeholder below text.

  Phase 2 (Complete state):
    Large green checkmark circle (64px) with subtle bounce animation implied.
    "분석 완료!" (Bold 24px, dark gray)
    "당신의 소비 습관을 파악했어요" (Regular 14px, gray)

Bottom (appears on complete):
- "내 결과 확인하기" button — full-width, accent green, bold.

Style: Delightful, celebratory moment. Light confetti dots or sparkle elements around the checkmark. 말해보카-style completion screen energy.
```

---

## Page 0-L · 로그인

```
Design a mobile login screen for "MyAsset" app.

Layout:
- No GNB. White background.
- MyAsset logo (wordmark, accent color or dark) centered at top, with generous top margin (~80px from status bar).
- Content area: max-width 480px, center-aligned.

Title:
- "다시 오셨군요!" (Bold 24px, dark gray #1A1A2E), center-aligned.
- Small mascot character peeking from behind the title or waving, ~80×80px, adds warmth.

Form fields — vertical stack, 16px gap:
1. Email — text input, placeholder "이메일 주소", left icon: envelope
2. Password — password input, placeholder "비밀번호", left icon: lock, right icon: eye toggle

Input style: height 52px, rounded 12px, light gray border, 16px padding, font 15px.

Below inputs (8px gap):
- [로그인] — Primary button, full-width, accent green #00D26A, rounded 12px, bold white 16px, height 52px.

Below button — center-aligned, vertical stack, 12px gap:
- "비밀번호를 잊었어요" — text link, gray #8E8E93, 14px, center.
- "회원가입하기" — text link, accent blue #007AFF, 14px, center.

Style: Warm, simple, inviting. 말해보카 login screen energy — minimal fields, friendly tone, no friction.
```

---

## Page 1 · 홈 (메인 대시보드)

```
Design the main home screen for "MyAsset" gamification fintech app. This is the core screen users see daily. Style reference: 말해보카 home screen — card-based, gamified, friendly.

Layout:
- Top bar: Left — "MyAsset" small logo/wordmark. Right — notification bell icon + profile avatar circle (32px).
- Scrollable content below, vertical card stack.

─── Section 1: 티어 & 점수 카드 (Hero Card) ───
Large rounded card (16px radius), gradient background (navy to deep purple or brand gradient). Full-width with 16px horizontal margin.
Inside:
- Top-left: Tier badge — e.g., "🥈 실버" with metallic silver icon (or bronze/gold variants). Bold 14px, white.
- Top-right: "Lv. 12" in a small pill badge, white/translucent.
- Center: Large score number "71점" (Bold 48px, white). Below it: a thin horizontal progress bar (current tier progress, e.g., 71/80 to next tier), accent green fill on white track.
- Below progress bar: "골드까지 9점 남았어요!" (Medium 13px, white 80%)
- ⚠️ Urgency nudge banner at bottom of card, slight red/orange tint background:
  "⚡ 현재 71점 — 유지 턱걸이! 오늘 소비 하나로 강등됩니다" (Bold 13px, warm red/orange text)

─── Section 2: 오늘의 미션 ───
Section header: "오늘의 미션 🎯" (Bold 18px, dark gray). Right side: "모두 보기 >" link.

Mission cards — vertical stack, 12px gap. Each card:
- Rounded 14px, white bg, subtle shadow.
- Left: circular progress ring (40px) showing completion or icon (☕ 🛒 🍔).
- Center: Mission title "카페 안 가기" (Bold 15px) + subtitle "성공 시 +5점 · A등급 유지 가능" (Regular 12px, gray). Or danger variant: "❌ 실패 시 강등 위험" (12px, red #FF3B30)
- Right: Status badge — "진행중" (yellow pill) or "완료 ✓" (green pill)

Show 2-3 mission cards. One should have the urgency/danger styling.

─── Section 3: 내 캐릭터 미리보기 ───
Small horizontal card or banner:
- Left: Character avatar (64×64px), customizable look (hat, accessories shown).
- Center: "나의 절약 요정" (Bold 14px) + "오늘 미션 완료하면 새 모자 획득!" (Regular 12px, gray)
- Right: "꾸미기 >" text link, accent blue.

─── Bottom Tab Bar ───
5 tabs with icons + labels (10px, gray, active = accent green):
홈 (house icon, active) | 분석 (chart icon) | 미션 (target icon) | 캐릭터 (star/person icon) | 설정 (gear icon)

Style: Bright, gamified, slightly competitive tension. The urgency elements ("턱걸이", "강등") should feel emotionally activating but not stressful — playful danger, like 말해보카's streak warnings. Use warm accent colors for urgency (orange/red) against the clean white card layout.
```

---

## Page 2 · 소비패턴 분석

```
Design a "Spending Analysis" screen for "MyAsset" app. Accessed from bottom tab "분석".

Layout:
- Top bar: "소비 패턴 분석" title center (Bold 18px). Back arrow left if navigated from elsewhere.
- Bottom tab bar persistent.

─── Section 1: 월별 비교 토글 ───
Segmented control at top: "지지난달 (2월)" | "지난달 (3월)" | "이번달 (4월)" — pill-style toggle, selected = accent green fill + white text. Width: full, height 36px.

─── Section 2: 소비 요약 카드 ───
Large card, rounded 16px, white bg:
- Total spending: "₩1,284,500" (Bold 28px, dark)
- vs last month: "지난달 대비 -12.3% 📉" (Medium 14px, green = decreased, red = increased)
- Small sparkline chart placeholder showing daily spending trend for selected month.

─── Section 3: 카테고리 도넛 차트 ───
Card with:
- Donut/ring chart (200×200px center) showing spending by category.
- Legend below or beside:
  🍔 식비 35% — ₩449,575
  ☕ 카페 18% — ₩231,210
  🛒 쇼핑 22% — ₩282,590
  🚗 교통 12% — ₩154,140
  🎮 여가 8% — ₩102,760
  📦 기타 5% — ₩64,225
- Each category row is tappable (chevron right).

─── Section 4: AI 인사이트 카드 ───
Card with subtle gradient border (purple/blue glow effect) to indicate AI-generated:
- "🧠 AI 심리 분석" header (Bold 16px)
- Insight text example: "주말 오후에 카페 지출이 집중돼요. 스트레스 해소형 소비 패턴이 감지됩니다. 카페 대신 산책 미션을 시도해 보세요!"
- (Regular 14px, dark gray, line-height 1.6)
- "자세히 보기" text link at bottom of card.

─── Section 5: 월간 비교 바 차트 ───
Small horizontal bar chart comparing 지지난달 vs 지난달 spending by top 3 categories. Clean, minimal, labeled.

Style: Data-rich but not overwhelming. Cards break up complexity. AI insight card should feel special/premium — like getting a personal coach's note. 말해보카's clean data presentation style.
```

---

## Page 3 · 캐릭터 꾸미기

```
Design a "Character Customization" screen for "MyAsset" app. This is the reward/fun zone.

Layout:
- Top bar: "내 캐릭터" title center. Back arrow or close (X) top-left.
- Bottom tab bar persistent (캐릭터 tab active).

─── Top Section: Character Display ───
Large character display area (~280×280px), centered:
- Character standing on a small platform/pedestal.
- Soft radial gradient background behind character (light pastel).
- Character is a simple, cute, geometric mascot (think 말해보카 owl-level simplicity).
- Currently equipped items are visible on the character (hat, glasses, cape, etc).
- Subtle idle animation implied (floating, bouncing).

Below character:
- Character name: "절약 요정 '또리'" (Bold 16px, dark) — editable, pencil icon.
- Level/tier badge: "Lv.12 실버" pill.

─── Middle Section: 아이템 탭 ───
Horizontal tab bar: 모자 | 안경 | 의상 | 악세서리 | 배경
Selected tab: accent green underline, bold text.

─── Item Grid ───
3 columns grid, 12px gap. Each item cell:
- Square, rounded 12px, 1:1 ratio.
- Item thumbnail centered.
- Below thumbnail: item name (11px, gray).
- Locked items: grayed out with small 🔒 lock icon overlay + "미션 3회 클리어" requirement text (10px).
- Owned/unlocked items: full color, tappable.
- Currently equipped: green border + "착용중" small badge.
- NEW items (just earned): small red "NEW" dot badge top-right.

Show ~9 items (3×3). Mix of unlocked, locked, and equipped states.

─── Bottom ───
- "장착하기" button — full-width, accent green. Changes to "장착 완료 ✓" after tap.

Style: Playful, collectible energy. This should feel rewarding — like a gacha/collection screen. 말해보카's achievement/reward screen vibe. Bright, fun, makes users want to complete missions to unlock items.
```

---

## 🔄 시스템 플로우 요약 (참고용)

```
This is a system flow reference for the developer/designer. Not a screen prompt.

1. 회원가입 (0-1 → 0-2 → 0-3 → 0-4) → 홈 (Page 1)
2. 로그인 (0-L) → 홈 (Page 1)

3. 매월 초:
   - 소비 API 호출 → 지지난달 + 지난달 데이터 수집
   - OpenAI API로 심리학 기반 인사이트 + 미션 + 점수 범위 추출
   - 결과를 사용자 프로필에 저장

4. 일간 루프:
   - 홈 화면에 현재 점수 + 티어 + 오늘의 미션 표시
   - 미션 진행 상황 실시간 반영 (소비 API 감지)
   - 미션 클리어 → 점수 획득 + 캐릭터 아이템 보상
   - 미션 실패 → 점수 차감 + 강등 위험 경고

5. 행동심리학 메커니즘:
   - 손실 회피: "강등 위험" 경고로 현재 등급 유지 욕구 자극
   - 턱걸이 효과: 점수를 경계선 근처에 배치하여 긴장감 유지
   - 즉시 보상: 미션 클리어 즉시 캐릭터 아이템 해금
   - 소유 효과: 캐릭터 커스텀으로 플랫폼 애착 형성
```