/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.controller;

import com.apogee.requestresponse.MyResponse;
import com.apogee.services.FileProcessorService;
import com.apogee.services.RtkAndGridDataService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author user
 */
@RestController
@RequestMapping("/rtkandgrid")
public class RtkAndGridDataRestController {

    @Autowired
    RtkAndGridDataService rtkAndGridDataService;

    @Autowired
    private FileProcessorService fileProcessorService;

    @PostMapping("/data")
//    public String receiveGridData(@RequestBody GridData gridData) {
    public ResponseEntity<MyResponse> receiveRtkAndGridData(@RequestBody Map<String, Map<String, String>> data) {
        MyResponse response = this.rtkAndGridDataService.saveRtkAndGridData(data);
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/dxfdataapi")
    public ResponseEntity<HashMap<String, ArrayList<String>>> dxfData(Model model) {
//        System.out.println("HIIIIIIIIIIIIIIIIIII");
        String filePath = "D:\\Shailendra Singh\\Documents\\RoadMapProject\\NAMI10KM.dxf";
        HashMap<String, ArrayList<String>> dataList1 = this.fileProcessorService.fetchDXFDataUsingDXFFile(filePath);

        //FIND LINEMAP
//        ArrayList<String> lineMap = dataList1.get("line_map");
//        for (String input : lineMap) {
//            String[] keyValue = input.split("=");
//            String key = keyValue[0].trim();
//            String valuesString = keyValue[1].trim();
//            String[] valuesArray = valuesString.substring(1, valuesString.length() - 1).split(",");
//            for (int i = 0; i < valuesArray.length; i += 3) {
//                String easting = valuesArray[i];
//                String northing = valuesArray[i + 1];
//                String height = valuesArray[i + 2];
//                System.out.println(easting + "," + northing + "," + height);
//            }
//        }
//FIND lwPolylineMap
//         Initialize min and max variables
        double minEasting = Double.MAX_VALUE;
        double maxEasting = Double.MIN_VALUE;
        double minNorthing = Double.MAX_VALUE;
        double maxNorthing = Double.MIN_VALUE;
        // FIND lwPolylineMap
        ArrayList<String> lwPolylineMap = dataList1.get("lwPolyline_map");
        for (String input : lwPolylineMap) {
//            System.out.println(input);
            String[] keyValue = input.split("=");
            String key = keyValue[0].trim();
            String valuesString = keyValue[1].trim();
            String[] valueArray = valuesString.substring(1, valuesString.length() - 1).split(",");
            for (int i = 0; i < valueArray.length; i += 2) {
                double easting = Double.parseDouble(valueArray[i].trim());
                double northing = Double.parseDouble(valueArray[i + 1].trim());

                // Update min and max values
                if (easting < minEasting) {
                    minEasting = easting;
                }
                if (easting > maxEasting) {
                    maxEasting = easting;
                }
                if (northing < minNorthing) {
                    minNorthing = northing;
                }
                if (northing > maxNorthing) {
                    maxNorthing = northing;
                }

//                System.out.println(easting + "," + northing);
            }
        }

        // Add min and max values to dataList1
        ArrayList<String> minMaxValues = new ArrayList<>();
        minMaxValues.add("minEasting=" + minEasting);
        minMaxValues.add("maxEasting=" + maxEasting);
        minMaxValues.add("minNorthing=" + minNorthing);
        minMaxValues.add("maxNorthing=" + maxNorthing);
        System.out.println(minMaxValues);
        dataList1.put("minMaxValues", minMaxValues);

        return ResponseEntity.ok(dataList1);
    }

}
