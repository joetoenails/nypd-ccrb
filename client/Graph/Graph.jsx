import React from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import axios from 'axios';

export class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      links: [],
    };
    this.createChart = this.createChart.bind(this);

    this.node = React.createRef();
  }

  componentDidMount() {
    axios.get('/api/graph').then(({ data }) => {
      this.setState((state) => {
        return {
          nodes: data.nodes,
          links: data.links,
        };
      }, this.createChart);
    });
  }

  createChart() {
    const height = 1600;
    const width = height;

    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return (d) => scale(d.group);
    };

    const drag = (simulation) => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const links = this.state.links.map((d) => Object.create(d));
    const nodes = this.state.nodes.map((d) => Object.create(d));
    // // console.log(data.nodes)
    // console.log(links);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.unique_mos_id)
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const svg = d3
      .create('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const link = svg
      .append('g')
      .attr('stroke', '#ffa500')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => d.qty * 2);

    link.append('title').text((d) => `${d.qty} Complaints shared`);

    const node = svg
      .append('g')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.count * 0.25)
      .attr('fill', 'dodgerblue')
      .call(drag(simulation));

    node
      .append('title')
      .text(
        (d) =>
          `${d.first_name} ${d.last_name} \nTotal Allegations: ${d.count}\n${
            d.mos_ethnicity
          } ${d.mos_gender === 'M' ? 'Male' : 'Female'}, ${d.rank_now}`
      );

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    // invalidation.then(() => simulation.stop());

    const graph = svg.node();
    if (this.node.current.children.length) {
      this.node.current.removeChild(this.node.current.children[0]);
    }
    this.node.current.appendChild(graph);
  }

  render() {
    return (
      <div>
        <h1>Graph</h1>
        <p>
          All complaints filed at the CCRB can several allegations lodged
          against multiple officers. Each of these circles represents a single
          police officer that has had a allegation filed against them and
          another police officer by the same complainant. Or more simply, these
          officers were working together when they were both accused of wrong
          doing by a complainant. The size of the circle represents how many
          total allegations have been lodged against them. The width of the line
          that connects each circle represents how many complaints the two
          connected officers appear in together. Hover over each circle to see
          detail information of individual officers. By showing these
          connections we can get a feel of what groups of officers tend to have
          connected behavior accorded to the filed allegations.
        </p>
        <div ref={this.node}></div>
      </div>
    );
  }
}
