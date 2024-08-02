<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Cesium Viewer</title>
        <script src="https://cesium.com/downloads/cesiumjs/releases/1.118/Build/Cesium/Cesium.js"></script>
        <link href="https://cesium.com/downloads/cesiumjs/releases/1.118/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.5/proj4.js"></script>
    </head>
    <body>

        <div id="cesiumContainer">     
<!--            <button type="submit" onclick="generateStaticGridVertexes()">Show Grids</button>
            <button type="submit" onclick="mergeGrid()">Merge Grid</button>
            <button type="submit" onclick="splitGrid()">Split Grid</button>
            <button type="submit" onclick="getDXFData()">get DXF Data</button>-->
        </div>
        <!--        <script>
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
                    function getDXFData() {
                        $.ajax({
                            type: "GET",
                            url: "http://localhost:8080/Compactor/dxfdata",
                            dataType: "json",
                            success: function (response) {
        //                        console.log(response);
                                let lineMap = response.line_map;
                                let lwPolylineMap = response.lwPolyline_map;
                                let minMaxValues = response.minMaxValues;
                                getminMaxValuesOfDXF(minMaxValues);
        //                        createLinesFromDXFData(lineMap);
                                createPolylineFromDXFData(lwPolylineMap);
        
                            },
                            error: function (error) {
                                console.error(error);
                                alert("Error fetching user data");
                            }
                        });
                    }
        
        
                    var minmaxcoordinates = {};
                    function getminMaxValuesOfDXF(minMaxValues) {
                        minMaxValues.forEach(item => {
                            const [key, value] = item.split('=');
                            minmaxcoordinates[key] = parseFloat(value);
                        });
        
                        const minEasting = minmaxcoordinates.minEasting;
                        const maxEasting = minmaxcoordinates.maxEasting;
                        const minNorthing = minmaxcoordinates.minNorthing;
                        const maxNorthing = minmaxcoordinates.maxNorthing;
        //                console.log(minmaxcoordinates.minEasting);
        //                
        //                const [xMin, yMin] = UTMToLatLon(minEasting, minNorthing);
        //                const [xMax, yMax] = UTMToLatLon(maxEasting, maxNorthing);
                    }
                    console.log(minmaxcoordinates.minEasting);
        
                    const [xMin, yMin] = UTMToLatLon(340720.294745321, 2982771.25387919);
                    const [xMax, yMax] = UTMToLatLon(400170.1032381087, 3008426.968591016);
        //            console.log(xMin + " " + xMax);
        //            console.log(yMin + " " + yMax);
        
                    var origin_X_Min_UTM = 314156.4722717507;
                    var origin_X_Max_UTM = 435639.05052392476;
                    var origin_Y_Min_UTM = 2959345.060443616;
                    var origin_Y_Max_UTM = 3018291.4444603045;
                    var pointMap = new Map();
                    var result = {};
                    var pointMapInLatLong = new Map();
                    var pointMapInUTM = new Map();
                    var deltaX = 3000;
                    var deltaY = 3000;
                    var n = 10;
                    var fixedRows = 50;
                    var fixedColumns = 100;
                    viewer.camera.setView(
                            {
                                destination: Cesium.Rectangle.fromDegrees(xMin, yMin, xMax, yMax),
                                orientation: {
                                    heading: 0.0,
                                    pitch: -45.0,
                                    roll: 0.0
                                }
                            });
                    // Function to calculate the visible area in square meters, width, and height
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
        //                        const zoomLevel = viewer.camera.getMagnitude() / 100000; 
        //                        console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
        //                        console.log(''Zoom level changed! Current height: ', zoomLevel.toFixed(5));
        //                        console.log('Visible Area (sq meters):', area.toFixed(2));
        //                        console.log('Visible Width (meters):', width.toFixed(2));
        //                        console.log('Visible Height (meters):', height.toFixed(2));
        //                        console.log('Visible LatLong Bounds:', bounds);
        //                        console.log('Visible UTM Bounds:', utmBounds);
        //                        console.log('SCENEDs: ', SCENEDs);
        //                        console.log("camera : ", camera);
                            } else {
        //                        console.log('Unable to calculate visible bounds.');
                            }
                        }, 500);
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
        //            createGlobalPointMap();
        
                    function getGridInBounds() {
                        start_time = performance.now();
                        viewer.entities.removeAll();
                        var n = 0.25;
                        result = calculateVisibleBounds(viewer);
                        if (result) {
                            var {utmBounds, width, height} = result;
        //                    var origin_Delta_X = origin_X_Max_UTM - origin_X_Min_UTM;
        //                    var origin_Delta_Y = origin_Y_Max_UTM - origin_Y_Min_UTM;
        
        //                    var origin_n_res = Math.ceil((origin_Delta_X / fixedRows) / 0.25);
        //                    var origin_m_res = Math.ceil((origin_Delta_Y / fixedColumns) / 0.25);
        //                    var origin_n_res = roundToNearestQuarter((origin_Delta_X / fixedRows) / 0.25);
        //                    var origin_m_res = roundToNearestQuarter((origin_Delta_Y / fixedColumns) / 0.25);
        
        //                    console.log(origin_n_res);
        //                    console.log(origin_m_res);
        
                            var current_X_Min_UTM = utmBounds.west;
                            var current_Y_Min_UTM = utmBounds.south;
        //                    if (origin_X_UTM < current_X_UTM || origin_Y_UTM < current_Y_UTM) {
                            var dx = origin_X_Min_UTM - current_X_Min_UTM;
                            var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
        //                    console.log(dx);
        //                    console.log(dy);
                            var i = Math.floor(Math.abs(dx) / n);
                            var j = Math.floor(Math.abs(dy) / n);
                            var innerBoundkey = i + "_" + j;
        //                    console.log('innerBoundkey : ', innerBoundkey);
                            var deltaX = Math.floor(width);
                            var deltaY = Math.floor(height);
        //                    console.log(deltaX);
        //                    console.log(deltaY);
        
                            var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
                            var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
                            var ii = Math.ceil((deltaX / current_n_res)) + i;
                            var jj = Math.ceil((deltaY / current_m_res)) + j;
                            var outerBoundkey = ii + "_" + jj;
        //                    console.log("outerBoundkey : ", outerBoundkey);
                            var stepX = current_n_res / n;
                            var stepY = current_m_res / n;
        //                    console.log(stepX);
        //                    console.log(stepY);
                            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
        //                    }
                            end_time = performance.now();
                            const executionTimeMs = end_time - start_time;
        //                    console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
                        } else {
        //                        console.log('Unable to calculate visible bounds.');
                        }
                    }
        
                    function generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY) {
                        start_time = performance.now();
                        var [initialRows, initialColumns] = innerBoundkey.split("_");
                        var [endRows, endColumns] = outerBoundkey.split("_");
                        var xxMin = origin_X_Min_UTM + n * initialRows;
                        var yyMin = origin_Y_Min_UTM + n * initialColumns;
                        for (var i = 0; i < endRows - initialRows; i++) {
        //                    console.log(i);
                            var x_i = xxMin + stepX * 0.25 * i;
                            for (var j = 0; j < endColumns - initialColumns; j++) {
                                var y_j = yyMin + stepY * 0.25 * j;
                                const [lon, lat] = UTMToLatLon(x_i, y_j);
                                var key = i + "_" + j;
        //                        if (pointMap.has(key)) {
                                var valueInLatLong = lon + "," + lat;
        //                        var valueInUTM = x_i + "," + y_j;
        //                        viewer.entities.add({
        //                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
        //                            point: {
        //                                pixelSize: 11,
        //                                color: Cesium.Color.BLUE
        //                            }
        //                        });
                                pointMapInLatLong.set(key, valueInLatLong);
        //                        pointMapInUTM.set(key, valueInUTM);
        //                        }
                            }
                        }
        //                console.log("pointMapInLatLong.Size : ", pointMapInLatLong);
        //                console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
        //                console.log(pointMapInUTM.size);
                        generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
                        end_time = performance.now();
                        const executionTimeMs = end_time - start_time;
        //                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
                    }
        
                    function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
        //                createRoadPolygon();
                        var loop_counter = 0;
                        for (let [key, value] of pointMapInLatLong) {
                            var [origin_i, origin_j] = key.split('_');
                            origin_i = parseInt(origin_i);
                            origin_j = parseInt(origin_j);
        //                    console.log(origin_i + "_" + origin_j);
                            if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
                                continue;
                            }
                            if (origin_i % skipsteps != 0 || origin_j % skipsteps != 0) {
                                continue;
                            }
                            var topLeftKey = origin_i + "_" + (origin_j + skipsteps);
                            var topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
                            var bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
                            var bottomLeftKey = (origin_i) + "_" + (origin_j);
                            var temp = pointMapInLatLong.get(topLeftKey).split(',');
                            const [topLeftLon, topLeftLat] = temp;
                            const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
                            const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
                            const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
                            if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
                                viewer.entities.add({
                                    polygon: {
                                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                                            topLeftLon, topLeftLat,
                                            topRightLon, topRightLat,
                                            bottomRightLon, bottomRightLat,
                                            bottomLeftLon, bottomLeftLat
                                        ]),
                                        material: Cesium.Color.TRANSPARENT,
                                        outline: true,
                                        outlineColor: Cesium.Color.BLACK,
                                        outlineWidth: 0,
                                        height: 0
                                    }
                                });
                            }
                            loop_counter++;
                        }
        //                console.log("Loop Counter is : " + loop_counter);
                    }
        
                    function allPoint() {
                        var n = 1;
                        var allPointMapInLatLong = new Map();
                        result = calculateVisibleBounds(viewer);
                        if (result) {
                            var {utmBounds, width, height} = result;
                            var current_X_Min_UTM = utmBounds.west;
                            var current_Y_Min_UTM = utmBounds.south;
                            console.log(current_X_Min_UTM);
                            console.log(current_Y_Min_UTM);
                            var dx = origin_X_Min_UTM - current_X_Min_UTM;
                            var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
        //                    console.log(dx);
        //                    console.log(dy);
                            var i = Math.floor(Math.abs(dx) / n);
                            var j = Math.floor(Math.abs(dy) / n);
                            var innerBoundkey = i + "_" + j;
        //                    console.log('innerBoundkey : ', innerBoundkey);
                            var deltaX = Math.floor(width);
                            var deltaY = Math.floor(height);
                            var [initialRows, initialColumns] = innerBoundkey.split("_");
        
                            var ii = Math.ceil((deltaX / n) + i);
                            var jj = Math.ceil((deltaY / n) + j);
                            var outerBoundkey = ii + "_" + jj;
        //                    console.log('outerBoundkey : ', outerBoundkey);
        
                            var [endRows, endColumns] = outerBoundkey.split("_");
                            var xxMin = origin_X_Min_UTM + n * initialRows;
                            var yyMin = origin_Y_Min_UTM + n * initialColumns;
        
                            console.log(endRows - initialRows);
                            console.log(endColumns - initialColumns);
        
        //                    for (var i = 0; i < endRows - initialRows; i++) {
        //                        console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
        //                        var x_i = xxMin + 0.25 * i;
        //                        for (var j = 0; j < endColumns - initialColumns; j++) {
        ////                            console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
        //                            var y_j = yyMin + 0.25 * j;
        //                            const [lon, lat] = UTMToLatLon(x_i, y_j);
        //                            var key = i + "_" + j;
        //                            var valueInLatLong = lon + "," + lat;
        //
        //                            allPointMapInLatLong.set(key, valueInLatLong);
        ////                        }
        //                        }
        //                    }
                            console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
                        } else {
        //                        console.log('Unable to calculate visible bounds.');
                        }
        
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
        
                    //3 Function to create a road polygon with increased width
        //            function createRoadPolygon() {
        //                const roadCoordinates = [
        //                    [77.396, 28.626], [77.397, 28.6262], [77.398, 28.6264],
        //                    [77.399, 28.6266], [77.400, 28.6268], [77.401, 28.6270],
        //                    [77.402, 28.6272], [77.403, 28.6274], [77.404, 28.6276],
        //                    [77.405, 28.6278], [77.406, 28.6280], [77.407, 28.6282],
        //                    [77.408, 28.6284], [77.409, 28.6286], [77.410, 28.6288],
        //                    [77.411, 28.6290], [77.412, 28.6292], [77.413, 28.6294],
        //                    [77.414, 28.6296], [77.415, 28.6298], [77.416, 28.6300],
        //                    [77.417, 28.6302], [77.418, 28.6304], [77.419, 28.6306],
        //                    [77.420, 28.6308], [77.421, 28.6310], [77.422, 28.6312],
        //                    [77.423, 28.6314], [77.424, 28.6316], [77.425, 28.6318],
        //                    [77.426, 28.6320], [77.427, 28.6322], [77.428, 28.6324],
        //                    [77.429, 28.6326], [77.430, 28.6328], [77.431, 28.6330],
        //                    [77.432, 28.6332], [77.433, 28.6334], [77.434, 28.6336],
        //                    [77.435, 28.6338], [77.436, 28.6340], [77.437, 28.6342],
        //                    [77.438, 28.6344], [77.439, 28.6346], [77.440, 28.6348],
        //                    [77.441, 28.6350], [77.442, 28.6352], [77.443, 28.6354]
        //                ];
        //
        //                const width = 0.0001; // Width in degrees
        //
        //                const leftSide = roadCoordinates.map(([lon, lat]) => [lon - width / 2, lat]);
        //                const rightSide = roadCoordinates.map(([lon, lat]) => [lon + width / 2, lat]);
        //
        //                // Combine left and right sides to form the polygon
        //                const roadPolygonCoordinates = [...leftSide, ...rightSide.reverse()];
        //
        //                const hierarchy = roadPolygonCoordinates.flat();
        //
        //                const roadPolygon = viewer.entities.add({
        //                    polygon: {
        //                        hierarchy: Cesium.Cartesian3.fromDegreesArray(hierarchy),
        //                        material: Cesium.Color.BLUE.withAlpha(0.5),
        //                        outline: true,
        //                        outlineColor: Cesium.Color.BLACK,
        //                        height: 0
        //                    }
        //                });
        //
        //                // Zoom to the road polygon
        ////                viewer.zoomTo(roadPolygon);
        //            }
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////// here start reads some files - DXF///////////////////////////////////////////////////////////
        
        //            let polylineCoordinates = [];
        //            function getDXFData() {
        //                $.ajax({
        //                    type: "GET",
        //                    url: "http://localhost:8080/EcomBack/dxfdata",
        //                    dataType: "json",
        //                    success: function (response) {
        //                        console.log(response);
        //                        let lwPolylineMap = response.lwPolyline_map;
        //                        let lineMap = response.line_map;
        //                        console.log(lineMap);
        //                        lineMap
        
        //                        // Iterate through each string in the lwPolyline_map list
        //                        lwPolylineMap.forEach(function (polyline) {
        //                            // Remove the "Pl1_=" part and the brackets, then split by commas
        //                            let cleanedPolyline = polyline.replace("Pl1_=", "").replace(/[\[\]]/g, "");
        //                            let values = cleanedPolyline.split(",");
        //
        //                            // Convert and add each pair of UTM coordinates to the polylineCoordinates array
        //                            for (let i = 0; i < values.length; i += 2) {
        //                                let easting = parseFloat(values[i].trim());
        //                                let northing = parseFloat(values[i + 1].trim());
        //                                let [lon, lat] = UTMToLatLon(easting, northing);
        //                                polylineCoordinates.push(lon, lat);
        //                            }
        //                        });
        //                        createSimplePolyline();
                    // Print the polylineCoordinates array
        //                    },
        //                    error: function (error) {
        //                        console.error(error);
        //                        alert("Error fetching user data");
        //                    }
        //                });
        //            }
        
                    //polyLine
        //            function createSimplePolyline() {
        //                // Create the polyline
        //                const polyline = viewer.entities.add({
        //                    polyline: {
        //                        positions: Cesium.Cartesian3.fromDegreesArray(polylineCoordinates),
        //                        width: 5,
        //                        material: Cesium.Color.BLACK
        //                    }
        //                });
        //                viewer.zoomTo(polyline);
        //                // Optionally, fly to the polyline
        ////                viewer.camera.flyTo({
        ////                    destination: Cesium.Cartesian3.fromDegrees(77.405, 28.630, 1000)
        ////                });
        //            }
        
        
        //            function getDXFData() {
        ////                alert("Hiiiiiiiiiiiii");
        //                $.ajax({
        //                    type: "GET",
        //                    url: "http://localhost:8080/Compactor/dxfdata",
        //                    dataType: "json",
        //                    success: function (response) {
        ////                        console.log(response);
        //                        let lineMap = response.line_map;
        //                        let lwPolylineMap = response.lwPolyline_map;
        ////                        createLinesFromDXFData(lineMap);
        //                        createPolylineFromDXFData(lwPolylineMap);
        //                    },
        //                    error: function (error) {
        //                        console.error(error);
        //                        alert("Error fetching user data");
        //                    }
        //                });
        //            }
        
                    function createLinesFromDXFData(lineMap) {
                        const parsedLines = parseLineMap(lineMap);
                        parsedLines.forEach(line => {
                            const positions = [];
                            for (let i = 0; i < line.coordinates.length; i += 3) {
                                const easting = line.coordinates[i];
                                const northing = line.coordinates[i + 1];
                                const altitudeUTM = line.coordinates[i + 2];
                                let [lon, lat] = UTMToLatLon(easting, northing);
        //                        console.log(lon + ":" + lat);
                                positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, altitudeUTM));
                            }
        
                            viewer.entities.add({
                                polyline: {
                                    positions: positions,
                                    width: 5,
                                    material: Cesium.Color.BLACK
                                }
                            });
                        });
                        // Optionally, zoom to the first polyline
                        if (parsedLines.length > 0) {
                            viewer.zoomTo(viewer.entities);
                        }
                    }
        
                    function parseLineMap(lineMap) {
                        return lineMap.map(line => {
                            const [name, coords] = line.split('=');
                            const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
                            return {
                                name: name,
                                coordinates: points
                            };
                        });
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
        
                    // Proj4 definitions
        //            const proj4 = window.proj4;
        //            const WGS84 = 'EPSG:4326';
        //            const UTM43N = '+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs';
                    function latLonToUTM(lat, lon) {
                        return proj4(WGS84, UTM43N, [lon, lat]);
                    }
        
                    function UTMToLatLon(easting, northing) {
                        return proj4(UTM43N, WGS84, [easting, northing]);
                    }
        
                    viewer.camera.moveEnd.addEventListener(() => {
                        updateConsoleValues(viewer, "move");
        //                createGlobalPointMap();
        //                createRoadPolygon();
        //                getDXFData();
                        getGridInBounds();
                    });
                    viewer.camera.changed.addEventListener(() => {
        //                updateConsoleValues(viewer, "change");
                    });
                    updateConsoleValues(viewer, "start");
        //            getGridInBounds();
        //            createRoadPolygon();
        //            createSimplePolyline();
        //            allPoint();
        //            getDXFData();
        
        
                </script>-->
        <!--<script src="${pageContext.request.contextPath}/static/js/compactor.js"></script>-->
        <script src="${pageContext.request.contextPath}/static/js/compactor4.js"></script>     
    </body>
</html>





<!--var lwPolylineMap = new Map();
$(function () {
    var minmaxcoordinates = {};
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
            setView(minmaxcoordinates);

//            console.log(minmaxcoordinates);
            getGridInBounds(lwPolylineMap);
//            createLinesFromDXFData(lineMap);
//            createPolylineFromDXFData(lwPolylineMap);
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

var origin_X_Min_UTM = 314156.4722717507;
var origin_X_Max_UTM = 435639.05052392476;
var origin_Y_Min_UTM = 2959345.060443616;
var origin_Y_Max_UTM = 3018291.4444603045;
var pointMap = new Map();
var result = {};
var pointMapInLatLong = new Map();
var pointMapInUTM = new Map();
var deltaX = 3000;
var deltaY = 3000;
var n = 10;
var fixedRows = 50;
var fixedColumns = 100;

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

//function createLinesFromDXFData(lineMap) {
//    const parsedLines = parseLineMap(lineMap);
//    parsedLines.forEach(line => {
//        const positions = [];
//        for (let i = 0; i < line.coordinates.length; i += 3) {
//            const easting = line.coordinates[i];
//            const northing = line.coordinates[i + 1];
//            const altitudeUTM = line.coordinates[i + 2];
//            let [lon, lat] = UTMToLatLon(easting, northing);
////                        console.log(lon + ":" + lat);
//            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, altitudeUTM));
//        }
//
//        viewer.entities.add({
//            polyline: {
//                positions: positions,
//                width: 5,
//                material: Cesium.Color.BLACK
//            }
//        });
//    });
//    // Optionally, zoom to the first polyline
//    if (parsedLines.length > 0) {
//        viewer.zoomTo(viewer.entities);
//    }
//}
//
//function parseLineMap(lineMap) {
//    return lineMap.map(line => {
//        const [name, coords] = line.split('=');
//        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
//        return {
//            name: name,
//            coordinates: points
//        };
//    });
//}


function getGridInBounds(lwPolylineMap) {
    start_time = performance.now();
    viewer.entities.removeAll();
    createPolylineFromDXFData(lwPolylineMap);
    var n = 0.25;
    result = calculateVisibleBounds(viewer);
    if (result) {
        var {utmBounds, width, height} = result;
//                    var origin_Delta_X = origin_X_Max_UTM - origin_X_Min_UTM;
//                    var origin_Delta_Y = origin_Y_Max_UTM - origin_Y_Min_UTM;

//                    var origin_n_res = Math.ceil((origin_Delta_X / fixedRows) / 0.25);
//                    var origin_m_res = Math.ceil((origin_Delta_Y / fixedColumns) / 0.25);
//                    var origin_n_res = roundToNearestQuarter((origin_Delta_X / fixedRows) / 0.25);
//                    var origin_m_res = roundToNearestQuarter((origin_Delta_Y / fixedColumns) / 0.25);

//                    console.log(origin_n_res);
//                    console.log(origin_m_res);



        var current_X_Min_UTM = utmBounds.west;
        var current_Y_Min_UTM = utmBounds.south;
//                    if (origin_X_UTM < current_X_UTM || origin_Y_UTM < current_Y_UTM) {
        var dx = origin_X_Min_UTM - current_X_Min_UTM;
        var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
//                    console.log(dx);
//                    console.log(dy);
        var i = Math.floor(Math.abs(dx) / n);
        var j = Math.floor(Math.abs(dy) / n);
        var innerBoundkey = i + "_" + j;
//                    console.log('innerBoundkey : ', innerBoundkey);
        var deltaX = Math.floor(width);
        var deltaY = Math.floor(height);
//                    console.log(deltaX);
//                    console.log(deltaY);

        var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
        var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
        var ii = Math.ceil((deltaX / current_n_res)) + i;
        var jj = Math.ceil((deltaY / current_m_res)) + j;
        var outerBoundkey = ii + "_" + jj;
//                    console.log("outerBoundkey : ", outerBoundkey);
        var stepX = current_n_res / n;
        var stepY = current_m_res / n;
//                    console.log(stepX);
//                    console.log(stepY);
        generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
//                    }
        end_time = performance.now();
        const executionTimeMs = end_time - start_time;
//                    console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
    } else {
//                        console.log('Unable to calculate visible bounds.');
    }
}

function generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY) {
    start_time = performance.now();
    var [initialRows, initialColumns] = innerBoundkey.split("_");
    var [endRows, endColumns] = outerBoundkey.split("_");
    var xxMin = origin_X_Min_UTM + n * initialRows;
    var yyMin = origin_Y_Min_UTM + n * initialColumns;
    for (var i = 0; i < endRows - initialRows; i++) {
//                    console.log(i);
        var x_i = xxMin + stepX * 0.25 * i;
        for (var j = 0; j < endColumns - initialColumns; j++) {
            var y_j = yyMin + stepY * 0.25 * j;
            const [lon, lat] = UTMToLatLon(x_i, y_j);
            var key = i + "_" + j;
//                        if (pointMap.has(key)) {
            var valueInLatLong = lon + "," + lat;
//                        var valueInUTM = x_i + "," + y_j;
//                        viewer.entities.add({
//                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
//                            point: {
//                                pixelSize: 11,
//                                color: Cesium.Color.BLUE
//                            }
//                        });
            pointMapInLatLong.set(key, valueInLatLong);
//                        pointMapInUTM.set(key, valueInUTM);
//                        }
        }
    }
//                console.log("pointMapInLatLong.Size : ", pointMapInLatLong);
//                console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
//                console.log(pointMapInUTM.size);
    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
    end_time = performance.now();
    const executionTimeMs = end_time - start_time;
//                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
}

function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
//                createRoadPolygon();
    var loop_counter = 0;
    for (let [key, value] of pointMapInLatLong) {
        var [origin_i, origin_j] = key.split('_');
        origin_i = parseInt(origin_i);
        origin_j = parseInt(origin_j);
//                    console.log(origin_i + "_" + origin_j);
        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
            continue;
        }
        if (origin_i % skipsteps != 0 || origin_j % skipsteps != 0) {
            continue;
        }
        var topLeftKey = origin_i + "_" + (origin_j + skipsteps);
        var topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
        var bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
        var bottomLeftKey = (origin_i) + "_" + (origin_j);
        var temp = pointMapInLatLong.get(topLeftKey).split(',');
        const [topLeftLon, topLeftLat] = temp;
        const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
        const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
        const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
        if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
            viewer.entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
                        topLeftLon, topLeftLat,
                        topRightLon, topRightLat,
                        bottomRightLon, bottomRightLat,
                        bottomLeftLon, bottomLeftLat
                    ]),
                    material: Cesium.Color.TRANSPARENT,
                    outline: true,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 0,
                    height: 0
                }
            });
        }
        loop_counter++;
    }
//                console.log("Loop Counter is : " + loop_counter);
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
//        console.log("aaaa", minEasting);
//        console.log("aaaa", minNorthing);

        var dx = origin_X_Min_UTM - minEasting;
        var dy = origin_Y_Min_UTM - minNorthing;
//                    console.log(dx);
//                    console.log(dy);
        var i = Math.floor(Math.abs(dx) / n);
        var j = Math.floor(Math.abs(dy) / n);
        var innerBoundkey = i + "_" + j;
//                    console.log('innerBoundkey : ', innerBoundkey);
        var deltaX = Math.floor(width);
        var deltaY = Math.floor(height);
        console.log(deltaX);
        console.log(deltaY);
        var [initialRows, initialColumns] = innerBoundkey.split("_");

        var ii = Math.ceil((deltaX / n) + i);
        var jj = Math.ceil((deltaY / n) + j);
        var outerBoundkey = ii + "_" + jj;
//                    console.log('outerBoundkey : ', outerBoundkey);

        var [endRows, endColumns] = outerBoundkey.split("_");
        var xxMin = origin_X_Min_UTM + n * initialRows;
        var yyMin = origin_Y_Min_UTM + n * initialColumns;

        console.log(endRows - initialRows);
        console.log(endColumns - initialColumns);

        for (var i = 0; i < endRows - initialRows; i++) {
            console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
            var x_i = xxMin + 0.25 * i;
            for (var j = 0; j < endColumns - initialColumns; j++) {
//                          console.log("allPointMapInLatLong : " + allPointMapInLatLong.size);
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
//                        const zoomLevel = viewer.camera.getMagnitude() / 100000; 
//                        console.log('Zoom level changed! Current height: ' + viewer.camera.positionCartographic.height);
//                        console.log(''Zoom level changed! Current height: ', zoomLevel.toFixed(5));
//                        console.log('Visible Area (sq meters):', area.toFixed(2));
//                        console.log('Visible Width (meters):', width.toFixed(2));
//                        console.log('Visible Height (meters):', height.toFixed(2));
//                        console.log('Visible LatLong Bounds:', bounds);
            console.log('Visible UTM Bounds:', utmBounds);
//                        console.log('SCENEDs: ', SCENEDs);
//                        console.log("camera : ", camera);
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
//    console.log(lwPolylineMap);
    getGridInBounds(lwPolylineMap);
});
viewer.camera.changed.addEventListener(() => {
//    updateConsoleValues(viewer, "change");
});
//allPoint();


        -->
        
        
        
<!--        //Important
        
        var lwPolylineMap = new Map();
var pointMapInLatLong = new Map();
var pointMapInUTM = new Map();
var pointMap = new Map();
var minmaxcoordinates = {};
var result = {};
var origin_X_Min_UTM = 314156.4722717507;
var origin_X_Max_UTM = 435639.05052392476;
var origin_Y_Min_UTM = 2959345.060443616;
var origin_Y_Max_UTM = 3018291.4444603045;
var n = 10;
var deltaX = 3000;
var deltaY = 3000;
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

//var origin_X_Min_UTM = 314156.4722717507;
//var origin_X_Max_UTM = 435639.05052392476;
//var origin_Y_Min_UTM = 2959345.060443616;
//var origin_Y_Max_UTM = 3018291.4444603045;
//var pointMap = new Map();
//var result = {};
//var pointMapInLatLong = new Map();
//var pointMapInUTM = new Map();
//var deltaX = 3000;
//var deltaY = 3000;
//var n = 10;
//var fixedRows = 50;
//var fixedColumns = 100;

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

//function createLinesFromDXFData(lineMap) {
//    const parsedLines = parseLineMap(lineMap);
//    parsedLines.forEach(line => {
//        const positions = [];
//        for (let i = 0; i < line.coordinates.length; i += 3) {
//            const easting = line.coordinates[i];
//            const northing = line.coordinates[i + 1];
//            const altitudeUTM = line.coordinates[i + 2];
//            let [lon, lat] = UTMToLatLon(easting, northing);
////                        console.log(lon + ":" + lat);
//            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, altitudeUTM));
//        }
//
//        viewer.entities.add({
//            polyline: {
//                positions: positions,
//                width: 5,
//                material: Cesium.Color.BLACK
//            }
//        });
//    });
//    // Optionally, zoom to the first polyline
//    if (parsedLines.length > 0) {
//        viewer.zoomTo(viewer.entities);
//    }
//}
//
//function parseLineMap(lineMap) {
//    return lineMap.map(line => {
//        const [name, coords] = line.split('=');
//        const points = coords.replace(/[\[\]]/g, '').split(',').map(Number);
//        return {
//            name: name,
//            coordinates: points
//        };
//    });
//}


function getGridInBounds(lwPolylineMap, minmaxcoordinates) {
    start_time = performance.now();
    viewer.entities.removeAll();
    pointMapInLatLong.clear();
    if (pointMapInLatLong.size === 0) {
        createPolylineFromDXFData(lwPolylineMap);
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
                deltaX = maxEasting - minEasting;
                deltaY = maxNorthing - minNorthing;
            }

            var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
            var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
            var ii = Math.ceil((deltaX / current_n_res)) + i;
            var jj = Math.ceil((deltaY / current_m_res)) + j;
            var outerBoundkey = ii + "_" + jj;
//        console.log("outerBoundkey : ", outerBoundkey);
            var stepX = current_n_res / n;
            var stepY = current_m_res / n;

            generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY);
//                    }
            end_time = performance.now();
            const executionTimeMs = end_time - start_time;
//                    console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
        } else {
//                        console.log('Unable to calculate visible bounds.');
        }
    } else {
        console.log("wait==================================");
    }
}

function generateStaticGridVertexes(innerBoundkey, outerBoundkey, n, stepX, stepY) {
    start_time = performance.now();
//    pointMapInLatLong.clear();
    var [initialRows, initialColumns] = innerBoundkey.split("_");
    var [endRows, endColumns] = outerBoundkey.split("_");
    var xxMin = origin_X_Min_UTM + n * initialRows;
    var yyMin = origin_Y_Min_UTM + n * initialColumns;
    for (var i = 0; i < endRows - initialRows; i++) {
        var x_i = xxMin + stepX * 0.25 * i;
        for (var j = 0; j < endColumns - initialColumns; j++) {
            var y_j = yyMin + stepY * 0.25 * j;
            const [lon, lat] = UTMToLatLon(x_i, y_j);
            var key = i + "_" + j;
//                        if (pointMap.has(key)) {
            var valueInLatLong = lon + "," + lat;
//                        var valueInUTM = x_i + "," + y_j;
//                        viewer.entities.add({
//                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
//                            point: {
//                                pixelSize: 11,
//                                color: Cesium.Color.BLUE
//                            }
//                        });
            pointMapInLatLong.set(key, valueInLatLong);
//                        pointMapInUTM.set(key, valueInUTM);
//                        }
        }
    }

//                console.log("pointMapInLatLong.Size : ", pointMapInLatLong);
    console.log("pointMapInLatLong.Size : ", pointMapInLatLong.size);
//                console.log(pointMapInUTM.size);
    generateGridCells(pointMapInLatLong, endRows - initialRows, endColumns - initialColumns, 1);
    end_time = performance.now();
    const executionTimeMs = end_time - start_time;
//                console.log('Method execution time:' + executionTimeMs + 'milliseconds');
}

function generateGridCells(pointMapInLatLong, rows, columns, skipsteps) {
//                createRoadPolygon();
    var loop_counter = 0;
    for (let [key, value] of pointMapInLatLong) {
        var [origin_i, origin_j] = key.split('_');
        origin_i = parseInt(origin_i);
        origin_j = parseInt(origin_j);
//                    console.log(origin_i + "_" + origin_j);
        if (origin_i > (rows - 1 - skipsteps) || origin_j > (columns - 1 - skipsteps)) {
            continue;
        }
        if (origin_i % skipsteps != 0 || origin_j % skipsteps != 0) {
            continue;
        }
        var topLeftKey = origin_i + "_" + (origin_j + skipsteps);
        var topRightKey = (origin_i + skipsteps) + "_" + (origin_j + skipsteps);
        var bottomRightKey = (origin_i + skipsteps) + "_" + (origin_j);
        var bottomLeftKey = (origin_i) + "_" + (origin_j);
        var temp = pointMapInLatLong.get(topLeftKey).split(',');
        const [topLeftLon, topLeftLat] = temp;
        const [topRightLon, topRightLat] = pointMapInLatLong.get(topRightKey).split(',');
        const [bottomRightLon, bottomRightLat] = pointMapInLatLong.get(bottomRightKey).split(',');
        const [bottomLeftLon, bottomLeftLat] = pointMapInLatLong.get(bottomLeftKey).split(',');
        if (topLeftKey && topRightKey && bottomLeftKey && bottomRightKey) {
            viewer.entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
                        topLeftLon, topLeftLat,
                        topRightLon, topRightLat,
                        bottomRightLon, bottomRightLat,
                        bottomLeftLon, bottomLeftLat
                    ]),
                    material: Cesium.Color.TRANSPARENT,
                    outline: true,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 0,
                    height: 0
                }
            });
        }
        loop_counter++;
    }
//                console.log("Loop Counter is : " + loop_counter);
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

function latLonToUTM(lat, lon) {
    return proj4(WGS84, UTM43N, [lon, lat]);
}

function UTMToLatLon(easting, northing) {
    return proj4(UTM43N, WGS84, [easting, northing]);
}

viewer.camera.moveEnd.addEventListener(() => {
    updateConsoleValues(viewer, "move");
//    console.log(lwPolylineMap);
    getGridInBounds(lwPolylineMap, minmaxcoordinates);
});
viewer.camera.changed.addEventListener(() => {
//    updateConsoleValues(viewer, "change");
});-->


        