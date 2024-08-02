/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.controller;

import com.apogee.requestresponse.MyResponse;
import com.apogee.services.RtkAndGridDataService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/data")
//    public String receiveGridData(@RequestBody GridData gridData) {
    public ResponseEntity<MyResponse> receiveRtkAndGridData(@RequestBody Map<String, Map<String, String>> data) {
        MyResponse response = this.rtkAndGridDataService.saveRtkAndGridData(data);
        return ResponseEntity.ok(response);
    }

}
