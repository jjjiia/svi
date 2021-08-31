
//$(function() {
//    queue()
//        .defer(d3.csv,"durations_moreThanDay.csv")
//        .defer(d3.csv,"allCentroids.csv")
//	.await(dataDidLoad);
//})
//var centroidsFile = d3.csv("allCentroids.csv")
var finishedGidsFile = d3.json("finished_gids 10.16.34 AM.json")
var boundaries = d3.json("CT_new.geojson")
Promise.all([finishedGidsFile,boundaries]	)
.then(function(data){
	//console.log(data[0])
	dataDidLoad(data[0],data[1])
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

var fileZoom = {}
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

//global variables of map and Gid to get current map and gid on command
var currentMapZoom
var currentGid

// ADDED BY ADELINE: made map a global variable
//var map = null
//var gid = null


var idsTodo= [ "36085011202" ]

// "36047035200", "36061006000", "36061022302", "36081148300", "36085014605", "36085017700", "36085022600", "36085029103"
// ,"36085009700","36085011201","36085011202",
// "36085012804","36085012805","36085012806","36085015400","36085015601","36085015602",
// "36085015603","36085017600","36085019800","36085020700","36085020801","36085022300",
// "36085022600","36085022800","36085024401","36085024402","36085024800","36085027900",
// "36085029102","36085031902"]

//no boudnaries "36085990100","36085008900"

function dataDidLoad(finished,tractBoundaries){
    //console.log(finished)
    finishedGids = finished.gids
	// centroidsData = makeDictionary(centroidsFile)
	//    console.log(centroidsData)
	// console.log("finished: "+finished.gids.length)

    boundariesData = makeBoundaryDictionary(tractBoundaries)
	idsTodo=Object.keys(boundariesData)
	// console.log(boundariesData["36085011202"])

	//placesData = getIdsFromDuration(places).sort()
	//gids = getAllGid(centroidsFile)
	//gids = nycGeoids.sort()

    gids = idsTodo.sort()

    // var notFinished = []
    // for(var g in gids){
    //     if(finished.gids.indexOf(gids[g])==-1){
    //         notFinished.push(gids[g])
    //         // console.log([gids[g],boundariesData[gids[g]]])
    //     }
    // }    //
    // console.log(notFinished.join(","))
    // console.log("not finished "+notFinished.length)

    totalIds = gids.length    //
    // console.log("total: "+totalIds)
     console.log(totalIds)

    mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
    //mapboxgl.accessToken ="pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    var currentId =gids[geoidIndex]
    //var currentId ="1400000US01003010500"
		//    var center = [centroidsData[currentId]["lng"],centroidsData[currentId]["lat"]]
    //   console.log(centroidsData["1400000US01003010500"])
    //   console.log(center)

    map = new mapboxgl.Map({
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
		
		d3.select("#startButton")
		.on("click",function(){
			moveMap(map,currentId)
			gid = currentId
			//console.log(map.getStyle().layers)
			// map.on("mousemove","tracts",function(c){
	// 		console.log(c.features[0].properties.FIPS)
	// 		})
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


function bearingBetween(coordinate1, coordinate2) {
  var point1 = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [coordinate1[0], coordinate1[1]]
    }
  };
  var point2 = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [coordinate2[0], coordinate2[1]]
    }
  };
  return turf.bearing(point1, point2);
}

function getDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}


function makeBoundaryDictionary(data){
    var formatted = {}
    for(var i in data.features){
        var geoid =String(data.features[i].properties["GEOID"])
        formatted[geoid]=data.features[i].geometry
    }
		console.log(formatted);
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
    // console.log(geometry)
	var boundary = geometry
	zoomToBounds(map,boundary)
}
//https://jsfiddle.net/Mourner/zbdu3fkg/?utm_source=website&utm_medium=embed&utm_campaign=zbdu3fkg
function flatDeep(arr, d = 2) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 2) : val), [])
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

// 	 	//var bearing = getOrientation(map,center)
// 		//	loadBoundaries(map,gid)
// 	//console.log([gid, bearing])
			//	console.log(gid)
				//console.log(boundariesData[gid])
			console.log(boundariesData)
			console.log(gid)
	
				var currentGeometry = boundariesData[gid].coordinates

				//console.log(currentGeometry)
				//console.log(new mapboxgl.LngLatBounds(currentGeometry))
	
	
                var userCoords =  flatDeep(currentGeometry,Infinity)
				
				
				//console.log(userCoords)
				var repair = []
				for(var i in userCoords){
					if(i%2==0){
						repair.push([userCoords[i], userCoords[(parseInt(i)+1)]])
					}
				}
				
				//console.log(repair)
				var maxDistance = 0
				var distanceCoords
				for(var p in repair){
					var c1 = repair[p]
					for(var p2 in repair){
						var c2 = repair[p2]
						var distance = getDistance(c1[1], c1[0], c2[1], c2[0], "K")
						//console.log(distance)
						if(distance>maxDistance){
							maxDistance = distance
							distanceCoords=[c1,c2]
						}
					}
				}
			//	console.log(maxDistance,distanceCoords)
				
				
				var bearing = bearingBetween(distanceCoords[0],distanceCoords[1])
				
				//console.log(bearing)
                var userBounds = getMaxMin(userCoords)
				//console.log(userBounds)
				
               // var bounds = new mapboxgl.LngLatBounds(userBounds)
				// var bounds = new mapboxgl.LngLatBounds(formattedCoords)
	// 			console.log(bounds)
	// 			console.log(formattedCoords)
	//                 pub.userBounds = bounds
	//                 map.fitBounds(bounds,{padding:200})
                map.fitBounds(userBounds,{padding:10, bearing:bearing-90})
				 const marker1 = new mapboxgl.Marker()
 				.setLngLat(distanceCoords[0])
 				.addTo(map);

 				const marker2 = new mapboxgl.Marker()
 				.setLngLat(distanceCoords[1])
 				.addTo(map);

                map.once('moveend',function(){
				    var filter = ['!=', 'GEOID',String(gid)];
					map.setFilter("tracts",filter)

					//sets to invisible for taking image, comment out for testing
					map.setLayoutProperty("tract_boundaries",'visibility',"none")
					map.setLayoutProperty("tract-centroids-1avl3g",'visibility',"none")

					// https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
					map.on("idle", function () {

                    setTimeout(function(){
						
						if(geoidIndex>totalIds-1){
							console.log("all done!")
							d3.select("#menu").html("all done")
							return
						}else{
							currentMapZoom = map.getZoom();
							currentGid = gid;
	                        makePrint(map,String(gid))
							geoidIndex+=1
						}
					}, 3000);
                });
})
}

function makePrint(map, gid){
	//console.log("making print of "+gid+" at "+map.getZoom())
		console.log(gid, map.getZoom())
		fileZoom[gid]=map.getZoom()
		download(fileZoom, 'gid_zoom.txt', 'text/plain');
		
        var canvas = document.getElementsByClassName("mapboxgl-canvas")[0]

	    canvas.toBlob(function(blob) {
	               saveAs(blob, gid+".png");
	           }, "image/png");
			  var nextGid = gids[geoidIndex]
					//
					// map.setLayoutProperty("tract_boundaries",'visibility',"visible")
					// map.setLayoutProperty("tract-centroids-1avl3g",'visibility',"visible")
			   moveMap(map,nextGid)
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//additional save button
function saveImage(){
	 var canvas = document.getElementsByClassName("mapboxgl-canvas")[0]
	// console.log("printing");
	canvas.toBlob(function(blob) {
						 saveAs(blob, currentGid + "_" + String(currentMapZoom) +".png"); //zoom scale is only the same as previous number
				 }, "image/png");
}
