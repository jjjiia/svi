var measuresLabels = {
AGE17:"% of Persons aged 17 and younger",
AGE65:"% of Persons aged 65 and older",
DISABL:"% of Civilian noninstitutionalized population with a disability",
LIMENG:"% of Persons who speak English \"less than well\"",
CROWD:"% of Households with more people than rooms",
GROUPQ:"% of Persons in group quarters",
MINRTY:"% of Minorities(all persons except white, non-Hispanic)",
MOBILE:"% of Mobile homes",
MUNIT:"% of Housing in structures with 10 or more units",
NOHSDP:"% of Persons with no high school diploma*",
NOVEH:"% of Households with no vehicle available",
PCI:"Per capita income",
POV:"% of Persons below poverty",
SNGPNT:"% of Single parent household with children under 18",
UNEMP:"Unemployed",
TOTPOP:"Total Population",
    UNINSUR:"% Uninsured"
}
var colors = ["#79872a",
"#37a625",
"#9b8e24",
"#3e9d48",
"#445a06",
"#6c9f27",
"#37630d",
"#5d882f",
"#297627",
"#576c1c"]
var colors2 = ["#ea5a22",
"#b12f4c",
"#cc8929",
"#e74b6e",
"#ab561a",
"#de3437",
"#812810",
"#e57952",
"#a12526",
"#bf4931"]
//top, bottom, middle, same/different, place at both ends - more than 1 extreme
var sortOrder = "UP"
var currentCat = "EP_UNEMP"
var countyNames = {
    "Richmond County":"Staten Island",
    "Kings County":"Brooklyn",
    "New York County":"Manhattan",
    "Queens County":"Queens",
    "Bronx County":"The Bronx"
}
var listLen = 10
     var topTenCats = ['EP_UNEMP', 'EP_PCI', 'EP_NOHSDP', 'EP_AGE65', 'EP_AGE17', 'EP_DISABL',
     'EP_SNGPNT', 'EP_MINRTY', 'EP_LIMENG', 'EP_MUNIT', 'EP_MOBILE', 'EP_CROWD', 'EP_NOVEH', 'EP_GROUPQ', 'EP_UNINSUR','EP_POV']
var withPop =null

function order(){
        d3.select("#up").style("background-color","#aaa")
    
    d3.select("#up").on("click",function(){
      //  console.log("up")
        sortOrder = "UP"
       d3.selectAll(".square").remove()
       d3.selectAll("#map svg").remove()
        display(withPop,currentCat)
        d3.select(this).style('background-color',"#aaa")
        d3.select("#down").style("background-color","#fff")
        
    })
    
    d3.select("#down").on("click",function(){
     //   console.log("down")
        sortOrder = "DOWN"
       d3.selectAll(".square").remove()
       d3.selectAll("#map svg").remove()
        display(withPop,currentCat)
        d3.select(this).style("background-color","#aaa")
        d3.select("#up").style("background-color","#fff")
    })
}

function slider(){
    d3.select("#size").append("div").attr("id","slider")
    
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function() {
      output.innerHTML = this.value;
      gridSize(this.value)
    
      
    }
    
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function gridSize(size){
    var highlightScale = d3.scaleLinear().domain([100,1000]).range([12,36])
    var fontScale = d3.scaleLinear().domain([100,1000]).range([10,16])
    
    var heightScale = d3.scaleLinear().domain([100,1000]).range([200,1200])
    
    d3.selectAll(".square").style("width",size+"px").style("height",heightScale(size)+"px")
    d3.selectAll("img").style("width",size*.9+"px").style("height",size*.9+"px")
    
    d3.selectAll(".labels").style("font-size",fontScale(size)+"px")
    d3.selectAll(".highlight").style("font-size",highlightScale(size)+"px")
}
function dropdown() {
        
    var list = document.getElementById("dropdownMenu");

    var boundsDict = {}
    
    for (var i in topTenCats) {
        var label = measuresLabels[topTenCats[i].split("_")[1]]
        var value = topTenCats[i]
        var option = document.createElement("OPTION");
        //Set Customer Name in Text part.
        option.innerHTML = label;    
        option.value = value
        option.id = "_"+i
        list.options.add(option);
          
    }
    
   $('select').on("change",function(){
      // console.log(this.value)       
       d3.selectAll(".square").remove()
       d3.selectAll("#map svg").remove()
       currentCat = this.value
       display(withPop,this.value)
       
    })
}



var sviData  = d3.csv("nyc_tracts_svi.csv")
var neighborhoodsData= d3.csv("neighborhoods.csv")
var centroidsData = d3.csv("allCentroids.csv")
var geoData = d3.json("newyork_tracts.geojson")
var waterData =d3.json("water.geojson")
Promise.all([sviData,neighborhoodsData, centroidsData,geoData,waterData]).then(function(data){ ready(data[0],data[1],data[2],data[3],data[4])})
//36005000100
//36061000700

var pub = {
    geo:null,
    centrois:null,
    water:null
}
function ready(sviData,neighborhoods,centroids,geo,water){ 
    slider()
    dropdown()
    order()
    //addGrid()
    
    pub.centroids = centroidsDictionary(centroids)
    pub.geo = geo
    pub.water = water
    
    topTenCats = [currentCat]
    //addGrid()
    
   
    var nDict = neighborhoodDict(neighborhoods)
    withPop = filterNoPop(sviData,nDict)
  //  console.log(topTenCats)
    for(var t in topTenCats){
       // console.log(topTenCats[t])
        display(withPop,topTenCats[t])
    }

   //  display(withPop,'EP_UNEMP')
}
function centroidsDictionary(data){
    var dict = {}
    for(var i in data){
        if(data[i]["Gid"]!=undefined){
            var gid = data[i]["Gid"].split("US")[1]
            dict[gid]=data[i]
        }
       
    }
    return dict
}
function drawMap(geo, centroids, water,list,list2){
    console.log(list2)
    console.log(list)
    var padding = 4
    var width = 800
    var height = 800
    var projection = d3.geoAlbers()
            .fitExtent([[padding,padding],[width-padding,height-padding]],geo)

    var path = d3.geoPath().projection(projection);
    var svg = d3.select("#map").append("svg").attr("width",width).attr("height", height);           

    svg.append("path")
        .attr("d", path(geo))
        //.attr("fill", "none")
        .attr("stroke", "none")
        .attr("fill","#000")
        .attr("stroke-opacity",1)
        .attr("stroke-width",1)

    svg.append("path")
        .attr("d", path(water))
        //.attr("fill", "none")
        .attr("stroke", "none")
        .attr("fill","#fff")
        .attr("stroke-opacity",1)
        .attr("stroke-width",1)  
    
    
    svg.selectAll("circle")
    	.data(list)
        .enter()
    	.append("circle")
    	.attr("r", 10)
        .attr("id",function(d){
            return "c1_"+d["FIPS"]
        })
    	.attr("cx", function(d) {
            var coords = centroids[d["FIPS"]]
        //    console.log(coords)
           // console.log(projection([coords.lng,coords.lat]))
      	    return projection([coords.lng,coords.lat])[0]
    	})
    	.attr("cy", function(d) {
            var coords = centroids[d["FIPS"]]
      	    return projection([coords.lng,coords.lat])[1]
    	})
    	.attr("opacity", 1)
        .attr("fill",function(d,i){
            if(currentCat=="EP_PCI"){
                return colors2[5]
            }
                return colors[3]
            
        })
        .attr("stroke","#fff")
        .attr("cursor","pointer")
        .on("click",function(d){
            var gid = d["FIPS"]
            d3.selectAll(".text2").attr("opacity",.5)
            d3.selectAll(".text1").attr("opacity",.5)
            d3.selectAll("circle").attr("opacity",.5)
            d3.select(this).attr("r",20).attr("opacity",1)
            d3.select("#t1_"+gid).style("font-size","24px").attr("opacity",1)
            addGrid([d],currentCat)
        })
    
    svg.selectAll(".list2")
    	.data(list2)
        .enter()
    	.append("circle")
        .attr("class","list2")
    	.attr("r", 10)
        .attr("id",function(d){
            return "c2_"+d["FIPS"]
        })
    	.attr("cx", function(d,i) {
            var coords = centroids[d["FIPS"]]
        //    console.log(coords)
           // console.log(projection([coords.lng,coords.lat]))
      	    return projection([coords.lng,coords.lat])[0]
    	})
    	.attr("cy", function(d,i) {
            var coords = centroids[d["FIPS"]]
      	    return projection([coords.lng,coords.lat])[1]
    	})
    	.attr("opacity", 1)
        .attr("fill",function(d,i){
            if(currentCat=="EP_PCI"){
                return colors[3]
            }
                return colors2[5]
        })
        .attr("stroke","#fff")
        .on("click",function(d){
            d3.selectAll(".text2").attr("opacity",.5)
            d3.selectAll(".text1").attr("opacity",.5)
            d3.selectAll("circle").attr("opacity",.5)
            var gid = d["FIPS"]
            d3.select(this).style("font-size","24px").attr("opacity",1)
            d3.select("#c2_"+gid).style("r",20).attr("opacity",1)
            addGrid([d],currentCat)
        })
        
    svg.selectAll("text")
    	.data(list)
        .enter()
    	.append("text")
        .text(function(d,i){
            if(i==0){
                return i+1
            }
                return i+1
        })
        .attr("id",function(d){
            return "t1_"+d["FIPS"]
        })
    	.attr("x", function(d) {
            var coords = centroids[d["FIPS"]]
         //   console.log(coords)
           // console.log(projection([coords.lng,coords.lat]))
      	    return projection([coords.lng,coords.lat])[0]
    	})
    	.attr("y", function(d) {
            var coords = centroids[d["FIPS"]]
      	    return projection([coords.lng,coords.lat])[1]+4
    	})
        .attr("fill","#fff")
        .style("text-anchor","middle")
        .style("font-family","helvetica")
        .style("font-size","12px")
        .on("click",function(d){
            d3.selectAll(".text2").attr("opacity",.5)
            d3.selectAll(".text1").attr("opacity",.5)
            d3.selectAll("circle").attr("opacity",.5)
            var gid = d["FIPS"]
            d3.select(this).style("font-size","24px").attr("opacity",1)
            d3.select("#c2_"+gid).style("r",20).attr("opacity",1)
            addGrid([d],currentCat)
        })
        
        if(currentCat=="EP_PCI"){
            d3.select("#mapName").html("<span style=\"color:"
            +colors[3]+"\">HIGHEST</span><br>+ <br><span style=\"color:"
            +colors2[5]+"\">LOWEST</span><br>"
            +measuresLabels[currentCat.split("_")[1]].toUpperCase())
        }else{
            d3.select("#mapName").html("<span style=\"color:"
            +colors2[5]+"\">HIGHEST</span><br>+ <br><span style=\"color:"
            +colors[3]+"\">LOWEST</span><br>"
            +measuresLabels[currentCat.split("_")[1]].toUpperCase())
        }
       
        
        
    svg.selectAll(".text2")
    	.data(list2)
        .enter()
    	.append("text")
        .attr("class","text2")
        .text(function(d,i){
            if(i==0){
                return i+1
            }
                return i+1
        })
        .attr("id",function(d){
            return "t2_"+d["FIPS"]
        })
    	.attr("x", function(d) {
            var coords = centroids[d["FIPS"]]
         //   console.log(coords)
           // console.log(projection([coords.lng,coords.lat]))
      	    return projection([coords.lng,coords.lat])[0]
    	})
    	.attr("y", function(d) {
            var coords = centroids[d["FIPS"]]
      	    return projection([coords.lng,coords.lat])[1]+4
    	})
        .attr("fill","#fff")
        .style("text-anchor","middle")
        .style("font-family","helvetica")
        .style("font-size","12px")
        .on("click",function(d){
            d3.selectAll(".text2").attr("opacity",.5)
            d3.selectAll(".text1").attr("opacity",.5)
            d3.selectAll("circle").attr("opacity",.5)
            var gid = d["FIPS"]
            d3.select(this).style("font-size","24px").attr("opacity",1)
            d3.select("#c2_"+gid).style("r",20).attr("opacity",1)
            addGrid([d],currentCat)
            
        })
        
}

function filterNoPop(data,nDict){
    var withPop = []
    
    for(var i in data){
        if(data[i]["E_HH"]>100){
            var fips = data[i]["FIPS"]
            var neighborhood = nDict[fips]
            var newEntry = data[i]
            newEntry["neighborhood"]=neighborhood
            withPop.push(newEntry)
        }
    }
    //console.log("filtered length = "+withPop.length)
    return withPop
}

function neighborhoodDict(data){
    var dict = {}
    for(var i in data){
        var fips = "36"+data[i]["2010 Census Bureau FIPS County Code"]+data[i]["2010 Census Tract"]
        dict[fips]=data[i]["Code"]
    }   
    return dict
}

function addGrid(list,column){
   // console.log(list)
   // console.log(list)
    var i = 0
       // console.log(list[i]["FIPS"])
      //  d3.select("#grid").append("div").html("<img src=\"tracts/"+list[i]["FIPS"]+".png\" width=\"200\" >")
        var square = d3.select("#grid").append("div").attr("class","square")
        square.append("div").html("<img src=\"tracts/"+list[i]["FIPS"]+".png\" >")
        
        var county = list[i]["LOCATION"].split(",")[1]
        var state= list[i]["LOCATION"].split(",")[2]
        var tract= list[i]["LOCATION"].split(",")[0]
        
        var columnRoot = column.split("_")[1]
        if(columnRoot =="PCI"){
            square.append("div")
                .attr("class","labels")
                .html(
                     "<span class=\"highlight\">"+tract+"<br>"+list[i]["neighborhood"]
                     +", "+county
                     +"</span><br>Total Population: "+numberWithCommas(list[i]["E_TOTPOP"])
                     +"<br>Total Households: "+numberWithCommas(list[i]["E_HH"])
                     +"<br>Total Housing Units: "+numberWithCommas(list[i]["E_HU"])
                    +"<br><span class=\"highlight\">"+measuresLabels[column.split("_")[1]]+":"
                    +"$"+numberWithCommas(list[i]["E_"+columnRoot])
                     +"</span>"
                )
        }else{
            square.append("div")
                .attr("class","labels")
                .html(
                     // "<span class=\"cat\">Highest % of "+measuresLabels[column.split("_")[1]]
                     "<span class=\"highlight\">"+tract+"<br>"+list[i]["neighborhood"]
                     +", "+county
                     +"</span><br>Total Population: "+numberWithCommas(list[i]["E_TOTPOP"])
                     +"<br>Total Households: "+numberWithCommas(list[i]["E_HH"])
                     +"<br>Total Housing Units: "+numberWithCommas(list[i]["E_HU"])
                     +"<br>"+measuresLabels[column.split("_")[1]]+": "+list[i]["E_"+columnRoot]
                     +"<br><span class=\"highlight\">% of "+measuresLabels[column.split("_")[1]]+": "+list[i][column]+"%"
                     +"</span>"
                )
        }
 
 
 
 gridSize(210)
}

function display(data,column){
    d3.select("#menu").html("Highest "+measuresLabels[currentCat.split("_")[1]])
    var filtered = []
    
    
    for(var a in data){
        
        if(parseFloat(data[a][column])>0){
            filtered.push(data[a])
        }
    }
    var sorted = null
    var reverse = null
    if(sortOrder == "UP"){
        sorted = filtered.sort(function(a,b){
                return a[column]-b[column]
        })
        
        var topTen = sorted.slice(0,listLen)
        reverse = filtered.sort(function(a,b){
                return b[column]-a[column]
        })
        var bottomTen = reverse.slice(0,listLen)
      //  addGrid(topTen,column)
    }else{
        sorted = filtered.sort(function(a,b){
                return b[column]-a[column]
        })
        var topTen = sorted.slice(0,listLen)
        reverse = filtered.sort(function(a,b){
                return a[column]-b[column]
        })
        var bottomTen = reverse.slice(0,listLen)
        
       // addGrid(topTen,column)
    }
   
    drawMap(pub.geo,pub.centroids,pub.water,topTen,bottomTen)
   
    
}

