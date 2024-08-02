/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.services;

import com.apogee.requestresponse.MyResponse;
import java.util.Map;

/**
 *
 * @author user
 */
public interface RtkAndGridDataService {

    public MyResponse saveRtkAndGridData(Map<String, Map<String, String>> data);

}
