export const whoStandards = {
  wfa_l: { 0: { L: 0.34, M: 3.34, S: 0.14 }, 12: { L: 0.17, M: 9.64, S: 0.11 }, 24: { L: 0.11, M: 12.23, S: 0.1 }, 60: { L: 0.08, M: 18.02, S: 0.11 } },
  wfa_p: { 0: { L: 0.38, M: 3.23, S: 0.14 }, 12: { L: 0.15, M: 8.94, S: 0.11 }, 24: { L: 0.07, M: 11.48, S: 0.11 }, 60: { L: 0.03, M: 17.69, S: 0.11 } },
  hfa_l: { 0: { L: 1, M: 49.8, S: 0.037 }, 12: { L: 1, M: 75.7, S: 0.034 }, 24: { L: 1, M: 87.0, S: 0.035 }, 60: { L: 1, M: 110.3, S: 0.038 } },
  hfa_p: { 0: { L: 1, M: 49.1, S: 0.037 }, 12: { L: 1, M: 74.3, S: 0.034 }, 24: { L: 1, M: 85.7, S: 0.035 }, 60: { L: 1, M: 109.4, S: 0.038 } },
  wfh_l: { 65: { L: -0.5, M: 7.0, S: 0.11 }, 85: { L: -0.1, M: 11.7, S: 0.09 }, 110: { L: 0.3, M: 18.6, S: 0.09 } },
  wfh_p: { 65: { L: -0.4, M: 7.0, S: 0.11 }, 85: { L: -0.1, M: 11.5, S: 0.09 }, 110: { L: 0.4, M: 18.6, S: 0.1 } },
  bmifa_l: { 24: { L: -0.3, M: 16.8, S: 0.09 }, 60: { L: -0.8, M: 15.3, S: 0.08 } },
  bmifa_p: { 24: { L: -0.3, M: 16.5, S: 0.09 }, 60: { L: -0.9, M: 15.2, S: 0.08 } },
};

export const statusExplanations = {
  "Sangat Kurang": "Berat badan anak sangat kurang dibandingkan standar usianya. Ini menandakan masalah gizi yang signifikan.",
  Kurang: "Berat badan anak berada di bawah standar usianya.",
  Normal: "Berat badan atau kondisi gizi anak sesuai dengan standar yang ditetapkan WHO untuk usia atau tinggi badannya.",
  "Sangat Pendek": "Tinggi badan anak sangat kurang dibandingkan standar usianya. Ini adalah indikator stunting kronis (masalah gizi jangka panjang).",
  Pendek: "Tinggi badan anak berada di bawah standar usianya. Ini adalah indikator stunting.",
  "Gizi Buruk": "Berat badan sangat kurang dibandingkan tinggi badannya. Ini menandakan kondisi wasting (kurus) yang parah dan butuh perhatian medis segera.",
  "Gizi Kurang": "Berat badan kurang dibandingkan tinggi badannya. Ini menandakan kondisi wasting (kurus) akibat masalah gizi akut.",
  "Gizi Baik": "Berat badan anak proporsional dengan tinggi badannya.",
  "Risiko Gizi Lebih": "Anak memiliki kecenderungan berat badan berlebih untuk tinggi badannya.",
  "Gizi Lebih": "Berat badan anak berlebih (overweight) untuk tinggi badannya.",
  Obesitas: "Berat badan anak sangat berlebih untuk tinggi badannya. Ini adalah kondisi obesitas.",
  "Sangat Kurus": "Anak tergolong sangat kurus berdasarkan perbandingan Indeks Massa Tubuh (IMT) dengan standar usianya.",
  Kurus: "Anak tergolong kurus berdasarkan perbandingan Indeks Massa Tubuh (IMT) dengan standar usianya.",
  "Risiko Gemuk": "Anak memiliki risiko kegemukan berdasarkan Indeks Massa Tubuh (IMT) untuk usianya.",
  Gemuk: "Anak tergolong gemuk (overweight) berdasarkan perbandingan Indeks Massa Tubuh (IMT) dengan standar usianya.",
};

export function interpolate(point, data) {
  const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
  if (point <= keys[0]) return data[keys[0]];
  if (point >= keys[keys.length - 1]) return data[keys[keys.length - 1]];
  if (data[point]) return data[point];

  const lowerKey = keys.filter((key) => key <= point).pop();
  const upperKey = keys.filter((key) => key >= point).shift();
  const lower = data[lowerKey];
  const upper = data[upperKey];
  const ratio = (point - lowerKey) / (upperKey - lowerKey);

  return {
    L: lower.L + (upper.L - lower.L) * ratio,
    M: lower.M + (upper.M - lower.M) * ratio,
    S: lower.S + (upper.S - lower.S) * ratio,
  };
}

export function calculateZScore(value, { L, M, S }) {
  if (L === 0) return Math.log(value / M) / S;
  return (Math.pow(value / M, L) - 1) / (L * S);
}

export function interpretStatus(z, indicator) {
  switch (indicator) {
    case "BB/U":
      if (z < -3) return { text: "Sangat Kurang", level: "danger" };
      if (z < -2) return { text: "Kurang", level: "warning" };
      return { text: "Normal", level: "normal" };
    case "TB/U":
      if (z < -3) return { text: "Sangat Pendek", level: "danger" };
      if (z < -2) return { text: "Pendek", level: "warning" };
      return { text: "Normal", level: "normal" };
    case "BB/TB":
      if (z < -3) return { text: "Gizi Buruk", level: "danger" };
      if (z < -2) return { text: "Gizi Kurang", level: "warning" };
      if (z > 3) return { text: "Obesitas", level: "danger" };
      if (z > 2) return { text: "Gizi Lebih", level: "warning" };
      if (z > 1) return { text: "Risiko Gizi Lebih", level: "normal" };
      return { text: "Gizi Baik", level: "normal" };
    case "IMT/U":
      if (z < -3) return { text: "Sangat Kurus", level: "danger" };
      if (z < -2) return { text: "Kurus", level: "warning" };
      if (z > 2) return { text: "Gemuk", level: "warning" };
      if (z > 1) return { text: "Risiko Gemuk", level: "normal" };
      return { text: "Normal", level: "normal" };
    default:
      return { text: "N/A", className: "" };
  }
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

export function calculateAgeInMonths(birthDate, measurementDate = new Date()) {
  const measuredAt = measurementDate instanceof Date ? measurementDate : parseLocalDate(measurementDate);
  const birth = birthDate instanceof Date ? birthDate : parseLocalDate(birthDate);

  if (!birth || !measuredAt || Number.isNaN(birth.getTime()) || Number.isNaN(measuredAt.getTime())) {
    throw new Error("Tanggal lahir atau tanggal sesi tidak valid.");
  }

  if (birth > measuredAt) {
    throw new Error("Tanggal lahir tidak boleh lebih baru dari tanggal sesi.");
  }

  let months = (measuredAt.getFullYear() - birth.getFullYear()) * 12 + measuredAt.getMonth() - birth.getMonth();
  if (measuredAt.getDate() < birth.getDate()) months -= 1;

  const safeMonths = Math.max(months, 0);

  return {
    months: safeMonths,
    formatted: `${safeMonths} bulan`,
  };
}

function normalizeGender(value) {
  const gender = String(value || "").trim().toLowerCase();

  if (gender === "l" || gender.includes("laki")) return "l";
  if (gender === "p" || gender.includes("perempuan")) return "p";

  return "";
}

function formatZScore(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function calculateNutritionResult(formData) {
  const age = calculateAgeInMonths(formData.tanggalLahir, formData.sessionDate);
  const imt = formData.berat / (formData.tinggi / 100) ** 2;
  const gender = normalizeGender(formData.jenisKelamin);

  if (!gender) {
    throw new Error("Jenis kelamin wajib dipilih.");
  }

  const zScores = {
    wfa: calculateZScore(formData.berat, interpolate(age.months, whoStandards[`wfa_${gender}`])),
    hfa: calculateZScore(formData.tinggi, interpolate(age.months, whoStandards[`hfa_${gender}`])),
    wfh: calculateZScore(formData.berat, interpolate(formData.tinggi, whoStandards[`wfh_${gender}`])),
    bmifa: calculateZScore(imt, interpolate(age.months, whoStandards[`bmifa_${gender}`])),
  };

  return {
    ...formData,
    ageMonths: age.months,
    ageFormatted: age.formatted,
    imt: Number(imt.toFixed(2)),
    isStunted: zScores.hfa < -2,
    stuntingConclusion: zScores.hfa < -2 ? "TERINDIKASI STUNTING" : "TIDAK TERINDIKASI STUNTING",
    wfa: { ...interpretStatus(zScores.wfa, "BB/U"), z: formatZScore(zScores.wfa) },
    hfa: { ...interpretStatus(zScores.hfa, "TB/U"), z: formatZScore(zScores.hfa) },
    wfh: { ...interpretStatus(zScores.wfh, "BB/TB"), z: formatZScore(zScores.wfh) },
    bmifa: { ...interpretStatus(zScores.bmifa, "IMT/U"), z: formatZScore(zScores.bmifa) },
  };
}
