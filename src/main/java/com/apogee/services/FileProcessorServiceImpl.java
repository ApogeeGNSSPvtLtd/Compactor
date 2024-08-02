/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.services;

import com.apogee.EntityModel.Compaction;
import com.apogee.EntityModel.DummyData;
import com.apogee.controller.FileProcessorController;
import com.apogee.repository.CompactorRepository;
import com.apogee.repository.DummyDataRepository;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author user
 */
@Service
public class FileProcessorServiceImpl implements FileProcessorService {

    @Autowired
    private CompactorRepository compactorRepo;

    public HashMap<String, ArrayList<String>> dataList;

    @Override
    public HashMap<String, ArrayList<String>> fetchDXFDataUsingDXFFile(String filePath) {
        ArrayList<String> tempString = new ArrayList<>();
//        Compaction compaction = new Compaction();

        try ( BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                tempString.add(line);
            }
            dataList = importDxf(tempString);

            //save data in db
//            compaction.setPoint_index("1");
//            compaction.setI("11");
//            compaction.setJ("12");
//            compaction.setTemp("temp");
//            compaction.setVibration("1");
//            compaction.setPass("1");
//            compaction.setDirection("1");
//            compaction.setHeading_angle("1");
//            compaction.setTimes("11");
//            compaction.setSpeed("20");
//            compaction.setCut_fill("2");
//            compaction.setMachine_id("1");
//            compactorRepo.save(compaction);
//      dummyData For Testing

        } catch (IOException e) {
            Logger.getLogger(FileProcessorController.class.getName()).log(Level.SEVERE, "fetchDXFDataUsingDXFFile IOException: " + e.getMessage(), e);
            e.printStackTrace();
        }
        return dataList;
    }

    // Example method to process the imported DXF data
    private HashMap<String, ArrayList<String>> importDxf(ArrayList<String> tempString) {
        // Creating HashMaps with specified types
        HashMap<String, ArrayList<String>> pointMap = new HashMap<>();
        HashMap<String, ArrayList<String>> mtextMap = new HashMap<>();
        HashMap<String, ArrayList<String>> circleMap = new HashMap<>();
        HashMap<String, ArrayList<String>> lineMap = new HashMap<>();
        HashMap<String, ArrayList<String>> arcMap = new HashMap<>();
        HashMap<String, ArrayList<String>> lwpolylineMap = new HashMap<>();
        HashMap<String, ArrayList<ArrayList<String>>> polylineMap = new HashMap<>();
        HashMap<String, ArrayList<ArrayList<String>>> polygonMap = new HashMap<>();

        List<String> entitiesList = new ArrayList<>(Arrays.asList(
                "POINT",
                "TEXT",
                "MTEXT",
                "LINE",
                "ARC",
                "CIRCLE",
                "POLYLINE",
                "LWPOLYLINE",
                "ENDSEC",
                "VERTEX"
        ));

        entitiesList.clear();
        entitiesList.addAll(Arrays.asList(
                "POINT",
                "TEXT",
                "MTEXT",
                "LINE",
                "ARC",
                "CIRCLE",
                "POLYLINE",
                "LWPOLYLINE",
                "ENDSEC",
                "VERTEX"
        ));

        int startCounter = tempString.indexOf("ENTITIES");
        int endCounter = tempString.subList(startCounter, tempString.size() - 1)
                .indexOf("ENDSEC") + startCounter;
//        System.out.println("Start: " + startCounter);
//        System.out.println("End: " + endCounter);

        while (startCounter < endCounter) {
            String currentWord = tempString.get(startCounter);
            if (!entitiesList.contains(currentWord)) {
//                System.out.println("No ");
                startCounter++;
                continue;
            }
            if (currentWord.equals("POINT")) {
                boolean pointLoopFlag = true;
                int pointLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbPoint") + startCounter;
                List<String> tempPointList = new ArrayList<>();
                List<String> pointMatchList = Arrays.asList(" 10", " 20", " 30");
                while (pointLoopFlag) {
                    if (entitiesList.contains(tempString.get(pointLoopCounter + 1))) {
                        String pointPrefix = "Pt_" + (pointMap.size() + 1);
                        pointMap.put(pointPrefix, new ArrayList<>(tempPointList));
                        startCounter = pointLoopCounter;
                        pointLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(pointLoopCounter);
                    if (pointMatchList.contains(currentWordInLoop)) {
                        tempPointList.add(tempString.get(pointLoopCounter + 1));
                        pointLoopCounter += 1;
                        continue;
                    }
                    pointLoopCounter += 1;
                }
            }
            if (currentWord.equals("MTEXT")) {
                boolean mtextLoopFlag = true;
                int mtextLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbMText") + startCounter;
                List<String> tempMtextList = new ArrayList<>();
                List<String> mtextMatchList = Arrays.asList(" 1", "  1");
                while (mtextLoopFlag) {
                    if (entitiesList.contains(tempString.get(mtextLoopCounter + 1))) {
                        String mtextPrefix = "txt_" + (mtextMap.size() + 1);
                        mtextMap.put(mtextPrefix, new ArrayList<>(tempMtextList));
                        startCounter = mtextLoopCounter;
                        mtextLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(mtextLoopCounter);
                    if (mtextMatchList.contains(currentWordInLoop)) {
                        tempMtextList.add(tempString.get(mtextLoopCounter + 1));
                        mtextLoopCounter += 1;
                        continue;
                    }
                    mtextLoopCounter += 1;
                }
            }
            if (currentWord.equals("CIRCLE")) {
                boolean circleLoopFlag = true;
                int circleLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbCircle") + startCounter;
                List<String> tempCircleList = new ArrayList<>();
                List<String> circleMatchList = Arrays.asList(
                        " 10", " 20", " 30", " 40", "  10", "  20", "  30", "  40"
                );
                while (circleLoopFlag) {
                    if (entitiesList.contains(tempString.get(circleLoopCounter + 1))) {
                        String circlePrefix = "1Cr" + (circleMap.size() + 1);
                        circleMap.put(circlePrefix, new ArrayList<>(tempCircleList));
                        startCounter = circleLoopCounter;
                        circleLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(circleLoopCounter);
                    if (circleMatchList.contains(currentWordInLoop)) {
                        tempCircleList.add(tempString.get(circleLoopCounter + 1));
                        circleLoopCounter += 1;
                        continue;
                    }
                    circleLoopCounter += 1;
                }
            }
            if (currentWord.equals("LINE")) {
                boolean lineLoopFlag = true;
                int lineLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbLine") + startCounter;
                List<String> tempLineList = new ArrayList<>();
                List<String> lineMatchList = Arrays.asList(
                        " 10", " 20", " 30", "  10", "  20", "  30", " 11", " 21", " 31",
                        "  11", "  21", "  31"
                );
                while (lineLoopFlag) {
                    if (entitiesList.contains(tempString.get(lineLoopCounter + 1))) {
                        String linePrefix = "Ln" + (lineMap.size() + 1);
                        lineMap.put(linePrefix, new ArrayList<>(tempLineList));
                        startCounter = lineLoopCounter;
                        lineLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(lineLoopCounter);
                    if (lineMatchList.contains(currentWordInLoop)) {
                        tempLineList.add(tempString.get(lineLoopCounter + 1));
                        lineLoopCounter += 1;
                        continue;
                    }
                    lineLoopCounter += 1;
                }
//                System.out.println("importDxfTemp_line_list1: " + tempLineList);
            }
            if (currentWord.equals("ARC")) {
                boolean arcLoopFlag = true;
                int arcLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbCircle") + startCounter;
                List<String> tempArcList = new ArrayList<>();
                List<String> arcMatchList = Arrays.asList(
                        " 10", " 20", " 30", " 40", " 50", " 51", "  10", "  20", "  30",
                        "  40", "  50", "  51"
                );
                while (arcLoopFlag) {
                    if (entitiesList.contains(tempString.get(arcLoopCounter + 1))) {
                        String arcPrefix = "Ar" + (arcMap.size() + 1);
                        arcMap.put(arcPrefix, new ArrayList<>(tempArcList));
                        startCounter = arcLoopCounter;
                        arcLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(arcLoopCounter);
                    if (arcMatchList.contains(currentWordInLoop)) {
                        tempArcList.add(tempString.get(arcLoopCounter + 1));
                        arcLoopCounter += 1;
                        continue;
                    }
                    arcLoopCounter += 1;
                }
            }
            if (currentWord.equals("LWPOLYLINE")) {
                boolean lwpolylineLoopFlag = true;
                int lwpolylineLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDbPolyline") + startCounter;
                List<String> tempLwpolylineList = new ArrayList<>();
                List<String> lwpolylineMatchList = Arrays.asList(" 10", " 20", "  10", "  20");
                while (lwpolylineLoopFlag) {
                    if (entitiesList.contains(tempString.get(lwpolylineLoopCounter + 1))) {
                        String lwpolylinePrefix = "Pl" + (lwpolylineMap.size() + 1) + "_";
                        lwpolylineMap.put(lwpolylinePrefix, new ArrayList<>(tempLwpolylineList));
                        startCounter = lwpolylineLoopCounter;
                        lwpolylineLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(lwpolylineLoopCounter);
                    if (lwpolylineMatchList.contains(currentWordInLoop)) {
                        tempLwpolylineList.add(tempString.get(lwpolylineLoopCounter + 1));
                        lwpolylineLoopCounter += 1;
                        continue;
                    }
                    lwpolylineLoopCounter += 1;
                }
            }
            if (currentWord.equals("POLYLINE")) {
                boolean isPolygonFlag = false;
                boolean polylineLoopFlag = true;
                int polylineLoopCounter = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("AcDb3dPolyline") + startCounter;
//                List<List<String>> tempPolylineList = new ArrayList<>();
                ArrayList<ArrayList<String>> tempPolylineList = new ArrayList<>();
                int isPolygonFlagIndex = tempString.subList(startCounter, tempString.size() - 1)
                        .indexOf("  70") + startCounter + 1;
                if (tempString.get(isPolygonFlagIndex).equals("1")) {
//                    System.out.println("importDxf:  POLYGON " + tempString.get(isPolygonFlagIndex));
                    isPolygonFlag = true;
//                    System.out.println("importDxf:  POLYGON " + isPolygonFlag);
                }
//                System.out.println("importDxf: is_polygon_flag " + isPolygonFlagIndex);
                while (polylineLoopFlag) {
                    if (entitiesList.subList(0, entitiesList.size() - 1)
                            .contains(tempString.get(polylineLoopCounter + 1))) {
                        if (isPolygonFlag) {
                            String polygonPrefix = "Pg" + (polygonMap.size() + 1) + "_";
                            polygonMap.put(polygonPrefix, new ArrayList<>(tempPolylineList));
                        } else {
                            String polylinePrefix = "Pl" + (polylineMap.size() + 1) + "_";
                            polylineMap.put(polylinePrefix, new ArrayList<>(tempPolylineList));
                        }
                        startCounter = polylineLoopCounter;
                        polylineLoopFlag = false;
                        continue;
                    }
                    String currentWordInLoop = tempString.get(polylineLoopCounter);
                    if (currentWordInLoop.equals("VERTEX")) {
                        boolean vertexLoopFlag = true;
                        int vertexLoopCounter = tempString.subList(polylineLoopCounter, tempString.size() - 1)
                                .indexOf("AcDbVertex") + polylineLoopCounter;
                        List<String> tempVertexList = new ArrayList<>();
                        List<String> vertexMatchList = Arrays.asList(
                                " 10", " 20", " 30", "  10", "  20", "  30"
                        );
                        while (vertexLoopFlag) {
                            if (tempString.get(vertexLoopCounter + 1).equals("SEQEND") || tempString.get(vertexLoopCounter + 1).equals("VERTEX")) {
                                tempPolylineList.add(new ArrayList<>(tempVertexList));
                                polylineLoopCounter = vertexLoopCounter;
                                vertexLoopFlag = false;
                                continue;
                            }
                            String currentWordInInnerLoop = tempString.get(vertexLoopCounter);
                            if (vertexMatchList.contains(currentWordInInnerLoop)) {
                                tempVertexList.add(tempString.get(vertexLoopCounter + 1));
                                vertexLoopCounter += 1;
                                continue;
                            }
                            vertexLoopCounter += 1;
                        }
                    }
                    polylineLoopCounter += 1;
                }

//                System.out.println("importDxfTemp_line_list2: " + polylineLoopFlag);
            }
            startCounter++;
        }

//        System.out.println("point_map: " + pointMap.entrySet());
//        System.out.println("mtext_map: " + mtextMap.entrySet());
//        System.out.println("circle_map: " + circleMap.entrySet());
//        System.out.println("line_map: " + lineMap.entrySet());
//        System.out.println("arc_map: " + arcMap.entrySet());
//        System.out.println("lwpolyline_map: " + lwpolylineMap.entrySet());
//        System.out.println("polyline_map: " + polylineMap.entrySet());
//        System.out.println("polygon_map: " + polygonMap.entrySet());
        HashMap<String, ArrayList<String>> dataList = new HashMap<>();

        dataList.put("point_map", new ArrayList<>(pointMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("mText_map", new ArrayList<>(mtextMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("circle_map", new ArrayList<>(circleMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("line_map", new ArrayList<>(lineMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("arc_map", new ArrayList<>(arcMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("lwPolyline_map", new ArrayList<>(lwpolylineMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("polyline_map", new ArrayList<>(polylineMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );
        dataList.put("polygon_map", new ArrayList<>(polygonMap.entrySet().stream()
                .map(entry -> entry.toString())
                .collect(Collectors.toList()))
        );

//        System.out.println("dataList:  " + dataList);
        return dataList;
    }

}
