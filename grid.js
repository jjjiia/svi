var measuresLabels = {
AGE17:"Persons aged 17 and younger",
AGE65:"Persons aged 65 and older",
DISABL:"Civilian noninstitutionalized population with a disability",
LIMENG:"Persons(age 5+) who speak English \"less than well\"",
CROWD:"At household level(occupied housing unite) more people than rooms",
GROUPQ:"Persons in group quarters",
MINRTY:"Minority(all persons expcept white, non-Hispanic)",
MOBILE:"Mobile homes",
MUNIT:"Housing in structures with 10 or more units",
NOHSDP:"Persons(age 25+) with no high school diploma",
NOVEH:"Households with no vehicle available",
PCI:"Per capita income",
POV:"Persons below poverty",
SNGPNT:"Single parent household with children under 18",
UNEMP:"Civilian(age 16+) unemployed",
TOTPOP:"Total Population",
    UNINSUR:"Uninsured"
}

var listLen = 2000

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var sviData  = d3.csv("nyc_tracts_svi.csv")
var neighborhoodsData= d3.csv("neighborhoods.csv")

Promise.all([sviData,neighborhoodsData]).then(function(data){ ready(data[0],data[1])})
//36005000100
//36061000700
function ready(sviData,neighborhoods){ 
    // var topTenCats = ['EP_POV', 'EP_UNEMP', 'EP_PCI', 'EP_NOHSDP', 'EP_AGE65', 'EP_AGE17', 'EP_DISABL',
    // 'EP_SNGPNT', 'EP_MINRTY', 'EP_LIMENG', 'EP_MUNIT', 'EP_MOBILE', 'EP_CROWD', 'EP_NOVEH', 'EP_GROUPQ', 'EP_UNINSUR']
    //addGrid()
    
    var topTenCats = ['E_PCI']
    //addGrid()
    
    listLen = sviData.length
   
    var nDict = neighborhoodDict(neighborhoods)
    var withPop = filterNoPop(sviData,nDict)
    for(var t in topTenCats){
        console.log(topTenCats[t])
        display(withPop,topTenCats[t])
    }
    // display(withPop,'EP_UNEMP')
}
function filterNoPop(data,nDict){
    var withPop = []
    
    for(var i in data){
        if(data[i]["E_HH"]>10){
            var fips = data[i]["FIPS"]
            var neighborhood = nDict[fips]
            var newEntry = data[i]
            newEntry["neighborhood"]=neighborhood
            withPop.push(newEntry)
        }
    }
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
    
    for(var i=0;i< listLen;i++){
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
                     // "<span class=\"cat\">Lowest "+measuresLabels[column.split("_")[1]]
                      "</span><br>"+tract+"<br>"+list[i]["neighborhood"]
                      +", "+county
 //                     +"<br>Population: "+numberWithCommas(list[i]["E_TOTPOP"])
 //                     +"<br>Households: "+numberWithCommas(list[i]["E_HH"])
 //                    // +"<br>Housing Units: "+numberWithCommas(list[i]["E_HU"])
 //                     +"<br><span class=\"highlight\">"+measuresLabels[column.split("_")[1]]
 //                    +": "
                    +"<span class=\"highlight\">$"+numberWithCommas(list[i]["E_"+columnRoot])
                     +"</span>"
                )
        }else{
            square.append("div")
                .attr("class","labels")
                .html(
                     "<span class=\"cat\">Highest % of "+measuresLabels[column.split("_")[1]]
                     +"</span><br>"+tract+"<br>"+list[i]["neighborhood"]
                     +", "+county
                     +"<br>Total Population: "+numberWithCommas(list[i]["E_TOTPOP"])
                     +"<br>Total Households: "+numberWithCommas(list[i]["E_HH"])
                     +"<br>Total Housing Units: "+numberWithCommas(list[i]["E_HU"])
                     +"<br>"+measuresLabels[column.split("_")[1]]+": "+list[i]["E_"+columnRoot]
                     +"<br><span class=\"highlight\">% of "+measuresLabels[column.split("_")[1]]+": "+list[i][column]+"%"
                     +"</span>"
                )
        }
 }
}

function display(data,column){
    d3.select("#menu").html("Highest "+measuresLabels[column.split("_")[1]])
    var filtered = []
    for(var a in data){
        
        if(parseFloat(data[a][column])>0){
            filtered.push(data[a])
        }
    }
    if(column=="E_PCI"){
        var sorted = filtered.sort(function(a,b){
                return b[column]-a[column]
        })
    }else{
        var sorted = filtered.sort(function(a,b){
                return a[column]-b[column]
        })
    }
   
   console.log(sorted)
    //28272 36005046201
    var topTen = sorted.slice(sorted.length-listLen,sorted.length)
    var bottomTen = sorted.slice(0,listLen-1)
    addGrid(topTen,column)
}

