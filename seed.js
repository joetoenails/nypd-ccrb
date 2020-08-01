const { Officer, Complaint, db } = require('./server/db.js');
const chalk = require('chalk');
const csv = require('csv-parser');
const fs = require('fs');

function parseCSV(path) {
  console.log(chalk.yellow('Start CSV Parse'));
  const results = [];
  return new Promise((res, rej) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res(results);
      });
  });
}

async function seed() {
  try {
    await db.sync({ force: true });
    console.log(chalk.green('DB Dropped and Synced'));
    const lineItems = await parseCSV('./allegations_20200726939.csv');
    console.log(chalk.green('CSV Parsed'));
    const uniqueOfficers = getUniques(lineItems);
    console.log(chalk.green('Unique Officers Filtered'));
    console.log(chalk.yellow('Start Unique Officer Creation'));

    await Promise.all(uniqueOfficers.map(createOfficer));
    console.log(chalk.green('Unique Officers Seeded'));
    console.log(chalk.yellow('Start create Complaints and Associate to Cops'));

    await Promise.all(lineItems.map(createComplaintAssignToOfficer));
    console.log(chalk.green('Complaints Seeded and Officers Associated'));
    console.log(chalk.green('DONE'));
    await db.close();
  } catch (e) {
    console.error(
      chalk.red('Seed disaster. Something wrong in seed.js', e, e.message)
    );
  }
}

seed();

function createOfficer(cop) {
  return Officer.create({
    firstName: cop.first_name,
    lastName: cop.last_name,
    mosId: Number(cop.unique_mos_id),
    commandNow: cop.command_now,
    rankNow: cop.rank_now,
    rankAbbrev: cop.rank_abbrev_now,
    ethnicity: cop.mos_ethnicity,
    gender: cop.mos_gender,
  });
}

function getUniques(data) {
  const ids = {};
  const uniques = [];
  data.forEach((result) => {
    if (!(result.unique_mos_id in ids)) {
      uniques.push(result);
      ids[result.unique_mos_id] = true;
    }
  });
  return uniques;
}

async function createComplaintAssignToOfficer(complaint) {
  let {
    unique_mos_id,
    complaint_id,
    month_received,
    year_received,
    month_closed,
    year_closed,
    command_at_incident,
    rank_abbrev_incident,
    rank_incident,
    mos_age_incident,
    complainant_ethnicity,
    complainant_gender,
    complainant_age_incident,
    fado_type,
    allegation,
    precinct,
    contact_reason,
    outcome_description,
    board_disposition,
  } = complaint;

  let officer = await Officer.findOne({
    where: {
      mosId: unique_mos_id,
    },
  });
  let createdComplaint = await Complaint.create({
    complaintId: complaint_id,
    monthReceived: month_received,
    yearReceived: year_received,
    monthClosed: month_closed,
    yearClosed: year_closed,
    officerCommand: command_at_incident,
    officerRank: rank_incident,
    officerRankAbbrev: rank_abbrev_incident,
    officerAge: mos_age_incident,
    complaintEthnicity: complainant_ethnicity,
    complaintGender: complainant_gender,
    complaintAge: complainant_age_incident,
    fadoType: fado_type,
    allegation: allegation,
    precinct: precinct,
    contactReason: contact_reason,
    outcome: outcome_description,
    boardDisposition: board_disposition,
  });

  await officer.addComplaint(createdComplaint);
}
