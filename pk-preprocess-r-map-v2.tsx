import { useState } from "react";

const TIERS = [
  { tier: 1, label: "Tier 1 · 매 데이터셋", pct: "100%", color: "#dc2626" },
  { tier: 2, label: "Tier 2 · 대부분", pct: "70–85%", color: "#d97706" },
  { tier: 3, label: "Tier 3 · 자주", pct: "40–60%", color: "#2563eb" },
  { tier: 4, label: "Tier 4 · 상황별", pct: "15–30%", color: "#7c3aed" },
  { tier: 5, label: "Tier 5 · 드묾", pct: "<10%", color: "#6b7280" },
];

const tierBg = { 1: "#fef2f2", 2: "#fffbeb", 3: "#eff6ff", 4: "#f5f3ff", 5: "#f9fafb" };
const tierColor = { 1: "#dc2626", 2: "#d97706", 3: "#2563eb", 4: "#7c3aed", 5: "#6b7280" };
const tierPct = { 1: "100%", 2: "70–85%", 3: "40–60%", 4: "15–30%", 5: "<10%" };
const tierTag = { 1: "매 데이터셋", 2: "대부분", 3: "자주", 4: "상황별", 5: "드묾" };

const CASES = [
  {
    tier: 1, id: "C00", name: "데이터 소스 수령·병합", sub: "CRF + Bioanalytical + Labs + Demo",
    work: "임상시험 DB에서 투약기록(CRF/eCRF), 생분석 농도(LIMS), 인구통계, 검사실 데이터를 수령. ID 키로 병합. 컬럼명 정리, 소스별 중복·불일치 식별",
    dod: "① 소스별 ID 매칭율 100% (불일치 목록 문서화) ② 병합 후 행 수 = 예상값 ③ 중복 행 0건 ④ 컬럼명 clean_names 적용",
    rTools: [
      { pkg: "readr", fn: "read_csv(), read_delim()", note: "CSV/TSV 읽기. locale() 인코딩 주의" },
      { pkg: "readxl", fn: "read_excel(), excel_sheets()", note: "Excel 파일. sheet 지정 필수" },
      { pkg: "haven", fn: "read_sas(), read_xpt()", note: "SAS .sas7bdat / SDTM .xpt 읽기" },
      { pkg: "dplyr", fn: "left_join(), full_join(), anti_join()", note: "anti_join으로 불일치 ID 즉시 탐지" },
      { pkg: "janitor", fn: "clean_names()", note: "컬럼명 일괄 snake_case 변환" },
    ],
    prompt: `"CRF 투약기록(dosing.csv), 생분석 농도(conc.csv), 인구통계(demo.csv)를 SUBJID 기준으로 병합해줘. anti_join으로 매칭 안 되는 ID를 먼저 확인하고, 전체 left_join 후 행 수를 소스별로 비교 출력해줘"`,
    note: "모든 전처리의 출발점. 여기서 ID 불일치를 놓치면 이후 모든 작업이 오염된다"
  },
  {
    tier: 1, id: "C01", name: "투약+채혈 병합", sub: "EVID·MDV 구조 설계",
    work: "EVID=1(투약행) + EVID=0(관측행)을 ID/TIME 정렬 후 병합. 투약행 DV='.', MDV=1 처리. 동일 TIME 충돌 시 투약행 우선 정렬",
    dod: "① ID×TIME 중복 없음 (동시점 투약+채혈 제외) ② EVID/MDV 값 오류 0건 ③ AMT 열 투약행에만 수치 존재 ④ NONMEM $DATA 로드 시 에러 없음",
    rTools: [
      { pkg: "dplyr", fn: "bind_rows(), arrange(), mutate(), case_when()", note: "핵심 4함수. 전처리의 70%가 이것" },
      { pkg: "dplyr", fn: "if_else(), na_if(), coalesce()", note: "조건부 값 할당, 결측 대체" },
    ],
    prompt: `"EVID=1 투약 행과 EVID=0 관측 행을 ID/TIME 기준으로 병합하되, 동일 TIME에 투약+관측이 겹치면 투약 행을 먼저 배치해줘. 투약 행의 DV는 NA로, MDV=1로 설정해줘"`,
    note: "ADVAN4에서 depot(CMT=1)→central(CMT=2) 번호 1씩 밀림 주의"
  },
  {
    tier: 1, id: "C02", name: "TIME 변환 + TAD 계산", sub: "datetime → 경과 시간(hours)",
    work: "datetime 문자열 → 첫 투약 기준 경과 시간(hours, 소수점). 다중투약 시 직전 투약 기준 TAD 별도 계산. NTAD 매핑",
    dod: "① TIME이 numeric hours ② 음수 TIME = 사전 베이스라인만 허용 ③ TAD ≥ 0 ④ NTAD 매핑 완료",
    rTools: [
      { pkg: "lubridate", fn: "ymd_hms(), mdy_hm(), dmy_hms()", note: "날짜 파싱. 포맷 자동감지 vs 명시 지정" },
      { pkg: "base/lubridate", fn: "difftime(), as.numeric(, units='hours')", note: "경과시간 계산의 핵심" },
      { pkg: "dplyr", fn: "group_by(ID), mutate(), lag()", note: "ID별 직전 투약 시각 참조 → TAD" },
    ],
    prompt: `"DATE와 CLOCK_TIME 열을 lubridate로 결합해 첫 투약 기준 경과 시간(TIME, hours)을 만들고, 각 관측 직전 투약 시각 기준 TAD도 계산해줘"`,
    note: "프로토콜 공칭 채혈시점(NTAD)과 실제 채혈시점(TAD) 모두 보존할 것"
  },
  {
    tier: 1, id: "C03", name: "NONMEM 컬럼 정렬 + 포맷팅", sub: "$INPUT 순서 맞춤 + 결측 처리",
    work: "ID, TIME, AMT, DV, EVID, MDV, CMT, RATE, [공변량] 순서 재배열. 헤더 대문자. 결측 = '.'. CSV 저장",
    dod: "① $INPUT 선언 순서 = 실제 컬럼 순서 ② 헤더 대문자 ③ 결측 = '.' (NA 없음) ④ NONMEM 로드 에러 없음",
    rTools: [
      { pkg: "dplyr", fn: "select(), relocate(), rename_with(toupper)", note: "컬럼 순서·이름 정리" },
      { pkg: "dplyr", fn: "mutate(across(everything(), ~replace_na(., '.')))", note: "NA → '.' 일괄 변환" },
      { pkg: "readr", fn: "write_csv(, na='.')", note: "na 인자로 결측 표기 자동 처리" },
    ],
    prompt: `"최종 데이터셋을 NONMEM 형식으로: ID,TIME,AMT,DV,EVID,MDV,CMT,RATE 순 재배열, 헤더 대문자, 결측='.'으로 write_csv 저장해줘"`,
    note: "write_csv(na='.') 한 줄이면 NA→'.' 변환 완료 — mutate(across()) 불필요할 수 있음"
  },
  {
    tier: 2, id: "C04", name: "BLQ 처리 (정량한계 미만)", sub: "M1(제외) / M2(LLOQ/2) / M3($PRED)",
    work: "LLOQ 미만 값을 M1(제외, MDV=1) 또는 M2(DV=LLOQ/2) 방법으로 처리. BLQ_FLAG 열 추가. 투여군별·시점별 BLQ 비율 요약",
    dod: "① BLQ_FLAG 열 존재 ② M1 시 해당 행 MDV=1 ③ M2 시 DV=LLOQ/2 & MDV=0 ④ BLQ 비율 요약표 생성",
    rTools: [
      { pkg: "dplyr", fn: "mutate(), case_when(), if_else()", note: "BLQ 판별 및 FLAG 부여" },
      { pkg: "dplyr", fn: "group_by(), summarise(), n()", note: "투여군·시점별 BLQ 비율 계산" },
      { pkg: "tidyr", fn: "pivot_wider()", note: "BLQ 비율을 시점×그룹 테이블로 전환" },
    ],
    prompt: `"LLOQ=X ng/mL 미만에 BLQ_FLAG=1 부여, M1 방법으로 MDV=1 처리. 투여군별·NTAD별 BLQ 비율 요약 테이블도 만들어줘"`,
    note: "BLQ >20-30% → M3 method($PRED likelihood 개조) 고려. M3는 NONMEM 코딩 영역"
  },
  {
    tier: 2, id: "C05", name: "공변량 결측치 처리", sub: "Median/Mode 대체 + MISS_FLAG",
    work: "연속형: 중앙값 대체. 범주형: 최빈값 대체. MISS_FLAG 열 추가. 결측 패턴 분석(MCAR/MAR/MNAR)",
    dod: "① 공변량 열에 NA 0건 ② MISS_FLAG로 대체 여부 추적 ③ 대체 값 기록 ④ 결측 비율 열별 요약",
    rTools: [
      { pkg: "dplyr", fn: "mutate(), if_else(), across(where(is.numeric))", note: "조건부 대체의 기본" },
      { pkg: "tidyr", fn: "replace_na(list(WT=median_wt))", note: "명시적 대체값 지정" },
      { pkg: "dplyr", fn: "summarise(across(everything(), ~sum(is.na(.))))", note: "결측 비율 일괄 계산" },
    ],
    prompt: `"연속형(WT,AGE,ALB)은 중앙값, 범주형(SEX,RACE)은 최빈값으로 결측 대체. MISS_FLAG=1 추가하고 열별 결측 비율 요약해줘"`,
    note: "결측 >30% 공변량은 분석 제외 or 감도분석 대상"
  },
  {
    tier: 2, id: "C06", name: "파생변수 계산", sub: "CrCL, BSA, BMI, LBW, FFM",
    work: "CrCL: Cockcroft-Gault (SCR 단위 확인). BSA: DuBois/Mosteller. BMI. LBW(Janmahasatian). 극단값 Winsorizing",
    dod: "① 단위 명시 ② 음수·비현실값 0건 ③ Winsorizing 범위 기록 ④ 원본 보존",
    rTools: [
      { pkg: "dplyr", fn: "mutate() + 커스텀 수식", note: "CG식, BSA식을 mutate 내 직접 코딩" },
      { pkg: "base", fn: "pmin(), pmax()", note: "Winsorizing 핵심: pmin(pmax(x, lo), hi)" },
    ],
    prompt: `"SCR(mg/dL), AGE, WT, SEX로 CG식 CrCL 계산 (여성 ×0.85). pmin/pmax로 10~200 Winsorize해줘"`,
    note: "SCR 단위 μmol/L 시 ÷88.4 변환 — 가장 흔한 단위 오류"
  },
  {
    tier: 2, id: "C07", name: "탐색적 시각화 (EDA)", sub: "Spaghetti + Dose-normalized + 공변량 분포",
    work: "① Spaghetti plot (log-Y, ID별 선, 그룹별 색) ② Dose-normalized 중첩 ③ 공변량 분포 ④ 관측 빈도 히트맵",
    dod: "① 입력 오류 발견·수정 ② 선형/비선형 1차 판단 ③ 이상치 후보 도출 ④ 공변량 분포 확인",
    rTools: [
      { pkg: "ggplot2", fn: "geom_line(), geom_point(), aes(group=ID, color=DOSE_GRP)", note: "spaghetti plot 기본 구조" },
      { pkg: "ggplot2", fn: "scale_y_log10(), facet_wrap(~DOSE_GRP)", note: "로그축 + 패널 분할" },
      { pkg: "ggplot2", fn: "geom_histogram(), geom_boxplot(), geom_density()", note: "공변량 분포 탐색" },
      { pkg: "patchwork", fn: "plot1 + plot2 / plot3", note: "다중 플롯 배치의 최신 표준" },
    ],
    prompt: `"ID별 DV vs TIME 선 그래프: y축 log10, 투여군별 색, alpha=0.3. 아래에 dose-normalized DV vs TIME 추가. patchwork로 상하 배치해줘"`,
    note: "EDA 없이 NONMEM 투입은 FDA 리뷰어가 가장 먼저 지적하는 오류"
  },
  {
    tier: 2, id: "C16", name: "단위 표준화·검증", sub: "농도·용량·체중 단위 통일",
    work: "농도 단위(ng/mL, μg/mL, nM → 통일), 용량 단위(mg, mg/kg → mg 환산), 체중 기반 투여량 환산. 단위 변환 이력 추적",
    dod: "① DV 단위 단일화 완료 ② AMT 단위 단일화 완료 ③ 변환 계수 문서화 ④ 변환 전후 범위 비교표 생성",
    rTools: [
      { pkg: "dplyr", fn: "case_when(), mutate()", note: "소스별 다른 단위 → 조건부 변환" },
      { pkg: "dplyr", fn: "distinct(), count()", note: "단위 열의 고유값 확인 → 변환 누락 탐지" },
    ],
    prompt: `"CONC_UNIT 열이 'ng/mL'과 'ug/mL' 혼재. 전부 ng/mL로 통일하고, 변환된 행에 UNIT_CONV_FLAG=1을 부여해줘. 변환 전후 DV 범위를 group별로 비교해줘"`,
    note: "ng/mL ↔ μg/mL 1000배 오류 — 발견 안 되면 CL이 1000배 틀린 결과 출판"
  },
  {
    tier: 3, id: "C08", name: "이상치 탐지 + FLAG", sub: "통계적 + 생물학적 판별",
    work: "시점별 ±3IQR, 생물학적 불가능 값, C(t) 점프 패턴 탐지. OBS_FLAG 열 마킹. 임상 검토 후 처리 결정",
    dod: "① OBS_FLAG 열 존재 ② FLAG 행에 판별 근거 ③ 제외/MDV=1 방향 결정 ④ 감도분석 계획",
    rTools: [
      { pkg: "dplyr", fn: "group_by(NTAD), mutate(), IQR()", note: "시점별 IQR 기반 이상치 탐지" },
      { pkg: "ggplot2", fn: "geom_boxplot(), geom_jitter()", note: "시점별 분포 시각적 확인" },
      { pkg: "dplyr", fn: "filter(OBS_FLAG==1) %>% select(ID,TIME,DV)", note: "이상치 목록 추출" },
    ],
    prompt: `"NTAD별 DV의 중앙값±3IQR 초과 관측에 OBS_FLAG=1 부여. 해당 행 ID·TIME·DV 테이블 추출해줘"`,
    note: "통계적 이상치 ≠ 생물학적 이상치 — 반드시 임상 맥락 재확인 후 최종 결정"
  },
  {
    tier: 3, id: "C09", name: "반복투여 + SS 코딩", sub: "ADDL, II, SS",
    work: "규칙적 반복투여를 ADDL+II로 압축. SS=1 + II 부여. 불규칙 투약은 개별 행 전개",
    dod: "① ADDL×II 논리적 정합 ② SS=1의 II = 실제 투약 간격(±10%) ③ 불규칙 구간 복원 ④ NONMEM 경고 없음",
    rTools: [
      { pkg: "dplyr", fn: "group_by(ID), mutate(), lag(), lead()", note: "투약 간격 계산 → II 도출" },
      { pkg: "dplyr", fn: "summarise(n_doses=n()), cumsum()", note: "ADDL 계산용 투약 횟수 집계" },
    ],
    prompt: `"QD 20mg을 D1~D14 투여 후 D14 PK 채혈: D14 투약행에 ADDL=13, II=24, SS=1을 설정하는 구조로 변환해줘"`,
    note: "II 단위 = TIME 단위. TIME이 hours면 II도 hours"
  },
  {
    tier: 3, id: "C10", name: "정맥 주입 코딩", sub: "RATE / RATE=-2 + D1",
    work: "실제 속도(RATE=mg/h) 또는 RATE=-2 + D1(주입시간) 방식. 시작/종료 TIME. 볼루스 혼용 처리",
    dod: "① RATE 또는 D1 일관 사용 ② 주입 후 TIME 연속성 ③ AMT=총투여량 ④ 피크 재현 확인",
    rTools: [
      { pkg: "dplyr", fn: "mutate(RATE = -2, D1 = INF_DUR)", note: "RATE=-2 방식 (D1 추정)" },
      { pkg: "dplyr", fn: "mutate(RATE = AMT / INF_DUR)", note: "실제 RATE 직접 계산 방식" },
    ],
    prompt: `"AMT(mg)와 INF_DUR(hours)에서 RATE=-2, D1=INF_DUR로 NONMEM 형식 변환해줘"`,
    note: "RATE=-2는 'D1 파라미터를 추정하라'는 NONMEM 신호. 고정 주입시간이면 RATE=AMT/D1 직접 계산이 단순"
  },
  {
    tier: 3, id: "C17", name: "데이터셋 QC·검증", sub: "Programmatic Check + Define File",
    work: "① 필수 컬럼 존재/타입 점검 ② ID별 최소 1개 투약+1개 관측 확인 ③ TIME 단조증가 검증 ④ AMT>0이면 EVID=1 일관성 ⑤ Define file(데이터 명세서) 생성",
    dod: "① 프로그래밍 QC 체크 전항목 PASS ② Define file 완성 ③ 더블 프로그래밍 or 독립 검증 기록",
    rTools: [
      { pkg: "dplyr", fn: "group_by(ID) %>% summarise() + filter()", note: "ID별 투약/관측 행 수 점검" },
      { pkg: "dplyr", fn: "arrange(ID,TIME) %>% mutate(diff=TIME-lag(TIME))", note: "TIME 단조증가 확인" },
      { pkg: "base", fn: "stopifnot(), warning(), message()", note: "assertion 기반 QC 자동화" },
      { pkg: "rmarkdown", fn: "render()", note: "QC 보고서 자동 생성 (Rmd→HTML)" },
    ],
    prompt: `"최종 NONMEM 데이터셋에 대해 QC 점검 실행: ① 모든 필수 컬럼 존재 ② ID별 EVID=1 최소 1행 ③ TIME 단조증가 ④ EVID=1일 때 AMT>0. 위반 사항을 ID별 테이블로 출력해줘"`,
    note: "FDA PopPK 리뷰에서 데이터 무결성 지적은 주요 결함(Major Deficiency)으로 분류됨"
  },
  {
    tier: 4, id: "C11", name: "다중 분석물질 (DVID)", sub: "Parent + Metabolite",
    work: "DVID/CMT로 분석물질 구분. 동일 TIME에 Parent·Metabolite 별도 행 분리. $ERROR 분기 구조 준비",
    dod: "① DVID 일관성 ② 동일 TIME 분석물질별 행 분리 ③ DV 단위 통일 ④ $ERROR 분기 메모",
    rTools: [
      { pkg: "tidyr", fn: "pivot_longer(cols=c(PARENT,METABOLITE))", note: "Wide→Long 변환의 핵심" },
      { pkg: "dplyr", fn: "mutate(DVID=case_when(), CMT=case_when())", note: "DVID·CMT 할당" },
    ],
    prompt: `"동일 시점 parent/metabolite 측정 데이터를 pivot_longer로 Long 형식 변환 후 DVID=1/2, CMT=2/3 부여해줘"`,
    note: "FDA: active metabolite 존재 시 parent+metabolite PK 모두 규명 요구"
  },
  {
    tier: 4, id: "C12", name: "교차설계 + Occasion (OCC)", sub: "Period, Washout, IOV",
    work: "Period별 OCC 번호 부여. Washout 구간 FLAG. Period 내 TIME 재계산. Carry-over 검토",
    dod: "① OCC 열 존재 ② Washout 관측 WFLAG=1 ③ Period별 TIME=0 재설정 ④ Carry-over 판단 기록",
    rTools: [
      { pkg: "dplyr", fn: "group_by(ID, PERIOD), mutate(TIME=TIME-min(TIME))", note: "Period별 TIME 리셋" },
      { pkg: "dplyr", fn: "mutate(OCC=PERIOD)", note: "OCC 부여 (IOV 모델링 출발점)" },
    ],
    prompt: `"2-Period 교차설계에서 Period별 OCC=1/2 부여, Period별 TIME 재계산, Washout(Day X~Y) 관측에 WFLAG=1 표시해줘"`,
    note: "OCC와 IIV를 구분하는 것이 IOV(Inter-Occasion Variability) 모델링의 출발점"
  },
  {
    tier: 4, id: "C13", name: "시간의존 공변량 (TVC)", sub: "EVID=2 삽입 / LOCF",
    work: "방문별 변하는 공변량(SCR, WT, ALB)을 EVID=2 행 삽입 또는 LOCF 방식으로 처리",
    dod: "① 공변량 변경 시점 행 존재 ② TIME 순서 일치 ③ 방법 SAP 기록",
    rTools: [
      { pkg: "tidyr", fn: "fill(.direction='down')", note: "LOCF 한 줄 구현 — 가장 깔끔" },
      { pkg: "dplyr", fn: "bind_rows() %>% arrange(ID, TIME)", note: "EVID=2 행 삽입 후 재정렬" },
    ],
    prompt: `"방문별 SCR을 시간의존 공변량으로: EVID=2 행 삽입 or tidyr::fill()로 LOCF 적용해줘"`,
    note: "TVC 미처리 → 반복투여 CL 변화가 랜덤효과에 흡수 — 해석 오류의 원천"
  },
  {
    tier: 4, id: "C14", name: "SC/IM/Depot 경로 코딩", sub: "CMT=1(depot) + ALAG/Transit",
    work: "Depot CMT=1 → Central CMT=2 흡수 구조. ALAG·Transit 모델용 CMT 배정. SC F1 연결",
    dod: "① 투약행 CMT=1 ② 관측행 CMT=2 ③ F1·ALAG 구조 준비 ④ ADVAN4/13 선택 근거",
    rTools: [
      { pkg: "dplyr", fn: "mutate(CMT=if_else(EVID==1, 1, 2))", note: "경로별 CMT 할당" },
      { pkg: "dplyr", fn: "case_when(ROUTE=='IV' ~ 2, ROUTE=='SC' ~ 1)", note: "IV+SC 혼합 데이터 처리" },
    ],
    prompt: `"SC 투여 데이터: 투약행 CMT=1(depot), 관측행 CMT=2(central)로 배정. IV+SC 혼합이면 IV는 CMT=2로 해줘"`,
    note: "LAI(팔리페리돈 팔미테이트 등)는 ADVAN13+$DES Transit 모델 필수"
  },
  {
    tier: 5, id: "C15", name: "외부 데이터 통합 (PGx·바이오마커)", sub: "유전형·표적발현·ADA",
    work: "CYP genotype, biomarker, ADA 데이터를 ID 기준 병합. 대립유전자 표기 표준화. 결측 유전형 처리",
    dod: "① ID 매칭 완료 ② 대립유전자 표기 통일 ③ 결측 GENO_FLAG=1 ④ PM/IM/EM/UM 분류 기준 문서화",
    rTools: [
      { pkg: "dplyr", fn: "left_join(), mutate()", note: "외부 데이터 병합" },
      { pkg: "stringr", fn: "str_extract(), str_replace(), str_c()", note: "대립유전자 문자열 파싱" },
      { pkg: "forcats", fn: "fct_recode(), fct_collapse()", note: "표현형 범주 재코딩" },
    ],
    prompt: `"PGx 데이터(ID, CYP2D6_AL1, CYP2D6_AL2)를 PK 데이터에 ID 병합, 대립유전자 조합 → PM/IM/EM/UM 분류 열 생성해줘"`,
    note: "CYP2C9/2D6/3A4 — 임상약사 출신에게 가장 친숙한 영역. 강점 활용 지점"
  },
];

const R_STACK = [
  {
    phase: "Phase 1: 기초 무장 (Week 1–4)", color: "#dc2626", bg: "#fef2f2",
    desc: "이 패키지들만 익히면 Tier 1–2 전체(C00~C07, C16)를 커버한다",
    pkgs: [
      { name: "dplyr", role: "데이터 조작의 핵심 엔진", fns: "mutate, filter, select, arrange, group_by, summarise, left_join, case_when, across", cases: "C00~C17 전체", pct: 70 },
      { name: "readr", role: "CSV/TSV 읽기·쓰기", fns: "read_csv, write_csv (na='.')", cases: "C00, C03", pct: 10 },
      { name: "ggplot2", role: "시각화", fns: "geom_line, geom_point, geom_histogram, scale_y_log10, facet_wrap", cases: "C07, C08", pct: 15 },
      { name: "lubridate", role: "날짜/시간 파싱·계산", fns: "ymd_hms, difftime, as.numeric", cases: "C02", pct: 8 },
      { name: "tidyr", role: "데이터 형태 변환", fns: "pivot_longer, pivot_wider, fill, replace_na", cases: "C04, C05, C11, C13", pct: 12 },
    ]
  },
  {
    phase: "Phase 2: 확장 도구 (Week 5–8)", color: "#d97706", bg: "#fffbeb",
    desc: "Tier 3–4 케이스와 보고서 자동화에 필요한 도구들",
    pkgs: [
      { name: "readxl / haven", role: "Excel·SAS 파일 읽기", fns: "read_excel, read_sas, read_xpt", cases: "C00", pct: 5 },
      { name: "janitor", role: "컬럼명 정리", fns: "clean_names, tabyl", cases: "C00", pct: 3 },
      { name: "stringr", role: "문자열 처리", fns: "str_extract, str_replace, str_c", cases: "C15", pct: 5 },
      { name: "forcats", role: "범주형 변수 관리", fns: "fct_recode, fct_collapse, fct_relevel", cases: "C15, C05", pct: 4 },
      { name: "patchwork", role: "다중 플롯 배치", fns: "p1 + p2 / p3, plot_layout()", cases: "C07", pct: 5 },
      { name: "rmarkdown", role: "재현가능 보고서", fns: "render(), knitr::kable()", cases: "C17", pct: 8 },
    ]
  },
  {
    phase: "Phase 3: 계량약리학 특화 (Week 9–16)", color: "#2563eb", bg: "#eff6ff",
    desc: "NONMEM 결과 진단·시각화 — 전처리 이후 분석 단계 진입에 필요",
    pkgs: [
      { name: "xpose / xpose4", role: "NONMEM 진단 플롯", fns: "xpose_data(), dv_vs_pred(), res_vs_idv()", cases: "모델링 진단", pct: 0 },
      { name: "vpc", role: "Visual Predictive Check", fns: "vpc(), vpc_data(), plot()", cases: "모델 검증", pct: 0 },
      { name: "mrgsolve", role: "ODE 시뮬레이션", fns: "mread(), mrgsim(), ev()", cases: "시뮬레이션", pct: 0 },
      { name: "PKPDmisc", role: "PK 유틸리티 함수", fns: "NCA 보조, 단위 변환 등", cases: "전반", pct: 0 },
    ]
  }
];

export default function PKPreprocessMapV2() {
  const [view, setView] = useState("cases");
  const [expanded, setExpanded] = useState(null);
  const [filterTier, setFilterTier] = useState(0);
  const [showR, setShowR] = useState({});

  const displayed = filterTier === 0 ? CASES : CASES.filter(c => c.tier === filterTier);
  const f = "'Pretendard','Noto Sans KR',system-ui,sans-serif";

  const Stars = ({ tier }) => (
    <span style={{ fontSize: 9, letterSpacing: -1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= (6-tier) ? tierColor[tier] : "#d1d5db" }}>★</span>)}
    </span>
  );

  const renderCases = () => (
    <div>
      <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={() => setFilterTier(0)} style={{ padding: "3px 10px", borderRadius: 16, border: "1.5px solid #374151", background: filterTier===0?"#1e40af":"#fff", color: filterTier===0?"#fff":"#374151", fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: f }}>전체 (18)</button>
        {TIERS.map(t => (
          <button key={t.tier} onClick={() => setFilterTier(t.tier)} style={{ padding: "3px 10px", borderRadius: 16, border: `1.5px solid ${t.color}`, background: filterTier===t.tier?t.color:"#fff", color: filterTier===t.tier?"#fff":t.color, fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: f }}>
            T{t.tier} {t.pct}
          </button>
        ))}
      </div>

      {displayed.map((c, i) => {
        const col = tierColor[c.tier]; const bg = tierBg[c.tier];
        const isOpen = expanded === c.id;
        const rOpen = showR[c.id];
        return (
          <div key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div onClick={() => setExpanded(isOpen ? null : c.id)}
              style={{ display: "flex", gap: 8, padding: "7px 8px", background: isOpen ? bg : (i%2===0?"#fafafa":"#fff"), cursor: "pointer", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 28, flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", background: col, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>T{c.tier}</span>
                <span style={{ fontSize: 8, color: "#9ca3af" }}>{c.id}</span>
              </div>
              <div style={{ minWidth: 110, maxWidth: 130, flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: "#1a1a2e", lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.3, marginTop: 1 }}>{c.sub}</div>
              </div>
              <div style={{ minWidth: 56, flexShrink: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                <Stars tier={c.tier} />
                <span style={{ fontSize: 8, fontWeight: 700, color: col, background: `${col}12`, padding: "1px 5px", borderRadius: 8, display: "inline-block", textAlign: "center" }}>{tierPct[c.tier]}</span>
              </div>
              <div style={{ flex: 1, fontSize: 10, color: "#374151", lineHeight: 1.5 }}>{c.work}</div>
              <span style={{ fontSize: 10, color: "#9ca3af", flexShrink: 0, transform: isOpen?"rotate(180deg)":"rotate(0)", transition: "0.15s" }}>▼</span>
            </div>

            {isOpen && (
              <div style={{ padding: "8px 10px 10px 44px", background: bg, borderTop: `1.5px solid ${col}22` }}>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: col, marginBottom: 2 }}>✅ 완료 조건 (Definition of Done)</div>
                  <div style={{ fontSize: 10, color: "#374151", lineHeight: 1.6, background: "#fff", padding: "5px 8px", borderRadius: 5, border: `1px solid ${col}18` }}>{c.dod}</div>
                </div>

                <div style={{ marginBottom: 6 }}>
                  <div onClick={() => setShowR(p => ({...p, [c.id]: !p[c.id]}))}
                    style={{ fontSize: 9, fontWeight: 800, color: col, marginBottom: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    📦 R 패키지·함수 매핑 <span style={{ fontSize: 8, color: "#9ca3af", fontWeight: 400 }}>{rOpen ? "▲ 접기" : "▼ 펼치기"}</span>
                  </div>
                  {rOpen && (
                    <div style={{ background: "#fff", borderRadius: 5, border: `1px solid ${col}18`, overflow: "hidden" }}>
                      {c.rTools.map((t, ti) => (
                        <div key={ti} style={{ display: "flex", gap: 6, padding: "4px 8px", borderBottom: ti < c.rTools.length-1 ? "1px solid #f3f4f6" : "none", fontSize: 10 }}>
                          <span style={{ fontWeight: 700, color: col, minWidth: 70, fontFamily: "monospace", fontSize: 9, flexShrink: 0 }}>{t.pkg}</span>
                          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#1e40af", minWidth: 160, flexShrink: 0 }}>{t.fn}</span>
                          <span style={{ color: "#6b7280", fontSize: 9 }}>{t.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: col, marginBottom: 2 }}>💬 프롬프트 패턴</div>
                  <pre style={{ fontSize: 9, background: "#1e293b", color: "#86efac", padding: "6px 8px", borderRadius: 5, margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Courier New',monospace" }}>{c.prompt}</pre>
                </div>
                <div style={{ fontSize: 9, color: "#6b7280", background: `${col}08`, padding: "3px 7px", borderRadius: 4, borderLeft: `2px solid ${col}` }}>
                  <span style={{ fontWeight: 700, color: col }}>⚠ 주의: </span>{c.note}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRStack = () => (
    <div>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 10, lineHeight: 1.6 }}>
        Phase 1만 완전히 익히면 Tier 1–2(전체 케이스의 70–85%)를 독립 수행할 수 있다. Phase 1의 핵심은 dplyr 하나다.
      </div>
      {R_STACK.map((ph, pi) => (
        <div key={pi} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: ph.color, borderRadius: 2 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 12, color: ph.color }}>{ph.phase}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>{ph.desc}</div>
            </div>
          </div>
          {ph.pkgs.map((p, pj) => (
            <div key={pj} style={{ marginLeft: 14, marginBottom: 4, padding: "5px 8px", background: ph.bg, borderRadius: 5, border: `1px solid ${ph.color}18` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 11, color: ph.color, fontFamily: "monospace" }}>{p.name}</span>
                <span style={{ fontSize: 9, color: "#374151" }}>{p.role}</span>
                {p.pct > 0 && <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: ph.color, padding: "0 5px", borderRadius: 8, marginLeft: "auto" }}>전처리 사용 빈도 ~{p.pct}%</span>}
              </div>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "#1e40af", lineHeight: 1.5 }}>{p.fns}</div>
              <div style={{ fontSize: 8, color: "#9ca3af", marginTop: 1 }}>적용 케이스: {p.cases}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ padding: "8px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 10, lineHeight: 1.6, marginTop: 8 }}>
        <span style={{ fontWeight: 700, color: "#166534" }}>80/20 법칙: </span>
        <span style={{ color: "#374151" }}>dplyr(6개 동사) + ggplot2(3개 geom) + readr(2개 함수) = 전처리 작업량의 80%. 나머지는 필요할 때 찾아 쓰면 된다.</span>
      </div>
    </div>
  );

  const renderPath = () => (
    <div>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 10 }}>T+0 → T+12 구간. R 전처리 역량 → NONMEM 독립 실행까지의 학습 경로</div>
      {[
        { wk: "Week 1–2", title: "R 기초 + dplyr 6동사", tasks: "mutate, filter, select, arrange, group_by, summarise를 C01·C02·C03 데이터로 반복 훈련. pipe(%>%) 문법 체화", cases: "C00, C01, C02, C03", color: "#dc2626", milestone: "Tier 1 데이터셋 독립 조립" },
        { wk: "Week 3–4", title: "ggplot2 + lubridate", tasks: "spaghetti plot, dose-normalized plot, 공변량 히스토그램. 날짜/시간 → TIME 변환 완전 숙달", cases: "C02, C07", color: "#dc2626", milestone: "EDA 플롯 4종 독립 생성" },
        { wk: "Week 5–6", title: "Tier 2 전처리 완전 숙달", tasks: "BLQ 처리, 결측 대체, 파생변수, 단위 표준화. join 계열 함수 숙달", cases: "C04, C05, C06, C16", color: "#d97706", milestone: "Tier 2 케이스 독립 수행" },
        { wk: "Week 7–8", title: "이상치·QC + 첫 NONMEM 실행", tasks: "이상치 FLAG, 데이터셋 QC 자동화. C01~C07+C16+C17 완성 데이터로 ADVAN2 첫 실행", cases: "C08, C17", color: "#d97706", milestone: "NONMEM 첫 성공 실행" },
        { wk: "Week 9–12", title: "Tier 3 + NONMEM 진단", tasks: "반복투여 코딩, 주입 처리. xpose/vpc로 GOF·VPC 생성. ADVAN4 TRANS4 실행", cases: "C09, C10", color: "#2563eb", milestone: "2-comp PO 모델 독립 완성" },
        { wk: "Week 13–16", title: "Tier 4 + ADVAN13 진입", tasks: "다중 분석물질, 교차설계, 시간의존 공변량, Depot 경로. $DES 블록 첫 코딩", cases: "C11~C14", color: "#7c3aed", milestone: "복합 데이터 전처리 독립" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ minWidth: 70, flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: s.color }}>{s.wk}</div>
          </div>
          <div style={{ width: 3, background: s.color, borderRadius: 2, flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 4, left: -4, width: 11, height: 11, borderRadius: "50%", background: s.color, border: "2px solid #fff" }} />
          </div>
          <div style={{ flex: 1, padding: "4px 8px", background: `${s.color}08`, borderRadius: 6, border: `1px solid ${s.color}18` }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: s.color, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 10, color: "#374151", lineHeight: 1.5, marginBottom: 3 }}>{s.tasks}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 8, color: "#9ca3af" }}>케이스: {s.cases}</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: s.color, padding: "1px 6px", borderRadius: 8 }}>{s.milestone}</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ padding: "7px 9px", background: "#eff6ff", borderRadius: 6, fontSize: 9, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: "#1d4ed8", marginBottom: 2 }}>📌 진입 순서 요약</div>
          <div style={{ color: "#374151" }}>C00→C01→C02→C03 (Tier 1)<br/>→ C07→C04→C05→C06→C16 (Tier 2)<br/>→ C08→C17→C09→C10 (Tier 3)<br/>→ C11→C12→C13→C14 (Tier 4)<br/>→ C15 (필요 시)</div>
        </div>
        <div style={{ padding: "7px 9px", background: "#f0fdf4", borderRadius: 6, fontSize: 9, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: "#166534", marginBottom: 2 }}>🎯 NONMEM 연계 경로</div>
          <div style={{ color: "#374151" }}>Tier 1 완료 → ADVAN2 첫 실행<br/>Tier 2 완료 → ADVAN4 TRANS4<br/>Tier 3 완료 → ADVAN3 + Infusion<br/>Tier 4 완료 → ADVAN13+$DES</div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 10 }}>18개 케이스 × R 도구 매핑 — 전처리 역량 자기진단표</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
          <thead>
            <tr style={{ background: "#1e293b", color: "#fff" }}>
              {["ID","케이스명","Tier","빈도","핵심 R 패키지","dplyr 의존도"].map(h => (
                <th key={h} style={{ padding: "5px 6px", textAlign: "left", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASES.map((c, i) => {
              const col = tierColor[c.tier];
              const pkgs = [...new Set(c.rTools.map(t => t.pkg))].join(", ");
              const hasDplyr = c.rTools.some(t => t.pkg === "dplyr");
              return (
                <tr key={c.id} style={{ background: i%2===0 ? "#fafafa" : "#fff", borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "4px 6px", fontWeight: 700, color: col }}>{c.id}</td>
                  <td style={{ padding: "4px 6px" }}>{c.name}</td>
                  <td style={{ padding: "4px 6px" }}><span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: col, padding: "1px 5px", borderRadius: 8 }}>T{c.tier}</span></td>
                  <td style={{ padding: "4px 6px", color: col, fontWeight: 700 }}>{tierPct[c.tier]}</td>
                  <td style={{ padding: "4px 6px", fontFamily: "monospace", fontSize: 8 }}>{pkgs}</td>
                  <td style={{ padding: "4px 6px" }}>
                    <div style={{ width: 60, height: 8, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: hasDplyr ? "100%" : "20%", height: "100%", background: hasDplyr ? "#2563eb" : "#d1d5db", borderRadius: 3 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8, padding: "6px 8px", background: "#fef3c7", borderRadius: 5, fontSize: 9, color: "#92400e", fontWeight: 600 }}>
        결론: dplyr는 18개 케이스 중 18개 전체에서 사용된다. dplyr를 마스터하면 전처리의 70%가 해결된다.
      </div>
    </div>
  );

  const tabs = [
    ["cases", "케이스 맵 (18)"],
    ["rstack", "R 도구 스택"],
    ["path", "학습 경로"],
    ["summary", "요약 매트릭스"],
  ];

  return (
    <div style={{ fontFamily: f, maxWidth: 920, margin: "0 auto", padding: "12px 10px", fontSize: 12, color: "#1a1a2e" }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 2px" }}>계량약리학 데이터 전처리 + R 학습 완전 지형도</h2>
      <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 10px" }}>5 Tiers · 18 Cases · R 패키지 매핑 · 학습 경로 — v2 검수 완료본</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => { setView(k); setExpanded(null); setFilterTier(0); }}
            style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: view===k?"#1e40af":"#fff", color: view===k?"#fff":"#374151", fontWeight: 600, fontSize: 10, cursor: "pointer", fontFamily: f }}>{l}</button>
        ))}
      </div>

      {view === "cases" && renderCases()}
      {view === "rstack" && renderRStack()}
      {view === "path" && renderPath()}
      {view === "summary" && renderSummary()}

      <div style={{ marginTop: 12, padding: "7px 9px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 10, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: "#166534" }}>v1 → v2 변경사항: </span>
        <span style={{ color: "#374151" }}>+C00(소스 병합) +C16(단위 표준화) +C17(데이터셋 QC) 추가 → 총 18케이스. 전 케이스에 R 패키지·함수 매핑 완비. R 도구 스택·학습 경로·요약 매트릭스 뷰 신설</span>
      </div>
    </div>
  );
}
