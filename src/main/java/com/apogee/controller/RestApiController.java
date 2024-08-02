/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
 /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apogee.controller;

import com.apogee.EntityModel.DummyData;
import com.apogee.repository.DummyDataRepository;
import com.apogee.requestresponse.TestOne;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author saini
 */
@RestController
public class RestApiController {

    @Autowired
    private DummyDataRepository dummyDataRepository;

    @GetMapping("/getReq")
    public String getReq() {
        return "This is GET Response!";
    }

    @PostMapping("/postReq")
    public String postReq() {
        return "This is POST Response!";
    }

//    @PostMapping("/postReqData")
    @PostMapping(value = "/postReqData", consumes = "application/json", produces = "application/json")
    public Map<String, Object> postData(@RequestBody Map<String, Object> obj) {
        String result = "";
        Map<String, Object> jobj = new HashMap<>();
        try {
            result = obj.get("msg").toString();
            jobj.put("1", "hhhhh");
            jobj.put("2", "hi");
        } catch (Exception e) {
            System.out.println("com.apogee.controller.RestApiController.postData(): " + e);
        }
        return jobj;
    }

    @PostMapping("/postJSONReq")
    public ResponseEntity postJSONReq(@RequestBody TestOne req) {
        JSONObject jobj = new JSONObject();
        Map<String, String> data = new HashMap<>();
        try {
            jobj.put("1", "1");
            System.out.println("data: " + req.getMsg());
            data.put("key1", "value1");
            data.put("key2", "value2");
        } catch (Exception e) {
            System.out.println("com.apogee.controller.RestApiController.postJSONReq(): " + e);
        }

        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/dummydata")
    public ResponseEntity<String> dummyData(Model model) {

        int totalRows = 40000000;
        int batchSize = 5000;

//        List<DummyData> alldata = dummyDataRepository.findAll();
        LocalTime localTime1 = LocalTime.now();
        System.out.println(localTime1);
        List<DummyData> findsomedata = dummyDataRepository.findSomeData();
        System.out.println(findsomedata.size());
        LocalTime localTime2 = LocalTime.now();
        System.out.println(localTime2);

//        if you use dummyDataService so add on class @Transactional of dummyDataService if needed
//        dummyDataService.bulkInsert(totalRows, batchSize);
//        int i = 1;
//        List<DummyData> batchList = new ArrayList<>();
//
//        while (i <= totalRows) {
//            for (int j = 0; j < batchSize && i <= totalRows; j++, i++) {
//                DummyData dummyData = new DummyData();
//                dummyData.setName("compactor");
//                batchList.add(dummyData);
//            }
//
//            dummyDataRepository.saveAll(batchList);
//            batchList.clear();
//
//            // Log progress
//            if (i % 1000000 == 0) {
//                System.out.println("Inserted " + i + " rows");
//            }
//
//            // Introduce a small delay to avoid overloading the server
//            try {
//                Thread.sleep(100);
//            } catch (InterruptedException e) {
//                Thread.currentThread().interrupt();
//                throw new RuntimeException(e);
//            }
//        }\
        return null;
    }
}
