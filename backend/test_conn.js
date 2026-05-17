import mssql from 'mssql/msnodesqlv8.js';

const sqlConfig = {
  server: 'localhost', // Required by mssql validator
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(local)\\SQLEXPRESS;Database=RajpalVista;Trusted_Connection=yes;',
};

async function test() {
  console.log("Testing SQL Server connection...");
  try {
    const pool = await mssql.connect(sqlConfig);
    console.log("SUCCESS! Connected to RajpalVista.");
    const result = await pool.query("SELECT TOP 5 Film_strTitle FROM tblFilm");
    console.log("Sample films:", result.recordset);
    await pool.close();
  } catch (err) {
    console.error("CONNECTION FAILED:", err);
  }
}

test();
