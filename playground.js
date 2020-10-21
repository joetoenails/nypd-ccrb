const db = require('./server/db');
const { buildLinks, buildNodes } = require('./analyze');
const fs = require('fs');

async function init() {
  try {
    const { rows } = await db.query(`SELECT * FROM allegations`);
    // console.log(rows);
    const links = buildLinks(rows).sort((a, b) => b.qty - a.qty);
    // console.log(links);
    const arrOfuniqueMosIds = buildNodes(links);
    const { rows: nodes } = await db.query(
      `SELECT count(*), unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, rank_now FROM allegations 
WHERE unique_mos_id IN (${arrOfuniqueMosIds})
GROUP BY unique_mos_id, first_name, last_name,  mos_ethnicity, mos_gender, rank_now
ORDER BY count DESC;`
    );
    const result = {
      nodes,
      links,
    };
    await fs.writeFileSync('./result.json', JSON.stringify(result));
    console.log('done!');
    // console.log(nodes);
  } catch (e) {
    console.log('err', e);
  }
}

init();
