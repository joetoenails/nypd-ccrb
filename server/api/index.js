const router = require('express').Router();
const { Officer, Complaint } = require('../db');

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

module.exports = router;
