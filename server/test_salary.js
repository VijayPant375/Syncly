const pool = require('./src/config/db');
async function test() {
  try {
    const res = await pool.query(`
      SELECT salary, 
      NULLIF(regexp_replace(substring(salary::text FROM '[0-9]+[0-9,.]*'), '[^0-9.]', '', 'g'), '')::numeric as min_extracted
      FROM jobs LIMIT 5
    `);
    console.log(res.rows);
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
test();
