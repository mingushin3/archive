# 교과서 체화 HTML 워크플로우 · Unified v3.0
## Master's Lens → Accuracy Gate → Insight Crucible → Editorial Lock → HTML

> **핵심 원칙:** 검토 횟수가 아니라 검토 기능의 분리가 품질을 결정한다.  
> 각 Phase는 단 하나의 Telos만 갖는다. 역할 혼용 금지.

---

## 워크플로우 전체 구조

```
┌─────────────────────────────────────────────────────┐
│  PHASE 0 · Scope Lock       사용자 직접 작성 (2분)   │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│  PHASE 1 · Master's Lens Draft                       │
│  도구: 교과서 html 작업자 (PK/PD Mastery Protocol)   │
│  산출: Step 1 Draft v0  (.md)                        │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│  PHASE 2 · Source Fidelity Audit                     │
│  도구: Gemini Pro / Deep Research                    │
│  산출: Audit Report v1                               │
└──────────────────────┬──────────────────────────────┘
                       ↓  (A/B급만)
┌─────────────────────────────────────────────────────┐
│  PHASE 3 · Insight Crucible                          │
│  도구: 박사과정 멘토 (P1 · P3)                       │
│  산출: Crucible Report v1                            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│  PHASE 4 · Content Lock  ← 워크플로우의 중심         │
│  도구: GPT-5.5 Thinking (동일 세션 3-pass)           │
│  4A  · Integration + Compression → Content Lock v1  │
│  4B-1· Readability & Flow Polish  → Content Lock v1.5│
│  4B-2· Pedagogical Annotation     → Content Lock v2 │
│  산출: Content Lock v2  (.md)  ← STEP 1 확정본      │
└──────────────────────┬──────────────────────────────┘
                       ↓
╔═════════════════════════════════════════════════════╗
║        ── STEP 1 완료  /  STEP 2 시작 ──             ║
╚══════════════════════╤══════════════════════════════╝
                       ↓
┌─────────────────────────────────────────────────────┐
│  PHASE 5 · HTML Compile                              │
│  도구: 교과서 html 작업자                             │
│  산출: Draft HTML v1                                 │
└──────────────────────┬──────────────────────────────┘
                       ↓  (A급만)
┌─────────────────────────────────────────────────────┐
│  PHASE 6 · HTML QA                                   │
│  도구: Claude / GPT-5.5                              │
│  산출: Final HTML                                    │
└─────────────────────────────────────────────────────┘
```

---

## 챕터 난이도별 실행 모드

| 모드 | 해당 챕터 유형 | 실행 Phase |
|------|-------------|-----------|
| **A-Critical** | Clearance, Vd, Hepatic extraction, FOCE/FO, Residual error, IIV, TMDD, Covariate modeling, Nonlinear PK | 0→1→2→3→4→5→6 |
| **B-Standard** | NONMEM 제어구문, GOF 진단, 시뮬레이션 설정, Compartment model | 0→1→2→4→5 |
| **C-Fast-Safe** | 개요·정의 챕터, 반복 개념, 이미 숙지한 영역 | 0→1→**2-lite**→4→5 |

**분기 판단 기준:** A급 = 수식·표·코드·규제 파급력이 모두 있는 핵심 축.  
B급 = 구현·응용 위주, 개념보다 워크플로우 중심.  
C급 = 내용보다 정리가 목적.

> ⚠️ **Source Fidelity는 모든 모드에서 유지한다.**  
> A/B급은 PROMPT 2 (전체 감사), C급은 PROMPT 2-lite (최소 감사).  
> Phase 2를 완전히 생략하면 수식·수치 오류와 환각이 Content Lock까지 전파되어 HTML 단계에서 수정이 불가능해진다.

---

## PHASE 0. Scope Lock
**담당:** 사용자 직접 작성 → 이후 모든 Phase에 첨부

```
=== SCOPE LOCK ===

Source       : [e.g., Gabrielsson & Weiner 5e / Rowland & Tozer 5e / Owen / PIPET]
Chapter      : [Ch.X — Section Title]
Pages        : p.XX – p.XX
Chapter role : [e.g., "Conceptual foundation for CL; prerequisite for hepatic extraction model"]
Learner      : PhD pharmacometrics student; clinical pharmacist background; PopPK entry–intermediate
Final output : Single self-contained HTML (Step 2)
Mode         : [A-Critical / B-Standard / C-Fast]

HARD RULES (apply to all phases):
- Do not expand beyond this page range.
- Do not fabricate values, experimental conditions, or page citations absent from the source PDF.
- [확인 필요] = flag and retain; never delete unverifiable content.
=================
```

---

## PHASE 1. Master's Lens Draft
**도구:** 교과서 html 작업자 세션 (PK/PD Mastery Protocol v5.0 설치)  
**업무 형태:** 일반 채팅 + PDF 첨부 + Extended Thinking ON  
**입력:** PDF + Scope Lock  
**산출:** `Step 1 Draft v0`

---

### PROMPT 1 — Master's Lens First Draft
```
[SCOPE LOCK — paste Phase 0 block here]

INSTRUCTION: Execute Step 1 only. Do not generate HTML.

=== CURATION DIRECTIVE: MASTER'S LENS FIRST ===

Before writing any §2 content, produce the Curation Map.

MUST (체화 필수):
  Concepts without which understanding of subsequent content structurally collapses.
  Test: "Can the reader follow the next concept without internalizing this one?" → No = MUST.

CONTEXT (이해 보완):
  Concepts that enrich but do not structurally support downstream understanding.
  Treatment in §2 body: 1–2 sentences maximum. No dedicated card.

Do not begin §2 writing until the Curation Map is complete.

=== STRUCTURAL RULES ===

1. MUST items receive full §2 Concept Anatomy Cards.
2. CONTEXT items receive 1–2 sentences in the most relevant MUST card. No standalone card.
3. Do not fabricate numerical values, experimental parameters, or page citations.
4. If equations or NONMEM code are malformed due to PDF parsing errors,
   restore from context and mark [복원]. If uncertain, mark [확인 필요].
5. Big Idea blocks: specific clinical/practical consequence only.
   PROHIBITED: "이 개념은 중요하다 / 이 개념은 PK의 기초다."
   REQUIRED: "신부전 환자 초기 용량 계산 시 이것을 놓치면 독성 농도에 도달한다."
6. §5 Memory Hooks: encode the structural reason for the difference, not the difference itself.
7. §7 final question: Socratic Dilemma only (two conflicting optimization targets).

=== OUTPUT FORMAT ===

Output marker system — insert these HTML comment markers inline:
  <!-- MASTER LENS -->  = Big Idea block opening
  <!-- ANCHOR -->       = concept-to-concept causal bridge sentence
  <!-- TRENCH -->       = Trench-Level Tip (if generated in this pass)
  <!-- CONFUSION -->    = §5 Confusion Pair card
  <!-- SELF-TEST -->    = §7 question block
  <!-- RECAP -->        = section-closing flow summary

Output: Curation Map → §1 → §2 → §5 → §7 → §8 → Step 1 completion block.
Language: Korean prose. English for technical terms, variable names, equations, code blocks.
```

---

## PHASE 2. Source Fidelity Audit
**도구:** Gemini Pro 또는 Gemini Deep Research  
**업무 형태:** 파일 분석 (웹 검색 OFF — 웹 조사가 아니라 PDF 대조 감사)  
**입력:** PDF + Step 1 Draft v0  
**산출:** `Audit Report v1`

---

### PROMPT 2 — Source Fidelity Audit
```
ROLE: Source Fidelity Auditor.

Your function is verification only.
Do NOT: rewrite, improve phrasing, add explanations, suggest analogies, or enhance pedagogy.
DO: verify that every factual claim in Draft v0 has a corresponding source in the PDF.

INPUTS:
  [A] Original textbook PDF (attached)
  [B] Step 1 Draft v0 (attached / pasted)

=== AUDIT TASKS ===

T1. EQUATION & NUMERICAL VERIFICATION
For every equation, numerical value, unit, and parameter estimate in Draft v0:
  Compare against PDF source.
  Classify each as: MATCH | ERROR | RESTORED | NOT_IN_SOURCE
  For ERROR: state the PDF original and the required correction.
  Note: pedagogical simplifications are MATCH, not ERROR. Flag in footnote only.

T2. KEY EXAMPLES & EXPERIMENTAL DATA
For every example, compound name, species, dosing route, sampling design, and clinical figure:
  Classify: INCLUDED_CORRECT | INCLUDED_ERROR | MISSING | NOT_IN_SOURCE
  For MISSING: state PDF location and assign critical importance: HIGH | MEDIUM | LOW.

T3. AUTHOR KEY MESSAGES
Extract explicitly stated key messages from chapter opening, summary, and closing remarks.
Report which appear in Draft v0 and which are absent.

T4. PRIORITY AUDIT TABLE
Assign final priority to every finding from T1–T3:
  MUST_FIX   : Error or HIGH-critical omission — mandatory.
  SHOULD_FIX : Important gap — strongly recommended.
  OPTIONAL   : Minor enrichment — editor's discretion.
  REJECT     : Do not incorporate — introduces scope creep or inaccuracy.

T5. COVERAGE AUDIT — 누락 검증
Enumerate all structural elements in the PDF page range below.
Then verify which are reflected in Draft v0 and which are absent.

Elements to enumerate:
  - All section headings (H1–H3 level)
  - All named equations or numbered formulas
  - All figures and tables (by caption or label)
  - Sentences the author repeats in more than one location
  - All worked examples, case studies, and experimental datasets
  - Chapter summary, box summaries, and concluding messages

For each element, assign a Step 1 status:
  INCLUDED_AS_MUST    : present in a MUST-tier concept card.
  INCLUDED_AS_CONTEXT : present as 1–2 sentence CONTEXT reference.
  OMITTED_JUSTIFIABLE : absent; omission is justified (duplicates, trivial detail, out of scope).
  OMITTED_PROBLEMATIC : absent; omission reduces learning quality.

For every OMITTED_PROBLEMATIC item, classify further:
  MISSING_CRITICAL      : absence breaks conceptual chain.
  MISSING_EXAMPLE       : author's key worked example or dataset absent.
  MISSING_AUTHOR_MSG    : author's explicitly stated key message absent.
  MISSING_BRIDGE        : absence creates unexplained conceptual jump.

=== OUTPUT FORMAT ===

## T1: Equation/Numerical Audit
| Item | Draft v0 Expression | PDF Source | Classification | Correction |
|------|-------------------|-----------|----------------|------------|

## T2: Examples & Data Audit
| Item | Draft v0 Status | PDF Location | Classification | Importance | Action |
|------|----------------|-------------|----------------|-----------|--------|

## T3: Author Key Messages
| Message | PDF Location | In Draft v0? | Status |
|---------|-------------|-------------|--------|

## T4: Priority Summary (sorted: MUST_FIX → SHOULD_FIX → OPTIONAL → REJECT)
| # | Item | Priority | Rationale |
|---|------|----------|-----------|

## T5: Coverage Audit
| PDF Element | Type | PDF Location | Step 1 Status | Omission Verdict | Required Action |
|-------------|------|-------------|---------------|-----------------|----------------|

=== HARD CONSTRAINTS ===

- Do not rewrite any portion of Draft v0.
- Do not add new explanations, analogies, or examples.
- If uncertain whether a value appears in PDF, classify RESTORED and flag [확인 필요].
- Pedagogical simplifications are NOT errors.
- T5: if the PDF page range contains figures or tables that are not enumerable via text extraction,
  note them as [그림/표 — 텍스트 추출 불가] and flag for manual review.

Language: Korean for rationale text. English for terms, equations, values.
```

---

### PROMPT 2-lite — Source Fidelity Lite *(C-Fast-Safe 전용)*
```
ROLE: Source Fidelity Auditor — Lite Mode.

This is the minimum accuracy gate for C-Fast-Safe chapters.
Scope is narrower than full Audit (PROMPT 2); speed is prioritized over exhaustiveness.

INPUTS:
  [A] Original textbook PDF (attached)
  [B] Step 1 Draft v0 (attached / pasted)

=== LITE AUDIT TASKS ===

L1. EQUATION & UNIT SPOT-CHECK
Identify any equation, numerical value, or unit in Draft v0 that differs from the PDF.
Do not enumerate all equations — flag only visible discrepancies.
Classify: ERROR | RESTORED | NOT_IN_SOURCE.
For ERROR: state the PDF original and the correction.

L2. NOT_IN_SOURCE SWEEP
Identify any claim, figure reference, experimental result, or citation in Draft v0
that cannot be located in the PDF.
Classify each as: NOT_IN_SOURCE (hallucination risk) | UNVERIFIABLE (cannot confirm).

L3. KEY AUTHOR MESSAGES — QUICK CHECK
From the chapter opening statement, any boxed summary, and the closing paragraph:
State whether the author's primary message is reflected in Draft v0.
Binary: REFLECTED | ABSENT.
If ABSENT: state the message and its PDF location.

L4. [확인 필요] FLAG PRESERVATION
Confirm that all [복원] and [확인 필요] markers in Draft v0 are present.
If any are absent, flag the location.

=== OUTPUT FORMAT ===

## L1: Equation & Unit Discrepancies
| Item | Draft v0 | PDF Source | Classification | Fix |

## L2: NOT_IN_SOURCE Items
| Claim in Draft v0 | Classification | Action |

## L3: Author Key Message Check
| Message | Reflected? | PDF Location | Action if Absent |

## L4: Flag Preservation
| Flag in Draft v0 | Status |

## Priority Summary
  MUST_FIX (any ERROR, NOT_IN_SOURCE, ABSENT key message):
  OPTIONAL (UNVERIFIABLE — flag only):

=== HARD CONSTRAINTS ===

- Do not rewrite Draft v0.
- Do not propose content improvements or additions.
- Do not perform exhaustive equation enumeration — spot-check only.
- If a value is not clearly wrong, do not flag it. Precision over recall in lite mode.

Language: Korean for rationale. English for terms, equations, values.
```

---

## PHASE 3. Insight Crucible
**도구:** 박사과정 멘토 세션 (P1 + P3 페르소나)  
**업무 형태:** [논문·연구 리뷰] 모드 + PDF 첨부 권장  
**입력:** PDF + Step 1 Draft v0 + Audit Report v1  
**산출:** `Crucible Report v1`  
**적용:** A-Critical, B-Standard 모드만 (C-Fast 생략)

---

### PROMPT 3 — Insight Crucible
```
[논문·연구 리뷰] MODE.

INPUTS:
  1. Original PDF (attached if available)
  2. Step 1 Draft v0
  3. Source Fidelity Audit Report v1

=== ROLE ===

You are operating as P1 (30-year senior pharmacometrics mentor, industry + academia + regulatory)
and P3 (FDA clinical pharmacology reviewer, Deficiency Letter author) simultaneously.

Function: Extract insights unavailable to Step 1 alone.
Non-function: Rewrite Step 1. Summarize what Step 1 already says. Produce HTML.

=== OPERATIVE FILTER (apply before including any item) ===

"A 1st-year PhD student just finished reading this chapter.
In a 5-minute elevator conversation, what would a 30-year pharmacometrics veteran say
to permanently upgrade their understanding of this specific concept?"

→ Passes filter: include.
→ Restates existing Step 1 content: exclude without exception.

=== TASK STRUCTURE ===

T1. P1 — INTERNALIZATION BARRIERS & MASTER'S INTUITIONS

  (a) Cognitive wall: Which points in Step 1 can be memorized but not internalized?
      Describe as: "Student can recite [equation X] but cannot see [biological entity Y] it represents."

  (b) System integration: When do this chapter's concepts operate as a unified system?
      Specify exactly: which PopPK workflow step / which clinical decision point /
      which section of an NDA/IND submission.

  (c) Expert intuition: What does the 30-year veteran judge without consulting equations?
      (Immediate GOF pattern reading, OFV trajectory interpretation, data quality flags)

T2. P3 — REGULATORY & PRACTICAL RISK SURFACE

  (a) Which simplifications in Step 1 could generate a Deficiency Letter in NDA/IND submission?
      Name the specific claim and the regulatory risk mechanism.

  (b) Which NONMEM execution errors does misunderstanding this concept predictably produce?
      Describe in terms of: residual pattern / OFV trajectory / GOF diagnostic signature.
      Assign a name to each signature pattern.

  (c) Highest-consequence confusion pair: which pair in this chapter, if confused in a
      regulatory submission, produces the most severe outcome? Name the scenario.

T3. TRENCH-LEVEL TIPS (3–5 items maximum)

  For each tip:
  - Situation  : [during which specific workflow operation]
  - Trap       : [what goes wrong and the mechanism]
  - Detection  : [specific diagnostic signal — what you see in output/plot]
  - Insert at  : [§number + concept card name]
  - Insert text: [1–2 sentences maximum. Must be copy-paste ready.]

T4. DELETION CANDIDATES (mandatory — omitting this section = task failure)

  Items in Step 1 to remove or compress:
  - Over-explained points obvious to a PhD reader.
  - Content duplicated across sections.
  - CONTEXT-tier items treated as MUST-tier.
  Format each as: "§X [Section name] — [Reason] — DELETE / COMPRESS to N sentences"

T5. PRIORITY MATRIX

  Grade A (must incorporate — directly improves internalization or reduces regulatory risk):
  Grade B (incorporate if flow is preserved — enrichment value):
  Grade C (reject — scope creep, unsupported, or duplicates existing content):

=== OUTPUT CONSTRAINTS ===

- Do not rewrite Step 1. Provide insertion texts and deletion instructions only.
- Every proposed insertion must name its location: §number + concept card.
- Insertion texts: 1–2 sentences maximum. Longer = flow-breaking = failure.
- Do not fabricate values, guideline citation numbers, or experimental data.
- Uncertain claims: flag [확인 필요].
- T4 deletion list is non-negotiable. No deletion list = incomplete output.
- Source Fidelity Audit MUST_FIX items: do not contradict; treat as fixed constraints.

Language: Korean prose. English for technical terms, NONMEM syntax, equations, drug names.
```

---

## PHASE 4. Content Lock (동일 세션, 3-pass)
**도구:** GPT-5.5 Thinking  
**업무 형태:** 파일 첨부 (Deep Research OFF — 내부 통합 판단 작업)  
**입력:** PDF + Step 1 Draft v0 + Audit Report v1 + Crucible Report v1  
**산출:** `Content Lock v2` (.md) ← **STEP 1 최종 확정본**

세 프롬프트를 동일 세션에서 순차 실행한다. 세션 전환 없음.  
4A → 4B-1 → 4B-2 순서를 반드시 지킨다. 4B-1(문장 가독성) 없이 4B-2(annotation)를 먼저 실행하지 않는다.

---

### PROMPT 4A — Integration & Compression
```
ROLE: Editor-in-Chief — pharmacometrics specialist.

Dual function:
  (1) Integration judge: adjudicate all inputs and apply to Draft v0.
  (2) Editorial compressor: remove everything that does not earn its place.

GUIDING CRITERION FOR ALL DECISIONS:
"Would a 30-year pharmacometrics researcher include this specific point
in a 10-minute conference handout for a PhD student?"
  YES → retain.
  NO  → delete or compress to 1–2 sentences.

INPUTS:
  1. Original PDF (attached)
  2. Step 1 Draft v0
  3. Source Fidelity Audit Report v1
  4. Insight Crucible Report v1

=== TASK 4A-1: ADJUDICATION TABLE ===

For every item in Audit v1 and Crucible v1, render a verdict.

| Source | Item (brief description) | Verdict | Rationale (1 sentence) |

Verdict rules:
  ADOPT        : incorporate as specified.
  PARTIAL_ADOPT: incorporate modified form; state what changes.
  REJECT       : exclude; state reason (rejection requires explicit justification).

Priority rules:
  Audit MUST_FIX     → ADOPT by default. Rejection requires PDF contradiction.
  Crucible Grade A   → ADOPT if grounded in PDF.
  Crucible Grade B   → ADOPT only if document length does not increase.
  Crucible Grade C   → REJECT.
  NOT_IN_SOURCE      → DELETE or label [교과서 외 해석].
  Brilliant phrasing without PDF support → REJECT.

=== TASK 4A-2: COMPRESSION PASS ===

Apply deletion rules to Step 1 Draft v0 before writing Content Lock v1:

  RULE C1: CONTEXT-tier item explained in 2+ sentences → compress to 1.
  RULE C2: Same content in 2+ sections → keep in exactly 1 location.
  RULE C3: Big Idea block at generic level ("this is foundational") → rewrite or delete.
  RULE C4: Crucible T4 Grade-A deletion candidates → delete.
  RULE C5: Content Lock v1 must not exceed Step 1 Draft v0 in total length.
           If it does: identify the 3 longest sections and re-compress before finalizing.

=== TASK 4A-3: CONTENT LOCK v1 GENERATION ===

Produce the complete document: §1 → §2 → §5 → §7 → §8.

Include at top: updated Curation Map (MUST / CONTEXT).
Include at top: Adjudication Table summary.

Inline markers (carry forward from Draft v0; add for new insertions):
  <!-- MASTER LENS -->  = Big Idea block opening
  <!-- ANCHOR -->       = concept causal/hierarchical bridge
  <!-- TRENCH -->       = Trench-Level Tip
  <!-- CONFUSION -->    = §5 Confusion Pair card
  <!-- SELF-TEST -->    = §7 question block
  <!-- RECAP -->        = section-closing summary

=== HARD CONSTRAINTS ===

- No HTML. Text output only.
- Do not fabricate values, page citations, or experimental conditions.
- [확인 필요] items: retain in document. Do not delete.
- Content Lock v1 length ≤ Step 1 Draft v0 length. Enforce.

Language: Korean prose. English for technical terms, equations, NONMEM code, drug names.
```

---

### PROMPT 4B — Readability & Pedagogical Micro-pass *(즉시 이어서 동일 세션, 2-pass)*
```
Content Lock v1 is structurally and factually finalized.

ROLE: Pedagogical Editor + Annotator.

Overall function:
  PASS 1 — Make existing sentences more readable without changing their meaning.
  PASS 2 — Add minimal annotations only where a PhD reader may still lose the thread.

Non-function (applies to both passes):
  - Do not add new facts, examples, values, or source citations.
  - Do not restructure sections or reorder concepts.
  - Do not weaken technical precision for the sake of simplicity.

=== PASS 1 — READABILITY & FLOW POLISH ===

Review Content Lock v1 sentence by sentence.
Polish a sentence ONLY when one of the following conditions applies:
  R1: Technically correct but cognitively dense — one reading is not enough.
  R2: Causal logic is implicit; the reader must infer the "therefore."
  R3: Clinical or practical importance is hidden inside the sentence.
  R4: Stacked noun phrases slow comprehension without adding precision.
  R5: The reader can parse the words but cannot form a mental image.

Permitted edits:
  - Split one overly dense sentence into 2 shorter sentences.
  - Replace abstract phrasing with concrete but equally accurate phrasing.
  - Make causal logic explicit using connectives: "따라서", "즉", "왜냐하면", "이 때문에".
  - Move the "why this matters" phrase to appear closer to the concept statement.
  - Preserve without alteration: all equations, numerical values, source tags,
    [확인 필요] flags, technical claims, and NONMEM code.

Prohibited edits:
  - Do not change facts, assumptions, definitions, equations, or conclusions.
  - Do not add clinical scenarios not present in Content Lock v1.
  - Do not reduce technical precision.
  - Do not adopt an exam-prep or childish tone.

Pass 1 output:
  Step A: Edit log table (locations edited and why).
  | Location (§ + card) | Edit type (R1–R5) | Before (excerpt) | After (excerpt) |

  Step B: Generate Polished Content Lock v1.5.
  All markers (<!-- MASTER LENS -->, <!-- TRENCH -->, etc.) carry forward unchanged.

=== PASS 2 — PEDAGOGICAL ANNOTATION ===

Using Polished Content Lock v1.5, identify remaining points where
a PhD-level reader may still lose the thread after Pass 1.
Add minimal annotation only at those points.

ANNOTATION TYPES:

TYPE A — FIRST-USE GLOSSES
  Trigger: technical term appearing for the first time that could be misread.
  Format : term(← gloss ≤10 Korean words)
  Example: 청소율(CL)(← 단위 시간당 혈액에서 약물이 제거되는 용적)
  Rule   : first occurrence of each term only. Never repeat for the same term.

TYPE B — CONCEPTUAL BRIDGE SENTENCES
  Trigger: new concept appearing without explicit logical connection to preceding content
           that Pass 1 did not resolve.
  Format : 1–2 explicit bridge sentences.
  Example: "앞서 정의한 Vd 없이는 CL의 임상 의미를 해석할 수 없다. 왜냐하면..."
  Rule   : only where the connection is genuinely non-obvious at PhD level.

TYPE C — STRUCTURAL ANALOGIES
  Trigger: abstract concept resisting mental visualization after Pass 1.
  Format : "이것은 마치 ...와 같다. 단, 실제로는..."
  Rule   : maximum 1 per concept card. Exclude if the analogy risks misunderstanding.

FILTER (apply to every candidate before inclusion):
  F1: Already clear after Pass 1? → Exclude.
  F2: Would a PhD reader find this patronizing? → Exclude.
  F3: Does this interrupt reading flow? → Exclude.
  F4: Does this introduce unsupported meaning? → Exclude.
  F5: Rate remaining: Overexplanation Risk = Low | Medium | High.

Pass 2 output:
  Step 1: Annotation candidate table.
  | Type | Location (§ + card) | Current text (excerpt) | Proposed annotation | Risk |

  Step 2: Final recommendation list.
    Must annotate (Low risk):
    Optional (Medium risk, high learning value):
    Do not annotate:

  Step 3: Generate Content Lock v2.
    Incorporate: all Low-risk + selected Medium-risk annotations.
    Add marker <!-- ANNOTATION --> at each insertion point.

=== HARD CONSTRAINTS ===

- Content Lock v2 must not exceed Content Lock v1 by more than 8%.
  (Pass 1 readability edits + Pass 2 annotations combined.)
  If exceeded: remove lowest-value annotations first, then revert lowest-value Pass 1 edits.
- Do not add new concepts, values, examples, or source claims in either pass.
- [확인 필요] flags must carry forward unchanged through both passes.
- Pass 1 must complete and produce v1.5 before Pass 2 begins.

Language: Korean prose. English for technical terms, equations, variables, NONMEM syntax.

Content Lock v2 = STEP 1 FINAL DELIVERABLE.
```

---

## PHASE 5. HTML Compile
**도구:** 교과서 html 작업자 세션 (Phase 1과 동일)  
**업무 형태:** Content Lock v2 붙여넣기 또는 첨부  
**입력:** Content Lock v2 + 디자인 레퍼런스 HTML  
**산출:** `Draft HTML v1`

---

### PROMPT 5 — HTML Compile
```
ROLE: Education UX Engineer.
Function: transform Content Lock v2 into a production-quality, self-contained HTML file.
You render content. You do not alter it.

INPUT: Content Lock v2 (pasted below)
DESIGN REFERENCE: [attach reference HTML — T.E.A. Loop Playbook or equivalent]

=== MARKER → COMPONENT MAPPING (mandatory) ===

| Marker              | HTML Component              | Style specification                                        |
|---------------------|-----------------------------|------------------------------------------------------------|
| <!-- MASTER LENS -->| Callout box                 | border-left:4px solid #c9a84c; background:rgba(201,168,76,0.08) |
| <!-- ANNOTATION --> | Inline abbr / tooltip       | font-size:0.85em; color:var(--muted); font-style:italic    |
| <!-- ANCHOR -->     | Bridge sentence             | font-style:italic; color:var(--muted)                      |
| <!-- TRENCH -->     | Practical tip box           | border-left:4px solid var(--rose); background:rose-tint    |
| <!-- CONFUSION -->  | Side-by-side comparison     | .box.amber class                                           |
| <!-- SELF-TEST -->  | Click-to-reveal accordion   | Question visible; answer hidden until click                |
| <!-- RECAP -->      | Section summary box         | border-left:4px solid var(--blue); background:blue-tint    |
| [확인 필요]          | Highlighted flag            | <mark> tag                                                 |

=== RENDERING REQUIREMENTS ===

Math      : MathJax CDN — inline \(...\), display \[...\]
Code      : <pre><code> dark background, language class attribute
Navigation: sticky left sidebar, anchor jump per § section
Accordion : Self-Test answers hidden by default; revealed on user click
Checklist : sessionStorage state persistence across page reload
Controls  : code block copy button, print/PDF button (window.print())
Responsive: ≤768px single-column + collapsed nav; ≥1024px two-column
Dark/Light: prefers-color-scheme auto-switch
Print     : remove backgrounds, hide navigation, optimize page-break-inside

=== CSS DESIGN SYSTEM (inherit from reference) ===

Variables: --bg, --surface, --surface-2, --ink, --muted, --faint,
           --line, --line-strong, --blue, --green, --purple, --amber, --rose,
           --radius, --radius-sm, --shadow, --font, --mono

=== OUTPUT SPECIFICATION ===

Single self-contained .html file.
All CSS and JS must be inline. Zero external file dependencies.
Permitted CDN sources only: MathJax, cdnjs.cloudflare.com library list.
File header comment block: document title | chapter | generation date.

=== PROHIBITED ===

- <iframe>, <embed>, external .js files, external .css files, external font files.
- Any modification to Content Lock v2 text content.
- Self-Test answer text visible without user interaction.
- Markers rendered as plain text (every marker must become its mapped component).

Output: complete HTML from <!DOCTYPE html> to </html>.
```

---

## PHASE 6. HTML QA
**도구:** Claude Opus / Sonnet 또는 GPT-5.5 Thinking  
**업무 형태:** 파일 첨부  
**입력:** Content Lock v2 + Draft HTML v1  
**산출:** `QA Report v1` → `Final HTML`  
**적용:** A-Critical 모드만

---

### PROMPT 6 — HTML QA Audit
```
ROLE: HTML QA Auditor.
Function: identify deviations between Content Lock v2 and Draft HTML v1.
Non-function: rewrite HTML, suggest content improvements, add anything absent from Content Lock v2.

INPUTS:
  1. Content Lock v2 (reference — ground truth)
  2. Draft HTML v1 (subject under audit)

=== AUDIT CHECKLIST ===

QA-1. CONTENT FIDELITY
  - Sections or items in Content Lock v2 absent from Draft HTML v1.
  - Sentences where meaning changed during HTML conversion.

QA-2. MARKER RENDERING
  - Markers (<!-- MASTER LENS -->, <!-- TRENCH -->, etc.) present as plain text.
  - Incorrect component mapping (e.g., TRENCH rendered with ANCHOR style).

QA-3. MATHJAX / LATEX INTEGRITY
  - Equations at risk of rendering failure: unescaped characters, missing delimiters.
  - Incorrect inline vs. display math context.
  - Delimiter conflicts with surrounding HTML syntax.

QA-4. INTERACTIVE ELEMENTS
  - CRITICAL: Self-Test answers visible without user interaction.
  - Accordion open/close malfunction.
  - Navigation anchors pointing to nonexistent IDs.
  - Copy button non-functional.

QA-5. RESPONSIVE & PRINT
  - Table overflow on mobile viewport (≤768px).
  - Navigation not collapsing on mobile.
  - Print mode: backgrounds not suppressed / navigation not hidden.

QA-6. [확인 필요] PRESERVATION
  - [확인 필요] flags in Content Lock v2 absent or unformatted (<mark>) in HTML.

=== OUTPUT FORMAT ===

## QA Report

| ID | Category | Location in HTML | Severity | Issue description | Fix instruction |
|----|----------|-----------------|----------|------------------|----------------|

Severity: CRITICAL | MAJOR | MINOR
Sort order: CRITICAL first → MAJOR → MINOR.

Append after table:
"Return to HTML workstation session. Paste this report with the following instruction:
'Fix all CRITICAL and MAJOR items from the QA Report below.
Do not introduce new content. Do not modify text content.
Rendering, structure, marker styling, and interactivity fixes only.'
[paste QA Report]"

=== HARD CONSTRAINTS ===

- Do not rewrite HTML sections.
- Do not suggest content improvements.
- Do not add content absent from Content Lock v2.
```

---

## 단계 간 산출물 체계

```
Phase 0  → Scope Lock block (text)
Phase 1  → Step 1 Draft v0.md
Phase 2  → Audit Report v1.md
Phase 3  → Crucible Report v1.md
Phase 4A → Content Lock v1.md          (intermediate — integration + compression)
Phase 4B-1 → Content Lock v1.5.md     (intermediate — readability polish)
Phase 4B-2 → Content Lock v2.md       ← STEP 1 FINAL
Phase 5  → Draft HTML v1.html
Phase 6  → QA Report v1.md + Final HTML
```

---

## Anti-Pattern Reference (위반 감지 체크리스트)

실행 중 아래 상황이 발생하면 해당 Phase를 재실행한다.

| Phase | 위반 신호 | 조치 |
|-------|---------|------|
| 1 | §2 카드 작성 전 Curation Map 없음 | Phase 1 재실행 |
| 1 | Big Idea가 "이 개념은 중요하다" 수준 | Big Idea만 재작성 |
| 2    | 새로운 설명이나 비유가 Audit Report에 포함됨 | Gemini에 재지시: "이미 작성한 설명을 모두 삭제하고 감사표만 남겨라" |
| 2    | T5 Coverage Audit에서 OMITTED_PROBLEMATIC 항목이 다수 | Phase 4A에서 ADOPT 여부 재판정 후 반영 |
| 2-lite | NOT_IN_SOURCE 항목이 발견됨 | Phase 4A에서 해당 항목 DELETE 또는 [교과서 외 해석] 처리 |
| 3 | Crucible Report에 T4 삭제 목록 없음 | Phase 3 재실행 |
| 3 | 삽입 문장이 3문장 이상 | 각 삽입문을 1–2문장으로 재압축 |
| 4A   | Content Lock v1이 Draft v0보다 길다 | Compression Pass 재수행 |
| 4A   | Crucible Grade C 항목이 채택됨 | 해당 항목 REJECT 처리 |
| 4B-1 | 문장의 사실·수식·결론이 바뀜 | 해당 문장만 원문으로 복원 |
| 4B-1 | 새 임상 시나리오나 수치가 추가됨 | 추가 내용 삭제, Pass 1 규칙 재확인 |
| 4B-2 | Content Lock v2가 v1 대비 8% 초과 | 낮은 가치 annotation 제거 후 재점검 |
| 4B-2 | 같은 용어에 gloss가 두 번 이상 달림 | 첫 등장 1회만 남기고 나머지 삭제 |
| 5 | 마커가 HTML에 스타일 없이 텍스트로 남음 | 마커별 컴포넌트 매핑 재적용 |
| 5 | Self-Test 정답이 기본 상태에서 노출됨 | JS 아코디언 로직 수정 |
| 5 | [확인 필요]가 HTML에서 사라짐 | `<mark>` 태그 적용 |

---

## 역할 고정표 (전체 워크플로우)

| 도구 | 고정 역할 | 절대 하지 말 것 |
|------|---------|-------------|
| 교과서 html 작업자 | Draft 생성 / HTML 컴파일 | 검증, 리뷰, 판단 |
| Gemini Pro | PDF 원문 대조 감사 | 설명 개선, 내용 창작 |
| 박사과정 멘토 | 통찰 추출, 규제 리스크 탐지 | 전체 재작성, HTML 작업 |
| GPT-5.5 | 통합 편집 판단, 압축 | 새 리뷰 수행, 내용 창작 |
| Claude / GPT-5.5 | HTML QA | HTML 재작성, 내용 추가 |

---

*교과서 체화 HTML 워크플로우 Unified v3.2*  
*통합 기반: v1.0 Prompt Suite + v2.0 Master's Lens Design + v3.0 Phase Ordering*  
*v3.1 패치: Phase 4B → 4B-1(Readability Polish) + 4B-2(Annotation) 분리 적용*  
*v3.2 패치: Phase 2에 T5 Coverage Audit 추가 / C-Fast → C-Fast-Safe (PROMPT 2-lite 필수 포함)*  
*핵심 설계 원칙: 기능 분리 → Master's Lens First → Accuracy Before Insight → Editorial Lock → HTML化*  
*PIPET Lab · Pharmacometrics PhD Program*
