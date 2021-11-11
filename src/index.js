import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import { event as currentEvent } from "d3-selection";

import data from './data.json'

import "./styles.css";

const App = () => {
  useEffect(() => {
    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);

      return d => {
        console.log(d.group,d3.schemeCategory10);
        return d3.schemeCategory10[d.group];
      };
    };
    const drag = simulation => {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };
    const fetchData = async () => {
      const width = 500;
      const height = 500;
    //   const data = await d3.json(
    //     "https://demos-internal.s3-us-west-2.amazonaws.com/analisys-of-surveys/atlantia_graph.json"
    //   );
      console.log("DATA", data)
      const links = data.links.map(d => Object.create(d));
      const nodes = data.params.map(d => Object.create(d));
      const rules = data.rules.map(d => Object.create(d));
      const simulation = d3
        .forceSimulation([...nodes, ...rules])
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      const svg = d3
        .select("body")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

      const link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", color())
        .call(drag(simulation))
        .on("mouseover", function(d) {
          console.log(d);
          console.log(currentEvent.pageX, currentEvent.pageY);
        });

      node.append("title").text(d => d.group);

    //   console.log(svg
    //     .append("g")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 1.5)
    //     .selectAll("circle")
    //     .data(rules)
    //     .join("square")
    //     .attr("x", 5)
    //     .attr("y", 5))
      const rule = svg
      .append("g")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(rules)
      .join("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color())
      .call(drag(simulation))
      .on("mouseover", function(d) {
        console.log(d);
        console.log(currentEvent.pageX, currentEvent.pageY);
      });
      rule.append("title").text(d => d.group);

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

          node.attr("cx", d => d.x).attr("cy", d => d.y);
          rule.attr("x", d => d.x-5).attr("y", d => d.y-5);
      });
    };

    fetchData();
  }, []);

  return <div>app</div>;
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
