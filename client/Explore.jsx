import React, { Component } from 'react';

import { SunburstStaticData } from './Sunburst/SunburstStaticData';
import { SunburstZoomStaticData } from './Sunburst/SunburstZoomStaticData';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
  fadoTypeTree,
  fadoEthnicityTree,
  fadoEthnicityGenderTree,
  fadoEthnicityGenderZoomTree,
  ethnicityGenderFadoZoomTree,
} from './sampleData';

export class Explore extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <div>
          <h1>Explore</h1>
          <p>
            This project aims to visualize in interesting ways all of the
            information from the Civil Complaints Review Board (CCRB) that has
            been made available to the public (specifically from{' '}
            <a
              target="_blank"
              href="https://www.propublica.org/article/nypd-civilian-complaint-review-board-editors-note"
            >
              ProPublica
            </a>
            ) after the repeal of 50-a. Briefly, the CCRB is an independent
            agency that is charged with fielding complaints from the public
            about incidents involving NYPD Officers. By their own definition:
          </p>
          <blockquote>
            The New York City Civilian Complaint Review Board (CCRB) is an
            independent agency. It is empowered to receive, investigate,
            mediate, hear, make findings, and recommend action on complaints
            against New York City police officers alleging the use of excessive
            or unnecessary force, abuse of authority, discourtesy, or the use of
            offensive language. The Board’s investigative staff, composed
            entirely of civilian employees, conducts investigations in an
            impartial fashion. The Board forwards its findings to the police
            commissioner.
          </blockquote>
          <p>
            All complaints filed with the CCRB are filed against one or more
            specific officers by one or more complainants, and each complaint
            holds one or more allegations from a specific complainant to a
            specific officer. ProPublica does a great job explaining this in
            more detail{' '}
            <a
              target="_blank"
              href="https://projects.propublica.org/nypd-ccrb/#about"
            >
              here
            </a>
            . ProPublica also gives a great{' '}
            <a
              target="_blank"
              href="https://projects.propublica.org/nypd-ccrb/"
            >
              interface
            </a>{' '}
            for the break downs of allegations over four available categories:
            Force, Abuse of Authority, Discourtesy and Offensive Language. I am
            hoping that the tools I have made and describe here act as a
            companion to the ProPublica search tools and that they will help
            every day readers understand a bit more about the distribution of
            complaints among different intersections of the population.
          </p>
          <Row className="align-items-center content-div">
            <Col lg={{ order: 'first', span: 6 }} xs={{ order: 'last' }}>
              <SunburstStaticData data={fadoTypeTree} />
            </Col>
            <Col lg={6}>
              <p>
                This first pie chart represents all of the allegations in the
                database. It's immediately clear that Abuse of Authority
                allegations outnumber all the rest. By hovering over each pie
                slice, we can see how many allegations that slice holds. But
                what if I want to learn more about what who is actually making
                these complaints? For instance, how does each of these
                particular larger categories breakdown by the ethnicity of the
                complainant? Or by gender?
              </p>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="align-items-center content-div">
            <Col lg={6}>
              <p>
                Adding the breakdown of ethnicity for each allegation category
                illustrates a clearly that Black people have people have filed
                the most complaints with the CCRB across every category. Again,
                we can hover over each slice of the pie at each level to see how
                many allegations belong to each selected group.
              </p>
              <p>
                I'm curious to about how each gender for each ethnicity is
                distributed across all complaints.
              </p>
            </Col>
            <Col lg={6}>
              <SunburstStaticData data={fadoEthnicityTree} />
            </Col>
          </Row>
          <Row className="align-items-center content-div">
            <Col lg={6}>
              <SunburstStaticData data={fadoEthnicityGenderTree} />
            </Col>
            <Col lg={6} xs={{ order: 'first' }}>
              <p>
                After adding gender as a third characteristic in this chart, I
                can instantly see that Black males are consistently filing the
                most complaints with the CCRB.{' '}
              </p>

              <p>
                I can also see that this chart is getting more and more
                difficult to read. For instance, what is going on in the
                'Offensive Language Category'?
              </p>
            </Col>
          </Row>
          <Row className="align-items-center content-div">
            <Col lg={6}>
              <p>
                The next chart holds the same information as the previous chart
                but only shows 2 levels at a time. Click on each of the pie
                slices to go further into that particular segment of the data
                set, and click the blank space in the middle to move back up one
                level. Now we can explore the smaller teal piece of the pie
                towards the top of the chart to see the detail of Offensive
                Language Allegations. Always hover over each part of the pie to
                see the total number of allegations for that piece.{' '}
              </p>
            </Col>
            <Col lg={6}>
              <SunburstZoomStaticData data={fadoEthnicityGenderZoomTree} />
            </Col>
          </Row>
          <Row className="align-items-center content-div">
            <Col lg={6}>
              <p>
                If we change the order of information in the pie chart to show
                complainant ethnicity, then complainant gender, then abuse type,
                we can easily see that Black males are overwhelming filing the
                most allegations of police misconduct to the CCRB. After
                clicking on 'Black', then 'Male', we can hover over the 'Abuse
                of Authority' allegation type and see that there have been 8,824
                total Abuse of Authority allegations filed at the CCRB where the
                complainant is Black and Male. Check out{' '}
                <Link to="pie">Pie</Link> and <Link to="/piezoom">PieZoom</Link>{' '}
                to explore the data with your chosen data points.
              </p>
            </Col>
            <Col lg={6}>
              <SunburstZoomStaticData data={ethnicityGenderFadoZoomTree} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
