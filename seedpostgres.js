const { Client } = require('pg');
const chalk = require('chalk');

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/nypd-export';

const path = require('path');

const client = new Client({
  connectionString: connectionString,
});

const currentDir = path.join(__dirname, 'allegations_202007271729.csv');

function makeAllegationsTable() {
  console.log(chalk.green('Connect to client'));
  client
    .connect()
    .then(() => {
      console.log(chalk.green('Create Table if needed'));
      return client.query(
        `DROP TABLE IF EXISTS allegations;
        CREATE TABLE allegations (
          id SERIAL PRIMARY KEY,
          unique_mos_id int,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          command_now VARCHAR(50),
          shield_no int,
          complaint_id int,
          month_received int,
          year_received int,
          month_closed int,
          year_closed int,
          command_at_incident VARCHAR(50),
          rank_abbrev_incident VARCHAR(50),
          rank_abbrev_now VARCHAR(50),
          rank_now VARCHAR(50),
          rank_incident VARCHAR(50),
          mos_ethnicity VARCHAR(50),
          mos_gender VARCHAR(50),
          mos_age_incident int,
          complainant_ethnicity VARCHAR(50),
          complainant_gender VARCHAR(50),
          complainant_age_incident int,
          fado_type VARCHAR(50),
          allegation VARCHAR(50),
          precinct VARCHAR(50),
          contact_reason VARCHAR(100),
          outcome_description VARCHAR(50),
          board_disposition VARCHAR(50)
        )`
      );
    })
    .then(() => {
      console.log(chalk.green('Copy CSV to Table'));
      return client.query(
        `COPY allegations("unique_mos_id","first_name","last_name","command_now","shield_no","complaint_id","month_received","year_received","month_closed","year_closed","command_at_incident","rank_abbrev_incident","rank_abbrev_now","rank_now","rank_incident","mos_ethnicity","mos_gender","mos_age_incident","complainant_ethnicity","complainant_gender","complainant_age_incident","fado_type","allegation","precinct","contact_reason","outcome_description","board_disposition")
  FROM '${currentDir}'
  DELIMITER ','
  CSV HEADER`
      );
    })
    .then(() => {
      console.log(chalk.green('Done!'));
      return client.end();
    })
    .catch((er) => console.log(chalk.red('*** Error in seed', er, er.stack)));
}

makeAllegationsTable();
