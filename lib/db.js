import mariadb from "mariadb";

function getPool() {
  console.log("DB ENV CHECK:", {
    HOST: process.env.MARIADB_HOST,
    USER: process.env.MARIADB_USER,
    PASS: process.env.MARIADB_PASSWORD,
    DB: process.env.MARIADB_DATABASE
  });
  if (!process.env.MARIADB_HOST || !process.env.MARIADB_USER || !process.env.MARIADB_DATABASE) {
    throw new Error("Konfigurasi MariaDB belum lengkap. Isi MARIADB_HOST, MARIADB_USER, MARIADB_PASSWORD, dan MARIADB_DATABASE.");
  }

  const globalForMariaDb = globalThis;

  if (!globalForMariaDb.mariaDbPool) {
    globalForMariaDb.mariaDbPool = mariadb.createPool({
      host: process.env.MARIADB_HOST,
      port: Number(process.env.MARIADB_PORT || 3306),
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD || "",
      database: process.env.MARIADB_DATABASE,
      acquireTimeout: Number(process.env.MARIADB_ACQUIRE_TIMEOUT || 10000),
      connectTimeout: Number(process.env.MARIADB_CONNECT_TIMEOUT || 10000),
      connectionLimit: Number(process.env.MARIADB_CONNECTION_LIMIT || 1),
      idleTimeout: Number(process.env.MARIADB_IDLE_TIMEOUT || 30),
      timezone: "Z",
    });
  }

  return globalForMariaDb.mariaDbPool;
}

function normalizeQuery(sql, params) {
  const orderedParams = [];
  const normalizedSql = sql.replace(/\$(\d+)/g, (_, index) => {
    orderedParams.push(params[Number(index) - 1]);
    return "?";
  });

  return {
    sql: normalizedSql,
    params: orderedParams.length > 0 ? orderedParams : params,
  };
}

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map((row) => {
    const normalized = { ...row };
    for (const key in normalized) {
      if (typeof normalized[key] === 'bigint') {
        normalized[key] = normalized[key].toString();
      }
    }
    return normalized;
  });
}

export async function query(text, params = []) {
  const normalizedQuery = normalizeQuery(text, params);
  const result = await getPool().query(normalizedQuery.sql, normalizedQuery.params);
  return {
    rows: normalizeRows(result),
    rowCount: Array.isArray(result) ? result.length : result?.affectedRows || 0,
    insertId: typeof result?.insertId === 'bigint' ? result.insertId.toString() : result?.insertId,
    affectedRows: result?.affectedRows,
  };
}
