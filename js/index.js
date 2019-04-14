// url to retrieve data.
var url2 = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

//load data
d3.json(url2).then(function(json) {

    //load year and time
    const dataset2 =[];
    json.forEach(function(d) {
        dataset2.push([d3.timeParse("%Y")(d.Year),d3.timeParse("%M:%S")(d.Time)]);
    });

    //width and height of the plot.
    const w = 1000;
    const h = 700;
    const padding = 80;
  
    const minYear = d3.min(dataset2, (d,i) => d[0]);
    const maxYear = d3.max(dataset2, (d,i) => d[0]);
  
    const my2 = d3.timeYear.offset(new Date(minYear),-2);
 
    const minTime = d3.min(dataset2, (d,i) => d[1]);
    const maxTime = d3.max(dataset2, (d,i) => d[1]);
    
    const xScale = d3.scaleTime()
                     .domain([d3.timeYear.offset(minYear,0),d3.timeYear.offset(maxYear,+2)])
                     .range([padding, w - padding]);

    const yScale = d3.scaleTime()
                     .domain([d3.timeSecond.offset(minTime,-10),maxTime])
                     .range([h - padding, padding]);
  
    const svgC = d3.select("#visual")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
    var myTool = d3.select("#visual")
                  .append("div")
                  .attr("class", "myTool")
                  .attr("id","tooltip")
                  .style("opacity", 0);
  
     svgC.selectAll("circle")
       .data(dataset2)
       .enter()
       .append("circle")
       .attr("class","dot")
       .attr("cx", (d) => xScale(d[0]))
       .attr("cy", (d) => yScale(d[1]))
       .attr("data-xvalue", (d) => d[0])
       .attr("data-yvalue", (d) => d[1])
       .attr("r", (d) => 4)
       .on("mouseover", function(d,i){
            //alert(d[0])
            myTool.transition().duration(200).style('opacity', 0.9);
            myTool
              .html("<strong>Year: </strong> "+d[0].getFullYear()+"<strong> Time: </strong> "+d[1].getMinutes()+":"+ d[1].getSeconds())
              .attr("data-year", dataset2[i][0])
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY + 1 + "px")
              .style("display", "flex")
              .style("opacity", 1)
              
          })
    	  .on("mouseout", function(d) { 
            myTool.style("display", "none");
          });  

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  
    svgC.append("g")
       .attr("id","x-axis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);
  
    // text label for the x axis
  svgC.append("text")
      .attr("transform","translate(" + (w/2) + " ," + h + ")")
      .text("Date");
  
    svgC.append("g")
       .attr("id","y-axis")
       //.tickFormat(d3.timeFormat("%M:%S"))
       .attr("transform", "translate("+padding +",0)")
       .call(yAxis);
  
    // text label for the y axis
svgC.append("text")
    .attr("text-anchor", "end")
    .attr("y", 10)
    .attr('x',-270)
    .attr("dy", ".5em")
    .attr("transform", "rotate(-90)")
    .text("Time (min:sec)");  
  
  //add a legend
    svgC.append("text")
      .attr("id","legend")
      .attr("transform","translate(" + (w-padding - 200) + " ," + (h/2) + ")")
      .text("Cycling Data for Doping Cases");

});