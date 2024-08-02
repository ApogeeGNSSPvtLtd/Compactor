//var lwPolylineMap = new Map();
//var pointMapInLatLong = new Map();
//var pointMapInUTM = new Map();
//var pointMap = new Map();
//var minmaxcoordinates = {};
//var result = {};
//var origin_X_Min_UTM = 314156.4722717507;
//var origin_X_Max_UTM = 435639.05052392476;
//var origin_Y_Min_UTM = 2959345.060443616;
//var origin_Y_Max_UTM = 3018291.4444603045;
//var n = 10;
////var deltaX = 3000;
////var deltaY = 3000;
//var fixedRows = 50;
//var fixedColumns = 100;
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
//            setView(minmaxcoordinates);
//            getGridInBounds(lwPolylineMap, minmaxcoordinates);
////            createLinesFromDXFData(lineMap);
////            allPoint(minmaxcoordinates);
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
////function createLinesFromDXFData(lineMap) {
////    const parsedLines = parseLineMap(lineMap);
////    parsedLines.forEach(line => {
////        const positions = [];
////        for (let i = 0; i < line.coordinates.length; i += 3) {
////            const easting = line.coordinates[i];
////            const northing = line.coordinates[i + 1];
////            const altitudeUTM = line.coordinates[i + 2];
////            let [lon, lat] = UTMToLatLon(easting, northing);
//////                        console.log(lon + ":" + lat);
////            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, altitudeUTM));
////        }
////
////        viewer.entities.add({
////            polyline: {
////                positions: positions,
////                width: 5,
////                material: Cesium.Color.BLACK
////            }
////        });
////    });
////    // Optionally, zoom to the first polyline
////    if (parsedLines.length > 0) {
////        viewer.zoomTo(viewer.entities);
////    }
////}
////
////function parseLineMap(lineMap) {
////    return lineMap.map(line => {
////        const [name, coords] = line.split('=');
////        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
////        return {
////            name: name,
////            coordinates: points
////        };
////    });
////}
//
//
//function getGridInBounds(lwPolylineMap, minmaxcoordinates) {
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
////        console.log("innerBoundkey : ", innerBoundkey);
//        var deltaX = Math.floor(width);
//        var deltaY = Math.floor(height);
//        if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
////            deltaX = maxEasting - minEasting;
////            deltaY = maxNorthing - minNorthing;
//            deltaX = maxEasting - current_X_Min_UTM;
//            deltaY = maxNorthing - current_Y_Min_UTM;
//        }
//        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
//        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
////        console.log(current_n_res);
////        console.log(current_m_res);
//        var ii = Math.ceil((deltaX / current_n_res)) + i;
//        var jj = Math.ceil((deltaY / current_m_res)) + j;
//        var outerBoundkey = ii + "_" + jj;
////        console.log("outerBoundkey : ", outerBoundkey);
//        var stepX = current_n_res / n;
//        var stepY = current_m_res / n;
//        if (current_n_res >= n || current_m_res >= n) {
//            viewer.entities.removeAll();
////            console.log("innerBoundkey - if: " + innerBoundkey);
////            console.log("outerBoundkey - if: " + outerBoundkey);
//            createPolylineFromDXFData(lwPolylineMap);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
//        } else {
////            viewer.entities.removeAll();
////            ii = Math.ceil((deltaX / 0.25)) + i;
////            jj = Math.ceil((deltaY / 0.25)) + j;
////            outerBoundkey = ii + "_" + jj;
//////            console.log("innerBoundkey - else: " + innerBoundkey);
//////            console.log("outerBoundkey - else: " + outerBoundkey);
////            createPolylineFromDXFData(lwPolylineMap);
////            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, 1, 1);
//        }
//        end_time = performance.now();
//        const executionTimeMs = end_time - start_time;
////        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
//    } else {
////        console.log('Unable to calculate visible bounds.');
//    }
//}
//
//function generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY) {
//    start_time = performance.now();
////    pointMapInLatLong.clear();
//    var [initialRows, initialColumns] = innerBoundkey.split("_");
//    var [endRows, endColumns] = outerBoundkey.split("_");
//    var xxMin = origin_X_Min_UTM + n * initialRows;
//    var yyMin = origin_Y_Min_UTM + n * initialColumns;
//    for (var i = 0; i < endRows - initialRows; i++) {
////        console.log("iiiiiiiiiiiiii" + i);
//        var x_i = xxMin + stepX * n * i;
//        for (var j = 0; j < endColumns - initialColumns; j++) {
////            console.log("jjjjjjjjjjjj" + j);
//            var y_j = yyMin + stepY * n * j;
//            const [lon, lat] = UTMToLatLon(x_i, y_j);
//            var key = i + "_" + j;
////                        if (pointMap.has(key)) {
//            var valueInLatLong = lon + "," + lat;
////                        var valueInUTM = x_i + "," + y_j;
////                        viewer.entities.add({
////                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
////                            point: {
////                                pixelSize: 11,
////                                color: Cesium.Color.BLUE
////                            }
////                        });
//            pointMapInLatLong.set(key, valueInLatLong);
////                        pointMapInUTM.set(key, valueInUTM);
////                        }
//        }
//    }
//
//    console.log("pointMapInLatLong  : ", pointMapInLatLong);
////    console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
////                console.log(pointMapInUTM.size);
//    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
//    end_time = performance.now();
//    const executionTimeMs = end_time - start_time;
////                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
//}
//
//function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
////                createRoadPolygon();
//    var loop_counter = 0;
//    for (let [key, value] of pointMapInLatLong) {
//        var [origin_i, origin_j] = key.split('_');
//        origin_i = parseInt(origin_i);
//        origin_j = parseInt(origin_j);
////                    console.log(origin_i + "_" + origin_j);
//        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
//            continue;
//        }
//        if (origin_i % skipsteps != 0 || origin_j % skipsteps != 0) {
//            continue;
//        }
//        var topLeftKey = origin_i + "_" + (origin_j + skipsteps);
//        var topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
//        var bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
//        var bottomLeftKey = (origin_i) + "_" + (origin_j);
//        var temp = pointMapInLatLong.get(topLeftKey).split(',');
//        const [topLeftLon, topLeftLat] = temp;
//        const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
//        const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
//        const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
//        if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
//            viewer.entities.add({
//                polygon: {
//                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
//                        topLeftLon, topLeftLat,
//                        topRightLon, topRightLat,
//                        bottomRightLon, bottomRightLat,
//                        bottomLeftLon, bottomLeftLat
//                    ]),
//                    material: Cesium.Color.TRANSPARENT,
//                    outline: true,
//                    outlineColor: Cesium.Color.BLACK,
//                    outlineWidth: 0,
//                    height: 0
//                }
//            });
//        }
//        loop_counter++;
//    }
////                console.log("Loop Counter is : " + loop_counter);
//}
//
////function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
////    // Create a color map
////    const colorMap = {
////        0: Cesium.Color.RED,
////        1: Cesium.Color.GREEN,
////        2: Cesium.Color.BLUE,
////        // Add more colors as needed
////        // For example:
////        3: Cesium.Color.YELLOW,
////        4: Cesium.Color.CYAN,
////        // Repeat colors or add more colors if there are more IDs
////    };
////
////    let loop_counter = 0;
////    for (let [key, value] of pointMapInLatLong) {
////        let [origin_i, origin_j] = key.split('_');
////        origin_i = parseInt(origin_i);
////        origin_j = parseInt(origin_j);
////
////        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
////            continue;
////        }
////        if (origin_i % skipsteps !== 0 || origin_j % skipsteps !== 0) {
////            continue;
////        }
////
////        const topLeftKey = origin_i + "_" + (origin_j + skipsteps);
////        const topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
////        const bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
////        const bottomLeftKey = (origin_i) + "_" + (origin_j);
////
////        const temp = pointMapInLatLong.get(topLeftKey).split(',');
////        const [topLeftLon, topLeftLat] = temp;
////        const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
////        const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
////        const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
////
////        if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
////            // Determine the color based on the loop counter or a specific logic
////            const colorKey = Math.floor(loop_counter / 5) % Object.keys(colorMap).length;
////            const polygonColor = colorMap[colorKey];
////
////            viewer.entities.add({
////                polygon: {
////                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
////                        parseFloat(topLeftLon), parseFloat(topLeftLat),
////                        parseFloat(topRightLon), parseFloat(topRightLat),
////                        parseFloat(bottomRightLon), parseFloat(bottomRightLat),
////                        parseFloat(bottomLeftLon), parseFloat(bottomLeftLat)
////                    ]),
////                    material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
////                    outline: true,
////                    outlineColor: Cesium.Color.BLACK,
////                    outlineWidth: 0,
////                    height: 0
////                }
////            });
////        }
////        loop_counter++;
////    }
////}
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
//function createGlobalPointMap() {
//    start_time = performance.now();
//    var n = 1;
////                var Xmin = 732917.3687951488;
////                var Xmax = 735771.0096584512;
////                var Ymin = 3168637.992653215;
////                var Ymax = 3170130.353011305;
//    var deltaXX = Xmax - Xmin;
//    var deltaYY = Ymax - Ymin;
//    var rows = Math.ceil(deltaXX) / n;
//    var columns = Math.ceil(deltaYY) / n;
////                console.log("rows : ", rows);
////                console.log("columns : ", columns);
//    for (var i = 0; i < rows; i++) {
//        for (var j = 0; j < columns; j++) {
//            var key = i + "_" + j;
//            pointMap.set(key, "");
//        }
//    }
////                console.log("length of pointMap", pointMap.size);
//    end_time = performance.now();
//    const executionTimeMs = end_time - start_time;
////                console.log('createGlobalPointMap time:' + executionTimeMs + 'milliseconds');
////                var x_test = origin_X_UTM + n * 236;
////                var y_test = origin_Y_UTM + n * 195;
////                console.log(x_test, y_test);
//}
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
//            const zoomLevel = viewer.camera.getMagnitude() / 100000;
////            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
////            console.log(''Zoom level changed! Current height: ', zoomLevel.toFixed(5));
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
//
//viewer.camera.moveEnd.addEventListener(() => {
//    updateConsoleValues(viewer, "move");
////    console.log(lwPolylineMap);
//    getGridInBounds(lwPolylineMap, minmaxcoordinates);
//});
//
////viewer.camera.changed.addEventListener(() => {
//////    updateConsoleValues(viewer, "change");
////});


//////////////////////////////////////////////----------------------------------------corrected code-------------------------------------------------------/////////////////////////////////////////////////////////

//var lwPolylineMap = new Map();
//var pointMapInLatLong = new Map();
//var pointMapInUTM = new Map();
//var pointMap = new Map();
//var minmaxcoordinates = {};
//var result = {};
////var origin_X_Min_UTM = 314156.4722717507;
////var origin_X_Max_UTM = 435639.05052392476;
////var origin_Y_Min_UTM = 2959345.060443616;
////var origin_Y_Max_UTM = 3018291.4444603045;
//var origin_X_Min_UTM = 0;
//var origin_X_Max_UTM = 0;
//var origin_Y_Min_UTM = 0;
//var origin_Y_Max_UTM = 0;
//var n = 10;
////var deltaX = 3000;
////var deltaY = 3000;
//var fixedRows = 50;
//var fixedColumns = 100;
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
//            console.log(minmaxcoordinates);
//            setView(minmaxcoordinates);
//            getGridInBounds(lwPolylineMap, minmaxcoordinates);
////            createLinesFromDXFData(lineMap);
////            allPoint(minmaxcoordinates);
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
////function createLinesFromDXFData(lineMap) {
////    const parsedLines = parseLineMap(lineMap);
////    parsedLines.forEach(line => {
////        const positions = [];
////        for (let i = 0; i < line.coordinates.length; i += 3) {
////            const easting = line.coordinates[i];
////            const northing = line.coordinates[i + 1];
////            const altitudeUTM = line.coordinates[i + 2];
////            let [lon, lat] = UTMToLatLon(easting, northing);
//////                        console.log(lon + ":" + lat);
////            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, altitudeUTM));
////        }
////
////        viewer.entities.add({
////            polyline: {
////                positions: positions,
////                width: 5,
////                material: Cesium.Color.BLACK
////            }
////        });
////    });
////    // Optionally, zoom to the first polyline
////    if (parsedLines.length > 0) {
////        viewer.zoomTo(viewer.entities);
////    }
////}
////
////function parseLineMap(lineMap) {
////    return lineMap.map(line => {
////        const [name, coords] = line.split('=');
////        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
////        return {
////            name: name,
////            coordinates: points
////        };
////    });
////}
//
//
//function getGridInBounds(lwPolylineMap, minmaxcoordinates) {
////    console.log(lwPolylineMap);
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
////        console.log("innerBoundkey : ", innerBoundkey);
//        var deltaX = Math.floor(width);
//        var deltaY = Math.floor(height);
//        if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
////            deltaX = maxEasting - minEasting;
////            deltaY = maxNorthing - minNorthing;
//            deltaX = maxEasting - current_X_Min_UTM;
//            deltaY = maxNorthing - current_Y_Min_UTM;
//        }
//        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
//        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
////        console.log(current_n_res);
////        console.log(current_m_res);
//        var ii = Math.ceil((deltaX / current_n_res)) + i;
//        var jj = Math.ceil((deltaY / current_m_res)) + j;
//        var outerBoundkey = ii + "_" + jj;
////        console.log("outerBoundkey : ", outerBoundkey);
//        var stepX = current_n_res / n;
//        var stepY = current_m_res / n;
//        if (current_n_res >= n || current_m_res >= n) {
//            viewer.entities.removeAll();
////            console.log("innerBoundkey - if: " + innerBoundkey);
////            console.log("outerBoundkey - if: " + outerBoundkey);
//            createPolylineFromDXFData(lwPolylineMap);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
//        } else {
////            viewer.entities.removeAll();
////            ii = Math.ceil((deltaX / 0.25)) + i;
////            jj = Math.ceil((deltaY / 0.25)) + j;
////            outerBoundkey = ii + "_" + jj;
//////            console.log("innerBoundkey - else: " + innerBoundkey);
//////            console.log("outerBoundkey - else: " + outerBoundkey);
////            createPolylineFromDXFData(lwPolylineMap);
////            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, 1, 1);
//        }
//        end_time = performance.now();
//        const executionTimeMs = end_time - start_time;
////        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
//    } else {
////        console.log('Unable to calculate visible bounds.');
//    }
//}
//
//function generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY) {
//    start_time = performance.now();
////    pointMapInLatLong.clear();
//    var [initialRows, initialColumns] = innerBoundkey.split("_");
//    var [endRows, endColumns] = outerBoundkey.split("_");
//    var xxMin = origin_X_Min_UTM + n * initialRows;
//    var yyMin = origin_Y_Min_UTM + n * initialColumns;
//    for (var i = 0; i < endRows - initialRows; i++) {
////        console.log("iiiiiiiiiiiiii" + i);
//        var x_i = xxMin + stepX * n * i;
//        for (var j = 0; j < endColumns - initialColumns; j++) {
////            console.log("jjjjjjjjjjjj" + j);
//            var y_j = yyMin + stepY * n * j;
//            const [lon, lat] = UTMToLatLon(x_i, y_j);
//            var key = i + "_" + j;
////            console.log(key);
////                        if (pointMap.has(key)) {
//            var valueInLatLong = lon + "," + lat;
////                        var valueInUTM = x_i + "," + y_j;
////                        viewer.entities.add({
////                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
////                            point: {
////                                pixelSize: 11,
////                                color: Cesium.Color.BLUE
////                            }
////                        });
//            pointMapInLatLong.set(key, valueInLatLong);
////                        pointMapInUTM.set(key, valueInUTM);
////                        }
//        }
//    }
//
////    console.log("pointMapInLatLong  : ", pointMapInLatLong);
////    console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
////                console.log(pointMapInUTM.size);
//    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
//    end_time = performance.now();
//    const executionTimeMs = end_time - start_time;
////                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
//}
//
////original
//
////function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
////    // Create a color map
////    const colorMap = {
////        0: Cesium.Color.RED,
////        1: Cesium.Color.GREEN,
////        2: Cesium.Color.BLUE,
////        // Add more colors as needed
////        // For example:
////        3: Cesium.Color.YELLOW,
////        4: Cesium.Color.CYAN,
////        // Repeat colors or add more colors if there are more IDs
////    };
//////                createRoadPolygon();
////    var loop_counter = 0;
////    for (let [key, value] of pointMapInLatLong) {
////        var [origin_i, origin_j] = key.split('_');
////        origin_i = parseInt(origin_i);
////        origin_j = parseInt(origin_j);
//////                    console.log(origin_i + "_" + origin_j);
////        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
////            continue;
////        }
////        if (origin_i % skipsteps != 0 || origin_j % skipsteps != 0) {
////            continue;
////        }
////
////        var bottomLeftKey = (origin_i) + "_" + (origin_j);
////        var topLeftKey = origin_i + "_" + (origin_j + skipsteps);
////        var bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
////        var topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
////
////        const [topLeftLon, topLeftLat] = pointMapInLatLong.get(topLeftKey).split(',');
////        const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
////        const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
////        const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
////        if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
////
////            // Determine the color based on the loop counter or a specific logic
////            const colorKey = Math.floor(loop_counter / 5) % Object.keys(colorMap).length;
////            console.log(Object.keys(colorMap).length);
////            const polygonColor = colorMap[colorKey];
////
////            viewer.entities.add({
////                polygon: {
////                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
////                        topLeftLon, topLeftLat,
////                        topRightLon, topRightLat,
////                        bottomRightLon, bottomRightLat,
////                        bottomLeftLon, bottomLeftLat
////                    ]),
//////                    material: Cesium.Color.TRANSPARENT,
////                    material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
////                    outline: true,
////                    outlineColor: Cesium.Color.BLACK,
////                    outlineWidth: 0,
////                    height: 0
////                }
////            });
////        }
////        loop_counter++;
////    }
//////                console.log("Loop Counter is : " + loop_counter);
////}
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
//            const [topLeftLon, topLeftLat] = pointMapInLatLong.get(topLeftKey).split(',');
//            const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
//            const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
//            const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
//
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
//// Determine the color based on the unique ID
////            const color = Math.floor(uniqueIdCounter / 5) % 2 === 0 ? Cesium.Color.RED : Cesium.Color.BLUE;
//
//            // Create a unique ID for this set of four points and store the keys and color
//            uniqueIdMap.set(uniqueIdCounter, {
//                points: {
//                    topLeft: {lon: parseFloat(topLeftLon), lat: parseFloat(topLeftLat)},
//                    topRight: {lon: parseFloat(topRightLon), lat: parseFloat(topRightLat)},
//                    bottomRight: {lon: parseFloat(bottomRightLon), lat: parseFloat(bottomRightLat)},
//                    bottomLeft: {lon: parseFloat(bottomLeftLon), lat: parseFloat(bottomLeftLat)}
//                },
////                color: polygonColor
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
//
////    let delay = 100; // 1000 milliseconds = 1 second
////    uniqueIdMap.forEach((value, uniqueId) => {
////        setTimeout(() => {
////            const points = value.points;
////            const polygonColor = value.color;
////
////            viewer.entities.add({
////                polygon: {
////                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
////                        points.topLeft.lon, points.topLeft.lat,
////                        points.topRight.lon, points.topRight.lat,
////                        points.bottomRight.lon, points.bottomRight.lat,
////                        points.bottomLeft.lon, points.bottomLeft.lat
////                    ]),
////                    material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
////                    outline: false,
////                    outlineColor: Cesium.Color.BLACK,
////                    outlineWidth: 0,
////                    height: 0
////                }
////            });
////        }, delay * uniqueId); // Increment the delay for each uniqueId
////    });
//
////    async function plotPolygons() {
////        const delay = 100; // 10 milliseconds between each set of polygons
////
////        for (let [uniqueId, value] of uniqueIdMap.entries()) {
////            const points = value.points;
////            const polygonColor = value.color;
////
////            viewer.entities.add({
////                polygon: {
////                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
////                        points.topLeft.lon, points.topLeft.lat,
////                        points.topRight.lon, points.topRight.lat,
////                        points.bottomRight.lon, points.bottomRight.lat,
////                        points.bottomLeft.lon, points.bottomLeft.lat
////                    ]),
////                    material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
////                    outline: false,
////                    outlineColor: Cesium.Color.BLACK,
////                    outlineWidth: 0,
////                    height: 0
////                }
////            });
////
////            if ((uniqueId + 1) % 5 === 0) {
////                await new Promise(resolve => setTimeout(resolve, delay));
////            }
////        }
////    }
////    plotPolygons();
//
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
//function createGlobalPointMap() {
//    start_time = performance.now();
//    var n = 1;
////                var Xmin = 732917.3687951488;
////                var Xmax = 735771.0096584512;
////                var Ymin = 3168637.992653215;
////                var Ymax = 3170130.353011305;
//    var deltaXX = Xmax - Xmin;
//    var deltaYY = Ymax - Ymin;
//    var rows = Math.ceil(deltaXX) / n;
//    var columns = Math.ceil(deltaYY) / n;
////                console.log("rows : ", rows);
////                console.log("columns : ", columns);
//    for (var i = 0; i < rows; i++) {
//        for (var j = 0; j < columns; j++) {
//            var key = i + "_" + j;
//            pointMap.set(key, "");
//        }
//    }
////                console.log("length of pointMap", pointMap.size);
//    end_time = performance.now();
//    const executionTimeMs = end_time - start_time;
////                console.log('createGlobalPointMap time:' + executionTimeMs + 'milliseconds');
////                var x_test = origin_X_UTM + n * 236;
////                var y_test = origin_Y_UTM + n * 195;
////                console.log(x_test, y_test);
//}
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
//            const zoomLevel = viewer.camera.getMagnitude() / 100000;
////            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
////            console.log(''Zoom level changed! Current height: ', zoomLevel.toFixed(5));
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
////function ss() {
////    const [lon, lat] = UTMToLatLon(340731.416740272, 3008387.4771115);
////    console.log(lon, lat);
////}
////ss();
//
//function latLonToUTM(lat, lon) {
//    return proj4(WGS84, UTM43N, [lon, lat]);
//}
//
//function UTMToLatLon(easting, northing) {
//    return proj4(UTM43N, WGS84, [easting, northing]);
//}
//
//viewer.camera.moveEnd.addEventListener(() => {
//    updateConsoleValues(viewer, "move");
////    console.log(lwPolylineMap);
////    viewer.entities.removeAll();
//    getGridInBounds(lwPolylineMap, minmaxcoordinates);
//});
//
////viewer.camera.changed.addEventListener(() => {
//////    updateConsoleValues(viewer, "change");
////    viewer.entities.removeAll();
////    getGridInBounds(lwPolylineMap, minmaxcoordinates);
////});




///////////////////////////////////////---------22/07/2024-------------////////////////////////////////////////////////////////////////////

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
//var deltaX = 3000;
//var deltaY = 3000;
var fixedRows = 50;
var fixedColumns = 100;

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
            getGridInBounds(lwPolylineMap, minmaxcoordinates);
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

function getGridInBounds(lwPolylineMap, minmaxcoordinates) {
//    console.log(lwPolylineMap);
    start_time = performance.now();
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
//        console.log("innerBoundkey : ", innerBoundkey);
        var deltaX = Math.floor(width);
        var deltaY = Math.floor(height);
        if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
//            deltaX = maxEasting - minEasting;
//            deltaY = maxNorthing - minNorthing;
            deltaX = maxEasting - current_X_Min_UTM;
            deltaY = maxNorthing - current_Y_Min_UTM;
        }
        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
//        console.log(current_n_res);
//        console.log(current_m_res);
        var ii = Math.ceil((deltaX / current_n_res)) + i;
        var jj = Math.ceil((deltaY / current_m_res)) + j;
        var outerBoundkey = ii + "_" + jj;
//        console.log("outerBoundkey : ", outerBoundkey);

        var stepX = current_n_res / n;
        var stepY = current_m_res / n;
        if (current_n_res >= n || current_m_res >= n) {
            viewer.entities.removeAll();
            var result = generateDataSameAPI(innerBoundkey, outerBoundkey, n, deltaX, deltaY);
            console.log("jsonObjecttttttttttttt : " + console.log(JSON.stringify(result)));
            createPolylineFromDXFData(lwPolylineMap);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
            generateStaticGridVertexes(result, n, innerBoundkey, outerBoundkey);
        } else {
//            viewer.entities.removeAll();
//            ii = Math.ceil((deltaX / 0.25)) + i;
//            jj = Math.ceil((deltaY / 0.25)) + j;
//            outerBoundkey = ii + "_" + jj;
////            console.log("innerBoundkey - else: " + innerBoundkey);
////            console.log("outerBoundkey - else: " + outerBoundkey);
//            createPolylineFromDXFData(lwPolylineMap);
//            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, 1, 1);
        }
        end_time = performance.now();
        const executionTimeMs = end_time - start_time;
//        console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
    } else {
//        console.log('Unable to calculate visible bounds.');
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
//            var colorIndex = valuesList[0];
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


//            jsonObject[key] = valuesList; // Set the key-value pair in the map
            var x_i = xxMin + stepX * n * i;
            var y_j = yyMin + stepY * n * j;
            const [lon, lat] = UTMToLatLon(x_i, y_j);
//            var valueInLatLong = lon + "," + lat + "," + polygonColor;
            var valueInLatLong = lon + "," + lat;
            var key1 = i + "_" + j;
            pointMapInLatLong.set(key1, valueInLatLong);
        }
    }

//    pointMapInLatLong.clear();

//    for (var i = 0; i < endRows - initialRows; i++) {
////        console.log("iiiiiiiiiiiiii" + i);
//        var x_i = xxMin + stepX * n * i;
//        for (var j = 0; j < endColumns - initialColumns; j++) {
////            console.log("jjjjjjjjjjjj" + j);
//            var y_j = yyMin + stepY * n * j;
//            const [lon, lat] = UTMToLatLon(x_i, y_j);
//            var key = i + "_" + j;
////            console.log(key);
////                        if (pointMap.has(key)) {
////            var valueInLatLong = lon + "," + lat;
////                        var valueInUTM = x_i + "," + y_j;
////                        viewer.entities.add({
////                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
////                            point: {
////                                pixelSize: 11,
////                                color: Cesium.Color.BLUE
////                            }
////                        });
////            pointMapInLatLong.set(key, valueInLatLong);
////                        pointMapInUTM.set(key, valueInUTM);
////                        }
//        }
//    }

    console.log("pointMapInLatLong  : ", pointMapInLatLong);
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
//        console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv" + value.split(","));
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

//            const [topLeftLon, topLeftLat] = pointMapInLatLong.get(topLeftKey).split(',');
//            const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
//            const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
//            const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');

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
//                color: polygonColor
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

function createGlobalPointMap() {
    start_time = performance.now();
    var n = 1;
//                var Xmin = 732917.3687951488;
//                var Xmax = 735771.0096584512;
//                var Ymin = 3168637.992653215;
//                var Ymax = 3170130.353011305;
    var deltaXX = Xmax - Xmin;
    var deltaYY = Ymax - Ymin;
    var rows = Math.ceil(deltaXX) / n;
    var columns = Math.ceil(deltaYY) / n;
//                console.log("rows : ", rows);
//                console.log("columns : ", columns);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var key = i + "_" + j;
            pointMap.set(key, "");
        }
    }
//                console.log("length of pointMap", pointMap.size);
    end_time = performance.now();
    const executionTimeMs = end_time - start_time;
//                console.log('createGlobalPointMap time:' + executionTimeMs + 'milliseconds');
//                var x_test = origin_X_UTM + n * 236;
//                var y_test = origin_Y_UTM + n * 195;
//                console.log(x_test, y_test);
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
            const zoomLevel = viewer.camera.getMagnitude() / 100000;
//            console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
//            console.log(''Zoom level changed! Current height: ', zoomLevel.toFixed(5));
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

//function ss() {
//    const [lon, lat] = UTMToLatLon(340731.416740272, 3008387.4771115);
//    console.log(lon, lat);
//}
//ss();

function latLonToUTM(lat, lon) {
    return proj4(WGS84, UTM43N, [lon, lat]);
}

function UTMToLatLon(easting, northing) {
    return proj4(UTM43N, WGS84, [easting, northing]);
}

viewer.camera.moveEnd.addEventListener(() => {
    updateConsoleValues(viewer, "move");
//    console.log(lwPolylineMap);
//    viewer.entities.removeAll();
    getGridInBounds(lwPolylineMap, minmaxcoordinates);
});

//viewer.camera.changed.addEventListener(() => {
////    updateConsoleValues(viewer, "change");
//    viewer.entities.removeAll();
//    getGridInBounds(lwPolylineMap, minmaxcoordinates);
//});















