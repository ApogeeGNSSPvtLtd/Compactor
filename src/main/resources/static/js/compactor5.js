const proj4 = window.proj4;
const WGS84 = 'EPSG:4326';
const UTM43N = '+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs';
var lwPolylineMap = new Map();
var minmaxcoordinates = {};
var pointMapInLatLong = new Map();
var pointMapInUTM = new Map();
var result = {};
var origin_X_Min_UTM = 0;
//var origin_X_Max_UTM = 0;
var origin_Y_Min_UTM = 0;
//var origin_Y_Max_UTM = 0;
var fixedRows = 50;
var fixedColumns = 100;
var minCameraHeight = 30;
var numberOfBands = 7;
var bands = [];
var currentBandIndex = -1;
var min_reo_flag = true;
var isDragging = false;
var startPosition;
var distance = 0;
let updateConsoleTimeout = null;
let uniqueIdMap = new Map();

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWQwMTQwMC1jNGI1LTRjNTktODhmNC03M2FjZTk2ODgwNWEiLCJpZCI6MjIwODM3LCJpYXQiOjE3MTc3NTM2ODV9.NXbyoMbAMkBlp2Hs8nsqnvHOL0wh7mxkVKc5xxpaHGs';
const viewer = new Cesium.Viewer('cesiumContainer',
        {
            projectionPicker: true,
            mapProjection: new Cesium.WebMercatorProjection(),
            sceneMode: Cesium.SceneMode.SCENE2D
        });

$(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Compactor/dxfdata",
        dataType: "json",
        success: function (response) {
            let minMaxValues = response.minMaxValues;
            lwPolylineMap = response.lwPolyline_map;
            minmaxcoordinates = getminMaxValuesOfDXF(minMaxValues);
            seveneBands();
            setView(minmaxcoordinates);
            getGridInBounds(lwPolylineMap, minmaxcoordinates);
        },
        error: function (error) {
//            console.error(error);
            alert("Error fetching dxf data : " + error);
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
    origin_X_Min_UTM = Math.floor(minEasting);
//    origin_X_Max_UTM = maxEasting;
    origin_Y_Min_UTM = Math.floor(minNorthing);
//    origin_Y_Max_UTM = maxNorthing;
    return minmaxcoordinates;
}

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

function seveneBands() {
    var arr = [];
    var value = minCameraHeight;
    for (var i = 1; i <= numberOfBands; i++) {
        arr.push(value);
        value = value * 2;
    }
    for (var i = arr.length - 2; i >= 0; i--) {
        bands.push([arr[i + 1], arr[i]]);
    }
    var drag_drop_val = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];
    for (var i = 0; i < bands.length; i++) {
        bands[i][2] = drag_drop_val[i];
    }
//    console.log("bands:", bands);
}

function getGridInBounds(lwPolylineMap, minmaxcoordinates, current_dragdrop_distance) {
    start_time = performance.now();
    var n = 0.25;
    const currentCameraHeight = viewer.camera.positionCartographic.height;
//    console.log("currentCameraHeight : " + currentCameraHeight);
    if (currentCameraHeight <= 1800) {
        const [newBandIndex, band_dragdrop_distance] = getCurrentBandIndex(currentCameraHeight);
        if (newBandIndex !== currentBandIndex || current_dragdrop_distance >= band_dragdrop_distance) {
            currentBandIndex = newBandIndex;

            if (current_dragdrop_distance === 0 || current_dragdrop_distance === undefined) {
                if (current_dragdrop_distance === undefined) {
                    current_dragdrop_distance = 0;
                }
//                console.log('Zoom action detected :: ' + current_dragdrop_distance);
            } else {
//                console.log('Drag and drop action detected :: ' + current_dragdrop_distance);
            }

            result = calculateVisibleBounds(viewer);
            if (result) {
                var {utmBounds, width, height} = result;
//                var minEasting = minmaxcoordinates.minEasting;
//                var minNorthing = minmaxcoordinates.minNorthing;
//                var maxEasting = minmaxcoordinates.maxEasting;
//                var maxNorthing = minmaxcoordinates.maxNorthing;

                var current_X_Min_UTM = utmBounds.west; // current minEasting
                var current_Y_Min_UTM = utmBounds.south; //current minNorthing
                var current_X_Max_UTM = utmBounds.east; //current maxEasting
                var current_Y_Max_UTM = utmBounds.north; //current maxNorthing
//                console.log("utmBounds : " + JSON.stringify(utmBounds, null, 2));
//                if (current_X_Min_UTM <= minEasting || current_Y_Min_UTM <= minNorthing) {
//                    current_X_Min_UTM = minEasting;
//                    current_Y_Min_UTM = minNorthing;
//                }
                var dx = origin_X_Min_UTM - current_X_Min_UTM;
                var dy = origin_Y_Min_UTM - current_Y_Min_UTM;
                var i = Math.floor(Math.abs(dx) / n);
                var j = Math.floor(Math.abs(dy) / n);
                var innerBoundkey = i + "_" + j;
//                console.log("innerBoundkey : " + innerBoundkey);
//                var deltaX = Math.floor(width);
//                var deltaY = Math.floor(height);
//                console.log("deltaX1: " + deltaX);
//                console.log("deltaY1: " + deltaY);
                var deltaX = Math.floor(current_X_Max_UTM - current_X_Min_UTM);
                var deltaY = Math.floor(current_Y_Max_UTM - current_Y_Min_UTM);
//                console.log("deltaX2: " + deltaX);
//                console.log("deltaY2: " + deltaY);
//                if (current_X_Max_UTM >= maxEasting || current_Y_Max_UTM >= maxNorthing) {
//                    deltaX = maxEasting - current_X_Min_UTM;
//                    deltaY = maxNorthing - current_Y_Min_UTM;
//                }
                var current_n_res = roundToNearestQuarter(deltaX / fixedColumns);
                var current_m_res = roundToNearestQuarter(deltaY / fixedRows);
//                var ii = Math.ceil((deltaX / current_n_res)) + i;
//                var jj = Math.ceil((deltaY / current_m_res)) + j;
                var ii = Math.ceil((deltaX / n)) + i;
                var jj = Math.ceil((deltaY / n)) + j;
                var outerBoundkey = ii + "_" + jj;
//                console.log("outerBoundkey : " + outerBoundkey);
                var stepX = current_n_res / n;
                var stepY = current_m_res / n;
                if (current_n_res !== n && current_m_res !== n) {
                    min_reo_flag = true;
                }
                if (current_n_res >= n && current_m_res >= n && min_reo_flag) {
                    if (current_n_res === n && current_m_res === n) {
                        min_reo_flag = false;
                    }
                    viewer.entities.removeAll();
                    createPolylineFromDXFData(lwPolylineMap);
                    var [initialRows, initialColumns] = innerBoundkey.split("_");
                    var [endRows, endColumns] = outerBoundkey.split("_");
//                    var xxMin = origin_X_Min_UTM + n * initialRows;
//                    var yyMin = origin_Y_Min_UTM + n * initialColumns;
//                    var xxMax = origin_X_Min_UTM + n * endRows;
//                    var yyMax = origin_Y_Min_UTM + n * endColumns;

                    pointMapInUTM.clear();
                    uniqueIdMap.clear();
//                    console.log("Before pointMapInUTM : " + pointMapInUTM.size);
//                    console.log("Before uniqueIdMap : " + uniqueIdMap.size);
                    callapi(origin_X_Min_UTM, origin_Y_Min_UTM, current_X_Min_UTM, current_Y_Min_UTM, current_X_Max_UTM, current_Y_Max_UTM)
                            .then(gridData => {
//                                    console.log("API Response:", gridData);

                                const steps = gridData.steps;
                                console.log("steps ::  " + steps);

                                Object.keys(gridData.grid).forEach(key => {
                                    const value = gridData.grid[key];
                                    const splitValues = value.split(',').map(item => item.trim());
//                                    const [lon, lat] = UTMToLatLon(parseInt(splitValues[0]), parseInt(splitValues[1]));
//                                    viewer.entities.add({
//                                        position: Cesium.Cartesian3.fromDegrees(lon, lat),
//                                        point: {
//                                            pixelSize: 11,
//                                            color: Cesium.Color.BLUE
//                                        }
//                                    });
//                                        var valueInLatLong = lon + "," + lat;
                                    var valueInUTM = splitValues[0] + "," + splitValues[1] + "," + splitValues[2];
//                                        pointMapInLatLong.set(key, valueInLatLong);
                                    pointMapInUTM.set(key, valueInUTM);
                                });
                                generateGridCells(pointMapInUTM, endRows - initialRows, endColumns - initialColumns, steps);
                            })
                            .catch(error => {
                                console.error("API Error:", error);
                            });

//                    console.log("After pointMapInUTM : " + pointMapInUTM.size);
//                console.log("pointMapInUTM : ", pointMapInUTM);
//                    generateGridCells(pointMapInUTM, endRows - initialRows, endColumns - initialColumns);

                } else {
//                    console.log("resolution < 0.25 : grid not updated");
                }
                end_time = performance.now();
                const executionTimeMs = end_time - start_time;
//                console.log('getGridInBounds time:' + executionTimeMs + 'milliseconds');
            }
        } else {
//            console.log("inside same band : grid not updated");
        }
    } else {
        const [newBandIndex] = getCurrentBandIndex(currentCameraHeight);
        currentBandIndex = newBandIndex;
        viewer.entities.removeAll();
        createPolylineFromDXFData(lwPolylineMap);
//                console.log("height > 1800 : grid not generated");
    }
}

function generateGridCells(pointMapUTM, rows, columns, steps) {
//    viewer.entities.removeAll();
    // Map to store unique IDs with corresponding points and color for each set of four points
//    uniqueIdMap.clear();
    let uniqueIdCounter = 0;
//    let x_skip = 148;
//    let y_skip = 126;

    // Loop through the pointMapUTM to generate polygons

    for (let [key, value] of pointMapUTM) {
        let [xUTM, yUTM, colorIndex] = value.split(",");
        xUTM = parseFloat(xUTM);
        yUTM = parseFloat(yUTM);
//        console.log("colourcode: " + colorIndex);

        let bottomLeftUTM = [xUTM, yUTM];
        let topLeftUTM = [xUTM, yUTM + (steps * 0.25)];
        let bottomRightUTM = [xUTM + (steps * 0.25), yUTM];
        let topRightUTM = [xUTM + (steps * 0.25), yUTM + (steps * 0.25)];

        // Convert UTM to Latitude and Longitude
        const [bottomLeftX, bottomLeftY] = UTMToLatLon(bottomLeftUTM[0], bottomLeftUTM[1]);
        const [topLeftX, topLeftY] = UTMToLatLon(topLeftUTM[0], topLeftUTM[1]);
        const [bottomRightX, bottomRightY] = UTMToLatLon(bottomRightUTM[0], bottomRightUTM[1]);
        const [topRightX, topRightY] = UTMToLatLon(topRightUTM[0], topRightUTM[1]);

        // Determine the color based on the unique ID
//        const colorIndex = Math.floor(uniqueIdCounter / 5) % 5;
        let polygonColor;
        switch (parseInt(colorIndex)) {
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
                polygonColor = Cesium.Color.BLACK;
                break;
            case 5:
                polygonColor = Cesium.Color.BLUE;
                break;
            case 6:
                polygonColor = Cesium.Color.RED;
                break;
            case 7:
                polygonColor = Cesium.Color.YELLOW;
                break;
            case 8:
                polygonColor = Cesium.Color.GREEN;
                break;
            case 9:
                polygonColor = Cesium.Color.BLACK;
                break;
            default:
                polygonColor = Cesium.Color.CYAN;
                break;
        }

        // Create a unique ID for this set of four points and store the keys and color
        uniqueIdMap.set(uniqueIdCounter, {
            points: {
                topLeft: {lon: topLeftX, lat: topLeftY},
                topRight: {lon: topRightX, lat: topRightY},
                bottomRight: {lon: bottomRightX, lat: bottomRightY},
                bottomLeft: {lon: bottomLeftX, lat: bottomLeftY}
            },
            color: polygonColor
        });
        uniqueIdCounter++;
    }

    // Now create polygons using the uniqueIdMap
    uniqueIdMap.forEach((value) => {
        const points = value.points;
        const polygonColor = value.color;

        viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    points.bottomLeft.lon, points.bottomLeft.lat,
                    points.bottomRight.lon, points.bottomRight.lat,
                    points.topRight.lon, points.topRight.lat,
                    points.topLeft.lon, points.topLeft.lat
                ]),
//                material: Cesium.Color.TRANSPARENT,
                material: polygonColor.withAlpha(0.5), // Adjust transparency as needed
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1, // Set a non-zero width for visibility
                height: 0
            }
        });
    });
//    console.log("After uniqueIdMap : " + uniqueIdMap.size);
//    console.log("Unique ID Map:", uniqueIdMap);
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

function getCurrentBandIndex(height) {
    var intheight = parseInt(height);
//    console.log("height : " + intheight);
    for (var i = 0; i < bands.length; i++) {
        if (intheight <= bands[i][0] && intheight >= bands[i][1]) {
            return [i, bands[i][2]];
        }
    }
    return [-1];
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

function callapi(origin_X_Min_UTM, origin_Y_Min_UTM, xxMin, yyMin, xxMax, yyMax) {
    var x_min_y_min = [origin_X_Min_UTM, origin_Y_Min_UTM];
    var innerBounds = [xxMin, yyMin];
    var outerBounds = [xxMax, yyMax];
    var dataobj = {
        origin: x_min_y_min,
        innerBounds: innerBounds,
        outerBounds: outerBounds
    };
//    console.log("dataobj:", JSON.stringify(dataobj, null, 2));
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://192.168.29.21:8091/app/getGridInfo",
            data: JSON.stringify(dataobj),
            success: function (response) {
//                console.log(response);
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                reject(error);
            }
        });
    });
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

////drag and drop
//var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//// Start dragging
//handler.setInputAction(function (event) {
////    console.log("Event:", JSON.stringify(event));
//    isDragging = true;
//    startPosition = viewer.camera.pickEllipsoid(event.position);
////    console.log("Drag Start");
//}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
//
//// During dragging
//handler.setInputAction(function (event) {
//    if (isDragging) {
//        var endPosition = viewer.camera.pickEllipsoid(event.endPosition);
//        if (endPosition) {
//            distance = Cesium.Cartesian3.distance(startPosition, endPosition);
//        }
//    }
//}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//
//// End dragging
//handler.setInputAction(function () {
//    if (isDragging) {
//        isDragging = false;
////        console.log("Drag End");
//        getGridInBounds(lwPolylineMap, minmaxcoordinates, distance);
//    }
//}, Cesium.ScreenSpaceEventType.LEFT_UP);

//camera zooming
viewer.camera.moveEnd.addEventListener(() => {
//    updateConsoleValues(viewer, "move");
    getGridInBounds(lwPolylineMap, minmaxcoordinates, 0);
});

//viewer.camera.changed.addEventListener(() => {
//    updateConsoleValues(viewer, "change");
//    getGridInBounds(lwPolylineMap, minmaxcoordinates, 'zoom');
//});