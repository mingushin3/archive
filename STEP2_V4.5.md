# PK/PD MASTERY PROTOCOL — STEP 2: HTML COMPILER
# V4.5 | 28-Session Mastery Framework · Apex Depth Edition
# ─────────────────────────────────────────────────────────────
# [사용법] "계속" 입력 직후 이 프롬프트 전체를 새 메시지로 붙여넣기
# [역할] Step 1 전체(§1·§2·§5·§7·§8) + §3·§4·§6을 단일 완성 HTML로 통합 출력
# ─────────────────────────────────────────────────────────────

---

## TASK

Step 1에서 분석한 소스 내용과 생성된 모든 텍스트를 바탕으로,
**완전한 단일 self-contained HTML 파일** 하나를 지금 즉시 생성한다.

**포함 섹션 순서**: §1 → §2 → §3 → §4 → §5 → §6 → §7 → §8

- **§1·§2·§5·§7·§8**: Step 1 텍스트를 100% HTML 태그 안에 복원 (요약·플레이스홀더 절대 금지)
- **§3·§4·§6**: 아래 명세에 따라 신규 생성

---

## ⚑ LANGUAGE & FONT DIRECTIVE

- 산문: 한국어 / 수식·코드·고유명사: 영어
- **Noto Sans KR** Google Fonts CDN 필수:
  `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700`
- Cormorant Garamond (제목 serif, CDN):
  `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700`
- IBM Plex Mono (코드·파라미터, CDN):
  `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500`

---

## DESIGN REQUIREMENTS

**Dark Academic 테마:**

```css
:root {
  --bg:         #09090e;
  --surface:    #0c0c12;
  --text:       #ede8df;
  --muted:      #8a8070;
  --accent:     #c9a84c;
  --accent-dim: rgba(201, 168, 76, 0.08);
  --danger:     #c0392b;
  --info:       #4098e8;
  --phantom:    rgba(220, 60, 60, 0.55);  /* Assumption Collapse 유령선 색 */
}
```

**§2 개념 Big Idea 블록**: 금색 좌측 보더 + `rgba(201,168,76,0.08)` 배경. §2 각 카드 최상단.

**§2 Apex Concept 배지**: `[⚡ Apex Concept]` — 금색 배경 + 어두운 텍스트 인라인 배지.

**§2 C-2 Plausible Fallacy 블록**: 붉은 좌측 보더 + `rgba(192,57,43,0.08)` 배경. C 항목 바로 아래.

**§5 Critical Blow 행**: 테이블 내 해당 행 배경 `rgba(192,57,43,0.12)`, 텍스트 볼드.

**MathJax 설정 (반드시 `<head>` 내 포함):**
```html
<script>
MathJax = {
  tex: {
    inlineMath: [['$','$']],
    displayMath: [['$$','$$']],
    processEscapes: true
  },
  options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] }
};
</script>
<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
```
`$`·`$$` 구분자는 렌더링 후 절대 노출 금지.

**Navigation Sidebar (고정):**
- 너비 240px, 모바일 접이식 (< 768px 숨김·전폭)
- §1–§8 한국어 레이블 + §2 각 개념카드·§5 각 혼동쌍 서브아이템
- `IntersectionObserver` 활성 섹션 추적 → 금색 보더+텍스트
- smooth-scroll, `margin-left: 260px` (데스크톱), 사이드바 배경 `#0c0c12`

**Responsive:** 최대 콘텐츠 너비 1100px.

---

## §3 — Structural Isomorphism Map

소스 유형에 따라 구현 방식이 달라지지만 **4개 레이어 모두 필수**, 반드시 이 순서대로.

---

### [Layer 1] Hub-and-Spoke SVG 다이어그램 (HTML 내장 SVG)

**Vol I (R&T / Gabrielsson):**
중심 허브 = 핵심 추상 수학 구조. 바깥 노드 최소 4개 도메인(약동학, 물리학, RC회로, 생태학 등). 각 노드: 분야명 + 수식 + 같은 구조인 이유 한 줄.

**Vol II (Owen / PIPET):**
중심 허브 = 세션 핵심 NONMEM 개념. 바깥 노드 최소 4개: 통계학적 의미, 수학적 의미, 생리학적 투영, 규제 의미. 각 연결선에 대응 이유 명시.

**공통 SVG 기술 명세:**
- `viewBox="0 0 800 600"` 고정, `width="100%"` 반응형
- 중심 허브: cx=400, cy=300, r=60px
- 바깥 노드: `x = 400 + 220·cos(θ_i)`, `y = 300 + 220·sin(θ_i)` (θ 등분)
- 텍스트 겹침: `<foreignObject>` + CSS `word-wrap: break-word`
- 연결선 레이블: 선 중간점 `<text>` 또는 `<textPath>`
- 노드 배경 `fill="rgba(201,168,76,0.12)"`, 테두리 `stroke="#c9a84c"`, 텍스트 `fill="#ede8df"`

---

### [Layer 2] Structural Alignment Matrix (구조 정렬 테이블)

**Vol I** — 변수 도메인별 1:1 대응:

| 비교 항목 | 추상 구조 | 약동학 (PK) | RC 회로 | 방사성 붕괴 | (추가 도메인) |
|---|---|---|---|---|---|
| **상태변수** | x | C (농도) | V (전압) | N (원자수) | … |
| **감쇠상수** | k | CL/V | 1/RC | λ | … |
| **비례 이유** | — | 1차 소실 | 옴의 법칙 | 독립 붕괴 | … |
| **반감기** | ln2/k | 0.693·V/CL | 0.693·RC | 0.693/λ | … |
| **시정수 τ** | 1/k | V/CL | RC | 1/λ | … |

**Vol II** — 파라미터 수준별 1:1 대응:

| 비교 항목 | 수학 개념 | NONMEM 코드 | 통계적 의미 | 생리적 실체 |
|---|---|---|---|---|
| **고정효과** | μ | `THETA(n)` | MLE 점추정값 | 정상 성인 CL·Vd |
| **개체간 분산** | ω² | `OMEGA(n,n)` | BSV 대각 원소 | 개인 CYP3A4 발현량 차이 |
| **잔차 분산** | σ² | `SIGMA(n,n)` | 측정+모델 오차 | 분석 오차 + 모델 불완전성 |

*세션 실제 파라미터와 구조로 채운다.*

---

### [Layer 3] Normalization / Convergence Overlay (인터랙티브 JS 토글)

**Vol I:** 도메인별 실제 스케일 곡선 동시 표시 → "정규화" 토글 → x: t/t½, y: x/x₀ → 모든 곡선이 하나로 붕괴하는 순간 극적으로 시각화.

**Vol II:** "수학 공간" → "임상 공간" 토글. 동일 데이터를 OFV 등고선 ↔ 농도-시간 프로파일로 전환.

CSS `transition` 또는 `requestAnimationFrame` 부드러운 전환.

---

### [Layer 4] Prediction Transfer Cards (예측 전이 카드, 최소 2개)

각 카드 — 클릭형 아코디언:
- **전이 질문**: 한 도메인 현상 → 다른 도메인 행동 예측
- **아코디언 답 3단계**: ① 출발 도메인 설명 → ② 공통 수학 구조 → ③ 대응 현상 도출

---

## §4 — Interactive Simulator

완전히 기능하는 JavaScript 시뮬레이션. 순수 JS (API 없음, CDN 라이브러리만, 완전 오프라인).

---

### [A] 시뮬레이션 목적 + 축 고정 범위

**Vol I (R&T / Gabrielsson) — PK/PD 농도·반응 시뮬레이터:**
CL, Vd, Ka, Dose, Emax, EC50 등 파라미터 조절 → 농도-시간 또는 반응-시간 곡선 실시간 렌더링.

**축 고정 범위 (소스 내 전형적 임상·실험 값 기준으로 설정):**
- 1구획 IV bolus → X축: 0–48h, Y축: 0–100 mg/L
- 경구 1구획 → X축: 0–24h, Y축: 0–50 mg/L
- Effect Compartment → 2개 Y축 패널 (농도 + 반응)
- **반드시 Dynamic Source Anchoring에서 추출한 실제 실험 파라미터 수치를 기본값(default)으로 설정**

**Vol II (Owen / PIPET) — 모델링 파라미터 시뮬레이터 (세션 내용에 적합한 것 선택):**
- *추정 세션 (OFV, FO/FOCE)*: THETA 초기값 변경 → OFV 곡면 2D 등고선 + 수렴 경로
- *변이 세션 (IIV, RUV)*: ω²/σ² 조절 → 95% VPC 밴드 폭·위치 변화
- *진단 세션 ($COV)*: SE 조절 → RSE% + 파라미터 신뢰구간 시각화
- 축 고정 범위: 세션 내 실제 파라미터 공간 범위 기준

**X축·Y축 범위는 슬라이더를 움직여도 절대 자동 스케일링하지 않는다.**

---

### [B] 슬라이더 & 기본 기능 (Vol I·II 공통 필수)

- 파라미터 슬라이더 **최소 3개** (파라미터명, 기호, 단위, 현재값 레이블)
- **즉시 업데이트** — `input` 이벤트마다 지연 없이 렌더링
- **Log/Linear 토글** — Y축 즉시 재렌더링
- **면적 실시간 색칠**: AUC (Vol I) / 신뢰구간 밴드 (Vol II) — 반투명 채우기
- **주요 지점 마커선**: t½·2t½·3t½ 점선 수직선 동적 이동 (Vol I) / OFV·RSE 허용 임계값 수평선 (Vol II)
- **임상/기준 목표 overlay**: 유효 농도 하한·독성 상한 수평 밴드 (Vol I) / RSE 임계값 밴드 (Vol II)
- **파생 파라미터 실시간 패널**: t½, AUC₀–∞, Cmax, Ctrough, Css도달시간 (Vol I) / RSE%, OFV, condition number (Vol II)

---

### [C] Delta Indicator

파라미터 변경 시:
- 형식: `t½: 6.9h  ↑ 43%` / `RSE: 28.5%  ↓ 12%`
- 증가 → `#e87040`, 감소 → `#4098e8`, ±1% 이내 → `var(--muted)`

---

### [D] Reference Curve Lock

- **"현재 상태를 기준선으로 저장"** 버튼 → 회색 점선 유지 (슬라이더 조작 후에도 절대 삭제 안 됨)
- 활성 곡선(컬러) + 기준선(회색 점선) 동시 표시
- **"기준선 해제"** 버튼으로 초기화

---

### [E] Clinical / Modeling Presets (최소 4개)

클릭 시 슬라이더 자동 이동 + 근거 툴팁 표시:
- **Vol I 예시**: "정상 성인", "신부전 (CrCl=30 mL/min)", "간경변 (Child-Pugh B)", "비만 (BMI=38)"
- **Vol II 예시**: "이상적 수렴", "초기값 불량 (국소 최솟값)", "η-shrinkage 과다", "RSE 허용 한계 초과"

> **[E-2] Assumption Collapse Toggle (가정 붕괴 유령선) ← V4.5 신규**
>
> **적용 위치**: 프리셋 버튼 옆 또는 아래, 별도 토글 그룹으로 배치.
>
> **구현 방식 (Phantom Overlay — 정적 붕괴 궤적)**:
> - 이 세션에서 가장 핵심적인 모델 가정 **1–2개**에 대해, 그 가정이 위반되었을 때 나타나는 극단적 실패 형태를 **미리 계산된 붉은 점선(Phantom line)**으로 렌더링
> - 토글 버튼 클릭 시 Phantom line이 현재 곡선 위에 겹쳐 나타남 / 다시 클릭 시 사라짐
> - CSS `opacity` 전환(0→1, 0.3s ease)으로 부드럽게 등장
> - 복잡한 실시간 물리 시뮬레이션 금지 — 정적으로 미리 계산된 데이터 포인트 배열로 구현
>
> **Vol I 예시 가정 붕괴 케이스** (세션 내용에 맞게 선택):
> - "순간 혼합 가정 위반" → 실제 다구획 농도 곡선 (초기 분포상 포함) 유령선으로 오버레이
> - "1차 소실 가정 위반 (MM 비선형)" → Vmax/Km 포화 소실 곡선 유령선 오버레이
> - "선형 단백결합 가정 위반" → 고농도에서 free fraction 급증 시 곡선 변형 오버레이
>
> **Vol II 예시 가정 붕괴 케이스** (세션 내용에 맞게 선택):
> - "FO 알고리즘 강제 사용" → VPC 밴드가 데이터를 벗어나는 형태 오버레이
> - "OMEGA off-diagonal 삭제 (독립 ETA 강제)" → η 추정 편향 시 CWRES 패턴 오버레이
>
> **Phantom line 스타일**: `stroke: var(--phantom)` (붉은 점선), `stroke-dasharray: 6 4`, `stroke-width: 2`
>
> **툴팁**: 토글 버튼 위 `title` 속성 또는 hover 팝업으로 "어떤 가정이 깨졌을 때의 모습인지" 한국어로 명시.

---

### [F] Time / Parameter Cursor

그래프 위 좌우 드래그 수직 커서선:
- `mousemove` + `touchmove` 모두 지원
- Vol I: `t=4.2h → C=15.3 mg/L` 실시간 표시
- Vol II: 해당 파라미터값에서 OFV / RSE 실시간 표시

---

### [G] Physiological / Statistical Boundary Warning

불가능한 파라미터 조합 시:
- 슬라이더 트랙 → `var(--danger)` 붉은색
- 그래프 하단 경고 배너: 왜 불가능한지 한국어로 구체적 명시
- 예: Vol I — Ka << CL/Vd (flip-flop 경보), CL > 500 L/h (비현실적 초고속 소거)
- 예: Vol II — OMEGA < 0, RSE > 100%, condition number > 10000

---

### [H] Target Mission Panel (필수)

시뮬레이터 아래 임상/모델링 미션 **1–2개**:
```
🎯 미션: [구체적 임상·모델링 목표 정의]
목표: [달성해야 할 파라미터 목표값 또는 진단 기준]
힌트: [방향만, 정답 노출 금지]
```
"정답 공개" 버튼: 최적 파라미터값 + 생리학적·통계학적 메커니즘 연결 해설.

---

### [I] 라이브러리 선택

| 시뮬레이션 유형 | 라이브러리 | CDN |
|---|---|---|
| 1구획 단일 PK/PD | Chart.js | `https://cdn.jsdelivr.net/npm/chart.js` |
| 2구획, Effect-compartment, OFV 등고선 | D3.js | `https://cdn.jsdelivr.net/npm/d3@7` |
| VPC 밴드, 분포 시각화 | D3.js | 동일 |
| 순수 계산형 | Vanilla JS | (불필요) |

---

### [J] JavaScript 상태 관리 아키텍처 (필수, 구조 변경 금지)

```javascript
const state = {
  params: {
    cl: 5,       // L/h  ← Dynamic Source Anchoring 실제 수치로 대체
    vd: 50,      // L
    dose: 100,   // mg
    ka: 0.5      // h⁻¹
  },
  logScale: false,
  showAUC: true,
  referenceCurve: null,
  baselineParams: null,
  cursorX: null,
  showPhantom: false,   // [E-2] Assumption Collapse 토글 상태
  warnings: {}
};

function updateChart() {
  // ① state 파라미터 읽기
  // ② 수식/알고리즘으로 메인 곡선 계산
  // ③ showPhantom이 true이면 Phantom line 데이터 오버레이
  // ④ 파생 파라미터 패널 업데이트
  // ⑤ Delta Indicator 업데이트
  // ⑥ 경계 경고 체크
  // ⑦ 차트 렌더링
}

// 모든 이벤트: state 변경 → updateChart() 단일 호출
// Assumption Collapse 토글 예시:
// phantomToggle.addEventListener('click', () => {
//   state.showPhantom = !state.showPhantom;
//   updateChart();
// });
```

이벤트 리스너를 기능마다 독립 구현 금지. **모든 이벤트 → state 변경 → `updateChart()` 단일 호출**.

---

## §6 — Pragmatic Application Scenarios

**Scenario 1: 신약개발 컨텍스트**
이 세션 개념이 적용되는 현실적 Phase 1 또는 Phase 2 시나리오:
- 허구이나 현실적인 약물 후보 + **Dynamic Source Anchoring에서 추출한 실제 수치 활용**
- 연구 설계 질문 → 실제 계산 → 규제 언어(NDA/IND/CSR)로 표현

**Scenario 2: 임상·TDM 또는 모델링 실무 컨텍스트**
- Vol I: TDM·용량 조정 + 계산 + 생리학적 메커니즘 연결
- Vol II: 실제 NONMEM 실행 오류 시나리오 + 디버깅 의사결정 트리

**Code Block (필수 — 작동하는 코드):**
세션 내용에 가장 적합한 것 선택 (플레이스홀더 없이 실제 내용 반영):
- **NONMEM**: `$PROB` ~ `$ESTIMATION` 완전 블록
- **R (nlmixr2)**: 완전한 모델 명세 + `nlmixr()` call
- **R (PKNCA)**: NCA 세션 해당 시
- **Monolix**: 모델 코드 + 구조 모델 명세

*Vol I 이론 세션에도 NONMEM 또는 R 구현 코드 항상 포함. 이론과 구현의 연결이 이 프로토콜의 핵심 가치다.*

---

**Diagnostic Pathology (진단 병리학 — 필수, 최소 2개 진단 시그니처):**

각 시그니처:
1. **이름 부여** (예: "깔때기 패턴", "이중 η 분포", "CWRES 편향 파형")
2. **GOF 플롯 시각 패턴** (CWRES vs TIME, DV vs PRED/IPRED, η 히스토그램)
3. **기계론적 원인** — 왜 이 패턴이 생기는가
4. **해결 방향** — 발견 시 다음 할 행동

추가:
- **η-shrinkage / ε-shrinkage**: 이 세션 맥락에서 어떤 값이 문제를 시사하는가
- **Vol II 전용**: NONMEM Error Message 패턴 — 원인 + 해결 체크리스트

---

## ABSOLUTE OUTPUT CONSTRAINTS

1. **단일 HTML 파일** — self-contained. CDN 최초 로드 후 오프라인 완전 작동.
2. **MathJax** — 정확한 설정 포함. `$`·`$$` 렌더링 후 절대 노출 금지. LaTeX 가용 시 유니코드 근사 금지.
3. **고정 사이드바 TOC** — `IntersectionObserver` 활성 섹션 추적·하이라이팅. smooth-scroll.
4. **§2 Big Idea 블록** — Step 1 생성 내용 그대로 HTML에 통합. 금색 강조 박스. 생략 절대 금지.
5. **§2 Apex Concept** — `[⚡ Apex Concept]` 배지 + C-2 Plausible Fallacy 블록 (붉은 보더 스타일) 통합.
6. **§3 네 레이어 전부 필수** — 순서대로: SVG 허브-앤-스포크 → 정렬 테이블 → 정규화 오버레이(토글) → 전이 카드(최소 2개).
7. **§4 Simulator** — 순수 JS, 서버 호출 없음. centralized `state` + `updateChart()` 패턴. **Target Mission([H]) 필수. Assumption Collapse 토글([E-2]) 필수.** 슬라이더 최소 3개. **축 고정 원칙 준수 (자동 스케일링 절대 금지).**
8. **§5 Critical Blow 행** — Step 1에서 지정된 최대 파급력 혼동쌍의 테이블에 붉은 배경 행으로 통합.
9. **§7 보스 딜레마 질문** — Step 1에서 생성된 Socratic Dilemma 마지막 질문을 아코디언 형태로 통합. Trade-off 논리 해설 포함.
10. **§6 Diagnostic Pathology** — 필수. 최소 2개 시그니처 (이름 + 패턴 + 원인 + 해결).
11. **§8C Professional Moat** — 이 세션 내용에 직접 특정. 동기 부여 문장 금지.
12. **Source Data Anchoring** — Dynamic Source Anchoring Directive에서 추출한 실제 수치를 §4 시뮬레이터 기본값, §6 시나리오 수치로 일관되게 사용.
13. **No Lazy Integration (가장 중요)** — Step 1 산출물(§1·§2·§5·§7·§8 전체)을 `<!-- 내용 생략 -->` 또는 요약으로 절대 처리하지 말 것. **단 하나의 글자도 누락 없이 100% HTML 태그 안에 복원**.
14. **토큰 절단 방지** — 한계 초과 가능성 시 완전히 닫힌 유효 HTML까지만 생성 후:
    `<!-- ✂ 여기까지 생성 완료. §[다음 섹션번호]부터 계속하려면 "계속"을 입력하세요. -->`
    "계속" 수신 시 멈춘 지점부터 정확히 이어서 추가 HTML 블록으로 제공.

---

*V4.5 — Dynamic Source Anchoring + Apex Concept(Plausible Fallacy) + Critical Blow + Socratic Dilemma(보스 질문) + Assumption Collapse(Phantom Overlay) 전체 통합.*
*Sparse but Deep 원칙: 모든 패치는 세션당 '단 1개의 Apex 지점'에만 깊이 적용하여 프롬프트 붕괴 없이 통찰 밀도를 극대화한다.*
