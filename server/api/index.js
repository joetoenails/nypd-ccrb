const router = require('express').Router();
const db = require('../db');
const { build } = require('../../analyze');

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

router.get('/cops/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT unique_mos_id, first_name, last_name, mos_ethnicity, mos_gender, shield_no, command_now, rank_now, rank_abbrev_now FROM allegations 
    WHERE unique_mos_id = $1
    limit 1`,
      [req.params.id]
    );
    return res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  const { searchTerm } = req.body;
  console.log(searchTerm);
  if (Number(searchTerm)) {
    console.log('here');
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

module.exports = router;
