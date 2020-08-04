const { Sequelize, STRING, INTEGER } = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/nypd',
  {
    logging: false,
    pool: {
      max: 5,
      idle: 30000,
      acquire: 200000,
    },
  }
);

const Officer = db.define('officers', {
  lastName: {
    type: STRING,
    allowNull: false,
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  mosId: {
    type: INTEGER,
    allowNull: false,
  },
  badge: {
    type: STRING,
    allowNull: false,
  },
  commandNow: {
    type: STRING,
    allowNull: false,
  },
  rankNow: {
    type: STRING,
    allowNull: false,
  },
  rankAbbrev: {
    type: STRING,
    allowNull: false,
  },
  ethnicity: {
    type: STRING,
  },
  gender: {
    type: STRING,
  },
});

//	outcome_description	board_disposition
const Complaint = db.define('complaints', {
  complaintId: { type: STRING, allowNull: false },
  monthReceived: { type: STRING, allowNull: false },
  yearReceived: { type: STRING, allowNull: false },
  monthClosed: { type: STRING, allowNull: false },
  yearClosed: { type: STRING, allowNull: false },
  officerCommand: { type: STRING, allowNull: false },
  officerRank: { type: STRING, allowNull: false },
  officerRankAbbrev: { type: STRING, allowNull: false },
  officerAge: { type: INTEGER, allowNull: false },
  complaintEthnicity: { type: STRING },
  complaintGender: { type: STRING },
  complaintAge: { type: STRING },
  fadoType: { type: STRING, allowNull: false },
  allegation: { type: STRING, allowNull: false },
  precinct: { type: STRING, allowNull: false },
  contactReason: { type: STRING, allowNull: false },
  outcome: { type: STRING, allowNull: false },
  boardDisposition: { type: STRING, allowNull: false },
});

Officer.belongsToMany(Complaint, { through: 'officerComplaint' });
Complaint.belongsToMany(Officer, { through: 'officerComplaint' });

module.exports = {
  db,
  Officer,
  Complaint,
};
