/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.services;

import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author user
 */
public interface FileProcessorService {

    public HashMap<String, ArrayList<String>> fetchDXFDataUsingDXFFile(String filePath);

}
