import { useState } from "react";

const DAIRY_TYPES = {
  VN: [
    {
      id: "qcvn5-1",
      name: "살균·멸균 우유",
      code: "QCVN 5-1:2010/BYT",
      criteria: { fatMin: 3.2, snfMin: 8.0, moistureMax: null },
      description: "유지방 ≥ 3.2%, 무지유고형분 ≥ 8.0%",
    },
    {
      id: "qcvn5-1-low",
      name: "저지방 우유",
      code: "QCVN 5-1:2010/BYT",
      criteria: { fatMin: 0.5, fatMax: 1.8, snfMin: 8.0 },
      description: "유지방 0.5~1.8%, 무지유고형분 ≥ 8.0%",
    },
    {
      id: "qcvn5-1-skim",
      name: "탈지 우유",
      code: "QCVN 5-1:2010/BYT",
      criteria: { fatMax: 0.5, snfMin: 8.0 },
      description: "유지방 < 0.5%, 무지유고형분 ≥ 8.0%",
    },
    {
      id: "qcvn5-2",
      name: "발효유 (요거트)",
      code: "QCVN 5-2:2010/BYT",
      criteria: { fatMin: 0, lacticAcidBacteriaMin: 1000000 },
      description: "유산균 ≥ 10⁶ CFU/g",
    },
    {
      id: "qcvn5-3",
      name: "연유 (가당)",
      code: "QCVN 5-3:2010/BYT",
      criteria: { fatMin: 8.0, moistureMax: 27.0 },
      description: "유지방 ≥ 8%, 수분 ≤ 27%",
    },
    {
      id: "qcvn5-4",
      name: "크림류",
      code: "QCVN 5-4:2010/BYT",
      criteria: { fatMin: 18.0 },
      description: "유지방 ≥ 18%",
    },
    {
      id: "qcvn5-5",
      name: "버터",
      code: "QCVN 5-5:2010/BYT",
      criteria: { fatMin: 80.0, moistureMax: 16.0 },
      description: "유지방 ≥ 80%, 수분 ≤ 16%",
    },
    {
      id: "qcvn5-6",
      name: "치즈",
      code: "QCVN 5-6:2010/BYT",
      criteria: { fatMin: 22.0, moistureMax: 46.0 },
      description: "유지방 ≥ 22%, 수분 ≤ 46% (경성치즈 기준)",
    },
    {
      id: "qcvn5-7",
      name: "카제인",
      code: "QCVN 5-7:2010/BYT",
      criteria: { proteinMin: 88.0, moistureMax: 12.0 },
      description: "단백질 ≥ 88%, 수분 ≤ 12%",
    },
    {
      id: "powder",
      name: "분유 (전지·탈지)",
      code: "TCVN 5538:2002",
      criteria: { fatMin: 26.0, moistureMax: 5.0 },
      description: "유지방 ≥ 26% (전지), 수분 ≤ 5%",
    },
  ],
  KH: [
    { id: "codex-milk", name: "우유류", code: "Codex Stan A-6", criteria: { fatMin: 3.2, snfMin: 8.0 } },
    { id: "codex-yogurt", name: "발효유", code: "Codex Stan A-11", criteria: { fatMin: 0 } },
    { id: "codex-butter", name: "버터", code: "Codex Stan A-1", criteria: { fatMin: 80.0, moistureMax: 16.0 } },
    { id: "codex-cheese", name: "치즈", code: "Codex Stan A-6", criteria: {} },
    { id: "codex-cream", name: "크림", code: "Codex Stan A-9", criteria: { fatMin: 18.0 } },
    { id: "codex-powder", name: "분유", code: "Codex Stan A-5", criteria: { moistureMax: 5.0 } },
  ],
};

const ADDITIVES_DB = {
  100: { name: "쿠르쿠민 (Curcumin)", allowedTypes: ["qcvn5-2", "qcvn5-6", "powder"], maxLevel: 100, purpose: "착색료", vnAllowed: true, khAllowed: true },
  101: { name: "리보플라빈 (Riboflavin)", allowedTypes: ["all"], maxLevel: 300, purpose: "착색료", vnAllowed: true, khAllowed: true },
  102: { name: "타르트라진 (Tartrazine)", allowedTypes: ["qcvn5-2"], maxLevel: 100, purpose: "착색료", vnAllowed: true, khAllowed: true },
  110: { name: "선셋옐로우 FCF", allowedTypes: ["qcvn5-2"], maxLevel: 100, purpose: "착색료", vnAllowed: true, khAllowed: true },
  120: { name: "코치닐 (Carmine)", allowedTypes: ["qcvn5-2", "qcvn5-6"], maxLevel: 150, purpose: "착색료", vnAllowed: true, khAllowed: true },
  200: { name: "소르빈산 (Sorbic acid)", allowedTypes: ["qcvn5-6", "qcvn5-5"], maxLevel: 1000, purpose: "보존료", vnAllowed: true, khAllowed: true },
  202: { name: "소르빈산칼륨", allowedTypes: ["qcvn5-6", "qcvn5-5"], maxLevel: 1000, purpose: "보존료", vnAllowed: true, khAllowed: true },
  210: { name: "안식향산 (Benzoic acid)", allowedTypes: [], maxLevel: 0, purpose: "보존료", vnAllowed: false, khAllowed: false },
  211: { name: "안식향산나트륨", allowedTypes: [], maxLevel: 0, purpose: "보존료", vnAllowed: false, khAllowed: false },
  270: { name: "젖산 (Lactic acid)", allowedTypes: ["all"], maxLevel: null, purpose: "산도조절제", vnAllowed: true, khAllowed: true },
  300: { name: "아스코르빈산 (Vit.C)", allowedTypes: ["all"], maxLevel: null, purpose: "산화방지제", vnAllowed: true, khAllowed: true },
  322: { name: "레시틴 (Lecithin)", allowedTypes: ["all"], maxLevel: null, purpose: "유화제", vnAllowed: true, khAllowed: true },
  331: { name: "구연산나트륨", allowedTypes: ["qcvn5-3", "qcvn5-6"], maxLevel: 3000, purpose: "산도조절제", vnAllowed: true, khAllowed: true },
  332: { name: "구연산칼륨", allowedTypes: ["qcvn5-3", "qcvn5-6"], maxLevel: 3000, purpose: "산도조절제", vnAllowed: true, khAllowed: true },
  407: { name: "카라기난 (Carrageenan)", allowedTypes: ["qcvn5-1", "qcvn5-2", "qcvn5-3"], maxLevel: 150, purpose: "증점제", vnAllowed: true, khAllowed: true },
  412: { name: "구아검 (Guar gum)", allowedTypes: ["qcvn5-2", "qcvn5-3"], maxLevel: 5000, purpose: "증점제", vnAllowed: true, khAllowed: true },
  415: { name: "잔탄검 (Xanthan gum)", allowedTypes: ["all"], maxLevel: 5000, purpose: "증점제", vnAllowed: true, khAllowed: true },
  420: { name: "소르비톨 (Sorbitol)", allowedTypes: ["all"], maxLevel: null, purpose: "감미료", vnAllowed: true, khAllowed: true },
  471: { name: "모노·다이글리세리드", allowedTypes: ["all"], maxLevel: null, purpose: "유화제", vnAllowed: true, khAllowed: true },
  500: { name: "탄산나트륨", allowedTypes: ["qcvn5-3", "qcvn5-6"], maxLevel: 2000, purpose: "산도조절제", vnAllowed: true, khAllowed: true },
  509: { name: "염화칼슘 (CaCl₂)", allowedTypes: ["qcvn5-6"], maxLevel: 200, purpose: "응고제", vnAllowed: true, khAllowed: true },
  1422: { name: "아세틸화 디전분 아디페이트", allowedTypes: ["qcvn5-3", "qcvn5-2"], maxLevel: 10000, purpose: "증점제", vnAllowed: true, khAllowed: true },
};

const ANIMAL_INGREDIENTS = {
  "원유 (소)": { vnAllowed: true, heatTreatRequired: true, heatTreatMin: "72°C/15초 또는 UHT", originRestriction: ["구제역 청정국 원칙"], codeCitation: "MARD Circular 25/2016" },
  "원유 (염소)": { vnAllowed: true, heatTreatRequired: true, heatTreatMin: "72°C/15초", originRestriction: [], codeCitation: "MARD Circular 25/2016" },
  "분유 (전지·탈지)": { vnAllowed: true, heatTreatRequired: false, originRestriction: [], codeCitation: "MARD Circular 25/2016" },
  "유청분말": { vnAllowed: true, heatTreatRequired: false, originRestriction: [], codeCitation: "MARD Circular 25/2016" },
  "버터": { vnAllowed: true, heatTreatRequired: false, originRestriction: [], codeCitation: "MARD Circular 25/2016" },
  "젤라틴 (소)": { vnAllowed: true, heatTreatRequired: true, heatTreatMin: "가공처리 필수", originRestriction: ["BSE 비발생국"], codeCitation: "MARD Decision 15/2009" },
  "젤라틴 (돼지)": { vnAllowed: true, heatTreatRequired: true, heatTreatMin: "가공처리 필수", originRestriction: [], codeCitation: "MARD Decision 15/2009" },
  "카제인": { vnAllowed: true, heatTreatRequired: false, originRestriction: [], codeCitation: "MARD Circular 25/2016" },
  "크림": { vnAllowed: true, heatTreatRequired: true, heatTreatMin: "살균 처리", originRestriction: [], codeCitation: "MARD Circular 25/2016" },
};

const LABELING_REQUIREMENTS = {
  VN: [
    "제품명 (베트남어 표기 필수)",
    "성분표 (베트남어, 함량 순서대로)",
    "유통기한 (DD/MM/YYYY 형식)",
    "보관 방법",
    "원산지 표기",
    "제조사 정보",
    "순중량",
    "영양성분표 (에너지, 단백질, 지방, 탄수화물, 나트륨)",
    "알레르기 유발 성분 표시 (우유 포함)",
    "수입업체 정보 (베트남 내)",
  ],
  KH: [
    "제품명",
    "성분표",
    "유통기한",
    "원산지 표기",
    "순중량",
    "제조사 정보",
    "크메르어 병기 권장",
  ],
};

export default function DairyExportChecker() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");
  const [moisture, setMoisture] = useState("");
  const [protein, setProtein] = useState("");
  const [heatTreat, setHeatTreat] = useState("");
  const [animalIngredients, setAnimalIngredients] = useState([]);
  const [additives, setAdditives] = useState([{ ins: "", amount: "" }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("type");

  const countryName = country === "VN" ? "베트남" : country === "KH" ? "캄보디아" : "";

  const toggleAnimalIngredient = (ing) => {
    setAnimalIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const addAdditive = () => setAdditives([...additives, { ins: "", amount: "" }]);

  const updateAdditive = (i, field, val) => {
    const updated = [...additives];
    updated[i][field] = val;
    setAdditives(updated);
  };

  const removeAdditive = (i) => setAdditives(additives.filter((_, idx) => idx !== i));

  const runAnalysis = async () => {
    setLoading(true);

    const productData = {
      country: countryName,
      productName,
      selectedType,
      fat: parseFloat(fat) || null,
      snf: parseFloat(snf) || null,
      moisture: parseFloat(moisture) || null,
      protein: parseFloat(protein) || null,
      heatTreat,
      animalIngredients,
      additives: additives.filter((a) => a.ins),
    };

    const localResults = performLocalCheck(productData);

    setResult({
      ...localResults,
      aiSummary: "API 연결 없이 로컬 규정 데이터베이스 기준으로 판정한 결과입니다.",
    });

    setLoading(false);
    setStep(3);
  };

  const performLocalCheck = (data) => {
    const typeList = DAIRY_TYPES[country] || [];
    const selectedTypeObj = typeList.find((t) => t.id === data.selectedType);

    const typeChecks = [];
    if (selectedTypeObj) {
      const c = selectedTypeObj.criteria;

      if (c.fatMin !== undefined && data.fat !== null && data.fat < c.fatMin) {
        typeChecks.push({ pass: false, item: "유지방 함량", detail: `입력값 ${data.fat}% < 기준 ${c.fatMin}%` });
      } else if (c.fatMin !== undefined && data.fat !== null) {
        typeChecks.push({ pass: true, item: "유지방 함량", detail: `${data.fat}% ≥ ${c.fatMin}% ✓` });
      }

      if (c.fatMax !== undefined && data.fat !== null && data.fat > c.fatMax) {
        typeChecks.push({ pass: false, item: "유지방 상한", detail: `입력값 ${data.fat}% > 기준 ${c.fatMax}%` });
      }

      if (c.snfMin !== undefined && data.snf !== null && data.snf < c.snfMin) {
        typeChecks.push({ pass: false, item: "무지유고형분", detail: `입력값 ${data.snf}% < 기준 ${c.snfMin}%` });
      } else if (c.snfMin !== undefined && data.snf !== null) {
        typeChecks.push({ pass: true, item: "무지유고형분", detail: `${data.snf}% ≥ ${c.snfMin}% ✓` });
      }

      if (c.moistureMax !== undefined && data.moisture !== null && data.moisture > c.moistureMax) {
        typeChecks.push({ pass: false, item: "수분 함량", detail: `입력값 ${data.moisture}% > 기준 ${c.moistureMax}%` });
      } else if (c.moistureMax !== undefined && data.moisture !== null) {
        typeChecks.push({ pass: true, item: "수분 함량", detail: `${data.moisture}% ≤ ${c.moistureMax}% ✓` });
      }

      if (c.proteinMin !== undefined && data.protein !== null && data.protein < c.proteinMin) {
        typeChecks.push({ pass: false, item: "단백질 함량", detail: `입력값 ${data.protein}% < 기준 ${c.proteinMin}%` });
      } else if (c.proteinMin !== undefined && data.protein !== null) {
        typeChecks.push({ pass: true, item: "단백질 함량", detail: `${data.protein}% ≥ ${c.proteinMin}% ✓` });
      }
    }

    const animalChecks = data.animalIngredients.map((ing) => {
      const rule = ANIMAL_INGREDIENTS[ing];
      if (!rule) {
        return { pass: true, item: ing, detail: "검역 규정 정보 없음 - 별도 확인 필요" };
      }

      const issues = [];
      if (country === "VN" && !rule.vnAllowed) issues.push("베트남 수입 불가");
      if (rule.heatTreatRequired && !data.heatTreat) issues.push(`열처리 필수: ${rule.heatTreatMin}`);
      if (rule.originRestriction.length > 0) issues.push(`원산지 조건: ${rule.originRestriction.join(", ")}`);

      return {
        pass: issues.length === 0,
        item: ing,
        detail: issues.length > 0 ? issues.join(" / ") : `통관 가능 (근거: ${rule.codeCitation})`,
        citation: rule.codeCitation,
      };
    });

    const additiveChecks = data.additives.map((a) => {
      const ins = parseInt(a.ins, 10);
      const rule = ADDITIVES_DB[ins];

      if (!rule) {
        return { pass: null, item: `INS ${a.ins}`, detail: "DB에 없는 첨가물 - 수동 확인 필요" };
      }

      const countryAllowed = country === "VN" ? rule.vnAllowed : rule.khAllowed;
      if (!countryAllowed) {
        return { pass: false, item: `INS ${ins} ${rule.name}`, detail: `${countryName} 유제품 사용 불가` };
      }

      const typeAllowed = rule.allowedTypes.includes("all") || rule.allowedTypes.includes(data.selectedType);
      if (!typeAllowed) {
        return {
          pass: false,
          item: `INS ${ins} ${rule.name}`,
          detail: `해당 유형(${selectedTypeObj?.name || "선택 유형"})에 사용 불가`,
        };
      }

      if (rule.maxLevel && a.amount && parseFloat(a.amount) > rule.maxLevel) {
        return {
          pass: false,
          item: `INS ${ins} ${rule.name}`,
          detail: `허용량 초과: 입력 ${a.amount}mg/kg > 기준 ${rule.maxLevel}mg/kg`,
        };
      }

      return {
        pass: true,
        item: `INS ${ins} ${rule.name}`,
        detail: rule.maxLevel
          ? `허용 (최대 ${rule.maxLevel}mg/kg, 목적: ${rule.purpose})`
          : `허용 (제한 없음, 목적: ${rule.purpose})`,
      };
    });

    const allChecks = [...typeChecks, ...animalChecks, ...additiveChecks];
    const hasFail = allChecks.some((c) => c.pass === false);
    const allPassed = allChecks.length > 0 && allChecks.every((c) => c.pass === true);

    return {
      verdict: hasFail ? "부적합" : allPassed ? "적합" : "조건부 확인 필요",
      verdictColor: hasFail ? "red" : allPassed ? "green" : "yellow",
      typeChecks,
      animalChecks,
      additiveChecks,
      labelingRequirements: LABELING_REQUIREMENTS[country] || [],
      selectedTypeObj,
    };
  };

  const reset = () => {
    setStep(1);
    setCountry("");
    setProductName("");
    setSelectedType("");
    setFat("");
    setSnf("");
    setMoisture("");
    setProtein("");
    setHeatTreat("");
    setAnimalIngredients([]);
    setAdditives([{ ins: "", amount: "" }]);
    setResult(null);
    setActiveTab("type");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
        fontFamily: "'IBM Plex Sans KR', 'Noto Sans KR', sans-serif",
        color: "#e2e8f0",
        padding: 0,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          borderBottom: "1px solid rgba(99,179,237,0.15)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(13,33,55,0.8)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #3182ce, #63b3ed)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🥛
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px", color: "#e2e8f0" }}>
            유제품 수출 적합성 검토 시스템
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#63b3ed",
              fontFamily: "'IBM Plex Mono'",
              letterSpacing: "0.5px",
            }}
          >
            VIETNAM · CAMBODIA · DAIRY EXPORT COMPLIANCE
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["1 국가 선택", "2 제품 입력", "3 검토 결과"].map((s, i) => (
            <div
              key={i}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 11,
                background: step === i + 1 ? "rgba(49,130,206,0.3)" : "transparent",
                border: `1px solid ${step === i + 1 ? "#3182ce" : "rgba(99,179,237,0.2)"}`,
                color: step === i + 1 ? "#63b3ed" : "#718096",
                fontFamily: "'IBM Plex Mono'",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>수출 대상국을 선택하세요</div>
              <div style={{ fontSize: 13, color: "#718096" }}>선택한 국가의 규정 기준으로 검토가 진행됩니다</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                { code: "VN", flag: "🇻🇳", name: "베트남", sub: "Vietnam", desc: "QCVN 5-1~5-7 / Circular 24/2019", tags: ["MARD 검역", "QCVN 기준", "베트남어 라벨"] },
                { code: "KH", flag: "🇰🇭", name: "캄보디아", sub: "Cambodia", desc: "Codex Stan 국제기준 준용", tags: ["Codex 기준", "MOH 관할", "비교적 간소"] },
              ].map((c) => (
                <div
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  style={{
                    border: `1px solid ${country === c.code ? "#3182ce" : "rgba(99,179,237,0.15)"}`,
                    borderRadius: 12,
                    padding: "24px",
                    cursor: "pointer",
                    background: country === c.code ? "rgba(49,130,206,0.1)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{c.flag}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#718096", fontFamily: "'IBM Plex Mono'", marginBottom: 12 }}>{c.sub}</div>
                  <div style={{ fontSize: 12, color: "#a0aec0", marginBottom: 12 }}>{c.desc}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 10,
                          background: "rgba(99,179,237,0.1)",
                          border: "1px solid rgba(99,179,237,0.2)",
                          color: "#63b3ed",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => country && setStep(2)}
              style={{
                padding: "12px 32px",
                borderRadius: 8,
                border: "none",
                background: country ? "linear-gradient(135deg, #2b6cb0, #3182ce)" : "rgba(255,255,255,0.05)",
                color: country ? "#fff" : "#4a5568",
                cursor: country ? "pointer" : "not-allowed",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              다음 단계 →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>제품 정보 입력</div>
              <div style={{ fontSize: 13, color: "#718096" }}>{countryName} 유제품 수출 적합성 검토를 위한 정보를 입력하세요</div>
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(99,179,237,0.15)" }}>
              {[["type", "식품유형 & 규격"], ["animal", "동물성 원료"], ["additive", "첨가물"], ["label", "라벨링"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderBottom: `2px solid ${activeTab === id ? "#3182ce" : "transparent"}`,
                    background: "transparent",
                    color: activeTab === id ? "#63b3ed" : "#718096",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: activeTab === id ? 500 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "type" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>제품명</label>
                  <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="예: 한국 고다치즈 200g" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>식품유형 선택</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(DAIRY_TYPES[country] || []).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 8,
                          cursor: "pointer",
                          border: `1px solid ${selectedType === t.id ? "#3182ce" : "rgba(99,179,237,0.15)"}`,
                          background: selectedType === t.id ? "rgba(49,130,206,0.1)" : "rgba(255,255,255,0.02)",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: "#718096", fontFamily: "'IBM Plex Mono'", marginTop: 2 }}>{t.code}</div>
                        <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 4 }}>{t.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>유지방 함량 (%)</label>
                    <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="예: 3.5" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>무지유고형분 (%)</label>
                    <input type="number" value={snf} onChange={(e) => setSnf(e.target.value)} placeholder="예: 8.2" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>수분 함량 (%)</label>
                    <input type="number" value={moisture} onChange={(e) => setMoisture(e.target.value)} placeholder="예: 14.5" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>단백질 함량 (%)</label>
                    <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="예: 3.2" style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "animal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>열처리 방식</label>
                  <select value={heatTreat} onChange={(e) => setHeatTreat(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">선택하세요</option>
                    <option value="UHT">UHT (초고온순간살균)</option>
                    <option value="HTST">HTST (고온단시간살균)</option>
                    <option value="Pasteurized">저온살균</option>
                    <option value="Sterilized">고압멸균</option>
                    <option value="None">열처리 없음</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>동물성 원료 (해당 항목 모두 선택)</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {Object.keys(ANIMAL_INGREDIENTS).map((ing) => {
                      const rule = ANIMAL_INGREDIENTS[ing];
                      const selected = animalIngredients.includes(ing);
                      return (
                        <div
                          key={ing}
                          onClick={() => toggleAnimalIngredient(ing)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: `1px solid ${selected ? "#3182ce" : "rgba(99,179,237,0.15)"}`,
                            background: selected ? "rgba(49,130,206,0.1)" : "rgba(255,255,255,0.02)",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{ing}</div>
                          {rule.heatTreatRequired && <div style={{ fontSize: 10, color: "#f6ad55", marginTop: 2 }}>⚠ 열처리 필수</div>}
                          {rule.originRestriction.length > 0 && <div style={{ fontSize: 10, color: "#fc8181", marginTop: 2 }}>🌐 원산지 제한</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "additive" && (
              <div>
                <label style={labelStyle}>첨가물 목록 (INS 번호로 입력)</label>
                <div style={{ fontSize: 11, color: "#718096", marginBottom: 12 }}>예: 407 (카라기난), 415 (잔탄검), 322 (레시틴)</div>
                {additives.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input value={a.ins} onChange={(e) => updateAdditive(i, "ins", e.target.value)} placeholder="INS 번호 (예: 407)" style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" value={a.amount} onChange={(e) => updateAdditive(i, "amount", e.target.value)} placeholder="함량 mg/kg" style={{ ...inputStyle, flex: 1 }} />
                    {i > 0 && (
                      <button
                        onClick={() => removeAdditive(i)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid rgba(252,129,129,0.3)",
                          background: "transparent",
                          color: "#fc8181",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addAdditive}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid rgba(99,179,237,0.3)",
                    background: "transparent",
                    color: "#63b3ed",
                    cursor: "pointer",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  + 첨가물 추가
                </button>

                <div
                  style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 8,
                    background: "rgba(49,130,206,0.05)",
                    border: "1px solid rgba(99,179,237,0.1)",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#63b3ed", marginBottom: 8, fontWeight: 500 }}>자주 쓰이는 첨가물 INS 번호</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.entries(ADDITIVES_DB)
                      .slice(0, 10)
                      .map(([ins, info]) => (
                        <span
                          key={ins}
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.05)",
                            color: "#a0aec0",
                            fontFamily: "'IBM Plex Mono'",
                          }}
                        >
                          {ins}: {info.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "label" && (
              <div>
                <div style={{ fontSize: 13, color: "#a0aec0", marginBottom: 16 }}>{countryName} 유제품 라벨링 필수 항목 (자동 검토 대상)</div>
                {(LABELING_REQUIREMENTS[country] || []).map((req, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 6,
                      marginBottom: 6,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(99,179,237,0.1)",
                    }}
                  >
                    <span style={{ color: "#68d391", fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 13 }}>{req}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "1px solid rgba(99,179,237,0.2)",
                  background: "transparent",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ← 이전
              </button>
              <button
                onClick={runAnalysis}
                disabled={!productName || !selectedType || loading}
                style={{
                  padding: "12px 32px",
                  borderRadius: 8,
                  border: "none",
                  background: productName && selectedType ? "linear-gradient(135deg, #2b6cb0, #3182ce)" : "rgba(255,255,255,0.05)",
                  color: productName && selectedType ? "#fff" : "#4a5568",
                  cursor: productName && selectedType ? "pointer" : "not-allowed",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {loading ? "🔍 검토 중..." : "검토 시작 →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div>
            <div
              style={{
                padding: "24px",
                borderRadius: 12,
                marginBottom: 24,
                border: `1px solid ${result.verdictColor === "green" ? "rgba(104,211,145,0.3)" : result.verdictColor === "red" ? "rgba(252,129,129,0.3)" : "rgba(246,173,85,0.3)"}`,
                background: result.verdictColor === "green" ? "rgba(104,211,145,0.05)" : result.verdictColor === "red" ? "rgba(252,129,129,0.05)" : "rgba(246,173,85,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{result.verdictColor === "green" ? "✅" : result.verdictColor === "red" ? "❌" : "⚠️"}</span>
                <div>
                  <div style={{ fontSize: 11, color: "#718096", fontFamily: "'IBM Plex Mono'", letterSpacing: "1px" }}>COMPLIANCE VERDICT</div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: result.verdictColor === "green" ? "#68d391" : result.verdictColor === "red" ? "#fc8181" : "#f6ad55",
                    }}
                  >
                    {result.verdict}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#718096" }}>{countryName} 수출</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{productName}</div>
                  <div style={{ fontSize: 11, color: "#718096" }}>{result.selectedTypeObj?.name}</div>
                </div>
              </div>
              {result.aiSummary && (
                <div
                  style={{
                    padding: "14px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.2)",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "#cbd5e0",
                    borderLeft: "3px solid rgba(99,179,237,0.4)",
                  }}
                >
                  <div style={{ fontSize: 10, color: "#63b3ed", fontFamily: "'IBM Plex Mono'", marginBottom: 6 }}>
                    로컬 규정 판정 요약
                  </div>
                  {result.aiSummary}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "식품유형 규격 검토", items: result.typeChecks, citation: result.selectedTypeObj?.code },
                { title: "동물성 원료 검역", items: result.animalChecks, citation: "MARD Circular 25/2016" },
                { title: "첨가물 허용 기준", items: result.additiveChecks, citation: "Circular 24/2019/TT-BYT" },
              ].map(
                (section) =>
                  section.items.length > 0 && (
                    <div key={section.title} style={{ borderRadius: 10, border: "1px solid rgba(99,179,237,0.12)", overflow: "hidden" }}>
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "rgba(255,255,255,0.03)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{section.title}</div>
                        {section.citation && <div style={{ fontSize: 10, color: "#718096", fontFamily: "'IBM Plex Mono'" }}>{section.citation}</div>}
                      </div>
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "10px 16px",
                            borderTop: "1px solid rgba(99,179,237,0.07)",
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <span style={{ fontSize: 12, marginTop: 1, flexShrink: 0 }}>{item.pass === true ? "✅" : item.pass === false ? "❌" : "⚪"}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{item.item}</div>
                            <div style={{ fontSize: 11, color: item.pass === false ? "#fc8181" : "#a0aec0", marginTop: 2 }}>{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
              )}

              <div style={{ borderRadius: 10, border: "1px solid rgba(99,179,237,0.12)", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>라벨링 필수 항목</div>
                  <div style={{ fontSize: 10, color: "#718096", fontFamily: "'IBM Plex Mono'" }}>{country === "VN" ? "Decree 43/2017" : "MOH Guidelines"}</div>
                </div>
                {result.labelingRequirements.map((req, i) => (
                  <div key={i} style={{ padding: "8px 16px", borderTop: "1px solid rgba(99,179,237,0.07)", display: "flex", gap: 10 }}>
                    <span style={{ color: "#68d391", fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#a0aec0" }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "1px solid rgba(99,179,237,0.2)",
                  background: "transparent",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ← 수정
              </button>
              <button
                onClick={reset}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #2b6cb0, #3182ce)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                새 제품 검토
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "#63b3ed",
  marginBottom: 6,
  fontFamily: "'IBM Plex Mono'",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(99,179,237,0.2)",
  background: "rgba(255,255,255,0.04)",
  color: "#e2e8f0",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};
