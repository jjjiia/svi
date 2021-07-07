
//$(function() {
//    queue()
//        .defer(d3.csv,"durations_moreThanDay.csv")
//        .defer(d3.csv,"allCentroids.csv")
//	.await(dataDidLoad);
//})
//var centroidsFile = d3.csv("allCentroids.csv")
var finishedGidsFile = d3.json("finished_gids 10.16.34 AM.json")
var boundaries = d3.json("CT_2018Polygon.geojson")
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

// ADDED BY ADELINE: made map a global variable
//var map = null
//var gid = null

var quality = ["36047065600",
"36047064000",
"36047091000",
"36047090600",
"36047091200",
"36047090800",
"36047053700",
"36047123700",
"36047051500",
"36047035200",
"36047053300",
"36085014605",
"36047056400",
"36005002400",
"36005007900",
"36005005100",
"36047093600",
"36047083400",
"36047116000",
"36081018401",
"36047075400",
"36047075200",
"36047075800",
"36061006000",
"36061022302",
"36047101200",
"36047050400",
"36085022600",
"36085004700",
"36081148300",
"36061020101",
"36047090200",
"36085002700",
"36085029103",
"36005000200",
"36085013800",
"36047065200",
"36047066000",
"36085017700",
"36047072600"]
var crop = ["36081066300",
"36005004400",
"36005036501",
"36005022000",
"36005036902",
"36005026300",
"36047046400",
"36047002300",
"36005005300",
"36005038700",
"36081022900",
"36005028400",
"36005024501",
"36061010601",
"36061008603",
"36061006900",
"36061016700",
"36061015500",
"36047012200",
"36081040900",
"36081041300",
"36047002000",
"36047055500",
"36081001900",
"36047054900",
"36047042500",
"36047002100",
"36081091800",
"36047034000",
"36047005201",
"36047046800",
"36047047000",
"36047047200",
"36081019900",
"36081000100",
"36081008100",
"36081026500",
"36081077500",
"36081016900",
"36047005202",
"36047055700",
"36047004400",
"36081097202",
"36005021301",
"36005021100",
"36081059200",
"36047083200",
"36081027400",
"36081050600",
"36005002300",
"36047061002",
"36047036001",
"36081059400",
"36081091601",
"36081086900",
"36081084900",
"36081040500",
"36061026700",
"36081071303",
"36081056500",
"36085024800",
"36081092500",
"36081037600",
"36047067000",
"36081065600",
"36085006400",
"36081066400",
"36081048100",
"36085009700",
"36085020801",
"36005031800",
"36081047600",
"36081037900",
"36081037700",
"36081140901",
"36085017009",
"36085013203",
"36085020804",
"36081109700",
"36085020803",
"36061009400",
"36061025100",
"36081156700",
"36081045200",
"36081005800",
"36081066000",
"36081157101",
"36047006500",
"36047037900",
"36081116700",
"36081086500",
"36081040700",
"36081041100",
"36081037500",
"36081150701",
"36005002701",
"36081092200",
"36081060000",
]

var outlier = ["36005027600",
"36085022800",
"36081060701",
"36061010200",
"36005050400",
"36061004400",
"36085004000",
"36061013800",
"36061005700",
"36061008601",
"36061014000",
"36081063000",
"36061006700",
"36005009600",
"36061002500",
"36081061200",
"36061014601",
"36061008200",
"36061002100",
"36047016800",
"36005030100",
"36061009000",
"36047008500",
"36061005800",
"36061014500",
"36061005900",
"36061015001",
"36061001300",
"36061006300",
"36061006800",
"36061005000",
"36061000800",
"36061000600",
"36047016400",
"36061000700",
"36061001502",
"36005001900",
"36061003800",
"36061006500",
"36061013100",
"36061009200",
"36061012500",
"36061010400",
"36061004200",
"36085000600",
"36005043500",
"36081028000",
"36085024401",
"36061010602",
"36061031704",
"36061031703",
"36061001001",
"36061023801",
"36085017010",
"36005027401",
"36085017600",
"36085003300",
"36061016002",
"36081002500",
"36061000201",
"36061002000",
"36061023802",
"36061003100",
"36061006200",
"36005013200",
"36005045600",
"36061005400"
]

var idsTodo= ["36005005300"]
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
    // console.log(boundariesData["36085011202"])

    //placesData = getIdsFromDuration(places).sort()
    //gids = getAllGid(centroidsFile)
  //  gids = nycGeoids.sort()

    gids = idsTodo.sort()

    var notFinished = []
    for(var g in gids){
        if(finished.gids.indexOf(gids[g])==-1){
            notFinished.push(gids[g])

            // console.log([gids[g],boundariesData[gids[g]]])
        }
    }    //
    // console.log(notFinished.join(","))
    // console.log("not finished "+notFinished.length)

    totalIds = gids.length    //
    // console.log("total: "+totalIds)
    // console.log(totalIds)

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
	    moveMap(map,currentId)
			gid = currentId
         console.log(map.getStyle().layers)
        map.on("mousemove","tracts",function(c){
             console.log(c.features[0].properties.FIPS)
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
        var geoid = String(data.features[i].properties["GEOID"])
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
 //    if(finishedGids.indexOf(gid)==-1){
//     	finishedGids.push(gid)
// //        saveData({gids:finishedGids}, finishedIdsFile);
//
// 	 	//var bearing = getOrientation(map,center)
// 		//	loadBoundaries(map,gid)
// 	//console.log([gid, bearing])
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
					// reveal the correct tract

				    var filter = ['!=', 'GEOID',String(gid)];
					map.setFilter("tracts",filter)

					//sets to invisible for taking image, comment out for testing
					map.setLayoutProperty("tract_boundaries",'visibility',"none")
					map.setLayoutProperty("tract-centroids-1avl3g",'visibility',"none")

					// https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
					map.on("idle", function () {
					  // add the toggle buttons.
					  if (map.getLayer('tract_boundaries') && map.getLayer("tract-centroids-1avl3g") && map.getLayer("tracts")&& map.getLayer("water")) {
					      // Enumerate ids of the layers.
					      var toggleableLayerIds = ['tract_boundaries', "tract-centroids-1avl3g","tracts","water"];
					      // Set up the corresponding toggle button for each layer.
					      for (var i = 0; i < toggleableLayerIds.length; i++) {
					        var id = toggleableLayerIds[i];
					        if (!document.getElementById(id)) {
					          // Create a link.
					          var link = document.createElement('a');
					          link.id = id;
					          link.href = '#';
					          link.textContent = id;
					          link.className = 'active';
					          // Show or hide layer when the toggle is clicked.
					          link.onclick = function (e) {
					            var clickedLayer = this.textContent;
					            e.preventDefault();
					            e.stopPropagation();

					            var visibility = map.getLayoutProperty(
					              clickedLayer,
					              'visibility'
					              );
					              // Toggle layer visibility by changing the layout object's visibility property.
					              if (visibility === 'visible') {
					                map.setLayoutProperty(
					                  clickedLayer,
					                    'visibility',
					                    'none'
					                  );
					                  this.className = '';
					                    } else {
					                      this.className = 'active';
					                      map.setLayoutProperty(
					                        clickedLayer,
					                        'visibility',
					                        'visible'
					                      );
					                    }
					                  };

					                  var layers = document.getElementById('menu');
					                  layers.appendChild(link);
					                }
					              }
					            }
					      });

                    setTimeout(function(){

                        makePrint(map,String(gid))

						geoidIndex+=1
						if(geoidIndex>totalIds-1){
							return
						}
                     }, 2000);
                });
    // }else{
   //     // console.log(gid+ " was already downloaded")
   //      geoidIndex+=1
   //      var nextGid = gids[geoidIndex]
   //      //console.log("next is "+nextGid+ " at "+geoidIndex)
   //     // var nextCenter = centroidsData[nextGid]
   //      moveMap(map,nextGid)
   //  }
}

function makePrint(map, gid){

	console.log("making print of "+gid+" at "+map.getZoom())

        var canvas = document.getElementsByClassName("mapboxgl-canvas")[0]

	    canvas.toBlob(function(blob) {
	               saveAs(blob, gid+"_" + String(map.getZoom()) +".png");
	           }, "image/png");
			  var nextGid = gids[geoidIndex]
					//
					// map.setLayoutProperty("tract_boundaries",'visibility',"visible")
					// map.setLayoutProperty("tract-centroids-1avl3g",'visibility',"visible")
			   moveMap(map,nextGid)
}
