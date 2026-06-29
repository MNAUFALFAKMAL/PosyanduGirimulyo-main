"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { calculateNutritionResult, statusExplanations } from "@/lib/gizi";
import { readJsonResponse } from "@/lib/http";

const initialForm = {
  nikAnak: "",
  namaAnak: "",
  nikIbu: "",
  namaIbu: "",
  jenisKelamin: "",
  tanggalLahir: "",
  berat: "",
  tinggi: "",
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentMonth() {
  return getTodayDate().slice(0, 7);
}

function formatMonthYear(value) {
  if (!value) return "-";
  const [year, month] = String(value).split("-").map(Number);
  if (!year || !month) return value;

  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function formatDisplayDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(year, month - 1, day));
}

function getHistoryMonthOptions(totalMonths = 36) {
  const today = new Date();

  return Array.from({ length: totalMonths }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    return {
      value,
      label: formatMonthYear(value),
    };
  });
}

const resultCards = [
  {
    key: "wfa",
    title: "Berat Badan menurut Umur",
    subtitle: "Menilai apakah berat badan anak sesuai dengan usianya.",
  },
  {
    key: "hfa",
    title: "Tinggi Badan menurut Umur",
    subtitle: "Indikator utama untuk melihat risiko stunting.",
  },
  {
    key: "wfh",
    title: "Berat Badan menurut Tinggi Badan",
    subtitle: "Menilai apakah berat badan anak proporsional dengan tinggi badannya.",
  },
  {
    key: "bmifa",
    title: "Indeks Massa Tubuh menurut Umur",
    subtitle: "Membantu melihat risiko kurus atau gemuk berdasarkan usia.",
  },
];

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-sans text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
const buttonBase =
  "my-2 mr-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-0 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-primary/20 sm:px-7 sm:py-3.5 sm:text-base";
const tableCellClass = "border-b border-slate-200 px-3 py-3 text-left align-middle";

const statusStyles = {
  normal: "bg-primaryLight/50 text-primaryDark",
  warning: "bg-muted text-accent",
  danger: "bg-red-100 text-red-800",
};

function parseDecimalInput(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;

  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return Number.NaN;

  return Number(normalized);
}

function getStatusClass(result) {
  return statusStyles[result.level] || "bg-neutral-100 text-neutral-700";
}

function getResultExplanation(result) {
  if (!result) return "";

  const status = result.text.toLowerCase();
  if (status.includes("normal") || status.includes("baik")) {
    return "Hasil berada pada rentang yang sesuai. Tetap lanjutkan pemantauan rutin di Posyandu.";
  }

  if (status.includes("pendek") || status.includes("kurang") || status.includes("kurus") || status.includes("buruk")) {
    return "Hasil perlu diperhatikan. Lakukan pemantauan ulang dan konsultasikan dengan kader atau tenaga kesehatan.";
  }

  if (status.includes("lebih") || status.includes("gemuk") || status.includes("obesitas")) {
    return "Hasil menunjukkan kecenderungan berlebih. Perhatikan pola makan, aktivitas, dan lakukan pemantauan rutin.";
  }

  return "Gunakan hasil ini sebagai bahan pemantauan, bukan diagnosis tunggal.";
}

function Notification({ notification }) {
  if (!notification) return null;

  const colorClass =
    notification.type === "success"
      ? "border-health bg-green-50 text-green-900"
      : "border-red-500 bg-red-50 text-red-900";

  return <div className={`mb-5 rounded-lg border-l-4 px-5 py-4 font-medium ${colorClass}`}>{notification.message}</div>;
}

function FormSection({ title, description, icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
          <i className={`fa-solid ${icon}`} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CalculatorStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-white shadow-sm backdrop-blur">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/18">
        <i className={`fa-solid ${icon}`} aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{label}</p>
      <p className="mt-1 text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ result }) {
  return (
    <div className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ${getStatusClass(result)}`}>
      {result.text}
      <span className="group relative ml-2 inline-block cursor-pointer">
        <i className="fa-solid fa-circle-info text-secondary" aria-hidden="true" />
        <span className="invisible absolute bottom-[130%] left-1/2 z-10 w-56 -translate-x-1/2 rounded-md bg-slate-700 px-3 py-2 text-left text-xs font-medium leading-5 text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
          {statusExplanations[result.text] || ""}
        </span>
      </span>
    </div>
  );
}

function makeExcelRows(result) {
  return [
    [
      "Posyandu",
      "NIK Anak",
      "Tanggal Sesi",
      "Nama Anak",
      "NIK Ibu",
      "Nama Ibu",
      "Jenis Kelamin",
      "Tanggal Lahir",
      "Usia",
      "Usia (bulan)",
      "Berat (kg)",
      "Tinggi (cm)",
      "IMT",
      "Kesimpulan Stunting",
      "Berat Badan menurut Umur (Z-score)",
      "Status Berat Badan menurut Umur",
      "Tinggi Badan menurut Umur (Z-score)",
      "Status Tinggi Badan menurut Umur",
      "Berat Badan menurut Tinggi Badan (Z-score)",
      "Status Berat Badan menurut Tinggi Badan",
      "Indeks Massa Tubuh menurut Umur (Z-score)",
      "Status Indeks Massa Tubuh menurut Umur",
    ],
    [
      result.posyanduName,
      result.nikAnak,
      formatDisplayDate(result.sessionDate),
      result.namaAnak,
      result.nikIbu,
      result.namaIbu,
      result.jenisKelamin,
      result.tanggalLahir,
      result.ageFormatted,
      result.ageMonths,
      result.berat,
      result.tinggi,
      result.imt,
      result.stuntingConclusion,
      result.wfa.z,
      result.wfa.text,
      result.hfa.z,
      result.hfa.text,
      result.wfh.z,
      result.wfh.text,
      result.bmifa.z,
      result.bmifa.text,
    ],
  ];
}

function getColumnWidths(rows) {
  if (rows.length === 0) return [];

  return rows[0].map((_, columnIndex) => {
    const longestValue = rows.reduce((longest, row) => {
      const value = row[columnIndex] ?? "";
      return Math.max(longest, String(value).length);
    }, 0);

    return { wch: Math.min(Math.max(longestValue + 3, 10), 36) };
  });
}

function styleWorksheetAsTable(worksheet, rows) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const borderStyle = {
    top: { style: "thin", color: { rgb: "CBD5E1" } },
    right: { style: "thin", color: { rgb: "CBD5E1" } },
    bottom: { style: "thin", color: { rgb: "CBD5E1" } },
    left: { style: "thin", color: { rgb: "CBD5E1" } },
  };

  worksheet["!cols"] = getColumnWidths(rows);
  worksheet["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let column = range.s.c; column <= range.e.c; column += 1) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: column });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      cell.s = {
        border: borderStyle,
        alignment: { vertical: "center", wrapText: true },
        ...(row === 0
          ? {
              fill: { fgColor: { rgb: "1D9E75" } },
              font: { bold: true, color: { rgb: "FFFFFF" } },
              alignment: { horizontal: "center", vertical: "center", wrapText: true },
            }
          : {}),
      };
    }
  }
}

function writeWorkbook(rows, sheetName, filename) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  styleWorksheetAsTable(worksheet, rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

function validateFormData(formData) {
  const hasNumber = /\d/;
  const nikPattern = /^\d{16}$/;
  const berat = parseDecimalInput(formData.berat);
  const tinggi = parseDecimalInput(formData.tinggi);

  if (!formData.namaAnak || !formData.nikIbu || !formData.jenisKelamin || !formData.tanggalLahir || !formData.berat || !formData.tinggi) {
    return "Mohon lengkapi semua field yang wajib diisi.";
  }

  if (hasNumber.test(formData.namaAnak)) {
    return "Nama anak tidak boleh berisi angka.";
  }

  if (formData.namaIbu && hasNumber.test(formData.namaIbu)) {
    return "Nama ibu tidak boleh berisi angka.";
  }

  if (formData.nikAnak && !nikPattern.test(formData.nikAnak)) {
    return "NIK anak harus berisi angka saja dan tepat 16 digit.";
  }

  if (!nikPattern.test(formData.nikIbu)) {
    return "NIK ibu wajib berisi angka saja dan tepat 16 digit.";
  }

  if (!Number.isFinite(berat) || berat <= 0 || berat > 300) {
    return "Berat badan harus berupa angka valid, contoh 12.5 atau 12,5.";
  }

  if (!Number.isFinite(tinggi) || tinggi <= 0 || tinggi > 250) {
    return "Tinggi badan harus berupa angka valid, contoh 85.5 atau 85,5.";
  }

  return "";
}

export default function NutritionCalculator({ session }) {
  const [formData, setFormData] = useState(initialForm);
  const [selectedSessionDate, setSelectedSessionDate] = useState(getTodayDate);
  const activePosyandu = session?.posyanduName || "Plamboyan";
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(getCurrentMonth);
  const [historyScope, setHistoryScope] = useState("month");
  const [historySearch, setHistorySearch] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const isStunted = useMemo(() => {
    if (!lastResult) return false;
    return Number(lastResult.hfa.z) < -2;
  }, [lastResult]);

  const filteredReportData = useMemo(() => {
    const keyword = historySearch.trim().toLowerCase();
    if (!keyword) return reportData;

    return reportData.filter((data) => data.namaAnak?.toLowerCase().includes(keyword));
  }, [historySearch, reportData]);

  const historyMonthOptions = useMemo(() => {
    const options = getHistoryMonthOptions();
    if (options.some((option) => option.value === selectedHistoryMonth)) return options;

    return [{ value: selectedHistoryMonth, label: formatMonthYear(selectedHistoryMonth) }, ...options];
  }, [selectedHistoryMonth]);

  function showNotification(message, type) {
    setNotification({ message, type });
  }

  const getHistoryUrl = useCallback((scope = historyScope, historyMonth = selectedHistoryMonth) => {
    if (scope === "all") {
      return "/api/nutrition-history?scope=all";
    }

    return `/api/nutrition-history?month=${encodeURIComponent(historyMonth)}`;
  }, [historyScope, selectedHistoryMonth]);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);

    try {
      const response = await fetch(getHistoryUrl(historyScope, selectedHistoryMonth));
      const payload = await readJsonResponse(response, "Respons histori dari server tidak valid.");

      if (!response.ok) {
        throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
      }

      setReportData(payload.data || []);
      setHasLoadedHistory(true);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getHistoryUrl, historyScope, selectedHistoryMonth]);

  async function toggleHistory() {
    const nextVisible = !isHistoryVisible;
    setIsHistoryVisible(nextVisible);

    if (nextVisible && !hasLoadedHistory) {
      await loadHistory();
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function updateHistorySearch(event) {
    setHistorySearch(event.target.value);
  }

  function resetForm() {
    setFormData(initialForm);
  }

  function changeSessionDate(event) {
    setSelectedSessionDate(event.target.value);
  }

  async function changeHistoryMonth(event) {
    const nextHistoryMonth = event.target.value;
    setSelectedHistoryMonth(nextHistoryMonth);

    if (historyScope === "month") {
      setReportData([]);
      setHasLoadedHistory(false);
    }

    if (isHistoryVisible && historyScope === "month") {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(getHistoryUrl("month", nextHistoryMonth));
        const payload = await readJsonResponse(response, "Respons histori dari server tidak valid.");

        if (!response.ok) {
          throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
        }

        setReportData(payload.data || []);
        setHasLoadedHistory(true);
      } catch (error) {
        setNotification({ message: error.message, type: "error" });
      } finally {
        setIsLoadingHistory(false);
      }
    }
  }

  async function changeHistoryScope(nextScope) {
    if (nextScope === historyScope) return;

    setHistoryScope(nextScope);
    setReportData([]);
    setHasLoadedHistory(false);

    if (isHistoryVisible) {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(getHistoryUrl(nextScope, selectedHistoryMonth));
        const payload = await readJsonResponse(response, "Respons histori dari server tidak valid.");

        if (!response.ok) {
          throw new Error(payload.error || "Gagal mengambil histori kalkulator.");
        }

        setReportData(payload.data || []);
        setHasLoadedHistory(true);
      } catch (error) {
        setNotification({ message: error.message, type: "error" });
      } finally {
        setIsLoadingHistory(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateFormData(formData);
    if (validationMessage) {
      showNotification(validationMessage, "error");
      return;
    }

    try {
      const result = calculateNutritionResult({
        ...formData,
        posyanduName: activePosyandu,
        sessionDate: selectedSessionDate,
        berat: parseDecimalInput(formData.berat),
        tinggi: parseDecimalInput(formData.tinggi),
      });

      setLastResult(result);
      showNotification("Analisis status gizi berhasil!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  async function addToReport() {
    if (!lastResult) {
      showNotification("Tidak ada data hasil untuk ditambahkan.", "error");
      return;
    }

    setIsSavingHistory(true);

    try {
      const response = await fetch("/api/nutrition-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastResult),
      });
      const payload = await readJsonResponse(response, "Respons simpan histori dari server tidak valid.");

      if (!response.ok) {
        throw new Error(payload.error || "Gagal menyimpan histori ke database.");
      }

      const shouldAppendToCurrentHistory =
        historyScope === "all" || (historyScope === "month" && payload.data.sessionDate?.startsWith(selectedHistoryMonth));
      const nextReportData = shouldAppendToCurrentHistory ? [payload.data, ...reportData] : reportData;

      if (shouldAppendToCurrentHistory) {
        setReportData(nextReportData);
        setHasLoadedHistory(true);
      }

      setLastResult(null);
      resetForm();
      showNotification("Data berhasil disimpan ke database.", "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsSavingHistory(false);
    }
  }

  function saveSingleResult() {
    if (!lastResult) {
      showNotification("Tidak ada data hasil untuk disimpan.", "error");
      return;
    }

    writeWorkbook(
      makeExcelRows(lastResult),
      "Hasil Analisis",
      `Hasil_Gizi_${lastResult.namaAnak}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    showNotification("File Excel berhasil disimpan!", "success");
  }

  function downloadReport() {
    if (filteredReportData.length === 0) {
      showNotification("Belum ada data untuk diunduh.", "error");
      return;
    }

    const headers = [
      "No",
      "Posyandu",
      "Tanggal Sesi",
      "NIK Anak",
      "Nama Anak",
      "NIK Ibu",
      "Nama Ibu",
      "Jenis Kelamin",
      "Tanggal Lahir",
      "Usia",
      "Usia (bulan)",
      "Berat (kg)",
      "Tinggi (cm)",
      "IMT",
      "Kesimpulan Stunting",
      "Berat Badan menurut Umur (Z-score)",
      "Status Berat Badan menurut Umur",
      "Tinggi Badan menurut Umur (Z-score)",
      "Status Tinggi Badan menurut Umur",
      "Berat Badan menurut Tinggi Badan (Z-score)",
      "Status Berat Badan menurut Tinggi Badan",
      "Indeks Massa Tubuh menurut Umur (Z-score)",
      "Status Indeks Massa Tubuh menurut Umur",
    ];
    const rows = filteredReportData.map((data, index) => [
      index + 1,
      data.posyanduName || "-",
      formatDisplayDate(data.sessionDate),
      data.nikAnak,
      data.namaAnak,
      data.nikIbu,
      data.namaIbu,
      data.jenisKelamin,
      data.tanggalLahir,
      data.ageFormatted,
      data.ageMonths,
      data.berat,
      data.tinggi,
      data.imt,
      data.stuntingConclusion,
      data.wfa.z,
      data.wfa.text,
      data.hfa.z,
      data.hfa.text,
      data.wfh.z,
      data.wfh.text,
      data.bmifa.z,
      data.bmifa.text,
    ]);

    writeWorkbook(
      [headers, ...rows],
      "Laporan Gizi",
      historyScope === "all" ? `Laporan_Gizi_Semua_Histori_${getTodayDate()}.xlsx` : `Laporan_Gizi_Bulan_${selectedHistoryMonth}.xlsx`,
    );
    showNotification("Laporan berhasil diunduh!", "success");
  }

  return (
    <main className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft sm:mt-7">
      <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary via-primaryDark to-secondary px-4 py-7 text-white sm:px-7 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/12" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-black/15 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight">Kalkulator Posyandu</p>
            <h2 className="max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-4xl">
              Kalkulator Status Gizi Anak
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Catat data anak, hitung status gizi berdasarkan umur dalam bulan, lalu simpan hasilnya ke histori Posyandu.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <CalculatorStat icon="fa-location-dot" label="Lokasi" value={activePosyandu} />
            <CalculatorStat icon="fa-calendar-days" label="Sesi" value={formatDisplayDate(selectedSessionDate)} />
            <CalculatorStat icon="fa-database" label="Histori" value={hasLoadedHistory ? `${reportData.length} data` : "Siap"} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-muted/65 via-white to-secondaryLight/20 px-4 py-5 sm:px-7 sm:py-7">

      <Notification notification={notification} />

      <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
        <FormSection
          description="Pilih tanggal sesi sebelum memasukkan data anak. Lokasi data mengikuti akun login."
          icon="fa-calendar-check"
          title="Sesi Pemeriksaan"
        >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="sessionDate">Tanggal Sesi Posyandu</label>
            <input
              className={fieldClass}
              id="sessionDate"
              type="date"
              value={selectedSessionDate}
              onChange={changeSessionDate}
            />
          </div>
        </div>
        </FormSection>

        <FormSection
          description="Gunakan nama tanpa angka dan NIK 16 digit agar data histori mudah dicari."
          icon="fa-id-card"
          title="Identitas Anak dan Ibu"
        >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="nikAnak">NIK Anak (Opsional)</label>
            <input
              className={fieldClass}
              id="nikAnak"
              inputMode="numeric"
              maxLength="16"
              name="nikAnak"
              pattern="[0-9]{16}"
              placeholder="16 digit angka"
              type="text"
              value={formData.nikAnak}
              onChange={updateField}
            />

            <label className={`${labelClass} mt-5`} htmlFor="namaAnak">Nama Anak</label>
            <input className={fieldClass} id="namaAnak" name="namaAnak" placeholder="Nama tanpa angka" type="text" value={formData.namaAnak} onChange={updateField} />
          </div>

          <div>
            <label className={labelClass} htmlFor="nikIbu">NIK Ibu</label>
            <input
              className={fieldClass}
              id="nikIbu"
              inputMode="numeric"
              maxLength="16"
              name="nikIbu"
              pattern="[0-9]{16}"
              placeholder="16 digit angka"
              type="text"
              value={formData.nikIbu}
              onChange={updateField}
            />

            <label className={`${labelClass} mt-5`} htmlFor="namaIbu">Nama Ibu</label>
            <input className={fieldClass} id="namaIbu" name="namaIbu" placeholder="Nama tanpa angka" type="text" value={formData.namaIbu} onChange={updateField} />
          </div>
        </div>
        </FormSection>

        <FormSection
          description="Data umur dihitung dari tanggal lahir dalam satuan bulan agar hasil tidak NaN."
          icon="fa-child-reaching"
          title="Data Anak"
        >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="jenisKelamin">Jenis Kelamin</label>
            <select className={fieldClass} id="jenisKelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={updateField}>
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tanggalLahir">Tanggal Lahir</label>
            <input className={fieldClass} id="tanggalLahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={updateField} />
          </div>
        </div>
        </FormSection>

        <FormSection
          description="Angka desimal boleh memakai titik atau koma, contoh 12,5 kg dan 85,5 cm."
          icon="fa-ruler-combined"
          title="Pengukuran Antropometri"
        >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="berat">Berat Badan (kg)</label>
            <input
              className={fieldClass}
              id="berat"
              inputMode="decimal"
              name="berat"
              placeholder="Contoh: 12,5"
              type="text"
              value={formData.berat}
              onChange={updateField}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="tinggi">Tinggi Badan (cm)</label>
            <input
              className={fieldClass}
              id="tinggi"
              inputMode="decimal"
              name="tinggi"
              placeholder="Contoh: 85,5"
              type="text"
              value={formData.tinggi}
              onChange={updateField}
            />
          </div>
        </div>
        </FormSection>

        <div className="flex flex-col gap-3 rounded-3xl border border-primary/15 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-600">
            Pastikan data sudah benar sebelum menghitung. Hasil dapat disimpan ke database setelah analisis muncul.
          </p>
          <button className={`${buttonBase} m-0 bg-gradient-to-r from-primary to-secondary`} type="submit">
            <i className="fa-solid fa-calculator text-lg" aria-hidden="true" />
            Hitung Status Gizi
          </button>
        </div>
      </form>

      {lastResult && (
        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
          <div
            className={`border-b p-5 text-center text-xl font-bold sm:text-2xl ${
              isStunted ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900"
            }`}
          >
            <i className={`fa-solid ${isStunted ? "fa-triangle-exclamation" : "fa-circle-check"}`} aria-hidden="true" />
            {isStunted ? " TERINDIKASI STUNTING" : " TIDAK TERINDIKASI STUNTING"}
          </div>

          <div className="px-4 py-6 sm:px-5 sm:py-8">
          <h3 className="mb-5 text-center text-lg font-bold text-ink sm:text-xl">Hasil Analisis untuk {lastResult.namaAnak}</h3>
          <div className="mb-6 grid gap-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-muted/70 via-white to-primaryLight/25 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">Nama Ibu</strong> {lastResult.namaIbu || "-"}</div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">Tempat Posyandu</strong> {lastResult.posyanduName}</div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">Usia Anak</strong> {lastResult.ageFormatted}</div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">Tinggi Badan</strong> {lastResult.tinggi} cm</div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">Berat Badan</strong> {lastResult.berat} kg</div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-sm"><strong className="block text-slate-800">IMT</strong> {lastResult.imt}</div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {resultCards.map((card) => (
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-muted/70 p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-card" key={card.key}>
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primaryLight text-primary ring-1 ring-primaryLight">
                  <i className="fa-solid fa-chart-simple" aria-hidden="true" />
                </div>
                <div className="mb-2 text-sm font-semibold text-primary">{card.title}</div>
                <p className="mx-auto mb-3 max-w-sm text-xs leading-5 text-slate-500">{card.subtitle}</p>
                <div className="mb-2 text-3xl font-bold text-slate-900">{lastResult[card.key].z} SD</div>
                <StatusBadge result={lastResult[card.key]} />
                <p className="mt-3 text-xs leading-5 text-slate-600">{getResultExplanation(lastResult[card.key])}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <button className={`${buttonBase} bg-secondary hover:bg-[#2f76bd]`} type="button" onClick={addToReport}>
              <i className="fa-solid fa-plus text-lg" aria-hidden="true" />
              {isSavingHistory ? "Menyimpan..." : "Simpan ke Database"}
            </button>
            <button className={`${buttonBase} bg-health hover:bg-primaryDark`} type="button" onClick={saveSingleResult}>
              <i className="fa-solid fa-file-excel text-lg" aria-hidden="true" />
              Simpan Hasil Ini (Excel)
            </button>
          </div>
          </div>
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
        <div className="bg-gradient-to-r from-primary/10 via-white to-secondaryLight/45 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-slate-900">
              Histori Kalkulator{hasLoadedHistory ? ` (${filteredReportData.length}/${reportData.length} data)` : ""}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {session?.role === "admin" ? "Admin dapat melihat seluruh data Plamboyan." : `Data yang tampil hanya untuk ${session?.posyanduName}.`}
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primaryLight/30 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primaryLight/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
            type="button"
            onClick={toggleHistory}
          >
            <i className={`fa-solid ${isHistoryVisible ? "fa-eye-slash" : "fa-clock-rotate-left"}`} aria-hidden="true" />
            {isHistoryVisible ? "Sembunyikan Histori" : "Lihat Histori"}
          </button>
        </div>
        </div>

        {isHistoryVisible && (
          <div className="border-t border-slate-200 p-4 sm:p-5">
            <div className="mb-5 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/85 p-4 md:grid-cols-[220px_220px_1fr]">
              <div>
                <label className={labelClass} htmlFor="historyScope">Periode</label>
                <select className={fieldClass} id="historyScope" value={historyScope} onChange={(event) => changeHistoryScope(event.target.value)}>
                  <option value="month">Bulan tertentu</option>
                  <option value="all">Semua bulan</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="historyMonth">Bulan</label>
                <select
                  className={fieldClass}
                  disabled={historyScope === "all"}
                  id="historyMonth"
                  value={selectedHistoryMonth}
                  onChange={changeHistoryMonth}
                >
                  {historyMonthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="historySearch">Cari Nama Anak</label>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                  className={`${fieldClass} pl-11`}
                  id="historySearch"
                  name="historySearch"
                  placeholder="Ketik nama anak"
                  type="search"
                  value={historySearch}
                  onChange={updateHistorySearch}
                />
                </div>
              </div>
            </div>

            {isLoadingHistory && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600">
                Memuat histori dari database...
              </div>
            )}

            {!isLoadingHistory && reportData.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                Belum ada histori tersimpan.
              </div>
            )}

            {!isLoadingHistory && reportData.length > 0 && filteredReportData.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                Tidak ada histori dengan nama tersebut.
              </div>
            )}

            {!isLoadingHistory && filteredReportData.length > 0 && (
              <>
                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full bg-white text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                        <th className={tableCellClass}>No</th>
                        <th className={tableCellClass}>Posyandu</th>
                        <th className={tableCellClass}>Tanggal Sesi</th>
                        <th className={tableCellClass}>Nama Anak</th>
                        <th className={tableCellClass}>Usia</th>
                        <th className={tableCellClass}>Kesimpulan</th>
                        <th className={tableCellClass}>Berat menurut Umur</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>Tinggi menurut Umur</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>Berat menurut Tinggi</th>
                        <th className={tableCellClass}>Status</th>
                        <th className={tableCellClass}>IMT menurut Umur</th>
                        <th className={tableCellClass}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReportData.map((data, index) => (
                        <tr className="transition hover:bg-primaryLight/20" key={data.id || `${data.namaAnak}-${data.tanggalLahir}-${index}`}>
                          <td className={tableCellClass}>{index + 1}</td>
                          <td className={tableCellClass}>{data.posyanduName || "-"}</td>
                          <td className={tableCellClass}>{formatDisplayDate(data.sessionDate)}</td>
                          <td className={tableCellClass}>{data.namaAnak}</td>
                          <td className={tableCellClass}>{data.ageFormatted}</td>
                          <td className={tableCellClass}>{data.stuntingConclusion}</td>
                          <td className={tableCellClass}>{data.wfa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.wfa)}`}>{data.wfa.text}</td>
                          <td className={tableCellClass}>{data.hfa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.hfa)}`}>{data.hfa.text}</td>
                          <td className={tableCellClass}>{data.wfh.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.wfh)}`}>{data.wfh.text}</td>
                          <td className={tableCellClass}>{data.bmifa.z}</td>
                          <td className={`${tableCellClass} ${getStatusClass(data.bmifa)}`}>{data.bmifa.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className={`${buttonBase} bg-health hover:bg-primaryDark`} type="button" onClick={downloadReport}>
                  <i className="fa-solid fa-download text-lg" aria-hidden="true" />
                  {historyScope === "all" ? "Download Semua History" : "Download History"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      </section>
    </main>
  );
}
