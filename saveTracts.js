
//$(function() {
//    queue()
//        .defer(d3.csv,"durations_moreThanDay.csv")
//        .defer(d3.csv,"allCentroids.csv")
//	.await(dataDidLoad);
//})
var centroidsFile = d3.csv("allCentroids.csv")
var finishedGidsFile = d3.json("finished_gids.json")
var boundaries = d3.json("tracts_svi.geojson")
Promise.all([centroidsFile,finishedGidsFile,boundaries])
.then(function(data){
	//console.log(data[0])
	dataDidLoad(data[0],data[1],data[2])
})

// var centroids = [
// {id:28021, coords:[-90.91177381781301, 31.97366510901588]},
// {id:45005, coords:[-81.3583003787228, 32.98815286938094]},
// {id:37079, coords:[-77.67576163428339, 35.484998575385795]},
// {id:37165, coords:[-79.48039301611871, 34.84093951841315]},
// {id:36005, coords:[-73.86598404125822, 40.85002133502021]},
// {id:37107, coords:[-77.6412453979436, 35.23877058606307]},
// {id:48247, coords:[-98.69733191025438, 27.043419696004978]},
// {id:12051, coords:[-81.1658399039858, 26.553471963158746]},
// {id:46102, coords:[-102.55166409012502, 43.335597878399206]}
// ]
var pub = {
    zoom:9
}
var zoom = 15
var finishedIds = 0
var finished = []
var centroidsData = null
var geoidIndex = 0
var placesData = null
var totalIds = null
var gids = null
var finishedGids = []
var finishedIdsFile = "finished_gids.json"
var boundariesData = null

var idsTodo=["36085032300","36085032300"]
// ,"36085009700","36085011201","36085011202",
// "36085012804","36085012805","36085012806","36085015400","36085015601","36085015602",
// "36085015603","36085017600","36085019800","36085020700","36085020801","36085022300",
// "36085022600","36085022800","36085024401","36085024402","36085024800","36085027900",
// "36085029102","36085031902"]

//no boudnaries "36085990100","36085008900"

function dataDidLoad(centroidsFile,finished,tractBoundaries){
    //console.log(finished)
    finishedGids = finished.gids
    centroidsData = makeDictionary(centroidsFile)
//    console.log(centroidsData)
    
    console.log("finished: "+finished.gids.length)
    
    
    boundariesData = makeBoundaryDictionary(tractBoundaries)
    //console.log(boundariesData)
    
    //placesData = getIdsFromDuration(places).sort()
    //gids = getAllGid(centroidsFile)
  //  gids = nycGeoids.sort()
    
    gids = idsTodo.sort()
    
    var notFinished = []
    for(var g in gids){
        if(finished.gids.indexOf(gids[g])==-1){
            notFinished.push(gids[g])
            
            console.log([gids[g],boundariesData[gids[g]]])
        }
    }
    console.log(notFinished.join(","))
    console.log("not finished "+notFinished.length)
    
    totalIds = gids.length
    console.log("total: "+totalIds)
    
    
    
    // console.log(totalIds)
    mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
    //mapboxgl.accessToken ="pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    var currentId =gids[geoidIndex]
    //var currentId ="1400000US01003010500"
//    var center = [centroidsData[currentId]["lng"],centroidsData[currentId]["lat"]]

    //   console.log(centroidsData["1400000US01003010500"])
    //   console.log(center)

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jjjiia123/ckm127tll10f617o1ybzjipxh',
        //center:center,
        zoom: pub.zoom,
        preserveDrawingBuffer: true    
    });

   // var gidsList = finished.map(a => a.Gids);
//console.log(gidsList)
  
	map.on("load",function(){
	//	console.log(center,currentId)
	    moveMap(map,currentId)
        console.log(map.getStyle().layers)
        map.on("mousemove","tracts",function(c){
            console.log(c.features)
        })
        
	})
}  

var saveData = (function(data,fileName){
 
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function makeBoundaryDictionary(data){
    var formatted = {}
    for(var i in data.features){
        var geoid = data.features[i].properties["FIPS"]
        formatted[geoid]=data.features[i].geometry
    }
    return formatted
}

function makeDictionary(data){
    var formatted = {}
    for(var i in data){
        var gid = data[i]["Gid"]
        if(gid!=undefined){
            var gidFormatted = gid.split("US")[1]
            formatted[gidFormatted]=data[i]
        }
    }
    return formatted
}

function zoomToBounds(map,boundary){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
   // console.log(intervals[intervals.length-1])
    var coordinates = boundary.coordinates[0]
    var bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    map.fitBounds(bounds,{padding:20})
  //  map.fitBounds(bounds,{padding:20})
	//zoomToBounds(map,boundary)
     
}

function loadBoundaries(map,gid){
    var geometry = boundariesData[gid]
    console.log(geometry)
	var boundary = geometry
	zoomToBounds(map,boundary)
}
//https://jsfiddle.net/Mourner/zbdu3fkg/?utm_source=website&utm_medium=embed&utm_campaign=zbdu3fkg
function flatDeep(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};
function getMaxMin(coords){
    var maxLat = -999
    var minLat = 0
    var maxLng = 0
    var minLng = 999
    for(var i in coords){
        var coord = coords[i]
        if(coord<0){
            if(coord<minLat){
                minLat = coord
            }else if(coord>maxLat){
                maxLat = coord
            }
        }else{
            if(coord>maxLng){
                maxLng = coord
            }else if(coord<minLng){
                minLng = coord
            }
        }
    }
    var bounds = [
    [minLat,minLng], // Southwest coordinates
    [maxLat, maxLng] // Northeast coordinates
    ];
    return bounds
    
   // console.log([minLat,maxLat,minLng,maxLng])
}
function moveMap(map,gid){
    if(finishedGids.indexOf(gid)==-1){
    	finishedGids.push(gid)
        saveData({gids:finishedGids}, finishedIdsFile);
		
	 	//var bearing = getOrientation(map,center)
		//	loadBoundaries(map,gid)
	//console.log([gid, bearing])
            console.log(gid)
                console.log(boundariesData[gid])
                var currentGeometry = boundariesData[gid].coordinates
                var userCoords =  flatDeep(currentGeometry,Infinity)
                var userBounds = getMaxMin(userCoords)

                var bounds = new mapboxgl.LngLatBounds(userBounds)
                pub.userBounds = bounds
                map.fitBounds(bounds,{padding:20})
        
		
                map.once('moveend',function(){
					//console.log(gid)
				    var filter = ['!=', 'FIPS',gid];
					map.setFilter("tracts",filter)
					
                    setTimeout(function(){
						geoidIndex+=1
						if(geoidIndex>totalIds-1){
							return
						}
                        makePrint(map,gid)		
                     }, 2000);
                });  
    }else{
       // console.log(gid+ " was already downloaded")
        geoidIndex+=1
        var nextGid = gids[geoidIndex]
        //console.log("next is "+nextGid+ " at "+geoidIndex)
       // var nextCenter = centroidsData[nextGid]
        moveMap(map,nextGid)
    }
}

function makePrint(map, gid){
        var canvas = document.getElementsByClassName("mapboxgl-canvas")[0]
	
	    canvas.toBlob(function(blob) {
	               saveAs(blob, gid+".png");
	           }, "image/png");
			  var nextGid = gids[geoidIndex]
			  // var nextGid ="1400000US01003010500"
			   
			   //var nextCenter = centroidsData[nextGid]
			   //console.log(nextGid)
			   moveMap(map,nextGid)
}
