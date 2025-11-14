# Tasks: Virtual Coach App UI Redesign with Matcha Green Theme

**Feature**: 002-ui-redesign | **Branch**: 002-ui-redesign | **Date**: 2025-11-15

**Input**: Design documents from `/specs/002-ui-redesign/`
- spec.md (4 user stories: P1-P4)
- plan.md (React 19.2.0 + Mantine v7 + Tailwind + Framer Motion)
- data-model.md (Design Token schema, Component Variants)
- contracts/ (design-system-api.md, component-variants.md)
- research.md (Technical decisions)
- quickstart.md (Setup guide)

**Tests**: Component tests with React Testing Library, E2E visual regression with Playwright

**Organization**: Tasks grouped by user story for independent implementation and testing

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization, dependency installation, design system foundation

- [X] T001 Install Mantine dependencies: `npm install @mantine/core@^7.0.0 @mantine/hooks@^7.0.0 @mantine/form@^7.0.0` in virtual_coach_app_frontend/
- [X] T002 Install animation dependencies: `npm install framer-motion@^11.0.0 @tabler/icons-react@^3.0.0` in virtual_coach_app_frontend/
- [X] T003 Install testing dependencies: `npm install --save-dev @playwright/test@^1.40.0 @testing-library/jest-dom@^6.0.0` in virtual_coach_app_frontend/
- [X] T004 Create theme directory structure: `virtual_coach_app_frontend/src/theme/` with subdirectories
- [X] T005 Create icons directory: `virtual_coach_app_frontend/public/icons/` for SVG assets
- [X] T006 [P] Update .gitignore with `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`, `coverage/` (already configured)
- [X] T007 [P] Update .eslintignore with `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js` (already configured)

---

## Phase 2: Foundational (Design System Core) ✅ COMPLETE

**Purpose**: Design Token definitions, Mantine theme setup - BLOCKS all user story implementations

**⚠️ CRITICAL**: No UI component work can begin until this phase is complete

- [X] T008 Create color palette definition in virtual_coach_app_frontend/src/theme/colors.ts with matcha green 10-shade system
- [X] T009 [P] Create typography definitions in virtual_coach_app_frontend/src/theme/typography.ts (fontFamily, fontSize, fontWeight, lineHeight)
- [X] T010 [P] Create spacing scale in virtual_coach_app_frontend/src/theme/spacing.ts (4px base unit, 0-24 scale)
- [X] T011 [P] Create border radius standards in virtual_coach_app_frontend/src/theme/borderRadius.ts (none, xs, sm, md, lg, xl, full)
- [X] T012 [P] Create shadow system in virtual_coach_app_frontend/src/theme/shadows.ts (xs, sm, md, lg, xl with green tint)
- [X] T013 [P] Create animation definitions in virtual_coach_app_frontend/src/theme/animations.ts (duration, easing curves)
- [X] T014 Create main Mantine theme configuration in virtual_coach_app_frontend/src/theme/mantineTheme.ts integrating all design tokens
- [X] T015 Update Tailwind config in virtual_coach_app_frontend/tailwind.config.js to share design tokens (colors, spacing, radius, shadows)
- [X] T016 Wrap App with MantineProvider in virtual_coach_app_frontend/src/main.tsx and import `@mantine/core/styles.css`
- [X] T017 [P] Create CSS variables in virtual_coach_app_frontend/src/styles/variables.css for design tokens
- [X] T018 Update global styles in virtual_coach_app_frontend/src/index.css with matcha green theme base styles

**✅ Checkpoint**: Design system ready - all tokens defined, Mantine configured, can now build UI components

---

## Phase 3: User Story 1 - 視覺煥然一新的偏好設定體驗 (Priority: P1) ✅ COMPLETE 🎯 MVP

**Goal**: 重新設計偏好設定頁面,採用淡抹綠色卡片式佈局、視覺圖示、流暢互動動畫

**Independent Test**: 開啟應用 → 檢視主畫面配色(淡抹綠) → 驗證所有偏好選項有清晰視覺(圖示、卡片) → 測試選擇回饋 → 確認整體和諧易操作

### Component Tests for User Story 1

- [X] T019 [P] [US1] Create PreferenceCard component test in virtual_coach_app_frontend/tests/unit/PreferenceCard.test.tsx (renders, displays badges, handles click, applies hover styles)
- [X] T020 [P] [US1] Create OptionButton component test in virtual_coach_app_frontend/tests/unit/OptionButton.test.tsx (renders icon+text, selection state, keyboard navigation)
- [X] T021 [P] [US1] Create DurationSlider component test in virtual_coach_app_frontend/tests/unit/DurationSlider.test.tsx (value updates, green track, accessible)

### Implementation for User Story 1

- [X] T022 [P] [US1] Create PreferenceCard component in virtual_coach_app_frontend/src/components/preferences/PreferenceCard.tsx (white/light green background, matcha border, hover animation with Framer Motion)
- [X] T023 [P] [US1] Create OptionButton component in virtual_coach_app_frontend/src/components/preferences/OptionButton.tsx (icon+label, matcha outline/filled variants, scale hover effect)
- [X] T024 [P] [US1] Create DurationSlider component in virtual_coach_app_frontend/src/components/preferences/DurationSlider.tsx (green track, matcha handle, real-time value display)
- [X] T025 [US1] Redesign PreferenceForm in virtual_coach_app_frontend/src/components/preferences/PreferenceForm.tsx (integrate PreferenceCard, OptionButton, DurationSlider, responsive grid layout)
- [X] T026 [US1] Add workout goal icons in virtual_coach_app_frontend/public/icons/ (goal-muscle.svg, goal-fat-loss.svg, goal-tone.svg with green fill)
- [X] T027 [US1] Add equipment icons in virtual_coach_app_frontend/public/icons/ (equipment-dumbbell.svg, equipment-none.svg with matcha color)
- [X] T028 [US1] Update "生成課表" button in PreferenceForm with matcha green filled variant, white text, loading state with green spinner
- [X] T029 [US1] Add form validation error states with WCAG AA compliant red (#EF5350) and accessible error messages

**✅ Checkpoint**: User Story 1 完成 - 偏好設定頁面視覺全面更新,配色和諧,互動流暢

---

## Phase 4: User Story 2 - 清晰美觀的訓練課表展示 (Priority: P2)

**Goal**: 重新設計課表頁面,採用卡片列表佈局、清晰資訊層次、綠色系標籤和徽章

**Independent Test**: 生成 5-8 運動課表 → 驗證配色一致 → 檢查卡片資訊排版清晰 → 測試展開/收合 → 確認操作按鈕突出易點

### Component Tests for User Story 2

- [X] T030 [P] [US2] Create WorkoutCard component test in virtual_coach_app_frontend/tests/unit/WorkoutCard.test.tsx (displays exercise info, badges render, expand/collapse animation, border color changes)
- [X] T031 [P] [US2] Create WorkoutSummary component test in virtual_coach_app_frontend/tests/unit/WorkoutSummary.test.tsx (total duration badge, exercise count badge, difficulty badge)
- [X] T032 [P] [US2] Create ExerciseCard component test in virtual_coach_app_frontend/tests/unit/ExerciseCard.test.tsx (equipment/duration/difficulty labels, thumbnail display, expand state)

### Implementation for User Story 2

- [X] T033 [P] [US2] Create WorkoutSummary component in virtual_coach_app_frontend/src/components/workout/WorkoutSummary.tsx (horizontal badge group: clock icon+total time, number icon+count, star icon+difficulty, light green background)
- [X] T034 [US2] Redesign WorkoutCard component in virtual_coach_app_frontend/src/components/workout/WorkoutCard.tsx (white background, matcha border, xs shadow, md radius, badges for equipment/duration/difficulty)
- [X] T035 [US2] Redesign ExerciseCard component in virtual_coach_app_frontend/src/components/workout/ExerciseCard.tsx (expandable with Framer Motion layout animation, light green expanded section, enhanced shadow on expand)
- [X] T036 [US2] Update WorkoutList component in virtual_coach_app_frontend/src/components/workout/WorkoutList.tsx (integrate WorkoutSummary at top, vertical scrollable card list, 12-16px card spacing)
- [X] T037 [US2] Create Badge variants in WorkoutCard (equipment: filled matcha, duration: filled gray, difficulty: dot variant with 1-3 green dots)
- [X] T038 [US2] Add operation button section to WorkoutList (fixed position: "開始訓練" filled matcha full-width, "重新生成" outline matcha, 12-16px gap)
- [X] T039 [US2] Implement confirmation dialog for "重新生成" with green-themed modal (light green translucent overlay, white content card, matcha confirm button, gray outline cancel)

**Checkpoint**: User Story 2 完成 - 課表頁面清晰美觀,資訊層次分明,操作按鈕突出

---

## Phase 5: User Story 3 - 沉浸式綠色系訓練播放器 (Priority: P3)

**Goal**: 重新設計全螢幕播放器,深綠漸層背景、圓形倒數計時器、透明控制列、專注訓練氛圍

**Independent Test**: 開始訓練進入播放器 → 驗證全螢幕+深綠漸層 → 檢查圓形計時器視覺和動畫 → 測試控制按鈕(暫停/跳過/退出)清晰度和互動 → 確認運動切換過渡流暢

### Component Tests for User Story 3

- [X] T040 [P] [US3] Create Timer component test in virtual_coach_app_frontend/tests/unit/Timer.test.tsx (circular progress ring, countdown updates, green stroke, smooth animation)
- [X] T041 [P] [US3] Create PlayerControls component test in virtual_coach_app_frontend/tests/unit/PlayerControls.test.tsx (pause/resume/skip/exit buttons, auto-hide after 3s, tooltip display)
- [X] T042 [P] [US3] Create CompletionScreen component test in virtual_coach_app_frontend/tests/unit/CompletionScreen.test.tsx (celebration green gradient, completion icon animation, summary card, action buttons)

### Implementation for User Story 3

- [X] T043 [P] [US3] Redesign Timer component in virtual_coach_app_frontend/src/components/player/Timer.tsx (circular progress ring with SVG, matcha.400 stroke, remaining seconds in center, 200-300px diameter desktop, 150-200px mobile, CSS animation for smooth countdown)
- [X] T044 [US3] Redesign PlayerControls component in virtual_coach_app_frontend/src/components/player/PlayerControls.tsx (three circular buttons: pause/skip/exit, semi-transparent green background, white icons, 56-64px diameter, auto-hide after 3s with fade animation)
- [X] T045 [US3] Redesign TrainingPlayer component in virtual_coach_app_frontend/src/components/player/TrainingPlayer.tsx (fullscreen with deep green to black gradient background #2E7D32 → #1B5E20, integrate Timer and PlayerControls, exercise info overlay with semi-transparent light green background)
- [X] T046 [US3] Update VideoPlayer component in virtual_coach_app_frontend/src/components/player/VideoPlayer.tsx (enhanced info overlay: top exercise name, bottom instructions with rgba(200,230,201,0.3) background, progress label in top-left corner)
- [X] T047 [US3] Redesign CompletionScreen component in virtual_coach_app_frontend/src/components/player/CompletionScreen.tsx (bright green gradient #81C784 → #66BB6A, large checkmark icon 128-160px with bounce animation, white summary card with green accent, "返回主畫面" and "分享成績" buttons)
- [X] T048 [US3] Implement exercise transition animation in TrainingPlayer (previous fade-out 0.5s → transition screen with green background and "下一個運動" text 2s → new fade-in 0.5s)
- [X] T049 [US3] Add keyboard shortcuts to PlayerControls (Space: pause/resume, Right Arrow: skip, ESC: exit) with focus management

**Checkpoint**: User Story 3 完成 - 訓練播放器沉浸式體驗,深綠配色,計時器清晰,控制直觀

---

## Phase 6: User Story 4 - 響應式設計與多裝置適配 (Priority: P4)

**Goal**: 確保所有介面在手機/平板/桌面三種裝置上都能自動調整佈局、字體、互動元素,保持綠色主題一致

**Independent Test**: 使用 DevTools 切換裝置 → 手機(320-428px)測試所有頁面 → 平板(768-1024px)測試 → 桌面(1280px+)測試 → 驗證佈局適配、文字可讀、按鈕可點、配色一致

### Visual Regression Tests for User Story 4

- [X] T050 [P] [US4] Create Playwright visual test for PreferenceForm in virtual_coach_app_frontend/tests/visual/preference-form.spec.ts (desktop/tablet/mobile snapshots, hover states)
- [X] T051 [P] [US4] Create Playwright visual test for WorkoutList in virtual_coach_app_frontend/tests/visual/workout-list.spec.ts (desktop/tablet/mobile snapshots, card expand states)
- [X] T052 [P] [US4] Create Playwright visual test for TrainingPlayer in virtual_coach_app_frontend/tests/visual/training-player.spec.ts (desktop/tablet/mobile snapshots, fullscreen layout)

### Implementation for User Story 4

- [X] T053 [P] [US4] Create ResponsiveContainer layout component in virtual_coach_app_frontend/src/components/layout/ResponsiveContainer.tsx (max-width 1200-1440px desktop, centered, left-right padding based on breakpoint)
- [X] T054 [P] [US4] Create AppShell layout component in virtual_coach_app_frontend/src/components/layout/AppShell.tsx (main app container with responsive padding and margin)
- [X] T055 [US4] Add mobile responsive styles to PreferenceForm (single column layout < 768px, 16-24px margins, full-width cards, 44px+ button height, 16px+ font size)
- [X] T056 [US4] Add tablet responsive styles to PreferenceForm (2-column grid 768-1024px, 24px margins, increased card spacing)
- [X] T057 [US4] Add desktop responsive styles to PreferenceForm (3-column grid ≥1024px, 32px spacing, centered max-width 1440px, 48px margins)
- [X] T058 [US4] Add mobile responsive styles to WorkoutList (single column, full-width cards, vertical info layout, bottom fixed action buttons)
- [X] T059 [US4] Add desktop responsive styles to WorkoutList (optional two-column: left list + right detail, or maintain single column with wider cards)
- [X] T060 [US4] Add mobile responsive styles to TrainingPlayer (portrait: vertical layout, landscape: horizontal layout with adjusted timer size 150-200px)
- [X] T061 [US4] Add desktop responsive styles to TrainingPlayer (optional: left video + right info sidebar, or maintain centered layout with 200-300px timer)
- [X] T062 [US4] Implement typography scaling across breakpoints (mobile: h1 32px, tablet: h1 40px, desktop: h1 48px, body 16-18px responsive)
- [X] T063 [US4] Add touch-friendly interaction zones for mobile (all buttons ≥44x44px, increased tap target padding, swipe gestures for card expand/collapse)

**Checkpoint**: User Story 4 完成 - 所有介面響應式完美適配三種裝置,綠色主題一致

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 無障礙、效能優化、程式碼品質、文件更新

- [ ] T064 [P] Integrate axe-core for accessibility testing in virtual_coach_app_frontend/src/main.tsx (development only, auto-report violations in console)
- [ ] T065 [P] Add ARIA labels to all interactive components (buttons, cards, inputs, sliders) ensuring screen reader support
- [ ] T066 [P] Validate color contrast ratios ≥4.5:1 for all text-background combinations (use WebAIM contrast checker)
- [ ] T067 [P] Add prefers-reduced-motion support (disable/reduce animations when user preference set, use usePrefersReducedMotion hook)
- [ ] T068 Configure code splitting in virtual_coach_app_frontend/vite.config.ts (manualChunks for mantine, framer-motion, icons)
- [ ] T069 [P] Optimize SVG icons with SVGO (remove unnecessary metadata, minify paths, standardize viewBox)
- [ ] T070 [P] Add lazy loading for non-critical components (TrainingPlayer, CompletionScreen with React.lazy and Suspense)
- [ ] T071 Configure Tailwind purge in virtual_coach_app_frontend/tailwind.config.js (remove unused utility classes, target bundle < 250KB gzipped)
- [ ] T072 [P] Add will-change hints to animated elements (buttons, cards, timer ring for GPU acceleration)
- [ ] T073 [P] Run Lighthouse audit (target: FCP <1.5s, LCP <2.5s, TTI <3.5s, Performance score ≥90)
- [ ] T074 [P] Setup Playwright CI configuration in virtual_coach_app_frontend/playwright.config.ts (chromium, mobile, tablet viewports)
- [ ] T075 [P] Update component documentation with Storybook or inline JSDoc (Button, Card, Badge variants with usage examples)
- [ ] T076 [P] Create design system documentation in virtual_coach_app_frontend/docs/design-system.md (color palette, typography, spacing, component variants)
- [ ] T077 Run quickstart.md validation (follow all 8 steps, verify theme loads, PreferenceCard renders, tests pass)
- [ ] T078 Code review and refactoring (extract duplicated styles, consolidate animations, remove hardcoded colors)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational completion
  - US1 (P1): Independent after Foundational
  - US2 (P2): Independent after Foundational (can integrate with US1 components)
  - US3 (P3): Independent after Foundational
  - US4 (P4): Depends on US1, US2, US3 completion (adds responsive styles to existing components)
- **Polish (Phase 7)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: Foundational → Independent
- **US2 (P2)**: Foundational → Independent (may reuse Button from US1 but not blocking)
- **US3 (P3)**: Foundational → Independent
- **US4 (P4)**: US1 + US2 + US3 → Adds responsive styles to all existing components

### Within Each User Story

1. Component tests (if testing first approach)
2. Visual components (can parallelize [P] tasks)
3. Integration/composition components
4. Visual regression tests (for US4)

### Parallel Opportunities

**Phase 1 (Setup)**: T006, T007 parallel  
**Phase 2 (Foundational)**: T009, T010, T011, T012, T013 parallel; T017 parallel with T018  
**Phase 3 (US1 Tests)**: T019, T020, T021 parallel  
**Phase 3 (US1 Impl)**: T022, T023, T024 parallel  
**Phase 4 (US2 Tests)**: T030, T031, T032 parallel  
**Phase 4 (US2 Impl)**: T033 parallel with T034, T035  
**Phase 5 (US3 Tests)**: T040, T041, T042 parallel  
**Phase 5 (US3 Impl)**: T043, T044 parallel  
**Phase 6 (US4 Tests)**: T050, T051, T052 parallel  
**Phase 6 (US4 Impl)**: T053, T054 parallel; T055, T056, T057 sequential (same file); T058, T059 sequential; T060, T061 sequential  
**Phase 7 (Polish)**: T064, T065, T066, T067 parallel; T069, T070 parallel; T072, T073 parallel; T074, T075, T076 parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T018) - CRITICAL GATE
3. Complete Phase 3: User Story 1 (T019-T029)
4. **STOP and VALIDATE**: Test preference setting page independently
5. Deploy/demo MVP with refreshed green-themed preference UI

### Incremental Delivery

1. Setup + Foundational → Design system ready
2. Add US1 → Preference setting redesigned → Deploy/Demo (MVP!)
3. Add US2 → Workout list redesigned → Deploy/Demo
4. Add US3 → Training player immersive → Deploy/Demo
5. Add US4 → Responsive everywhere → Deploy/Demo
6. Polish → Accessibility + Performance → Final Release

### Parallel Team Strategy

With multiple developers (after Foundational Phase 2 completes):

- **Developer A**: User Story 1 (Preference Form)
- **Developer B**: User Story 2 (Workout List)
- **Developer C**: User Story 3 (Training Player)
- **Developer D**: User Story 4 waits for A+B+C, then adds responsive styles

Stories integrate independently, can be demoed separately.

---

## Notes

- **[P] tasks**: Different files, can run in parallel
- **[Story] labels**: Map task to user story for traceability
- **Foundational phase blocks everything**: Must complete before any UI work
- **Each user story independently testable**: Can demo/deploy after completion
- **US4 adds responsive styles**: Depends on US1/US2/US3 completion
- **Tests optional**: Included for quality assurance, adjust based on team preference
- **Commit frequently**: After each task or logical group
- **Stop at checkpoints**: Validate story works independently before continuing

---

## Total Task Count

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 11 tasks
- **Phase 3 (US1)**: 11 tasks (3 tests + 8 implementation)
- **Phase 4 (US2)**: 10 tasks (3 tests + 7 implementation)
- **Phase 5 (US3)**: 10 tasks (3 tests + 7 implementation)
- **Phase 6 (US4)**: 14 tasks (3 visual tests + 11 implementation)
- **Phase 7 (Polish)**: 15 tasks

**Total: 78 tasks**

**Parallel opportunities**: ~35 tasks marked [P] can run in parallel within their phases

**Suggested MVP scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 29 tasks
