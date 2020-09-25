const router = require('express').Router();
const { Officer, Complaint, db } = require('../db');
const { build } = require('../../analyze');

router.get('/complaints-tweak', async (req, res, next) => {
  // grab all officers and count how many allegations they have against them
  //TODO: add count of complaints here as well.
  try {
    const [
      result,
      meta,
    ] = await db.query(`select count(*), "officerMosId", officers."firstName", officers."lastName", officers.ethnicity, officers.badge from complaints
join officers on complaints."officerMosId" = officers."mosId"
group by complaints."officerMosId", officers."firstName", officers."lastName", officers.badge, officers.ethnicity;
`);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.get('/cops-ethnicity', (req, res, next) => {
  db.query(
    `select count(ethnicity), ethnicity from officers
group by ethnicity`
  )
    .then(([data, meta]) => {
      const ethnicityObj = data.reduce((acc, curr) => {
        acc[curr.ethnicity] = Number(curr.count);
        return acc;
      }, {});
      res.send(ethnicityObj);
    })
    .catch(next);
});

router.get('/cops', (req, res, next) => {
  Officer.findAll({
    where: req.query,
    include: { model: Complaint },
  })
    .then((officers) => {
      res.send(officers);
    })
    .catch(next);
});

router.get('/cops/:id', async (req, res, next) => {
  Officer.findOne({
    where: {
      mosId: req.params.id,
    },
  })
    .then((officer) => res.send(officer))
    .catch(next);
});

router.get('/complaints', (req, res, next) => {
  if (req.query.officer) {
    Complaint.findAll({
      where: {
        officerMosId: req.query.officer,
      },
    })
      .then((complaints) => res.send(complaints))
      .catch(next);
  } else {
    Complaint.findAll({
      where: req.query,
    })
      .then((complaints) => {
        res.send(complaints);
      })
      .catch(next);
  }
});

router.post('/burst', async (req, res, next) => {
  const slices = req.body;
  const arrOfSlices = [];
  for (const slice in slices) {
    if (slices[slice]) {
      arrOfSlices.push(slices[slice]);
    }
  }
  const tree = { name: 'flare', children: [] };
  const complaints = await Complaint.findAll({ raw: true });
  complaints.forEach((c) => {
    build(tree, c, arrOfSlices);
  });
  res.json(tree);
});

module.exports = router;
