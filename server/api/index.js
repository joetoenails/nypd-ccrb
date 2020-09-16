const router = require('express').Router();
const { Officer, Complaint } = require('../db');
const { build } = require('../../analyze');

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

router.get('/complaints', (req, res, next) => {
  Complaint.findAll({
    where: req.query,
  })
    .then((complaints) => {
      res.send(complaints);
    })
    .catch(next);
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
