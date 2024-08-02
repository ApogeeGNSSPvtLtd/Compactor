//var lwPolylineMap = new Map();
//var pointMapInLatLong = new Map();
//var pointMapInUTM = new Map();
//var pointMap = new Map();
//var minmaxcoordinates = {};
//var result = {};
//var origin_X_Min_UTM = 0;
//var origin_X_Max_UTM = 0;
//var origin_Y_Min_UTM = 0;
//var origin_Y_Max_UTM = 0;
//var n = 10;
//var fixedRows = 50;
//var fixedColumns = 100;
//var minCameraHeight = 55;
//var maxCameraHeight;
//var numberOfBands = 7;
//var bands = [];
//var currentBandIndex = -1;
//var min_reo_flag = true;
//
//
//$(function () {
//    $.ajax({
//        type: "GET",
//        url: "http://localhost:8080/Compactor/dxfdata",
//        dataType: "json",
//        success: function (response) {
////            console.log(response);
//            let minMaxValues = response.minMaxValues;
//            let lineMap = response.line_map;
//            lwPolylineMap = response.lwPolyline_map;
//
//            minmaxcoordinates = getminMaxValuesOfDXF(minMaxValues);
////            console.log(minmaxcoordinates);
//            setView(minmaxcoordinates);
////            createPolylineFromDXFData(lwPolylineMap);
//            getGridInBounds(lwPolylineMap, minmaxcoordinates);
//            seveneBands();
//        },
//        error: function (error) {
//            console.error(error);
//            alert("Error fetching user data");
//        }
//    });
//});
//
//
//function getminMaxValuesOfDXF(minMaxValues) {
//    var minmaxcoordinates = {};
//    minMaxValues.forEach(item => {
//        const [key, value] = item.split('=');
//        minmaxcoordinates[key] = parseFloat(value);
//    });
//
//    const minEasting = minmaxcoordinates.minEasting;
//    const maxEasting = minmaxcoordinates.maxEasting;
//    const minNorthing = minmaxcoordinates.minNorthing;
//    const maxNorthing = minmaxcoordinates.maxNorthing;
//
//    origin_X_Min_UTM = minEasting;
//    origin_X_Max_UTM = maxEasting;
//    origin_Y_Min_UTM = minNorthing;
//    origin_Y_Max_UTM = maxNorthing;
//
//    return minmaxcoordinates;
//}
//
//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWQwMTQwMC1jNGI1LTRjNTktODhmNC03M2FjZTk2ODgwNWEiLCJpZCI6MjIwODM3LCJpYXQiOjE3MTc3NTM2ODV9.NXbyoMbAMkBlp2Hs8nsqnvHOL0wh7mxkVKc5xxpaHGs';
//const viewer = new Cesium.Viewer('cesiumContainer',
//        {
//            projectionPicker: true,
//            mapProjection: new Cesium.WebMercatorProjection(),
//            sceneMode: Cesium.SceneMode.SCENE2D
//        });
//const proj4 = window.proj4;
//const WGS84 = 'EPSG:4326';
//const UTM43N = '+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs';
//
//function setView(minmaxcoordinates) {
////    const [xMin, yMin] = UTMToLatLon(340720.294745321, 2982771.25387919);
////    const [xMax, yMax] = UTMToLatLon(400170.1032381087, 3008426.968591016);
//
//    const [xMin, yMin] = UTMToLatLon(minmaxcoordinates.minEasting, minmaxcoordinates.minNorthing);
//    const [xMax, yMax] = UTMToLatLon(minmaxcoordinates.maxEasting, minmaxcoordinates.maxNorthing);
//
//    viewer.camera.setView(
//            {
//                destination: Cesium.Rectangle.fromDegrees(xMin, yMin, xMax, yMax),
//                orientation: {
//                    heading: 0.0,
//                    pitch: -45.0,
//                    roll: 0.0
//                }
//            });
//}
//
//function getGridInBounds(lwPolylineMap, minmaxcoordinates, action) {
//
//    if (action === 'dragDrop') {
//        console.log('Drag and drop action detected.');
//    } else if (action === 'zoom') {
//        console.log('Zoom action detected.');
//    }
//
//
//    start_time = performance.now();
//    pointMapInLatLong.clear();
//    var n = 0.25;
//    result = calculateVisibleBounds(viewer);
//    if (result) {
//        var {utmBounds, width, height} = result;
//        var minEasting = minmaxcoordinates.minEasting;
//        var minNorthing = minmaxcoordinates.minNorthing;
//        var maxEasting = minmaxcoordinates.maxEasting;
//        var maxNorthing = minmaxcoordinates.maxNorthing;
//
//        var current_X_Min_UTM = utmBounds.west;
//        var current_Y_Min_UTM = utmBounds.south;
//        var current_X_Max_UTM = utmBounds.east;
//        var current_Y_Max_UTM = utmBounds.north;
//
//        if (current_X_Min_UTM <= minEasting || current_Y_Min_UTM <= minNorthing) {
//            current_X_Min_UTM = minEasting;
//            current_Y_Min_UTM = minNorthing;
//        }
//        var dx = origin_X_Min_UTM - current_X_Min_UTM;
//        var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
//        var i = Math.floor(Math.abs(dx) / n);
//        var j = Math.floor(Math.abs(dy) / n);
//        var innerBoundkey = i + "_" + j;
//        var deltaX = Math.floor(width);
//        var deltaY = Math.floor(height);
//        if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
//            deltaX = maxEasting - current_X_Min_UTM;
//            deltaY = maxNorthing - current_Y_Min_UTM;
//        }
//        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
//        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
//        var ii = Math.ceil((deltaX / current_n_res)) + i;
//        var jj = Math.ceil((deltaY / current_m_res)) + j;
//        var outerBoundkey = ii + "_" + jj;
//        var stepX = current_n_res / n;
//        var stepY = current_m_res / n;
//        if (current_n_res !== n && current_m_res !== n) {
//            min_reo_flag = true;
//        }
//
//        if (current_n_res >= n && current_m_res >= n && min_reo_flag) {
//            console.log("current_n_res : " + current_n_res);
//            console.log("current_m_res : " + current_m_res);
//            if (current_n_res === n && current_m_res === n) {
//                min_reo_flag = false;
//            }
//            const currentCameraHeight = viewer.camera.positionCartographic.height;
//            console.log("currentCameraHeight : " + currentCameraHeight);
////            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
//
//            if (currentCameraHeight <= 1800) {
//                const newBandIndex = getCurrentBandIndex(currentCameraHeight);
//                if (newBandIndex !== currentBandIndex) {
//                    currentBandIndex = newBandIndex;
//                    viewer.entities.removeAll();
//                    createPolylineFromDXFData(lwPolylineMap);
//                    var result = generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY);
////            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
//                    generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey);
//                } else {
//                    console.log("inside same band : grid not updated");
//                }
//            } else {
//                viewer.entities.removeAll();
//                createPolylineFromDXFData(lwPolylineMap);
//                console.log("height > 1800 : grid not generated");
//            }
//        } else {
//            console.log("resolution < 0.25 : grid not updated");
//        }
//        end_time = performance.now();
//        const executionTimeMs = end_time - start_time;
////        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
//    }
//}
//
//function generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY) {
//    var [initialRows, initialColumns] = innerBoundkey.split("_");
//    var [endRows, endColumns] = outerBoundkey.split("_");
//
//    var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
//    var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
//
//    var stepX = current_n_res / n;
//    var stepY = current_m_res / n;
//
//    var jsonObject = {};
//    for (var i = 0; i < endRows - initialRows; i++) {
//        for (var j = 0; j < endColumns - initialColumns; j++) {
//            var key = i + "," + j;
//            jsonObject[key] = "0,0,0,True,1,7/4/2024 6:08:59 PM,0,0,0,1," + stepX + "," + stepY + "," + deltaX + "," + deltaY;
//        }
//    }
//    return jsonObject;
//}
//
//function generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey) {
//    start_time = performance.now();
//    var [initialRows, initialColumns] = innerBoundkey.split("_");
//    var [endRows, endColumns] = outerBoundkey.split("_");
//    var xxMin = origin_X_Min_UTM + n * initialRows;
//    var yyMin = origin_Y_Min_UTM + n * initialColumns;
//
//    pointMapInLatLong.clear();
//    for (var key in result) {
//        const ij = key.split(',');
//        var i = ij[0];
//        var j = ij[1];
////        console.log(i + "--------" + j);
//        if (result.hasOwnProperty(key)) {
//            var value = result[key];
//            const valuesList = value.split(','); // Split the value string into an array
//            var stepX = valuesList[10];
//            var stepY = valuesList[11];
//            var x_i = xxMin + stepX * n * i;
//            var y_j = yyMin + stepY * n * j;
//            const [lon, lat] = UTMToLatLon(x_i, y_j);
////            var valueInLatLong = lon + "," + lat + "," + polygonColor;
//            var valueInLatLong = lon + "," + lat;
//            var key1 = i + "_" + j;
//            pointMapInLatLong.set(key1, valueInLatLong);
//        }
//    }
////    console.log("pointMapInLatLong  : ", pointMapInLatLong);
////    console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
////                console.log(pointMapInUTM.size);
//    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
//    end_time = performance.now();
//    const executionTimeMs = end_time - start_time;
////                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
//}
//
//function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
//    // Map to store unique IDs with corresponding points and color for each set of four points
//    const uniqueIdMap = new Map();
//    let uniqueIdCounter = 0;
//
//    for (let [key, value] of pointMapInLatLong) {
//        let [origin_i, origin_j] = key.split('_');
//        origin_i = parseInt(origin_i);
//        origin_j = parseInt(origin_j);
//
//        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
//            continue;
//        }
//        if (origin_i % skipsteps !== 0 || origin_j % skipsteps !== 0) {
//            continue;
//        }
//
//        let bottomLeftKey = origin_i + "_" + origin_j;
//        let topLeftKey = origin_i + "_" + (origin_j + skipsteps);
//        let bottomRightKey = (origin_i + skipsteps) + "_" + origin_j;
//        let topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
//
//        if (pointMapInLatLong.has(topLeftKey) && pointMapInLatLong.has(topRightKey) &&
//                pointMapInLatLong.has(bottomRightKey) && pointMapInLatLong.has(bottomLeftKey)) {
//
//            const topLeft = pointMapInLatLong.get(topLeftKey).split(',');
//            const topRight = pointMapInLatLong.get(topRightKey).split(',');
//            const bottomRight = pointMapInLatLong.get(bottomRightKey).split(',');
//            const bottomLeft = pointMapInLatLong.get(bottomLeftKey).split(',');
////            // Determine the color based on the unique ID
//            const colorIndex = Math.floor(uniqueIdCounter / 5) % 5;
//            let polygonColor;
//            switch (colorIndex) {
//                case 0:
//                    polygonColor = Cesium.Color.RED;
//                    break;
//                case 1:
//                    polygonColor = Cesium.Color.GREEN;
//                    break;
//                case 2:
//                    polygonColor = Cesium.Color.BLUE;
//                    break;
//                case 3:
//                    polygonColor = Cesium.Color.YELLOW;
//                    break;
//                case 4:
//                    polygonColor = Cesium.Color.CYAN;
//                    break;
//                default:
//                    polygonColor = Cesium.Color.CYAN;
//                    break;
//            }
//
//            // Create a unique ID for this set of four points and store the keys and color
//            uniqueIdMap.set(uniqueIdCounter, {
//                points: {
//                    topLeft: {lon: parseFloat(topLeft[0]), lat: parseFloat(topLeft[1])},
//                    topRight: {lon: parseFloat(topRight[0]), lat: parseFloat(topRight[1])},
//                    bottomRight: {lon: parseFloat(bottomRight[0]), lat: parseFloat(bottomRight[1])},
//                    bottomLeft: {lon: parseFloat(bottomLeft[0]), lat: parseFloat(bottomLeft[1])}
//                },
//                color: polygonColor
//            });
//            uniqueIdCounter++;
//        }
//    }
//
////    // Now create polygons using the uniqueIdMap
//    uniqueIdMap.forEach((value, uniqueId) => {
//        const points = value.points;
//        const polygonColor = value.color;
//
//        viewer.entities.add({
//            polygon: {
//                hierarchy: Cesium.Cartesian3.fromDegreesArray([
//                    points.topLeft.lon, points.topLeft.lat,
//                    points.topRight.lon, points.topRight.lat,
//                    points.bottomRight.lon, points.bottomRight.lat,
//                    points.bottomLeft.lon, points.bottomLeft.lat
//                ]),
////                material: Cesium.Color.TRANSPARENT,
//                material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
//                outline: true,
//                outlineColor: Cesium.Color.BLACK,
//                outlineWidth: 0,
//                height: 0
//            }
//        });
//    });
////    console.log("Unique ID Map:", uniqueIdMap);
//}
//
//
//function roundToNearestQuarter(value) {
//    const scaledValue = value * 100; // Multiply by 100 to work with whole numbers
//    const fractionalPart = scaledValue % 100;
//    if (fractionalPart >= 50) {
//        // Round up to the nearest multiple of 25
//        return Math.ceil(scaledValue / 25) * 0.25;
//    } else {
//        // Round down to the nearest multiple of 25
//        return Math.floor(scaledValue / 25) * 0.25;
//    }
//}
//
//function createPolylineFromDXFData(lwPolylineMap) {
////    console.log("lwPolylineMap :" + lwPolylineMap.length);
//    lwPolylineMap.forEach(line => {
//        const [name, coords] = line.split('=');
//        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
//        const positions = [];
//        for (let i = 0; i < points.length; i += 2) {
//            const easting = points[i];
//            const northing = points[i + 1];
//            // Assuming UTM Zone 33N (change as per your data)
//            const [longitude, latitude] = UTMToLatLon(easting, northing);
//            positions.push(Cesium.Cartesian3.fromDegrees(longitude, latitude));
//        }
//
//        viewer.entities.add({
//            polyline: {
//                positions: positions,
//                width: 1,
//                material: Cesium.Color.BLACK
//            }
//        });
//    });
////                if (lwPolylineMap.length > 0) {
////                    viewer.zoomTo(viewer.entities);
////                }
//}
//
//var newBands = [];
//
//function seveneBands() {
//    bands = [
//        [
//            1920,
//            960
//        ],
//        [
//            960,
//            480
//        ],
//        [
//            480,
//            240
//        ],
//        [
//            240,
//            120
//        ],
//        [
//            120,
//            60
//        ],
//        [
//            60,
//            30
//        ]
//    ];
//}
//
//function getCurrentBandIndex(height) {
//    var intheight = parseInt(height);
//    console.log(intheight);
//    for (var i = 0; i < bands.length; i++) {
////        if (intheight >= bands[i][0] && intheight <= bands[i][1]) {
//        if (intheight <= bands[i][0] && intheight >= bands[i][1]) {
//            return i;
//        }
//    }
//    return -1; // Should not happen if height is within the range
//}
//
//function calculateVisibleBounds(viewer) {
//    const scene = viewer.scene;
//    const ellipsoid = scene.globe.ellipsoid;
//    const canvas = scene.canvas;
//    if (scene.mode === Cesium.SceneMode.SCENE3D || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
//        const width = canvas.clientWidth;
//        const height = canvas.clientHeight;
//        const topLeft = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
//        const topRight = scene.camera.pickEllipsoid(new Cesium.Cartesian2(width, 0), ellipsoid);
//        const bottomLeft = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, height), ellipsoid);
//        if (topLeft && topRight && bottomLeft) {
//            const widthMeters = Cesium.Cartesian3.distance(topLeft, topRight);
//            const heightMeters = Cesium.Cartesian3.distance(topLeft, bottomLeft);
//            const area = widthMeters * heightMeters; // in square meters
//
//            const rectangle = viewer.camera.computeViewRectangle();
//            const west = Cesium.Math.toDegrees(rectangle.west);
//            const south = Cesium.Math.toDegrees(rectangle.south);
//            const east = Cesium.Math.toDegrees(rectangle.east);
//            const north = Cesium.Math.toDegrees(rectangle.north);
//            const bounds = {west, south, east, north};
//            const utmBounds = {
//                west: latLonToUTM(south, west)[0],
//                south: latLonToUTM(south, west)[1],
//                east: latLonToUTM(north, east)[0],
//                north: latLonToUTM(north, east)[1]
//            };
//            return {
//                bounds,
//                utmBounds,
//                area,
//                width: widthMeters,
//                height: heightMeters,
//                SCENEDs: "SCENE3D"
//            };
//        }
//    } else if (scene.mode === Cesium.SceneMode.SCENE2D) {
//        const centerCartographic = scene.camera.positionCartographic;
//        const center = {
//            longitude: Cesium.Math.toDegrees(centerCartographic.longitude),
//            latitude: Cesium.Math.toDegrees(centerCartographic.latitude)
//        };
//        const canvasWidth = canvas.clientWidth;
//        const canvasHeight = canvas.clientHeight;
//        const halfWidth = canvasWidth / 2;
//        const halfHeight = canvasHeight / 2;
//        const centerPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, halfHeight), ellipsoid);
//        if (!centerPick) {
//            console.error('Failed to pick center of the view');
//            return null;
//        }
//
//        const centerCartesian = ellipsoid.cartesianToCartographic(centerPick);
//        const leftPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(0, halfHeight), ellipsoid);
//        const rightPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(canvasWidth, halfHeight), ellipsoid);
//        const topPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, 0), ellipsoid);
//        const bottomPick = scene.camera.pickEllipsoid(new Cesium.Cartesian2(halfWidth, canvasHeight), ellipsoid);
//        if (!leftPick || !rightPick || !topPick || !bottomPick) {
//            console.error('Failed to pick bounds of the view');
//            return null;
//        }
//
//        const leftCartesian = ellipsoid.cartesianToCartographic(leftPick);
//        const rightCartesian = ellipsoid.cartesianToCartographic(rightPick);
//        const topCartesian = ellipsoid.cartesianToCartographic(topPick);
//        const bottomCartesian = ellipsoid.cartesianToCartographic(bottomPick);
//        const west = Cesium.Math.toDegrees(leftCartesian.longitude);
//        const south = Cesium.Math.toDegrees(bottomCartesian.latitude);
//        const east = Cesium.Math.toDegrees(rightCartesian.longitude);
//        const north = Cesium.Math.toDegrees(topCartesian.latitude);
//        const bounds = {west, south, east, north};
//        // Convert to UTM
//        const utmWest = latLonToUTM(south, west)[0];
//        const utmSouth = latLonToUTM(south, west)[1];
//        const utmEast = latLonToUTM(north, east)[0];
//        const utmNorth = latLonToUTM(north, east)[1];
//        const utmBounds = {west: utmWest, south: utmSouth, east: utmEast, north: utmNorth};
//        // Approximate area in 2D
//        const viewWidth = Cesium.Cartesian3.distance(leftPick, rightPick);
//        const viewHeight = Cesium.Cartesian3.distance(topPick, bottomPick);
//        const area = viewWidth * viewHeight;
//        return {
//            bounds,
//            utmBounds,
//            area,
//            width: viewWidth,
//            height: viewHeight,
//            SCENEDs: "SCENE2D"
//        };
//    } else {
//        console.error('Unsupported scene mode');
//    }
//    return null;
//}
//
//function allPoint(minmaxcoordinates) {
//    var n = 10;
//    var allPointMapInLatLong = new Map();
//    result = calculateVisibleBounds(viewer);
//    if (result) {
//        var {width, height} = result;
//        var minEasting = minmaxcoordinates.minEasting;
//        var minNorthing = minmaxcoordinates.minNorthing;
//        var dx = origin_X_Min_UTM - minEasting;
//        var dy = origin_Y_Min_UTM - minNorthing;
//        var i = Math.floor(Math.abs(dx) / n);
//        var j = Math.floor(Math.abs(dy) / n);
//        var innerBoundkey = i + "_" + j;
////        console.log('innerBoundkey : ', innerBoundkey);
//        var deltaX = Math.floor(width);
//        var deltaY = Math.floor(height);
//        console.log(deltaX);
//        console.log(deltaY);
//        var [initialRows, initialColumns] = innerBoundkey.split("_");
//
//        var ii = Math.ceil((deltaX / n) + i);
//        var jj = Math.ceil((deltaY / n) + j);
//        var outerBoundkey = ii + "_" + jj;
////        console.log('outerBoundkey : ', outerBoundkey);
//        var [endRows, endColumns] = outerBoundkey.split("_");
//        var xxMin = origin_X_Min_UTM + n * initialRows;
//        var yyMin = origin_Y_Min_UTM + n * initialColumns;
//
//        for (var i = 0; i < endRows - initialRows; i++) {
//            console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
//            var x_i = xxMin + 0.25 * i;
//            for (var j = 0; j < endColumns - initialColumns; j++) {
////                console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
//                var y_j = yyMin + 0.25 * j;
//                const [lon, lat] = UTMToLatLon(x_i, y_j);
//                var key = i + "_" + j;
//                var valueInLatLong = lon + "," + lat;
//
//                allPointMapInLatLong.set(key, valueInLatLong);
//            }
//        }
//        console.log("allPointMapInLatLongaaaaaaaaaaaaaaaaaaaaaaaa : " + allPointMapInLatLong.size);
//    } else {
////                        console.log('Unable to calculate visible bounds.');
//    }
//
//}
//
//
//let updateConsoleTimeout = null;
//function updateConsoleValues(viewer, camera) {
//    if (updateConsoleTimeout) {
//        clearTimeout(updateConsoleTimeout);
//    }
//    updateConsoleTimeout = setTimeout(() => {
//        result = calculateVisibleBounds(viewer);
//        if (result) {
//            const {bounds, utmBounds, area, width, height, SCENEDs} = result;
////            const zoomLevel = viewer.camera.getMagnitude() / 100000;
////            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
////            console.log(zoomLevel.toFixed(5));
////            console.log('Visible Area (sq meters):', area.toFixed(2));
////            console.log('Visible Width (meters):', width.toFixed(2));
////            console.log('Visible Height (meters):', height.toFixed(2));
////            console.log('Visible LatLong Bounds:', bounds);
////            console.log('Visible UTM Bounds:', utmBounds);
////            console.log('SCENEDs: ', SCENEDs);
////            console.log("camera : ", camera);
//        } else {
////                        console.log('Unable to calculate visible bounds.');
//        }
//    }, 500);
//}
//
//function latLonToUTM(lat, lon) {
//    return proj4(WGS84, UTM43N, [lon, lat]);
//}
//
//function UTMToLatLon(easting, northing) {
//    return proj4(UTM43N, WGS84, [easting, northing]);
//}
//////////////////////////////////////////////////////////////////////////////////
//
////var startMousePosition;
////var endMousePosition;
////var isDragging = false;
////
////viewer.screenSpaceEventHandler.setInputAction((movement) => {
////    startMousePosition = movement.position;
////    isDragging = true;
////    console.log(isDragging);
////}, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
////
////viewer.screenSpaceEventHandler.setInputAction((movement) => {
////    if (isDragging) {
////        endMousePosition = movement.endPosition;
////        var startCartesian = viewer.camera.pickEllipsoid(startMousePosition, viewer.scene.globe.ellipsoid);
////        var endCartesian = viewer.camera.pickEllipsoid(endMousePosition, viewer.scene.globe.ellipsoid);
////
////        if (startCartesian && endCartesian) {
////            var startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
////            var endCartographic = Cesium.Cartographic.fromCartesian(endCartesian);
////
////            var geodesic = new Cesium.EllipsoidGeodesic();
////            geodesic.setEndPoints(startCartographic, endCartographic);
////            var distance = geodesic.surfaceDistance;
////
////            console.log('Distance dragged: ' + distance + ' meters');
////            getGridInBounds(lwPolylineMap, minmaxcoordinates, 'dragDrop');
////        }
////    }
////}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
////
////viewer.screenSpaceEventHandler.setInputAction(() => {
////    isDragging = false;
////}, Cesium.ScreenSpaceEventType.RIGHT_UP);
//
//////////////////////////////////////////////////////////////////////////////////
//
//viewer.camera.moveEnd.addEventListener(() => {
//    updateConsoleValues(viewer, "move");
////    const currentCameraHeight = viewer.camera.positionCartographic.height;
////    const newBandIndex = getCurrentBandIndex(currentCameraHeight);
////    updateConsoleValues(viewer, "move");
////    if (newBandIndex !== currentBandIndex) {
////        currentBandIndex = newBandIndex;
////        getGridInBounds(lwPolylineMap, minmaxcoordinates);
////    }
//    getGridInBounds(lwPolylineMap, minmaxcoordinates, 'zoom');
//});
//
////viewer.camera.changed.addEventListener(() => {
////    updateConsoleValues(viewer, "change");
//////    viewer.entities.removeAll();
////    getGridInBounds(lwPolylineMap, minmaxcoordinates);
////});
//
//// Add the right mouse button drag event
//


//////////////////////////////////////////////////  Testing  /////////////////////////

var lwPolylineMap = new Map();
var pointMapInLatLong = new Map();
var pointMapInUTM = new Map();
//var pointMap = new Map();
var minmaxcoordinates = {};
var result = {};
var origin_X_Min_UTM = 0;
//var origin_X_Max_UTM = 0;
var origin_Y_Min_UTM = 0;
//var origin_Y_Max_UTM = 0;
//var n = 10;
var fixedRows = 50;
var fixedColumns = 100;
var minCameraHeight = 30;
//var maxCameraHeight;
var numberOfBands = 7;
var bands = [];
var currentBandIndex = -1;
var min_reo_flag = true;
var isDragging = false;
var startPosition;
var distance = 0;


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
//            createPolylineFromDXFData(lwPolylineMap);
            getGridInBounds(lwPolylineMap, minmaxcoordinates);
            seveneBands();
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
//    origin_X_Max_UTM = maxEasting;
    origin_Y_Min_UTM = minNorthing;
//    origin_Y_Max_UTM = maxNorthing;

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

function getGridInBounds(lwPolylineMap, minmaxcoordinates, current_dragdrop_distance) {
    start_time = performance.now();
    var n = 0.25;
    const currentCameraHeight = viewer.camera.positionCartographic.height;
    console.log("currentCameraHeight : " + currentCameraHeight);
    if (currentCameraHeight <= 1800) {
//        let [newBandIndex, band_dragdrop_distance] = getCurrentBandIndex(currentCameraHeight);

        if (current_dragdrop_distance === 0 || current_dragdrop_distance === undefined) {
            if (current_dragdrop_distance === undefined) {
                current_dragdrop_distance = 0;
            }
            console.log('Zoom action detected :: ' + current_dragdrop_distance);
        } else {
            console.log('Drag and drop action detected :: ' + current_dragdrop_distance);
        }

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
            if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
                deltaX = maxEasting - current_X_Min_UTM;
                deltaY = maxNorthing - current_Y_Min_UTM;
            }
            var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
            var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
            var ii = Math.ceil((deltaX / current_n_res)) + i;
            var jj = Math.ceil((deltaY / current_m_res)) + j;
            var outerBoundkey = ii + "_" + jj;
            var stepX = current_n_res / n;
            var stepY = current_m_res / n;
            if (current_n_res !== n && current_m_res !== n) {
                min_reo_flag = true;
            }

            if (current_n_res >= n && current_m_res >= n && min_reo_flag) {
//            console.log("current_n_res : " + current_n_res);
//            console.log("current_m_res : " + current_m_res);
                if (current_n_res === n && current_m_res === n) {
                    min_reo_flag = false;
                }

                const [newBandIndex, band_dragdrop_distance] = getCurrentBandIndex(currentCameraHeight);
                if (newBandIndex !== currentBandIndex || current_dragdrop_distance >= band_dragdrop_distance) {
//                    console.log('action >= 0.5 ==> create grid by Drag and drop action detected :: ' + action);
                    currentBandIndex = newBandIndex;
                    viewer.entities.removeAll();
                    createPolylineFromDXFData(lwPolylineMap);
                    var result = generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY);
//                    console.log(result);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
                    generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey);
                } else {
//                    console.log("inside same band : grid not updated");
                }

            } else {
//            console.log("resolution < 0.25 : grid not updated");
            }
            end_time = performance.now();
            const executionTimeMs = end_time - start_time;
//        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
        }
    } else {
        const [newBandIndex] = getCurrentBandIndex(currentCameraHeight);
        currentBandIndex = newBandIndex;
        viewer.entities.removeAll();
        createPolylineFromDXFData(lwPolylineMap);
//                console.log("height > 1800 : grid not generated");
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
                material: Cesium.Color.TRANSPARENT,
//                material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
                outline: true,
//                outline: false,
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

function seveneBands() {
    var arr = [];
    var value = minCameraHeight;
    for (var i = 1; i <= numberOfBands; i++) {
        arr.push(value);
        value = value * 2;
    }

//    for (var i = 0; i < arr.length - 1; i++) {
////        bands.push([arr[i + 1], arr[i]]);
//        bands.push([arr[i], arr[i + 1]]);
//    }
//    console.log("bands:", bands);

    for (var i = arr.length - 2; i >= 0; i--) {
        bands.push([arr[i + 1], arr[i]]);
    }

    //    var drag_drop_val = [0.02, 0.03, 0.05, 0.1, 0.3, 0.5];
    var drag_drop_val = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];
    for (var i = 0; i < bands.length; i++) {
        bands[i][2] = drag_drop_val[i];
    }
    console.log("bands:", bands);
}

function getCurrentBandIndex(height) {
    var intheight = parseInt(height);
    console.log("height : " + intheight);
    for (var i = 0; i < bands.length; i++) {
//        if (intheight >= bands[i][0] && intheight <= bands[i][1]) {
        if (intheight <= bands[i][0] && intheight >= bands[i][1]) {
            return [i, bands[i][2]];
        }
    }
    return [-1]; // Should not happen if height is within the range
}

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

//drag and drop
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
// Start dragging
handler.setInputAction(function (event) {
//    console.log("Event:", JSON.stringify(event));
    isDragging = true;
    startPosition = viewer.camera.pickEllipsoid(event.position);
    console.log("Drag Start");
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

// During dragging
handler.setInputAction(function (event) {
    if (isDragging) {
        var endPosition = viewer.camera.pickEllipsoid(event.endPosition);
        if (endPosition) {
            distance = Cesium.Cartesian3.distance(startPosition, endPosition);
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// End dragging
handler.setInputAction(function () {
    if (isDragging) {
        isDragging = false;
        console.log("Drag End");
        getGridInBounds(lwPolylineMap, minmaxcoordinates, distance);
    }
}, Cesium.ScreenSpaceEventType.LEFT_UP);

//camera zooming
viewer.camera.moveEnd.addEventListener(() => {
    updateConsoleValues(viewer, "move");
    getGridInBounds(lwPolylineMap, minmaxcoordinates, 0);
});

//viewer.camera.changed.addEventListener(() => {
//    updateConsoleValues(viewer, "change");
//    getGridInBounds(lwPolylineMap, minmaxcoordinates, 'zoom');
//});







