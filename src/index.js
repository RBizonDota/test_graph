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
    const drawNode = (svg, simulation, div, node)=>{
        let n = svg
        .append("g")
        .attr("stroke", node.border_color)
        .attr("stroke-width", node.border_size)
        .selectAll("circle")
        .data([node])
        .join("circle")
        .attr("r", node.size)
        .attr("fill", node.color)
        .call(drag(simulation))
        .on("mouseover", function(event, element){
            console.log(event.pageY, event.pageX, event.target, element)
          d3.select(event.target)
          .transition()
          .duration(100)
          .style("opacity", 0.5);
          div
          .html(
            `
            <p style="font-size: ${event.font_size}; color: ${event.font_color}">${event.text}</p>
          `
          )
          .transition()
          .duration(100)
          .style("opacity", 1)
          .style("top", `${event.y*3}px`)
          .style("left", `${event.x*3}px`);
        })
        .on("mouseout", (event, element)=>{
            d3.select(event.target).transition().duration(100).style("opacity", 1);
            div.transition().duration(500).style("opacity", 0);
          });
        n.append("text").text(d => d.group);
        return n
    }
    const drawRule = (svg, simulation, div, rule)=>{
        let n = svg
        .append("g")
        .attr("stroke", rule.border_color)
        .attr("stroke-width", rule.border_size)
        .selectAll("circle")
        .data([rule])
        .join("rect")
        .attr("width", rule.size)
        .attr("height", rule.size)
        .attr("fill", rule.color)
        .call(drag(simulation))
        .on("mouseover", function(d) {
          console.log(d);
          console.log(currentEvent.pageX, currentEvent.pageY);
        });
        n.append("text").attr("dx", 0)
        .attr("dy", 0)
        .attr("fill", "#000")
        .attr("font-size", "10px")
        .text(d => d.text);
        return n
    }
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
      
        const div = d3.select("body").append("div").attr("class", "tooltip");
      let nodes_to_draw = []
      let rules_to_draw = []
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

        nodes.map(n=>{
            nodes_to_draw.push(drawNode(svg, simulation, div, n))
        })
        rules.map(n=>{
            rules_to_draw.push(drawRule(svg, simulation, div, n))
        })
        // const node = svg
        // .append("g")
        // .attr("stroke", "#fff")
        // .attr("stroke-width", 1.5)
        // .selectAll("circle")
        // .data(nodes)
        // .enter()
        // .append("circle")
        // .attr("r", 5)
        // .attr("fill", color())
        // .call(drag(simulation))
        // .on("mouseover", function(d) {
        //   console.log(d);
        //   console.log(currentEvent.pageX, currentEvent.pageY);
        // });

        // const _params = svg
        //     .append("g")
        //     .attr("class", "nodes")
        //     // .attr("stroke", "#000")
        //     // .attr("stroke-width", 2)
        //     .selectAll("g")
        //     .data(nodes)
        //     .enter()
        //     .append("g")
        //     .attr("stroke", d=>{d.border_color})
        //     .attr("stroke-width", d=>{d.border_size})
        //     .call(drag(simulation))
        //     .on("mouseover", function(d) {
        //       console.log(d);
        //       console.log(currentEvent.pageX, currentEvent.pageY);
        //     });
        // const params = _params
        //     .append("circle")
        //     .attr("r", d =>{d.size})
        //     .attr("fill", d =>{d.color})

    //   node.append("title").text(d => d.group);

    //   console.log(svg
    //     .append("g")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 1.5)
    //     .selectAll("circle")
    //     .data(rules)
    //     .join("square")
    //     .attr("x", 5)
    //     .attr("y", 5))
    //   const rule = svg
    //   .append("g")
    //   .attr("stroke", "#ddd")
    //   .attr("stroke-width", 1.5)
    //   .selectAll("circle")
    //   .data(rules)
    //   .join("rect")
    //   .attr("width", 10)
    //   .attr("height", 10)
    //   .attr("fill", color())
    //   .call(drag(simulation))
    //   .on("mouseover", function(d) {
    //     console.log(d);
    //     console.log(currentEvent.pageX, currentEvent.pageY);
    //   });
    //   rule.append("title").text(d => d.group);

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        //   node.attr("cx", d => d.x).attr("cy", d => d.y);
          nodes_to_draw.map(node =>node.attr("cx", d => d.x).attr("cy", d => d.y))
          rules_to_draw.map(node =>node.attr("x", d => d.x-d.size/2).attr("y", d => d.y-d.size/2))
        //   rule.attr("x", d => d.x-5).attr("y", d => d.y-5);
      });
    };

    fetchData();
  }, []);

  return <div>app</div>;
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
