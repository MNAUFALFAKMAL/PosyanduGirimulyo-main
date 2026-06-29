import { query } from "@/lib/db";

let tableReadyPromise;

async function addColumnIfMissing(columnDefinition) {
  try {
    await query(`ALTER TABLE nutrition_histories ADD COLUMN ${columnDefinition}`);
  } catch (error) {
    if (!["ER_DUP_FIELDNAME", "ER_DUP_KEYNAME"].includes(error.code)) {
      throw error;
    }
  }
}

async function createIndexIfMissing(indexSql) {
  try {
    await query(indexSql);
  } catch (error) {
    if (error.code !== "ER_DUP_KEYNAME") {
      throw error;
    }
  }
}

async function prepareNutritionHistoryTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS nutrition_histories (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      posyandu_name VARCHAR(80) NOT NULL DEFAULT 'Plamboyan 1',
      session_date DATE NOT NULL,
      nik_anak VARCHAR(16),
      nama_anak TEXT NOT NULL,
      nik_ibu VARCHAR(16),
      nama_ibu TEXT,
      jenis_kelamin VARCHAR(1) NOT NULL,
      tanggal_lahir DATE NOT NULL,
      usia TEXT NOT NULL,
      usia_bulan INT,
      berat DECIMAL(6,2) NOT NULL,
      tinggi DECIMAL(6,2) NOT NULL,
      imt DECIMAL(6,2),
      is_stunted BOOLEAN NOT NULL,
      stunting_conclusion TEXT,
      wfa_z DECIMAL(6,2) NOT NULL,
      wfa_status TEXT NOT NULL,
      wfa_level TEXT,
      hfa_z DECIMAL(6,2) NOT NULL,
      hfa_status TEXT NOT NULL,
      hfa_level TEXT,
      wfh_z DECIMAL(6,2) NOT NULL,
      wfh_status TEXT NOT NULL,
      wfh_level TEXT,
      bmifa_z DECIMAL(6,2) NOT NULL,
      bmifa_status TEXT NOT NULL,
      bmifa_level TEXT,
      result_json JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await addColumnIfMissing("posyandu_name VARCHAR(80) NOT NULL DEFAULT 'Plamboyan 1'");
  await addColumnIfMissing("usia_bulan INT");
  await addColumnIfMissing("imt DECIMAL(6,2)");
  await addColumnIfMissing("stunting_conclusion TEXT");
  await addColumnIfMissing("wfa_level TEXT");
  await addColumnIfMissing("hfa_level TEXT");
  await addColumnIfMissing("wfh_level TEXT");
  await addColumnIfMissing("bmifa_level TEXT");
  await addColumnIfMissing("session_date DATE");

  await createIndexIfMissing("CREATE INDEX idx_nutrition_histories_created_at ON nutrition_histories (created_at)");
  await createIndexIfMissing("CREATE INDEX idx_nutrition_histories_nama_anak ON nutrition_histories (nama_anak(191))");
  await createIndexIfMissing("CREATE INDEX idx_nutrition_histories_session_date ON nutrition_histories (session_date)");
  await createIndexIfMissing("CREATE INDEX idx_nutrition_histories_posyandu_session ON nutrition_histories (posyandu_name, session_date)");
}

export function ensureNutritionHistoryTable() {
  if (!tableReadyPromise) {
    tableReadyPromise = prepareNutritionHistoryTable();
  }

  return tableReadyPromise;
}
