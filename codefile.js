///First and foremost thanks for the skeleton, Dr. Sidharth Kumar. It reduced the burden to large extent. 
///mapping and filtering(array methods and JS Promises) methods reference from Web Dev Simplified youtube channel
///JavaScript Nested Loops with Arrays and Objects reference from Steve Griffith youtube channel 
///Legend and dynamic changes of year reference from Github

var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");
var title = 'Changes Over Years';
var yAxisLabel = 'Life Expectancy';
var xAxisLabel = 'Income';
var fdata, EuropeData, AmericaData, AsiaData, AfricaData, visdata, cntryData, selectedConti, selectedCntry, Flag=0;
var rendered_year = 0, current_year = 1800;
var playing = false;
let margin = { top: 60, right: 40, bottom: 88, left: 150 };
let innerWidth = width - margin.left - margin.right;
let innerHeight = height - margin.top - margin.bottom;

// Setting the Y axis
var frmtYaxis = d3.format("0");
var yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]).nice()
// Setting the X axis
var frmtXaxis = d3.format("0");
var xScale = d3.scaleLog().base(10).range([0, innerWidth]).domain([142, 150000]).nice()
// Setting Area
var area = d3.scaleLinear()	.range([25 * Math.PI, 1500 * Math.PI]).domain([2000, 1400000000]);
var g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
var xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15).tickFormat(frmtXaxis).ticks(4);
var yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10).tickFormat(frmtYaxis).ticks(4);;
var yAxisG = g.append('g').call(yAxis);
yAxisG.selectAll('.domain').remove();
var xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0,${innerHeight})`);
xAxisG.select('.domain').remove();

g.append('text').attr('class', 'title').attr('y', -10).text(title);
yAxisG.append('text').attr('class', 'axis-label')
.attr('y', -55).attr('x', -height / 3).attr('fill', 'black').attr('transform', `rotate(-90)`)
.attr('text-anchor', 'middle').text(yAxisLabel);
xAxisG.append('text').attr('class', 'axis-label').attr('y', 55).attr('x', innerWidth / 2)
.attr('fill', 'black').text(xAxisLabel);

svg.append("text").attr("id", "newyear").attr("text-anchor","end").attr("x",800).attr("y",390).attr("font-family", "Impact").style("opacity",0.2).attr("font-size","175px").text(+current_year);

//LEGENDS
svg.append("rect").attr("x", 825).attr("y", 290).attr("width", 20).attr("height", 20).attr("fill","#decbe4");
svg.append("rect").attr("x", 825).attr("y", 320).attr("width", 20).attr("height", 20).attr("fill","#ccebc5");
svg.append("rect").attr("x", 825).attr("y", 350).attr("width", 20).attr("height", 20).attr("fill","#b3cde3");
svg.append("rect").attr("x", 825).attr("y", 380).attr("width", 20).attr("height", 20).attr("fill","#fbb4ae");
svg.append("text").attr("x", 882).attr("y",305).style("text-anchor", "middle").attr("fill","black").text("Europe");
svg.append("text").attr("x", 873).attr("y",335).style("text-anchor", "middle").attr("fill","black").text("Asia");
svg.append("text").attr("x", 890).attr("y",365).style("text-anchor", "middle").attr("fill","black").text("Americas");
svg.append("text").attr("x", 881).attr("y",395).style("text-anchor", "middle").attr("fill","black").text("Africas");

var continentColor = d3.scaleOrdinal(d3.schemePastel1);
loadData();
function loadData()
{
	Flag='True';
	d3.json("data.json").then(function (data) 
{ 
	fdata = data.map(function (year_data) {
		return year_data["countries"].filter(function (country) {
			var existing_data = (country.income && country.life_exp);
			return existing_data
		}).map(function (country) {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	})
	;
	visdata=fdata;
	draw_circles(visdata,0);

	AsiaData = data.map(function(year_data){
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent  == "asia" && country.income && country.life_exp); 
			return existing_data
		}).map(function (country) {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})});

	EuropeData = data.map(function(year_data){
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent  == "europe" && country.income && country.life_exp); 
			return existing_data
		}).map(function (country) {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})});

	AmericaData = data.map(function(year_data){
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent  == "americas" && country.income && country.life_exp); 
			return existing_data
		}).map(function (country) {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})});

	AfricaData = data.map(function(year_data){
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent  == "africa" && country.income && country.life_exp); 
			return existing_data
		}).map(function (country) {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})});
})
}

function dropdownchange(s1,s2)
{
	var s1 = document.getElementById(s1);
	var s2 = document.getElementById(s2);
	s2.innerHTML="";
	selectedConti = s1.options[s1.selectedIndex].value;
	if(selectedConti=="all"){visdata=fdata;}
	else if(selectedConti=="asia")
	{
		visdata=AsiaData;
		countData = AsiaData[rendered_year];
		for(let i =0, len=countData.length; i<len; i++)
		{
			var OptionCntry = document.createElement("option");
			OptionCntry.value = countData[i].country;
			OptionCntry.innerHTML= countData[i].country;
			s2.options.add(OptionCntry);
		}
	}
	else if(selectedConti=="americas")
	{
		visdata=AmericaData;
		countData = AmericaData[rendered_year];
		for(let i =0, len=countData.length; i<len; i++)
		{
			var OptionCntry = document.createElement("option");
			OptionCntry.value = countData[i].country;
			OptionCntry.innerHTML= countData[i].country;
			s2.options.add(OptionCntry);
		}
	}
	else if(selectedConti=="africa")
	{
		visdata=AfricaData;
		countData = AfricaData[rendered_year];
		for(let i =0, len=countData.length; i<len; i++)
		{
			var OptionCntry = document.createElement("option");
			OptionCntry.value = countData[i].country;
			OptionCntry.innerHTML= countData[i].country;
			s2.options.add(OptionCntry);
		}
	}
	else if(selectedConti=="europe")
	{
		visdata=EuropeData;
		countData = EuropeData[rendered_year];
		for(let i =0, len=countData.length; i<len; i++)
		{
			var OptionCntry = document.createElement("option");
			OptionCntry.value = countData[i].country;
			OptionCntry.innerHTML= countData[i].country;
			s2.options.add(OptionCntry);
		}
	}
	draw_circles(visdata,0);
}

function reset_country()
{
location.reload();	
}

function dropdowncountry(s2)
{
	selectedCntry = document.getElementById(s2).value;
	if(selectedConti=="asia")
	{
	visdata=AsiaData;
	countData = AsiaData[rendered_year];
	loadCountry(visdata,0)
	}
	else if(selectedConti=="americas")
	{
	visdata=AmericaData;
	countData = AsiaData[rendered_year];
	loadCountry(visdata,0)
	}
	else if(selectedConti=="africa")
	{
	visdata=AfricaData;
	countData = AsiaData[rendered_year];
	loadCountry(visdata,0)
	}
	else if(selectedConti=="europe")
	{
	visdata=EuropeData;
	countData = AsiaData[rendered_year];
	loadCountry(visdata,0)
	}
}

function loadCountry(data, year)
{
	Flag="False";
	var localData = data[year];
	for(let i =0, len=localData.length; i<len; i++)
	{
		if(localData[i].country == selectedCntry)
		{
			cntryData=localData[i];
			draw_cntry_circles(cntryData,rendered_year)
		}
	}
}
d3.select("#slider").on("input", render);

function render() 
{
	var slider_val = d3.select("#slider").property("value");
    rendered_year = +slider_val
	if(Flag=="True")
	{
		draw_circles(visdata,rendered_year)
	}
	else if(Flag=="False")
	{
		loadCountry(visdata,rendered_year);
	}
}

function draw_cntry_circles(data,year) 
{
    d3.select("#newyear").text( + current_year+ year) 
    var circle_update = g.selectAll('circle');
    circle_update.enter().append('circle').merge(circle_update).attr("cx", xScale(data["income"]))
      .attr("cy", yScale(data["life_exp"])).attr("r", Math.sqrt(area(data["population"])/Math.PI))
      .attr("fill", d => continentColor(d.continent))
      .on("mouseover", function(d)
        {  
        labelInfo = d3.select(".container").append("div").attr("class", "label_content").style("opacity", 0); 
        d3.select(this).style("stroke-width", 3).transition().duration(500);
        labelInfo.style("opacity", 1.1);
        labelInfo.html("Country : "+data["country"]+"<br/>"+"Continent : "+d.continent+"<br/>"+"Life Expectancy : "+data["life_exp"]+"<br/>"+"Population : "+ data["population"]
        +"<br/>"+"Income : "+ data["income"]).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d)
        {  
        d3.select(this).style("stroke-width", 1).transition().duration(100);
        labelInfo.remove();
        })

circle_update.exit().remove();

	if (playing)
        setTimeout(step, 100)
}

function draw_circles(data,year) 
{
    d3.select("#newyear").text( + current_year+ year) 
    var circle_update = g.selectAll('circle').data(data[year]);
    circle_update.enter().append('circle').merge(circle_update).attr("cx", d => xScale(d.income))
      .attr("cy", d => yScale(d.life_exp)).attr("r", d => Math.sqrt(area(d.population)/Math.PI))
      .attr("fill", d => continentColor(d.continent))
      .on("mouseover", function(d)
        { 
        labelInfo = d3.select(".container").append("div").attr("class", "label_content").style("opacity", 0); 
        d3.select(this).style("stroke-width", 3).transition().duration(500);
        labelInfo.style("opacity", 1.1);
        labelInfo.html("Country : "+d.country+"<br/>"+"Continent : "+d.continent+"<br/>"+"Life Expectancy : "+d.life_exp+"<br/>"+"Population : "+ d.population
        +"<br/>"+"Income : "+ d.income).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d)
        {   
        d3.select(this).style("stroke-width", 1).transition().duration(100);
        labelInfo.remove();
        })

circle_update.exit().remove();

	if (playing)
        setTimeout(step, 100)
}

function play() 
{	
	if (d3.select("button").property("value") == "Play") {
		d3.select("button").text("Pause")
        d3.select("button").property("value", "Pause")
        playing = true
        step()
	}
	else 
	{
		d3.select("button").text("Play")
        d3.select("button").property("value", "Play")
        playing = false
	}
}

function step() 
{
	rendered_year = (rendered_year < 214) ? rendered_year + 1 : 0
	console.log(rendered_year);
	if(Flag=="True")
	{
		draw_circles(visdata,rendered_year)
	}
	else if(Flag=="False")
	{
		loadCountry(visdata,rendered_year);
	}
}


