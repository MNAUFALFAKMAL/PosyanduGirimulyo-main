import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthSession } from "@/lib/auth";
import { ensureNutritionHistoryTable } from "@/lib/nutritionHistoryTable";
import { query } from "@/lib/db";
import { calculateNutritionResult } from "@/lib/gizi";

export const runtime = "nodejs";

function parseJsonValue(value) {
  if (!value) return {};
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function toDateOnly(value) {
  if (!value) return value;
  if (typeof value === "string") return value.split("T")[0];
  if (value instanceof Date) return value.toISOString().split("T")[0];

  return value;
}

function normalizeHistoryRow(row) {
  const resultJson = parseJsonValue(row.result_json);
  const baseResult = {
    ...resultJson,
    id: row.id,
    posyanduName: resultJson.posyanduName || row.posyandu_name,
    sessionDate: toDateOnly(resultJson.sessionDate || row.session_date),
    createdAt: row.created_at,
  };

  try {
    const recalculatedResult = calculateNutritionResult({
      ...baseResult,
      berat: parseDecimalValue(baseResult.berat),
      tinggi: parseDecimalValue(baseResult.tinggi),
    });

    return {
      ...recalculatedResult,
      id: row.id,
      posyanduName: baseResult.posyanduName,
      createdAt: row.created_at,
    };
  } catch {
    return baseResult;
  }
}

function parseDecimalValue(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;

  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return Number.NaN;

  return Number(normalized);
}

function getMonthRange(monthValue) {
  if (!/^\d{4}-\d{2}$/.test(monthValue || "")) {
    throw new Error("Format bulan histori tidak valid.");
  }

  const [year, month] = monthValue.split("-").map(Number);
  const startDate = `${monthValue}-01`;
  const nextMonth = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return { startDate, nextMonth };
}

function normalizeResult(result) {
  const hasNumber = /\d/;
  const nikPattern = /^\d{16}$/;
  const berat = parseDecimalValue(result.berat);
  const tinggi = parseDecimalValue(result.tinggi);
  const imt = result.imt == null ? null : parseDecimalValue(result.imt);

  if (!result.namaAnak || hasNumber.test(result.namaAnak)) {
    throw new Error("Nama anak wajib diisi dan tidak boleh berisi angka.");
  }

  if (result.namaIbu && hasNumber.test(result.namaIbu)) {
    throw new Error("Nama ibu tidak boleh berisi angka.");
  }

  if (result.nikAnak && !nikPattern.test(result.nikAnak)) {
    throw new Error("NIK anak harus berisi angka saja dan tepat 16 digit.");
  }

  if (result.nikIbu && !nikPattern.test(result.nikIbu)) {
    throw new Error("NIK ibu harus berisi angka saja dan tepat 16 digit.");
  }

  if (!Number.isFinite(berat) || berat <= 0 || berat > 300) {
    throw new Error("Berat badan harus berupa angka valid.");
  }

  if (!Number.isFinite(tinggi) || tinggi <= 0 || tinggi > 250) {
    throw new Error("Tinggi badan harus berupa angka valid.");
  }

  return {
    ...result,
    berat,
    tinggi,
    imt: Number.isFinite(imt) ? imt : null,
  };
}

function buildInsertParams(result, session) {
  const isStunted = result.isStunted ?? Number(result.hfa?.z) < -2;
  const stuntingConclusion = result.stuntingConclusion || (isStunted ? "TERINDIKASI STUNTING" : "TIDAK TERINDIKASI STUNTING");
  const sessionDate = result.sessionDate || new Date().toISOString().split("T")[0];
  const posyanduName = session.role === "admin" ? result.posyanduName || "Plamboyan 1" : session.posyanduName;

  return [
    posyanduName,
    sessionDate,
    result.nikAnak || null,
    result.namaAnak,
    result.nikIbu || null,
    result.namaIbu || null,
    result.jenisKelamin,
    result.tanggalLahir,
    result.ageFormatted,
    result.ageMonths ?? null,
    Number(result.berat.toFixed(2)),
    Number(result.tinggi.toFixed(2)),
    result.imt == null ? null : Number(result.imt.toFixed(2)),
    isStunted,
    stuntingConclusion,
    result.wfa.z,
    result.wfa.text,
    result.wfa.level,
    result.hfa.z,
    result.hfa.text,
    result.hfa.level,
    result.wfh.z,
    result.wfh.text,
    result.wfh.level,
    result.bmifa.z,
    result.bmifa.text,
    result.bmifa.level,
    JSON.stringify({
      ...result,
      posyanduName,
      sessionDate,
      isStunted,
      stuntingConclusion,
    }),
  ];
}

function requireAuth() {
  const session = getAuthSession(cookies());

  if (!session) {
    return { error: NextResponse.json({ error: "Anda harus login untuk mengakses histori kalkulator." }, { status: 401 }) };
  }

  return { session };
}

function getPublicError(error) {
  const code = error?.code || "";
  const message = error instanceof Error ? error.message : "";

  if (code === "ER_ACCESS_DENIED_ERROR") {
    return "Akses database ditolak. Periksa MARIADB_USER dan MARIADB_PASSWORD di environment hosting.";
  }

  if (code === "ER_BAD_DB_ERROR") {
    return "Database tidak ditemukan. Periksa MARIADB_DATABASE di environment hosting.";
  }

  if (code === "ER_DBACCESS_DENIED_ERROR" || code === "ER_TABLEACCESS_DENIED_ERROR") {
    return "User database tidak punya akses ke database/tabel. Periksa permission user MySQL di Hostinger.";
  }

  if (code === "ENOTFOUND" || code === "ECONNREFUSED" || code === "ETIMEDOUT") {
    return "Server database tidak bisa dihubungi. Periksa MARIADB_HOST dan MARIADB_PORT.";
  }

  if (code === 45028 || code === "45028" || message.includes("pool failed to retrieve a connection")) {
    return "Koneksi database timeout. Periksa MARIADB_HOST, MARIADB_PORT, dan pastikan host database bisa diakses dari aplikasi Node.js.";
  }

  if (code === "ER_NO_SUCH_TABLE") {
    return "Tabel histori belum ada. Import database.sql ke phpMyAdmin atau pastikan user database boleh membuat tabel.";
  }

  if (message.includes("Konfigurasi MariaDB belum lengkap")) {
    return "Konfigurasi MariaDB belum lengkap. Isi MARIADB_HOST, MARIADB_USER, MARIADB_PASSWORD, dan MARIADB_DATABASE di environment hosting.";
  }

  if (error instanceof Error && (
    error.message.includes("valid")
    || error.message.includes("wajib")
    || error.message.includes("tidak boleh")
    || error.message.includes("NIK")
    || error.message.includes("Tanggal")
    || error.message.includes("Format bulan")
  )) {
    return error.message;
  }

  return "Terjadi kesalahan pada server. Silakan coba lagi.";
}

export async function GET(request) {
  const auth = requireAuth();
  if (auth.error) return auth.error;

  try {
    await ensureNutritionHistoryTable();
    const { searchParams } = new URL(request.url);
    const sessionDate = searchParams.get("sessionDate");
    const month = searchParams.get("month");
    const scope = searchParams.get("scope");
    const isAdmin = auth.session.role === "admin";
    const posyanduName = auth.session.posyanduName;
    const { rows } = scope === "all"
      ? isAdmin
        ? await query(`
            SELECT id, posyandu_name, session_date, result_json, created_at
            FROM nutrition_histories
            ORDER BY created_at DESC
          `)
        : await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE posyandu_name = $1
              ORDER BY created_at DESC
            `,
            [posyanduName],
          )
      : month
      ? isAdmin
        ? await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE session_date >= $1 AND session_date < $2
              ORDER BY session_date DESC, created_at DESC
            `,
            [getMonthRange(month).startDate, getMonthRange(month).nextMonth],
          )
        : await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE posyandu_name = $1 AND session_date >= $2 AND session_date < $3
              ORDER BY session_date DESC, created_at DESC
            `,
            [posyanduName, getMonthRange(month).startDate, getMonthRange(month).nextMonth],
          )
      : sessionDate
      ? isAdmin
        ? await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE session_date = $1
              ORDER BY created_at DESC
            `,
            [sessionDate],
          )
        : await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE posyandu_name = $1 AND session_date = $2
              ORDER BY created_at DESC
            `,
            [posyanduName, sessionDate],
          )
      : isAdmin
        ? await query(`
            SELECT id, posyandu_name, session_date, result_json, created_at
            FROM nutrition_histories
            ORDER BY created_at DESC
            LIMIT 100
          `)
        : await query(
            `
              SELECT id, posyandu_name, session_date, result_json, created_at
              FROM nutrition_histories
              WHERE posyandu_name = $1
              ORDER BY created_at DESC
              LIMIT 100
            `,
            [posyanduName],
          );

    return NextResponse.json({ data: rows.map(normalizeHistoryRow) });
  } catch (error) {
    console.error("Gagal mengambil histori kalkulator:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = requireAuth();
  if (auth.error) return auth.error;

  try {
    const result = normalizeResult(await request.json());

    if (!result?.namaAnak || !result?.jenisKelamin || !result?.tanggalLahir || !result?.berat || !result?.tinggi) {
      return NextResponse.json({ error: "Data hasil kalkulator tidak lengkap." }, { status: 400 });
    }

    await ensureNutritionHistoryTable();
    const insertResult = await query(
      `
        INSERT INTO nutrition_histories (
          session_date,
          posyandu_name,
          nik_anak,
          nama_anak,
          nik_ibu,
          nama_ibu,
          jenis_kelamin,
          tanggal_lahir,
          usia,
          usia_bulan,
          berat,
          tinggi,
          imt,
          is_stunted,
          stunting_conclusion,
          wfa_z,
          wfa_status,
          wfa_level,
          hfa_z,
          hfa_status,
          hfa_level,
          wfh_z,
          wfh_status,
          wfh_level,
          bmifa_z,
          bmifa_status,
          bmifa_level,
          result_json
        )
        VALUES (
          $2, $1, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28
        )
      `,
      buildInsertParams(result, auth.session),
    );
    const { rows: insertedRows } = await query(
      `
        SELECT id, posyandu_name, session_date, result_json, created_at
        FROM nutrition_histories
        WHERE id = $1
        LIMIT 1
      `,
      [insertResult.insertId],
    );

    return NextResponse.json({ data: normalizeHistoryRow(insertedRows[0]) }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan histori kalkulator:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}

export async function DELETE(request) {
  return NextResponse.json({ error: "Fitur hapus data dinonaktifkan." }, { status: 405 });
}
