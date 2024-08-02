var lwPolylineMap = new Map();
var pointMapInLatLong = new Map();
var pointMapInUTM = new Map();
var pointMap = new Map();
var minmaxcoordinates = {};
var result = {};
var origin_X_Min_UTM = 0;
var origin_X_Max_UTM = 0;
var origin_Y_Min_UTM = 0;
var origin_Y_Max_UTM = 0;
var n = 10;
var fixedRows = 50;
var fixedColumns = 100;
var minCameraHeight = 55;
var maxCameraHeight;
var numberOfBands = 7;
var bands = [];
var currentBandIndex = -1;
var minResolution = 0.25;
var numberOfIntervals = Math.floor(49 / 4);
$(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Compactor/dxfdata",
        dataType: "json",
        success: function (response) {
//            console.log(response);
            let minMaxValues = response.minMaxValues;
            let lineMap = response.line_map;
            lwPolylineMap = response.lwPolyline_map;

            minmaxcoordinates = getminMaxValuesOfDXF(minMaxValues);
//            console.log(minmaxcoordinates);
            setView(minmaxcoordinates);
            createPolylineFromDXFData(lwPolylineMap);
            getGridInBounds(lwPolylineMap, minmaxcoordinates, "byajax");
            seveneBands();
//            generateIntervals(minResolution, numberOfIntervals);
//            createLinesFromDXFData(lineMap);
//            allPoint(minmaxcoordinates);
        },
        error: function (error) {
            console.error(error);
            alert("Error fetching user data");
        }
    });
});


function getminMaxValuesOfDXF(minMaxValues) {
    var minmaxcoordinates = {};
    minMaxValues.forEach(item => {
        const [key, value] = item.split('=');
        minmaxcoordinates[key] = parseFloat(value);
    });

    const minEasting = minmaxcoordinates.minEasting;
    const maxEasting = minmaxcoordinates.maxEasting;
    const minNorthing = minmaxcoordinates.minNorthing;
    const maxNorthing = minmaxcoordinates.maxNorthing;

    origin_X_Min_UTM = minEasting;
    origin_X_Max_UTM = maxEasting;
    origin_Y_Min_UTM = minNorthing;
    origin_Y_Max_UTM = maxNorthing;

    return minmaxcoordinates;
}

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWQwMTQwMC1jNGI1LTRjNTktODhmNC03M2FjZTk2ODgwNWEiLCJpZCI6MjIwODM3LCJpYXQiOjE3MTc3NTM2ODV9.NXbyoMbAMkBlp2Hs8nsqnvHOL0wh7mxkVKc5xxpaHGs';
const viewer = new Cesium.Viewer('cesiumContainer',
        {
            projectionPicker: true,
            mapProjection: new Cesium.WebMercatorProjection(),
            sceneMode: Cesium.SceneMode.SCENE2D
        });
const proj4 = window.proj4;
const WGS84 = 'EPSG:4326';
const UTM43N = '+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs';

function setView(minmaxcoordinates) {
//    const [xMin, yMin] = UTMToLatLon(340720.294745321, 2982771.25387919);
//    const [xMax, yMax] = UTMToLatLon(400170.1032381087, 3008426.968591016);

    const [xMin, yMin] = UTMToLatLon(minmaxcoordinates.minEasting, minmaxcoordinates.minNorthing);
    const [xMax, yMax] = UTMToLatLon(minmaxcoordinates.maxEasting, minmaxcoordinates.maxNorthing);

    viewer.camera.setView(
            {
                destination: Cesium.Rectangle.fromDegrees(xMin, yMin, xMax, yMax),
                orientation: {
                    heading: 0.0,
                    pitch: -45.0,
                    roll: 0.0
                }
            });
}

function getGridInBounds(lwPolylineMap, minmaxcoordinates, forajax) {
//    console.log(lwPolylineMap);
    start_time = performance.now();
    if (forajax == "byajax") {
        maxCameraHeight = viewer.camera.positionCartographic.height;
    }
//    console.log(maxCameraHeight);
    pointMapInLatLong.clear();
    var n = 0.25;
    result = calculateVisibleBounds(viewer);
    if (result) {
        var {utmBounds, width, height} = result;
        var minEasting = minmaxcoordinates.minEasting;
        var minNorthing = minmaxcoordinates.minNorthing;
        var maxEasting = minmaxcoordinates.maxEasting;
        var maxNorthing = minmaxcoordinates.maxNorthing;

        var current_X_Min_UTM = utmBounds.west;
        var current_Y_Min_UTM = utmBounds.south;
        var current_X_Max_UTM = utmBounds.east;
        var current_Y_Max_UTM = utmBounds.north;

        if (current_X_Min_UTM <= minEasting || current_Y_Min_UTM <= minNorthing) {
            current_X_Min_UTM = minEasting;
            current_Y_Min_UTM = minNorthing;
        }
        var dx = origin_X_Min_UTM - current_X_Min_UTM;
        var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
        var i = Math.floor(Math.abs(dx) / n);
        var j = Math.floor(Math.abs(dy) / n);
        var innerBoundkey = i + "_" + j;
        var deltaX = Math.floor(width);
        var deltaY = Math.floor(height);
//        console.log(deltaX);

        if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
            deltaX = maxEasting - current_X_Min_UTM;
            deltaY = maxNorthing - current_Y_Min_UTM;
        }
//        console.log(parseInt(deltaX));
//        console.log(parseInt(deltaY));
        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
        var ii = Math.ceil((deltaX / current_n_res)) + i;
        var jj = Math.ceil((deltaY / current_m_res)) + j;
        var outerBoundkey = ii + "_" + jj;

        var stepX = current_n_res / n;
        var stepY = current_m_res / n;

//        const currentCameraHeight = viewer.camera.positionCartographic.height;
//        console.log(currentCameraHeight);
//        
//        const newBandIndex = getCurrentBandIndex(currentCameraHeight);
//        const newBandIndex = getCurrentBandIndexforresolution(current_n_res, current_m_res);



//        bands.push([currentCameraHeight, current_n_res, current_m_res]);
//
//        console.log(bands);

//        if (newBandIndex !== currentBandIndex || current_n_res >= 594.25) {
//            currentBandIndex = newBandIndex;

        if (current_n_res >= n && current_m_res >= n) {
            console.log("current_n_res: " + current_n_res);
//                console.log(current_m_res);
//            viewer.entities.removeAll();
//            createPolylineFromDXFData(lwPolylineMap);
/////////////////
//            bands.push([currentCameraHeight, current_n_res, current_m_res]);
//            console.log(bands);
/////////////////
//            const newItem = [currentCameraHeight, current_n_res, current_m_res];
/////////////////
            const newItem = [current_n_res];
            pushIfNotExists(bands, newItem);
//                console.log(bands);
//////////////
//            const newBands = [];
//            for (let i = 0; i < bands.length - 1; i++) {
//                const combinedBand = bands[i].concat(bands[i + 1]);
//                newBands.push(combinedBand);
//            }
//            console.log(newBands);
            const currentCameraHeight = viewer.camera.positionCartographic.height;
            console.log("currentCameraHeight : " + currentCameraHeight);
//            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
            if (currentCameraHeight <= 1800) {
//                console.log("currentCameraHeight : " + currentCameraHeight);
                const newBandIndex = getCurrentBandIndex(currentCameraHeight);
                if (newBandIndex !== currentBandIndex) {
                    currentBandIndex = newBandIndex;
                    viewer.entities.removeAll();
                    createPolylineFromDXFData(lwPolylineMap);
                    var result = generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
                    generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey);
                } else {
                    console.log("not generateddddddddddd");
                }
            } else {
                console.log("grid not generated");
            }
        } else {
//            viewer.entities.removeAll();
//            ii = Math.ceil((deltaX / 0.25)) + i;
//            jj = Math.ceil((deltaY / 0.25)) + j;
//            outerBoundkey = ii + "_" + jj;
////            console.log("innerBoundkey - else: " + innerBoundkey);
////            console.log("outerBoundkey - else: " + outerBoundkey);
//            createPolylineFromDXFData(lwPolylineMap);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, 1, 1);

            // Block zooming 
//            disableZoomIn = true;
//            console.log("else : " + minCameraHeight);
        }
//        } else {
//            console.log("grid not updated");
//        }

        // Enforce zoom restrictions
//        if (disableZoomIn && currentCameraHeight < minCameraHeight) {
//            viewer.camera.positionCartographic.height = minCameraHeight;
//        }
        end_time = performance.now();
        const executionTimeMs = end_time - start_time;
//        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
//    } else {
////        console.log('Unable to calculate visible bounds.');
//    }
    }
}

function pushIfNotExists(arr, item) {
    if (!arr.some(existingItem => existingItem[0] === item[0] && existingItem[1] === item[1] && existingItem[2] === item[2])) {
        arr.push(item);
    }
}

function generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY) {
    var [initialRows, initialColumns] = innerBoundkey.split("_");
    var [endRows, endColumns] = outerBoundkey.split("_");

    var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
    var current_m_res = roundToNearestQuarter(deltaY / fixedRows);

    var stepX = current_n_res / n;
    var stepY = current_m_res / n;

    var jsonObject = {};
    for (var i = 0; i < endRows - initialRows; i++) {
        for (var j = 0; j < endColumns - initialColumns; j++) {
            var key = i + "," + j;
            jsonObject[key] = "0,0,0,True,1,7/4/2024 6:08:59 PM,0,0,0,1," + stepX + "," + stepY + "," + deltaX + "," + deltaY;
        }
    }
    return jsonObject;
}

function generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey) {
    start_time = performance.now();
    var [initialRows, initialColumns] = innerBoundkey.split("_");
    var [endRows, endColumns] = outerBoundkey.split("_");
    var xxMin = origin_X_Min_UTM + n * initialRows;
    var yyMin = origin_Y_Min_UTM + n * initialColumns;

    pointMapInLatLong.clear();
    for (var key in result) {
        const ij = key.split(',');
        var i = ij[0];
        var j = ij[1];
//        console.log(i + "--------" + j);
        if (result.hasOwnProperty(key)) {
            var value = result[key];
            const valuesList = value.split(','); // Split the value string into an array
            var stepX = valuesList[10];
            var stepY = valuesList[11];
            var x_i = xxMin + stepX * n * i;
            var y_j = yyMin + stepY * n * j;
            const [lon, lat] = UTMToLatLon(x_i, y_j);
//            var valueInLatLong = lon + "," + lat + "," + polygonColor;
            var valueInLatLong = lon + "," + lat;
            var key1 = i + "_" + j;
            pointMapInLatLong.set(key1, valueInLatLong);
        }
    }
//    console.log("pointMapInLatLong  : ", pointMapInLatLong);
//    console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
//                console.log(pointMapInUTM.size);
    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
    end_time = performance.now();
    const executionTimeMs = end_time - start_time;
//                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
}

function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
    // Map to store unique IDs with corresponding points and color for each set of four points
    const uniqueIdMap = new Map();
    let uniqueIdCounter = 0;

    for (let [key, value] of pointMapInLatLong) {
        let [origin_i, origin_j] = key.split('_');
        origin_i = parseInt(origin_i);
        origin_j = parseInt(origin_j);

        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
            continue;
        }
        if (origin_i % skipsteps !== 0 || origin_j % skipsteps !== 0) {
            continue;
        }

        let bottomLeftKey = origin_i + "_" + origin_j;
        let topLeftKey = origin_i + "_" + (origin_j + skipsteps);
        let bottomRightKey = (origin_i + skipsteps) + "_" + origin_j;
        let topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);

        if (pointMapInLatLong.has(topLeftKey) && pointMapInLatLong.has(topRightKey) &&
                pointMapInLatLong.has(bottomRightKey) && pointMapInLatLong.has(bottomLeftKey)) {

            const topLeft = pointMapInLatLong.get(topLeftKey).split(',');
            const topRight = pointMapInLatLong.get(topRightKey).split(',');
            const bottomRight = pointMapInLatLong.get(bottomRightKey).split(',');
            const bottomLeft = pointMapInLatLong.get(bottomLeftKey).split(',');
//            // Determine the color based on the unique ID
            const colorIndex = Math.floor(uniqueIdCounter / 5) % 5;
            let polygonColor;
            switch (colorIndex) {
                case 0:
                    polygonColor = Cesium.Color.RED;
                    break;
                case 1:
                    polygonColor = Cesium.Color.GREEN;
                    break;
                case 2:
                    polygonColor = Cesium.Color.BLUE;
                    break;
                case 3:
                    polygonColor = Cesium.Color.YELLOW;
                    break;
                case 4:
                    polygonColor = Cesium.Color.CYAN;
                    break;
                default:
                    polygonColor = Cesium.Color.CYAN;
                    break;
            }

            // Create a unique ID for this set of four points and store the keys and color
            uniqueIdMap.set(uniqueIdCounter, {
                points: {
                    topLeft: {lon: parseFloat(topLeft[0]), lat: parseFloat(topLeft[1])},
                    topRight: {lon: parseFloat(topRight[0]), lat: parseFloat(topRight[1])},
                    bottomRight: {lon: parseFloat(bottomRight[0]), lat: parseFloat(bottomRight[1])},
                    bottomLeft: {lon: parseFloat(bottomLeft[0]), lat: parseFloat(bottomLeft[1])}
                },
                color: polygonColor
            });
            uniqueIdCounter++;
        }
    }

//    // Now create polygons using the uniqueIdMap
    uniqueIdMap.forEach((value, uniqueId) => {
        const points = value.points;
        const polygonColor = value.color;

        viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    points.topLeft.lon, points.topLeft.lat,
                    points.topRight.lon, points.topRight.lat,
                    points.bottomRight.lon, points.bottomRight.lat,
                    points.bottomLeft.lon, points.bottomLeft.lat
                ]),
//                material: Cesium.Color.TRANSPARENT,
                material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 0,
                height: 0
            }
        });
    });
//    console.log("Unique ID Map:", uniqueIdMap);
}


function roundToNearestQuarter(value) {
    const scaledValue = value * 100; // Multiply by 100 to work with whole numbers
    const fractionalPart = scaledValue % 100;
    if (fractionalPart >= 50) {
        // Round up to the nearest multiple of 25
        return Math.ceil(scaledValue / 25) * 0.25;
    } else {
        // Round down to the nearest multiple of 25
        return Math.floor(scaledValue / 25) * 0.25;
    }
}

function createPolylineFromDXFData(lwPolylineMap) {
//    console.log("lwPolylineMap :" + lwPolylineMap.length);
    lwPolylineMap.forEach(line => {
        const [name, coords] = line.split('=');
        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
        const positions = [];
        for (let i = 0; i < points.length; i += 2) {
            const easting = points[i];
            const northing = points[i + 1];
            // Assuming UTM Zone 33N (change as per your data)
            const [longitude, latitude] = UTMToLatLon(easting, northing);
            positions.push(Cesium.Cartesian3.fromDegrees(longitude, latitude));
        }

        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 1,
                material: Cesium.Color.BLACK
            }
        });
    });
//                if (lwPolylineMap.length > 0) {
//                    viewer.zoomTo(viewer.entities);
//                }
}

var newBands = [];

function seveneBands() {
    ////////////////////////////////////
//    const currentBands = [
//        [594.25],
//        [104],
//        [20.25],
//        [3.25],
//        [1.5],
//        [0.75],
//        [0.25]
//    ];
////    const newBands = [];
//    for (let i = 0; i < currentBands.length - 1; i++) {
//        var combinedBand = currentBands[i].concat(currentBands[i + 1]);
//        newBands.push(combinedBand);
//    }
//    console.log(newBands);
    /////////////////////////
//    var arr = [];
//    var numberOfBands = 9;
//    var max_n_res = 594.25;
//    var min_n_res = 0.25;
//    tottal_delta = max_n_res - min_n_res;
//    var constant = tottal_delta / 45;
//    arr.push(max_n_res);
//    for (var i = numberOfBands; i >= 1; i--) {
//        arr.push(i * constant);
////        arr.push([i * constant, (i + 1) * constant]);
//    }
//    arr.push(min_n_res);
////    console.log(arr);
/////////////////////////////////////////

//    var interval = (maxCameraHeight - minCameraHeight) / numberOfBands;
//
//    var bands = [];
//    for (var i = 0; i < numberOfBands; i++) {
//        var bandStart = parseInt(minCameraHeight + (i * interval));
//        var bandEnd = parseInt(minCameraHeight + ((i + 1) * interval));
//        bands.push([bandStart, bandEnd]);
//    }
//    console.log("bands : "+bands);

/////////////////////
    bands = [
        [
            1920,
            960
        ],
        [
            960,
            480
        ],
        [
            480,
            240
        ],
        [
            240,
            120
        ],
        [
            120,
            60
        ],
        [
            60,
            30
        ]
    ];
}

function getCurrentBandIndex(height) {
    var intheight = parseInt(height);
    console.log(intheight);
    for (var i = 0; i < bands.length; i++) {
//        if (intheight >= bands[i][0] && intheight <= bands[i][1]) {
        if (intheight <= bands[i][0] && intheight >= bands[i][1]) {
            return i;
        }
    }
    return -1; // Should not happen if height is within the range
}

//function getCurrentBandIndexforresolution(reso, reso2) {
////    console.log("current n__resolution :: " + reso);
////    console.log("current m__resolution :: " + reso2);
////    console.log("ssssss" + reso);
//    for (var i = 0; i < newBands.length; i++) {
//        if (reso <= newBands[i][0] && reso >= newBands[i][1]) {
//            return i;
//        }
//    }
//    return -1;
//}

///////////////////////////

//function generateIntervals(minResolution, numberOfIntervals) {
//    const intervals = [];
//    const maxResolution = minResolution * numberOfIntervals;
//    var screenresolution = 50;
////    const maxResolution = 594;
//
//    const intervalSize = (maxResolution - minResolution) / (numberOfIntervals - 1);
//
//    for (let i = 0; i < numberOfIntervals; i++) {
//        if (i > 0) {
//            screenresolution += 50;
//            intervals.push(minResolution + i * intervalSize * screenresolution);
//
//        } else {
//            intervals.push(minResolution + i * intervalSize);
//        }
////        intervals.push(minResolution + i * intervalSize);
//    }
//
////    return intervals;
//
//    for (const interval of intervals) {
////        console.log("intervals : " + interval);       
//    }
//}

// Example usage
//const minResolution = 0.25;
//const numberOfIntervals = Math.floor(49 / 2); // Assuming dxfPoints is a valid variable
//
//const intervals = generateIntervals(minResolution, numberOfIntervals);
//
//for (const interval of intervals) {
//    console.log(interval);
//}

///////////////////////////////////////

function calculateVisibleBounds(viewer) {
    const scene = viewer.scene;
    const ellipsoid = scene.globe.ellipsoid;
    const canvas = scene.canvas;
    if (scene.mode === Cesium.SceneMode.SCENE3D || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const topLeft = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
        const topRight = scene.camera.pickEllipsoid(new Cesium.Cartesian2(width, 0), ellipsoid);
        const bottomLeft = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, height), ellipsoid);
        if (topLeft && topRight && bottomLeft) {
            const widthMeters = Cesium.Cartesian3.distance(topLeft, topRight);
            const heightMeters = Cesium.Cartesian3.distance(topLeft, bottomLeft);
            const area = widthMeters * heightMeters; // in square meters

            const rectangle = viewer.camera.computeViewRectangle();
            const west = Cesium.Math.toDegrees(rectangle.west);
            const south = Cesium.Math.toDegrees(rectangle.south);
            const east = Cesium.Math.toDegrees(rectangle.east);
            const north = Cesium.Math.toDegrees(rectangle.north);
            const bounds = {west, south, east, north};
            const utmBounds = {
                west: latLonToUTM(south, west)[0],
                south: latLonToUTM(south, west)[1],
                east: latLonToUTM(north, east)[0],
                north: latLonToUTM(north, east)[1]
            };
            return {
                bounds,
                utmBounds,
                area,
                width: widthMeters,
                height: heightMeters,
                SCENEDs: "SCENE3D"
            };
        }
    } else if (scene.mode === Cesium.SceneMode.SCENE2D) {
        const centerCartographic = scene.camera.positionCartographic;
        const center = {
            longitude: Cesium.Math.toDegrees(centerCartographic.longitude),
            latitude: Cesium.Math.toDegrees(centerCartographic.latitude)
        };
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const halfWidth = canvasWidth / 2;
        const halfHeight = canvasHeight / 2;
        const centerPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, halfHeight), ellipsoid);
        if (!centerPick) {
            console.error('Failed to pick center of the view');
            return null;
        }

        const centerCartesian = ellipsoid.cartesianToCartographic(centerPick);
        const leftPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, halfHeight), ellipsoid);
        const rightPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(canvasWidth, halfHeight), ellipsoid);
        const topPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, 0), ellipsoid);
        const bottomPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, canvasHeight), ellipsoid);
        if (!leftPick || !rightPick || !topPick || !bottomPick) {
            console.error('Failed to pick bounds of the view');
            return null;
        }

        const leftCartesian = ellipsoid.cartesianToCartographic(leftPick);
        const rightCartesian = ellipsoid.cartesianToCartographic(rightPick);
        const topCartesian = ellipsoid.cartesianToCartographic(topPick);
        const bottomCartesian = ellipsoid.cartesianToCartographic(bottomPick);
        const west = Cesium.Math.toDegrees(leftCartesian.longitude);
        const south = Cesium.Math.toDegrees(bottomCartesian.latitude);
        const east = Cesium.Math.toDegrees(rightCartesian.longitude);
        const north = Cesium.Math.toDegrees(topCartesian.latitude);
        const bounds = {west, south, east, north};
        // Convert to UTM
        const utmWest = latLonToUTM(south, west)[0];
        const utmSouth = latLonToUTM(south, west)[1];
        const utmEast = latLonToUTM(north, east)[0];
        const utmNorth = latLonToUTM(north, east)[1];
        const utmBounds = {west: utmWest, south: utmSouth, east: utmEast, north: utmNorth};
        // Approximate area in 2D
        const viewWidth = Cesium.Cartesian3.distance(leftPick, rightPick);
        const viewHeight = Cesium.Cartesian3.distance(topPick, bottomPick);
        const area = viewWidth * viewHeight;
        return {
            bounds,
            utmBounds,
            area,
            width: viewWidth,
            height: viewHeight,
            SCENEDs: "SCENE2D"
        };
    } else {
        console.error('Unsupported scene mode');
    }
    return null;
}

function allPoint(minmaxcoordinates) {
    var n = 10;
    var allPointMapInLatLong = new Map();
    result = calculateVisibleBounds(viewer);
    if (result) {
        var {width, height} = result;
        var minEasting = minmaxcoordinates.minEasting;
        var minNorthing = minmaxcoordinates.minNorthing;
        var dx = origin_X_Min_UTM - minEasting;
        var dy = origin_Y_Min_UTM - minNorthing;
        var i = Math.floor(Math.abs(dx) / n);
        var j = Math.floor(Math.abs(dy) / n);
        var innerBoundkey = i + "_" + j;
//        console.log('innerBoundkey : ', innerBoundkey);
        var deltaX = Math.floor(width);
        var deltaY = Math.floor(height);
        console.log(deltaX);
        console.log(deltaY);
        var [initialRows, initialColumns] = innerBoundkey.split("_");

        var ii = Math.ceil((deltaX / n) + i);
        var jj = Math.ceil((deltaY / n) + j);
        var outerBoundkey = ii + "_" + jj;
//        console.log('outerBoundkey : ', outerBoundkey);
        var [endRows, endColumns] = outerBoundkey.split("_");
        var xxMin = origin_X_Min_UTM + n * initialRows;
        var yyMin = origin_Y_Min_UTM + n * initialColumns;

        for (var i = 0; i < endRows - initialRows; i++) {
            console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
            var x_i = xxMin + 0.25 * i;
            for (var j = 0; j < endColumns - initialColumns; j++) {
//                console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
                var y_j = yyMin + 0.25 * j;
                const [lon, lat] = UTMToLatLon(x_i, y_j);
                var key = i + "_" + j;
                var valueInLatLong = lon + "," + lat;

                allPointMapInLatLong.set(key, valueInLatLong);
            }
        }
        console.log("allPointMapInLatLongaaaaaaaaaaaaaaaaaaaaaaaa : " + allPointMapInLatLong.size);
    } else {
//                        console.log('Unable to calculate visible bounds.');
    }

}


let updateConsoleTimeout = null;
function updateConsoleValues(viewer, camera) {
    if (updateConsoleTimeout) {
        clearTimeout(updateConsoleTimeout);
    }
    updateConsoleTimeout = setTimeout(() => {
        result = calculateVisibleBounds(viewer);
        if (result) {
            const {bounds, utmBounds, area, width, height, SCENEDs} = result;
//            const zoomLevel = viewer.camera.getMagnitude() / 100000;
//            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
//            console.log(zoomLevel.toFixed(5));
//            console.log('Visible Area (sq meters):', area.toFixed(2));
//            console.log('Visible Width (meters):', width.toFixed(2));
//            console.log('Visible Height (meters):', height.toFixed(2));
//            console.log('Visible LatLong Bounds:', bounds);
//            console.log('Visible UTM Bounds:', utmBounds);
//            console.log('SCENEDs: ', SCENEDs);
//            console.log("camera : ", camera);
        } else {
//                        console.log('Unable to calculate visible bounds.');
        }
    }, 500);
}

function latLonToUTM(lat, lon) {
    return proj4(WGS84, UTM43N, [lon, lat]);
}

function UTMToLatLon(easting, northing) {
    return proj4(UTM43N, WGS84, [easting, northing]);
}

viewer.camera.moveEnd.addEventListener(() => {
    updateConsoleValues(viewer, "move");
//    const currentCameraHeight = viewer.camera.positionCartographic.height;
//    const newBandIndex = getCurrentBandIndex(currentCameraHeight);
//    updateConsoleValues(viewer, "move");
//    if (newBandIndex !== currentBandIndex) {
//        currentBandIndex = newBandIndex;
//        getGridInBounds(lwPolylineMap, minmaxcoordinates);
//    }
    getGridInBounds(lwPolylineMap, minmaxcoordinates);
});

//viewer.camera.changed.addEventListener(() => {
//    updateConsoleValues(viewer, "change");
////    viewer.entities.removeAll();
//    getGridInBounds(lwPolylineMap, minmaxcoordinates);
//});

//// Listen for the scroll event
//viewer.scene.postRender.addEventListener(function () {
//    var height = viewer.camera.positionCartographic.height;
//// Iterate through each sub-array in bands
//    for (var i = 0; i < bands.length; i++) {
//        var startHeight = bands[i][0];
//        var endHeight = bands[i][1];
//
//        // Call the function if height matches the startHeight
//        if (startHeight >= height || endHeight >= height) {
//            console.log("Hiiiiiiiiiii");
//        }
//    }
//});


