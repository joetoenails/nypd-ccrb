import React from 'react';
import { Link } from 'react-router-dom';

export const Home = (props) => {
  return (
    <div className="narrative">
      <h1>Release The Data! Now What?</h1>
      <p>
        After the{' '}
        <a
          target="_blank"
          href="https://www.innocenceproject.org/in-a-historic-victory-the-new-york-legislature-repeals-50-a-requiring-full-disclosure-of-police-disciplinary-records/"
        >
          repeal of 50-a
        </a>{' '}
        New Yorkers now have access to NYPD misconduct records held by the Civil
        Complaints Review Board (CCRB) that were previously shielded from the
        public. The CCRB is an independent agency that is charged with fielding
        complaints from the public about incidents involving NYPD Officers. By
        their own definition:{' '}
      </p>
      <blockquote>
        {' '}
        The New York City Civilian Complaint Review Board (CCRB) is an
        independent agency. It is empowered to receive, investigate, mediate,
        hear, make findings, and recommend action on complaints against New York
        City police officers alleging the use of excessive or unnecessary force,
        abuse of authority, discourtesy, or the use of offensive language. The
        Board’s investigative staff, composed entirely of civilian employees,
        conducts investigations in an impartial fashion. The Board forwards its
        findings to the police commissioner.
      </blockquote>
      <p>
        Unfortunately, the official{' '}
        <a target="_blank" href="https://www1.nyc.gov/apps/ccrb-status-lookup/">
          CCRB website
        </a>{' '}
        only offers viewing a CCRB if you know an exact case number, so the
        public has no resource to have a larger understanding of complaints
        against any particular officer or of complaints at the CCRB overall.
        Further, using the NYC Open Data Portal, a user can only view complaints
        and allegations received over time, but with no information on the
        officers who are alleged against.{' '}
      </p>
      <p>
        {' '}
        <a
          target="_blank"
          href="https://www.propublica.org/article/nypd-civilian-complaint-review-board-editors-note"
        >
          ProPublica
        </a>{' '}
        acquired a complete database of current officers who have allegations
        filed against them with the CCRB and released them in July, 2020. I
        don't know anyone else besides me who has actually *looked* at these
        files. The files in question include a 33,000+ row CSV file that details
        33,000+ allegations against some 4,000 officers. Making sense of 33k
        rows of anything is hard for anyone to do, let alone someone who is
        comfortable with spreadsheets. A couple of institutions have made tools
        available to go through this data including{' '}
        <a target="_blank" href="https://projects.propublica.org/nypd-ccrb/">
          ProPublica
        </a>
        , and{' '}
        <a
          target="_blank"
          href="https://www.nyclu.org/en/campaigns/nypd-misconduct-database"
        >
          NYCLU
        </a>
        , but I thought there were some features missing to help everyday people
        from understanding and seeing the data. Specifically, I wanted to see
        complaints broken down by precinct and complaint ethnicity. The Pie
        tools (<Link to="/pie">Pie</Link> and <Link to="/piezoom">PieZoom</Link>
        ) make these and other aggregate combinations available for
        visualization. I also wanted everyday users to be able to discover the
        data through exploring a 'searchbar-free' interface that can easily
        identify officers by amount of allegations received and the officer's
        ethnicity. See <Link to="/squares">Squares</Link> and{' '}
        <Link to="/bars">Bars</Link> for this.
      </p>
      <p>
        So much of our world is controlled by 'the data', but few undertake the
        daunting task of reading and understanding the data. Hopefully these
        tools will familiarize more every day people with some of this newly
        available information.
      </p>
    </div>
  );
};
