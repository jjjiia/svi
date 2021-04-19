function drawMap(neighbors,neighborNeighbors){

    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"//new account
    var maxBounds = [
    [-165,6], // Southwest coordinates
    [-15, 70] // Northeast coordinates
    ];

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jjjiia123/ckmf2g8ee68el17rxtndiums1',
        //center:[-73.865,40.75040908250621],
         center:[-73.935,40.8071498877022],
        zoom:13.8
    });
    
    map.on("load",function(){
        //console.log(map.getStyle().layers)
        d3.selectAll(".mapboxgl-ctrl-logo").remove()
        d3.selectAll(".mapboxgl-ctrl-attrib").remove()
        
        console.log(homeId)
        console.log(neighbors)
        console.log(neighborNeighbors)
        map.setFilter("hover",["==","FIPS",""])
        
        map.setFilter("tracts",["!=","FIPS",homeId])
      //  map.setFilter("neighbors",["!=","FIPS",homeId])
      //  map.setFilter("neighborneighbors",["!=","FIPS",homeId])
        
         map.setFilter("neighbors",["!in","FIPS"].concat(neighbors))
      //   map.setFilter("neighbors",["!in","FIPS"].concat(neighbors))
  //
         var nOfN = neighborNeighbors.concat(neighbors)
         map.setFilter("neighborneighbors",["!in","FIPS"].concat(nOfN))
        
       
    })
       //
     map.on("mousemove","tracts",function(c){
        var feature = c.features[0]
        console.log(feature.properties)
        map.setFilter("hover",["==","FIPS",feature.properties.FIPS])
     })
}


//var homeId = "36081028700"
var homeId = "36061020300"
var neighborsData = d3.json("neighbors.json")
var sviData = d3.json("tracts_svi.geojson")
Promise.all([sviData,neighborsData]).then(function(data){ ready(data[0],data[1])})

var measuresLabels = {
AGE17:"% 17 and younger",
AGE65:"% 65 and older",
DISABL:"% with a disability",
LIMENG:"% limited English",
CROWD:"% of crowded households",
GROUPQ:"% living in group quarters",
MINRTY:"% of Minorities",
MOBILE:"% of Mobile homes",
MUNIT:"% of Housing in large buildings",
NOHSDP:"% with no high school diploma",
NOVEH:"% of Households with no car",
PCI:"Per capita income",
POV:"% below poverty",
SNGPNT:"% Single parent households",
UNEMP:"% unemployed",
TOTPOP:"Total Population",
UNINSUR:"% Uninsured",
HH:"Households",
HU:"Housing Units"
}
var denom = {
AGE17:"TOTPOP",
AGE65:"TOTPOP",
CROWD:"HH",
GROUPQ:"TOTPOP",
MINRTY:"TOTPOP",
MOBILE:"HU",
MUNIT:"HU",
NOVEH:"HH",
PCI:"Per capita income",
POV:"TOTPOP",
SNGPNT:"HH",
TOTPOP:"TOTPOP",
UNINSUR:"TOTPOP",
HH:"HH",
HU:"HU",
UNEMP:"D_UNEMP",
NOHSDP:"D_NOHSDP",
LIMENG:"D_LIMENG",
DISABL:"D_DISABL"
}
var totalColumns = ["HH","HU","TOTPOP"]

var denomException = ["UNEMP","NOHSDP","LIMENG","DISABL"]
function ready(sviData,neighbors){ 
    // var topTenCats = ['EP_POV', 'EP_UNEMP', 'EP_PCI', 'EP_NOHSDP', 'EP_AGE65', 'EP_AGE17', 'EP_DISABL',
    // 'EP_SNGPNT', 'EP_MINRTY', 'EP_LIMENG', 'EP_MUNIT', 'EP_MOBILE', 'EP_CROWD', 'EP_NOVEH', 'EP_GROUPQ', 'EP_UNINSUR']
    //addGrid()
    var dict = fipsDict(sviData)
    var neighbors = (dict[homeId].properties["NEIGHBORS"]+","+homeId).split(",")    
    var neighborNeighbors = nOfN(neighbors,dict).concat(neighbors)
    
    // var sumN = addData(neighbors,dict)
    // var sumNN = addData(neighborNeighbors,dict)
    // display(sumN,"#neighbors")
    // display(sumNN,"#neighborNeighbors")
    drawMap(neighbors,neighborNeighbors)
    drawChart(dict,neighborNeighbors)
    console.log(neighborNeighbors.length)
    console.log(neighborNeighbors)
   // addData(neighborNeighbors,dict)
}
function drawChart(dict,gids){
    var keys = Object.keys(measuresLabels)
    var barDict = {}
    for(var i in keys){
        var key = keys[i]
        if(totalColumns.indexOf(key)==-1){
            barDict[key]=[]
            for(var g in gids){
                var gid = gids[g]
                var value = dict[gid].properties["E_"+key]
                var percent = dict[gid].properties["EP_"+key]
                barDict[key].push({id:gid,value:value,percent:percent})
            
            }
        }
    }
  //  console.log(barDict)
   var keys =  Object.keys(barDict)
    for(var k in keys){
        var key = keys[k]
        
        var sortedId = barDict[key].sort(function(a,b){
            return b.percent-a.percent
        })
        if(key=="PCI"){
        
            var sortedId = barDict[key].sort(function(a,b){
                return a.percent-b.percent
            }) 
        }
        
        var w = 100
        var p = 25
        var b = 10
        var h = (b+2)*gids.length
        var svg = d3.select("#overview")
                .append("svg")
                .attr("width",w+p*5.7)
                .attr("height",h+p*2)
        
        var max = d3.max(barDict[key], function(d){console.log(d); return  d.percent})
        var yScale = d3.scaleLinear().domain([0,max]).range([2,w])
        
        svg.append("text").text(measuresLabels[key]).attr("x",2).attr("y",18).style("font-size","16px").attr("fill","#fff")
        svg.selectAll("."+key)
            .data(sortedId)
            .enter()
            .append("rect")
            .attr("class",key)
            .attr("id",function(d){return "_"+d.id})
            .attr("height",b)
            .attr("width",function(d){
                return yScale(d.percent)
            })
            .attr("y",function(d,i){return i*(b+2)+p})
            .attr("x",function(d){
                return p*3//h+p*2-yScale(d.percent)
            })
            .attr("fill",function(d){
                if(d.id == homeId){
                    return"#fff"
                }else{
                    return "#888"
                }
            })
            .on("mouseover",function(d){
                var gid = d.id
                d3.select(this).attr("fill","gold")
                d3.selectAll("#_"+gid).attr("fill","gold")
                map.setFilter("hover",["==","FIPS",gid])
            })
            .on("mouseout",function(d){
                var gid = d.id
              
                if(gid==homeId){
                    d3.select(this).attr("fill","#fff")
                    d3.selectAll("#"+d3.select(this).attr("id")).attr("fill","#fff")
                }else{
                    d3.select(this).attr("fill","#888")
                    d3.selectAll("#"+d3.select(this).attr("id")).attr("fill","#888")
                }
                map.setFilter("hover",["==","FIPS",""])
            })
            
        svg.selectAll(".gid_"+key)
            .data(sortedId)
            .enter()
            .append("text")
            .attr("class","gid_"+key)
            .attr("id",function(d){return d.id})
            .attr("x",function(d,i){
                return 10
            })
            .attr("y",function(d,i){return i*(b+2)+p+10})
            .attr("fill",function(d){
                if(d.id == homeId){
                    return"#fff"
                }else{
                    return "#888"
                }
            })
            .text(function(d){
                return "tract "+d.id.replace("360810","")
            })
            .style("font-size","10px")
            .style("font-weight",100)
           
        
        svg.selectAll(".label_"+key)
            .data(sortedId)
            .enter()
            .append("text")
            .attr("class","label_"+key)
            .attr("id",function(d){return d.id})
            .attr("x",function(d,i){
                return yScale(d.percent)+2+p*3
            })
            .attr("y",function(d,i){return i*(b+2)+p+10})
            .attr("fill",function(d){
                if(d.id == homeId){
                    return"#fff"
                }else{
                    return "#888"
                }
            })
            .text(function(d){
                if(key=="PCI"){
                    return "$"+d.percent
                }
                return d.percent+"%"
            })
            .style("font-size","10px")
            .on("mouseover",function(d){
                console.log(d)
            })
    }
    
}

function display(data,divName){
    var keys = Object.keys(measuresLabels)
    var text = divName+"<br>"
    for(var i in keys){
        var key = keys[i]
        text+=measuresLabels[key]+": "
        var value = data[key].value
        var percent = data[key].percent+"%"
        //text+=value
        text+=percent+"<br>"
        
    }
    d3.select("#overview").append("div").attr("id",divName).html(text)
}

function addData(gids,dict){
    var keys = Object.keys(measuresLabels)
    var sumDict = {}
    for(var k in keys){
        var key = keys[k]
        sumDict[key]=0
        if(denomException.indexOf(key)!=-1){
            sumDict["D_"+key]=0
        }
    }
    
    for(var g in gids){
        var gid = gids[g]
      //  console.log(gid)
        var entry = dict[gid].properties
       // console.log(entry)
       // console.log(entry)
        for(var j in keys){
            var key = keys[j]
            var value = parseInt(entry["E_"+key])
            if(denomException.indexOf(key)!=-1){
                var percent = parseFloat(entry["EP_"+key])
                
              if(percent==0){
                var total = 0
              }else{
                var total = value/percent*100
              }
              sumDict["D_"+key]+=total
            }
            sumDict[key]+=value
        }
    }
   // console.log(sumDict)
    var output = {}
    for(var l in keys){
        var key = keys[l]
        output[key]={}
        var denomColumn = denom[key]
        var value = sumDict[key]
        var denomValue = sumDict[denomColumn]
        //console.log([key,denomValue])
        var percent = parseInt(value/denomValue*10000)/100
        output[key]["value"]=value
        output[key]["percent"]=percent
    }
    console.log(output)
    return output
}

function nOfN(neighbors,dict){
    var nOfNs =[]
    for(var n in neighbors){
        var nid = neighbors[n]//.split(",")[n]
        var newNeighbors = dict[nid].properties["NEIGHBORS"]
        //console.log(newNeighbors)
        for(var i in newNeighbors.split(",")){
            nnid = newNeighbors.split(",")[i]//36081048100
            if(nOfNs.indexOf(nnid)==-1 && neighbors.indexOf(nnid)==-1 && nnid!=homeId){
                nOfNs.push(nnid)
            }
        }
      
    }
      //  console.log(nOfNs)
        return nOfNs
}

function fipsDict(data){
    var formatted = {}
    for(var i in data.features){
        var fips = data.features[i]["properties"]["FIPS"]
        formatted[fips]=data.features[i]
    }
    return formatted
}