const router = require('express').Router();
const db = require('../db');
const { build, makeGraphForSingleOfficer } = require('../../analyze');
const graphdata = require('../../graphdata.json');

router.get('/complaint/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM allegations WHERE complaint_id = $1',
      [req.params.id]
    );
    res.send(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/allegations', async (req, res, next) => {
  if (req.query.officer) {
    try {
      const result = await db.query(
        `SELECT * FROM allegations 
      WHERE unique_mos_id = $1 ORDER BY year_received DESC, month_received DESC`,
        [req.query.officer]
      );
      return res.send(result.rows);
    } catch (e) {
      next(e);
    }
  }

  if (Object.keys(req.query).length) {
    // many wheres from req.query
    console.log(Object.entries(req.query));
    //TODO: Sanitize this string from USER INPUT!
    // maybe grab all of columns from table and all uniques in those columns
    // TODO: Deal with 'Unknown' and 'Null' ethnicities and genders, unexpected results on piezoom query
    const queryString = Object.entries(req.query)
      .reduce((arrOfQueries, [col, detail]) => {
        if (col !== 'offset') {
          arrOfQueries.push(`${col} = '${detail}'`);
        }
        return arrOfQueries;
      }, [])
      .join(' AND ');

    console.log(queryString);
    try {
      const count = await db.query(
        `SELECT COUNT (*) FROM allegations
      WHERE ${queryString}`
      );

      const result = await db.query(
        `SELECT * FROM allegations
      WHERE ${queryString}
      ORDER BY last_name
      LIMIT 30 OFFSET ${req.query.offset}`
      );

      return res.send({ count: count.rows[0].count, data: result.rows });
    } catch (e) {
      console.log(e);
      next(e);
      return;
    }
  }

  try {
    const result = await db.query(`
    SELECT count(*), unique_mos_id, first_name, last_name, mos_ethnicity, shield_no FROM allegations 
    GROUP BY unique_mos_id, first_name, last_name, mos_ethnicity, shield_no;`);

    return res.send(result.rows);
  } catch (e) {
    next(e);
  }
});

router.get('/cops/ethnicity', async (req, res, next) => {
  try {
    const result = await db.query(`
    SELECT COUNT(DISTINCT unique_mos_id), mos_ethnicity FROM allegations
    GROUP BY mos_ethnicity
    `);

    const ethnicityObj = result.rows.reduce((acc, curr) => {
      acc[curr.mos_ethnicity] = Number(curr.count);
      return acc;
    }, {});
    res.send(ethnicityObj);
  } catch (error) {
    next(error);
  }
});

router.get('/cops/related', async (req, res, next) => {
  try {
    if (req.query.officer === undefined) {
      throw new Error('Must have officer param');
    }
    const { rows } = await db.query(
      `SELECT count(*), unique_mos_id, first_name, last_name, complaint_id from allegations
       WHERE complaint_id in
      (SELECT DISTINCT complaint_id FROM allegations 
        WHERE unique_mos_id = $1) AND unique_mos_id <> $1
      GROUP BY  unique_mos_id, first_name, last_name, complaint_id;`,
      [req.query.officer]
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/cops/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, shield_no, command_now, rank_now, rank_abbrev_now FROM allegations 
    WHERE unique_mos_id = $1
    limit 1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      throw new Error('No such officer exists.');
    }
    return res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  const { searchTerm } = req.body;

  if (Number(searchTerm)) {
    try {
      const result = await db.query(
        `SELECT unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, shield_no, command_now, rank_now, rank_abbrev_now FROM allegations 
    WHERE shield_no = $1
    limit 1`,
        [searchTerm]
      );
      res.send(result.rows);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const result = await db.query(
        `SELECT unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, shield_no, command_now, rank_now, rank_abbrev_now FROM allegations 
    WHERE first_name ~* $1 OR last_name ~* $1
    GROUP BY unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, shield_no, command_now, rank_now, rank_abbrev_now
    ORDER BY last_name;
    `,
        [searchTerm]
      );
      res.send(result.rows);
    } catch (error) {
      next(error);
    }
  }
});

router.post('/burst', async (req, res, next) => {
  const slices = req.body;
  const arrOfSlices = [];
  for (const slice in slices) {
    if (slices[slice] && !arrOfSlices.includes(slices[slice])) {
      arrOfSlices.push(slices[slice]);
    }
  }
  if (req.query.type === 'zoom')
    arrOfSlices.push(arrOfSlices[arrOfSlices.length - 1]);
  const tree = { name: 'All Allegations', children: [] };

  let allegations;

  try {
    if (req.query.officer) {
      allegations = await db.query(
        'SELECT * FROM allegations WHERE unique_mos_id = $1',
        [req.query.officer]
      );
    } else {
      allegations = await db.query('SELECT * FROM allegations');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }

  allegations.rows.forEach((c) => {
    build(tree, c, arrOfSlices);
  });
  res.json(tree);
});

router.get('/graph', async (req, res, next) => {
  if (req.query.officer) {
    const graphByOfficer = makeGraphForSingleOfficer(
      Number(req.query.officer),
      graphdata.nodes,
      graphdata.links
    );
    if (!graphByOfficer.nodes.length) {
      throw new Error('no nodes here');
    }

    return res.send(graphByOfficer);
  } else {
    res.send(graphdata);
  }

  //   let allegations;
  //   try {
  //     if (req.query.officer) {
  //     } else {
  //       // get all allegations
  //       const { rows } = await db.query(`SELECT * FROM allegations`);
  //       allegations = rows;
  //     }

  //     const links = buildLinks(allegations).sort((a, b) => b.qty - a.qty);
  //     const arrOfUniqueMosIds = buildNodes(links);
  //     const { rows: nodes } = await db.query(
  //       `SELECT count(*), unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, rank_now FROM allegations
  // WHERE unique_mos_id IN (${arrOfUniqueMosIds})
  // GROUP BY unique_mos_id, first_name, last_name,  mos_ethnicity, mos_gender, rank_now
  // ORDER BY count DESC;`
  //     );

  //     res.send({ nodes, links });
  //   } catch (error) {
  //     console.log(error.stack);
  //     next(error);
  //   }
});

module.exports = router;
