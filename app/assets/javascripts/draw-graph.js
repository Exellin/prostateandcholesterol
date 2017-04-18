/*global $*/
/*global d3*/
/*global location*/
$(document).ready(function() {
  var regex = /profiles\/\d+$/;
  if($(location).attr('pathname').match(regex)) {
    var psaField = "psa";
    var psaAxis = "PSA";
    
    var choleterolField = "total_cholesterol";
    var cholesterolAxis = "Total Cholesterol";
    var cholesterolData = "total";  //can't be the same as field as passed variables can't have underscores
    
    var hdlField = "hdl";
    var hdlAxis = "HDL";
    
    var ldlField = "ldl";
    var ldlAxis = "LDL";
    
    var triglycerideField = "triglyceride";
    var triglycerideAxis = "Triglyceride";
    
    var glucoseField = "glucose";
    var glucoseAxis = "Glucose";
    
    drawGraph(psaField, psaField, psaAxis);
    drawGraph(cholesterolData, choleterolField, cholesterolAxis);
    drawGraph(hdlField, hdlField, hdlAxis);
    drawGraph(ldlField, ldlField, ldlAxis);
    drawGraph(triglycerideField, triglycerideField, triglycerideAxis);
    drawGraph(glucoseField, glucoseField, glucoseAxis);
  }
});

var drawGraph = function(data_field, attribute, axisTitle) {
  var id = "#" + attribute + "_chart";
  var margin = { top: 100, right: 20, bottom: 100, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
      
  var JSONData = $(id).data(data_field);
  if (!JSONData) {
    return;
  }
  
  var data = JSONData.slice();
  
  var parseTime = d3.timeParse("%Y-%m");
  
  var sortByDate = function(a, b) {
    return a.date-b.date;
  };
  
  data.forEach(function(d) {
    d.date = d.year + "-" + d.month;
    d[attribute] = +d[attribute];
    d.date = parseTime(d.date);
    data = data.sort(sortByDate);
  });
  
  var yFn = function(d) { return d[attribute] };
  var dateFn = function(d) { return parseTime(d.year + "-" + d.month)};

  var x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, dateFn));
    
  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, yFn)]);
    
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[attribute]); });
  
  var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("path")
    .attr("class", "line")
  .attr("d", line(data));
    
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .ticks(d3.timeYear.every(1))
      .tickFormat(d3.timeFormat('%Y'))
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-60)");
    
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top - 15)
    .style("text-anchor", "middle")
    .text("Date");
  
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(4));
    
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(axisTitle);
    
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .style("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "underline")
    .text(axisTitle + " History");
};