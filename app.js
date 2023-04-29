function finalproject() {
    var filePath="prospects.csv";
    scatter_plot(filePath);
    stacked_bar(filePath);
    bar_chart(filePath);
    choropleth(filePath);
    adjacency_matrix(filePath);

}

var scatter_plot = function(filePath) {
    d3.csv(filePath).then(function(data){
        c_data = data.filter(d => (d['3Cone'] != '') & (d['Shuttle'] != ''))

        const margin = {top: 100, right: 50, bottom: 70, left: 70},
        width = 900 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;
        padding = 0.5;

        const svg = d3.select("#scatter_plot")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform",`translate(${margin.left}, ${margin.top})`);

        // X-axis: 3-cone drill time
        min_3cone = d3.min(c_data, d => parseFloat(d['3Cone']))
        max_3cone = d3.max(c_data, d => parseFloat(d['3Cone']))
        const xScale = d3.scaleLinear()
                         .domain([min_3cone - padding, max_3cone + padding])
                         .range([0, width])

        svg.append("g")
           .attr("transform", "translate(0, " + (height) + ")")
           .call(d3.axisBottom(xScale))
           .selectAll("text").style("font-size", "12px");

        // Y-axis: Shuttle drill time
        min_shuttle = d3.min(c_data, d => parseFloat(d['Shuttle']))
        max_shuttle = d3.max(c_data, d => parseFloat(d['Shuttle']))
        const yScale = d3.scaleLinear()
                         .domain([min_shuttle - padding, max_shuttle + padding])
                         .range([height, 0])

        svg.append("g")
           .call(d3.axisLeft(yScale))
           .selectAll("text").style("font-size", "12px");

        const positions = d3.sort(new Set(d3.map(c_data, d => d['Pos'])))
        const colorScale = d3.scaleOrdinal()
                             .domain(positions)
                             .range(d3.schemePaired);

        // Graph points
        svg.append("g")
           .selectAll("points")
           .data(c_data)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(parseFloat(d['3Cone'])))
           .attr("cy", d => yScale(parseFloat(d['Shuttle'])))
           .attr("r", 5)
           .style("fill", function(d) { return colorScale(d['Pos'])})


        var legend_padding = width - 50
        var label_padding = 20
        var legend_height = 250
        var text_padding = 15

        svg.selectAll("legend_title")
           .data(positions)
           .enter()
           .append("text")
           .attr("font-size", "15px")
           .attr("x", legend_padding)
           .attr("y", legend_height - label_padding)
           .text("Legend")
           .attr("text-anchor", "left")
           .style("alignment-baseline", "middle")
           .attr("text-decoration", "underline")
           .attr("font-weight", "3")

        svg.selectAll("legend_colors")
            .data(positions)
            .enter()
            .append("circle")
                .attr("cx", legend_padding)
                .attr("cy", function(d,i){ return legend_height + i*label_padding})
                .attr("r", 5)
                .style("fill", function(d){ return colorScale(d)})
                
        svg.selectAll("legend_labels")
            .data(positions)
            .enter()
            .append("text")
            .attr("id", "text")
                .attr("x", legend_padding + text_padding)
                .attr("y", function(d,i){ return legend_height + i*label_padding})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        // title text label
        var title_x_padding = 20;
        var title_y_padding = 25;

        svg.append("text")
           .attr("x", margin.left - title_x_padding)
           .attr("y",  padding - title_y_padding )
           .text("3-Cone Time vs. Shuttle Time for 2023 NFL Draft Combine Participants")
           .style("font-size", "24px")
           .style("stroke-width", "1")

        var axis_padding = 10
        // x axis text label
        svg.append("text")
           .attr("x", width / 2 - axis_padding )
           .attr("y",  height + margin.bottom - axis_padding)
           .style("text-anchor", "middle")
           .text("3-Cone Time (Seconds)")
           .style("font-size", "18px");

        // y axis text label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x",  -height / 2)
           .attr("y", -margin.left + 2 * axis_padding)
           .style("text-anchor", "middle")
           .text("Shuttle Time (Seconds)")
           .style("font-size", "18px");

        var checklist = d3.select('#checklist')
                .attr('name', 'value').on("click", function (d) {
                    c_position = document.querySelectorAll('.pl');
                    c_position = d3.map(d3.filter(c_position, d => d.checked), d => d.value)
                    c_data = data.filter(d => c_position.includes(d.Pos))
                    c_data = c_data.filter(d => (d['3Cone'] != '') & (d['Shuttle'] != ''))

                    const positions = d3.sort(new Set(d3.map(c_data, d => d['Pos'])))
                    const colorScale = d3.scaleOrdinal()
                                         .domain(positions)
                                         .range(d3.schemePaired);
                    
                    // Updating points
                    svg.selectAll("circle")
                        .attr("opacity", 0)
                        .data(c_data)
                        .transition()
                        .duration(800)
                        .attr("cx", d => xScale(d['3Cone']))
                        .attr("cy", d => yScale(d['Shuttle']))
                        .attr("r", 5)
                        .style("fill", function(d) { return colorScale(d['Pos'])})
                        .attr("opacity", 1)

                    // Updating legend
                    var legend_padding = width - 50
                    var label_padding = 20
                    var legend_height = 250
                    var text_padding = 15
                
                    d3.select('#legend_colors').remove();
                    svg.selectAll("#legend_colors")
                        .data(positions)
                        .enter()
                        .append("circle")
                            .attr("cx", legend_padding)
                            .attr("cy", function(d,i){ return legend_height + i*label_padding})
                            .attr("r", 5)
                            .style("fill", function(d){ return colorScale(d)})
                            
                    d3.selectAll('#text').remove();
                    svg.selectAll("#legend_labels")
                        .data(positions)
                        .enter()
                        .append("text")
                        .attr("id", "text")
                            .attr("x", legend_padding + text_padding)
                            .attr("y", function(d,i){ return legend_height + i*label_padding})
                            .text(function(d){ return d})
                            .attr("text-anchor", "left")
                            .style("alignment-baseline", "middle")
                    
                })    

    });
}

var stacked_bar = function(filePath) {
    d3.csv(filePath).then(function(data){
        only_wr = d3.filter(data, d => d['Pos'] == 'WR')
        wr_drills = d3.filter(only_wr, d=> (d['40yd'] != '') & (d['3Cone'] != '') & (d['Shuttle'] != ''))
        wr_drills = d3.sort(wr_drills, d => parseFloat(d['40yd']) + parseFloat(d['3Cone']) + parseFloat(d['Shuttle']))
        
        quickness = ["40yd", "3Cone", "Shuttle"]
        var series =  d3.stack().keys(quickness);
	    var stacked = series(wr_drills);

        const margin = {top: 50, right: 150, bottom: 70, left: 150}
        var height = 800 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;
        var padding = 25;
        var value_padding = 2;

        var svg = d3.select("#stacked_bar_chart")
                    .append("svg")
				    .attr("height", height + margin.top + margin.bottom)
				    .attr("width", width + margin.left + margin.right)
                    .append("g")
                    .attr("transform",`translate(${margin.left}, ${margin.top})`);

        var colors = ["#003f5c", "#bc5090", "#ffa600"]

        var xScale = d3.scaleBand()
                        .domain(d3.range(wr_drills.length))
                        .range([0, width])
                        .padding(0.05);

        var yScale = d3.scaleLinear()
                        .domain([0, value_padding + d3.max(wr_drills, function(d){ 
                            return parseFloat(d['40yd']) + parseFloat(d['3Cone']) + parseFloat(d['Shuttle']);
                        })])
                        .range([height, 0]);

        
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        let player_names = wr_drills.map(d => {return d['Player']});
        xAxis.tickFormat(function(d, i) {return player_names[i]});

        svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0," + (height) + ")").selectAll("text").attr("transform", "rotate(-8)").style("font-size", "12px");
        svg.append("g").call(yAxis).attr("class", "yAxis").selectAll("text").style("font-size", "12px");

        

        var groups = svg.selectAll(".gbars")
                        .data(stacked)
                        .enter()
                        .append("g")
                        .attr("class","gbars")
                        .style("fill", function(d, i) {
                            return colors[i];
                        });

        var rects = groups.selectAll("rect")
                          .data(function(d){
                               return d;
                           })
                          .enter()
                          .append("rect")
                          .attr("x", function(d, i) {
                               return xScale(i);
                           })
                          .attr("y", function(d) {
                               return yScale(d[1]);
                           })
                          .attr("height", function(d) {
                               return yScale(parseFloat(d[0])) - yScale(parseFloat(d[1])) ;
                           })
                          .attr("width", xScale.bandwidth());

        // title text label
        var title_x_padding = 125;
        var title_y_padding = 30;

        svg.append("text")
           .attr("x", -margin.left + title_x_padding)
           .attr("y", -margin.top + title_y_padding)
           .text("Fastest (40-yd Time) and Most Agile (3-Cone Time and Shuttle Time) Wide Receivers in the 2023 NFL Draft Class")
           .style("font-size", "20px")
           .style("stroke-width", "1")

        var axis_padding = 15
        // x axis text label
        svg.append("text")
           .attr("x", width / 2 - axis_padding )
           .attr("y",  height + margin.bottom - axis_padding )
           .style("text-anchor", "middle")
           .text("Player")
           .style("font-size", "18px");

        // y axis text label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x",  -height / 2)
           .attr("y", -margin.left + 4 * padding)
           .style("text-anchor", "middle")
           .text("40-yd Time + 3-Cone Time + Shuttle Time (Seconds)")
           .style("font-size", "18px");

        var legend_padding = width + 20
        var label_padding = 20
        var legend_height = 250
        var text_padding = 15

        // legend title
        svg.selectAll("legend_title")
            .data(quickness)
            .enter()
            .append("text")
            .attr("font-size", "15px")
            .attr("x", legend_padding)
            .attr("y", legend_height - label_padding)
            .text("Legend")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("text-decoration", "underline")
            .attr("font-weight", "3")

        legend_label_padding = 45
        // legend colors
        svg.selectAll("legend_colors")
            .data(quickness)
            .enter()
            .append("circle")
                .attr("cx", legend_padding)
                .attr("cy", function(d,i){ return legend_height + legend_label_padding - i*label_padding})
                .attr("r", 5)
                .style("fill", function(d, i){ return colors[i]})
              
        // legend labels
        
        svg.selectAll("legend_labels")
            .data(quickness)
            .enter()
            .append("text")
                .attr("x", legend_padding + text_padding)
                .attr("y", function(d,i){ return legend_height + legend_label_padding - i*label_padding})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

    })
};

var bar_chart = function(filePath) {
    d3.csv(filePath).then(function(data){
        by_conference = d3.rollups(data, v => v.length, d => d.Conference)
        by_conference = d3.filter(by_conference, d => d[1] >= 5)
        by_conference = d3.sort(by_conference, (a, b) => d3.descending(a[1], b[1]))

        const margin = {top: 50, right: 150, bottom: 70, left: 150}
        var height = 800 - margin.top - margin.bottom;
        var width = 1200 - margin.left - margin.right;
        var value_padding = 2;

        let svg = d3.select("#bar_chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",`translate(${margin.left}, ${margin.top})`);

        let xScale = d3.scaleBand()
                        .domain(d3.map(by_conference, d => d[0]))
                        .range([0, width])
                        .paddingInner(0.05);

        let yScale = d3.scaleLinear()
                        .domain([0, value_padding + d3.max(by_conference, d => d[1])])
                        .range([height, 0]);

        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        svg.selectAll(".bars")
            .data(by_conference)
            .enter()
            .append("rect")
            .attr("class", "conferences")
            .attr("x", function(d, i) { return xScale(d[0])})
            .attr("y", function(d) { return yScale(d[1])})
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return  height - yScale(d[1])})
            .attr("fill", "#b30000");

        svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0," + (height) + ")").selectAll("text").style("font-size", "12px");
        svg.append("g").call(yAxis).attr("class", "yAxis").selectAll("text").style("font-size", "12px");

        // title text label
        var title_x_padding = 175;
        var title_y_padding = 25;

        svg.append("text")
           .attr("x", -margin.left + title_x_padding)
           .attr("y", -margin.top + title_y_padding)
           .text("Number of 2023 NFL Draft Prospects from Each College Conference (Min. 5 Players per Conference)")
           .style("font-size", "22px")
           .style("stroke-width", "1")

        var x_axis_padding = 10
        var y_axis_padding = margin.left - 50

        // x axis text label
        svg.append("text")
           .attr("x", width / 2 - x_axis_padding )
           .attr("y",  height + margin.bottom - x_axis_padding )
           .style("text-anchor", "middle")
           .text("Conference")
           .style("font-size", "18px");

        // y axis text label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x",  -height / 2)
           .attr("y", -margin.left + y_axis_padding)
           .style("text-anchor", "middle")
           .text("Number of Players")
           .style("font-size", "18px");

    });
}

var choropleth = function(filePath) {
    var stateSym = {
        AZ: 'Arizona',
        AL: 'Alabama',
        AK: 'Alaska',
        AR: 'Arkansas',
        CA: 'California',
        CO: 'Colorado',
        CT: 'Connecticut',
        DC: 'District of Columbia',
        DE: 'Delaware',
        FL: 'Florida',
        GA: 'Georgia',
        HI: 'Hawaii',
        ID: 'Idaho',
        IL: 'Illinois',
        IN: 'Indiana',
        IA: 'Iowa',
        KS: 'Kansas',
        KY: 'Kentucky',
        LA: 'Louisiana',
        ME: 'Maine',
        MD: 'Maryland',
        MA: 'Massachusetts',
        MI: 'Michigan',
        MN: 'Minnesota',
        MS: 'Mississippi',
        MO: 'Missouri',
        MT: 'Montana',
        NE: 'Nebraska',
        NV: 'Nevada',
        NH: 'New Hampshire',
        NJ: 'New Jersey',
        NM: 'New Mexico',
        NY: 'New York',
        NC: 'North Carolina',
        ND: 'North Dakota',
        OH: 'Ohio',
        OK: 'Oklahoma',
        OR: 'Oregon',
        PA: 'Pennsylvania',
        RI: 'Rhode Island',
        SC: 'South Carolina',
        SD: 'South Dakota',
        TN: 'Tennessee',
        TX: 'Texas',
        UT: 'Utah',
        VT: 'Vermont',
        VA: 'Virginia',
        WA: 'Washington',
        WV: 'West Virginia',
        WI: 'Wisconsin',
        WY: 'Wyoming'
    };
    d3.csv(filePath).then(function(data){
        var by_state = d3.rollups(data, v => v.length, d => d.State)
        for (let [key, value] of Object.entries(stateSym)) {
            if (!d3.map(by_state, d => d[0]).includes(value)) {
                by_state.push([value, 0])
            }
        }

        var colors = d3.schemeBlues[6];
        var color = d3.scaleQuantize()
                      .range(colors);

        min_players = d3.min(by_state, function(d) { return d[1];})
        max_players = d3.max(by_state, function(d) { return d[1];})
        
        color.domain([min_players, max_players])

        const margin = {top: 50, right: 50, bottom: 50, left: 50}
        var height = 900 - margin.top - margin.bottom;
        var width = 1100 - margin.left - margin.right;
        var padding = 25;

        var svg = d3.select("#choropleth")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        const projection1  = d3.geoAlbersUsa()
                               .scale(1400)
                               .translate([500, 400]) 

        const pathgeo1 = d3.geoPath().projection(projection1); 

        const statesmap = d3.json("us-states.json").then(function(json) {
            for (var i = 0; i < by_state.length; i++) {
                var dataState = by_state[i][0];
                var dataValue = parseFloat(by_state[i][1]);
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;
                    if (dataState == stateSym[jsonState]) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            svg.selectAll("path")
               .data(json.features)
               .enter().append("path")
               .attr("d", pathgeo1)
               .attr("fill", function(d) {
                   var value = d.properties.value;
                   return color(value);
                });
        });

        var text_padding = 15
        var height_padding = 40
        var title_padding = 100
        // title text label
        svg.append("text")
           .attr("x", width / 2 - 2 * title_padding )
           .attr("y",  height_padding )
           .text("Number of 2023 NFL Draft Prospects by State")
           .style("font-size", "20px")

        lower_bounds = color.thresholds()
        lower_bounds.unshift(min_players)
        
        upper_bounds = color.thresholds()
        upper_bounds.push(max_players)

        bounds = []
        for (var i = 0; i < lower_bounds.length; i++) {
            bounds.push([lower_bounds[i], upper_bounds[i]])
        }

        // legend
        var legend_padding = width - 260
        var label_padding = 25
        var legend_height = 85

        // legend title
        svg.selectAll("legend_title")
            .data(bounds)
            .enter()
            .append("text")
            .attr("font-size", "15px")
            .attr("x", legend_padding)
            .attr("y", legend_height - label_padding)
            .text("Legend")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("text-decoration", "underline")
            .attr("font-weight", "3")


        svg.selectAll("legend_colors")
            .data(bounds)
            .enter()
            .append("circle")
                .attr("cx", legend_padding)
                .attr("cy", function(d,i){ return legend_height + i*label_padding})
                .attr("r", 7)
                .style("fill", function(d, i){ return colors[i]})
                
        svg.selectAll("legend_labels")
            .data(bounds)
            .enter()
            .append("text")
                .attr("x", legend_padding + text_padding)
                .attr("y", function(d,i){ return legend_height + i*label_padding})
                .text(function(d){ return Math.ceil(d[0]) + ' to ' + Math.floor(d[1]) + ' Players'})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            
    });
}

var adjacency_matrix = function(filePath) {
    d3.csv(filePath).then(function(data){
        only_sec = data.filter(d => d['Conference'] == 'SEC')
        sec_defenders = only_sec.filter(d => ['LB', 'EDGE', 'SAF', 'CB', 'DT', 'DE'].includes(d.Pos))
        var matrix = [];
        def_line = ['DE', 'DT']
        linebackers = ['LB', 'EDGE']
        def_back = ['SAF', 'CB']
        for (var i = 0; i < sec_defenders.length; i++) {
            for (var j = 0; j < sec_defenders.length; j++) {
                player1 = sec_defenders[i]
                player2 = sec_defenders[j]
                value = 0;
                if (player1['Pos'] == player2['Pos']) {
                    value += 30;
                }
                if (player1['School'] == player2['School']) {
                    value += 30;
                }
                if (player1['State'] == player2['State']) {
                    value += 20;
                }
                if ((def_line.includes(player1['Pos'])) & (def_line.includes(player2['Pos']))) {
                    value += 20;
                }
                else if ((linebackers.includes(player1['Pos'])) & (linebackers.includes(player2['Pos']))) {
                    value += 20;
                }
                else if ((def_back.includes(player1['Pos'])) & (def_back.includes(player2['Pos']))) {
                    value += 20;
                }
                matrix.push({'Player1': player1.Player, 'Player2': player2.Player, 'Chemistry': value})
            }
        }

        const margin = {top: 250, right: 200, bottom: 50, left: 200}
        var height = 1300 - margin.top - margin.bottom;
        var width = 1300 - margin.left - margin.right;
        var padding = 25;

        var svg = d3.select("#adjacency_matrix")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var names = d3.map(sec_defenders, d => d.Player)

        var xScale = d3.scaleBand()
                       .domain(names)
                       .range([0, width])
                       .padding(0.01)

        var yScale = d3.scaleBand()
                       .domain(names)
                       .range([0, height])
                       .padding(0.01);

        var color = d3.schemeGreens[5];

        var colorScale = d3.scaleQuantize()
                           .domain([0, 100])
                           .range(color)
        
        var tooltip = d3.select("#adjacency_matrix")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px")

        svg.selectAll()
           .data(matrix)
           .enter()
           .append("rect")
           .attr("x", function(d) { return xScale(d.Player1)})
           .attr("y", function(d) { return yScale(d.Player2)})
           .attr("width", xScale.bandwidth())
           .attr("height", yScale.bandwidth())
           .style("fill", d => colorScale(d.Chemistry))
           .on("mouseover", function(d) {
                tooltip.style("opacity", 1)
                var xPos = +d3.select(this).attr("x")
                var yPos = +d3.select(this).attr("y")
                var wid = +d3.select(this).attr("width")
                var hei = +d3.select(this).attr("height")
                d3.select(this)
                  .attr("x", xPos - 5)
                  .attr("y", yPos - 5)
                  .attr("width", wid + 10)
                  .attr("height", hei + 10)
                  .style("fill", d => colorScale(d.Chemistry))
                  .style("stroke", "black")
                  .style("stroke-width", "2")
                  .style("opacity", 1)
                  .raise()
           })
           .on("mousemove", function(e, d) {
                tooltip.html(d.Player1 + " & " + d.Player2 + "<br>" +
                             "Chemistry: " + d.Chemistry)
                       .style("left", (e.pageX + 10) + "px")
                       .style("top", (e.pageY + 10) + "px")
           })
           .on("mouseleave", function(d) {
                tooltip.style("opacity", 0)
                d3.select(this)
                  .attr("x", function(d) { return xScale(d.Player1)})
                  .attr("y", function(d) { return yScale(d.Player2)})
                  .attr("width", xScale.bandwidth())
                  .attr("height", yScale.bandwidth())
                  .style("fill", d => colorScale(d.Chemistry))
                  .style("stroke", "none")
                
           })

        svg.append("g")
           .call(d3.axisTop(xScale))
           .selectAll("text")
           .attr("transform", "translate(" + (xScale.bandwidth() / 2) + ", " + -(yScale.bandwidth() / 2) + ") rotate(-90)")
           .attr("text-anchor", "start")

        svg.append("g")
           .call(d3.axisLeft(yScale))

        min_chem = 0
        max_chem = 100
        lower_bounds = colorScale.thresholds()
        lower_bounds.unshift(min_chem)
        
        upper_bounds = colorScale.thresholds()
        upper_bounds.push(max_chem)

        bounds = []
        for (var i = 0; i < lower_bounds.length; i++) {
            bounds.push([lower_bounds[i], upper_bounds[i]])
        }
        
        // legend
        var legend_padding = width + 50;
        var label_padding = 25
        var legend_height = 85
        var text_padding = 15

        // legend title
        svg.selectAll("legend_title")
            .data(bounds)
            .enter()
            .append("text")
            .attr("font-size", "15px")
            .attr("x", legend_padding)
            .attr("y", legend_height - label_padding)
            .text("Legend")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("text-decoration", "underline")
            .attr("font-weight", "3")

        // legend colors
        svg.selectAll("legend_colors")
            .data(bounds)
            .enter()
            .append("circle")
                .attr("cx", legend_padding)
                .attr("cy", function(d,i){ return legend_height + i*label_padding})
                .attr("r", 7)
                .style("fill", function(d, i){ return color[i]})
                
        // legend labels
        svg.selectAll("legend_labels")
            .data(bounds)
            .enter()
            .append("text")
                .attr("x", legend_padding + text_padding)
                .attr("y", function(d,i){ return legend_height + i*label_padding})
                .text(function(d){ return Math.ceil(d[0]) + ' - ' + Math.floor(d[1]) + ' Chemistry'})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        var height_padding = -margin.top + 100
        var title_padding = 100
        // title text label
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2 - title_padding )
            .attr("y",  height_padding )
            .text("Chemistry of 2023 NFL Defensive Draft Prospects from the SEC")
            .style("font-size", "24px")

    });
}