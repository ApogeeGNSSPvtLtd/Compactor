/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.services;

import com.apogee.EntityModel.GridData;
import com.apogee.EntityModel.RtkData;
import com.apogee.repository.GridDataRepository;
import com.apogee.repository.RtkDataRepository;
import com.apogee.requestresponse.MyResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.locationtech.proj4j.BasicCoordinateTransform;
import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.ProjCoordinate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author user
 */
@Service
public class RtkAndGridDataServiceImpl implements RtkAndGridDataService {

    @Autowired
    RtkDataRepository rtkDataRepository;
    @Autowired
    GridDataRepository gridDataRepository;

    @Override
    public MyResponse saveRtkAndGridData(Map<String, Map<String, String>> data) {
        MyResponse response = new MyResponse();
        int zone = 43;
        boolean isNorthernHemisphere = true;
        response.setMessage("Data Saved Successfully");
        try {
            List<RtkData> rtkDataList = new ArrayList<>();
            List<GridData> gridDataList = new ArrayList<>();
            data.forEach((outerKey, innerMap) -> {
                String[] eastingnorthing = outerKey.split(",");
                String easting = eastingnorthing[0];
                String northing = eastingnorthing[1];
                String[] latLon = UTMToLatLon(easting, northing, zone, isNorthernHemisphere);
//                System.out.println("Latitude: " + latLon[0]);
//                System.out.println("Longitude: " + latLon[1]);
                RtkData rtkData = new RtkData();
                rtkData.setLat(latLon[0]);
                rtkData.setLon(latLon[1]);
                rtkDataList.add(rtkData);
                innerMap.forEach((innerKey, value) -> {
                    String[] ij = innerKey.split(",");
                    GridData gridData = new GridData();
                    gridData.setLat(latLon[0]);
                    gridData.setLon(latLon[1]);
                    gridData.setI(ij[0]);
                    gridData.setJ(ij[1]);
                    gridData.setData_string(value);
                    gridDataList.add(gridData);
                });
            });
            List<RtkData> savedRtkData = rtkDataRepository.saveAll(rtkDataList);
            if (!savedRtkData.isEmpty()) {
                List<GridData> savedGridData = gridDataRepository.saveAll(gridDataList);
                if (savedGridData.isEmpty()) {
                    response.setMessage("data Not Saved");
                }
            } else {
                response.setMessage("data Not Saved");
            }
        } catch (Exception e) {
            response.setMessage("Error : " + e);
            System.out.println("Exception" + e);
        }
        return response;
    }

    public static String[] UTMToLatLon(String eastingStr, String northingStr, int zone, boolean isNorthernHemisphere) {
        double easting = Double.parseDouble(eastingStr);
        double northing = Double.parseDouble(northingStr);
        CRSFactory crsFactory = new CRSFactory();
        CoordinateReferenceSystem utmCRS = crsFactory.createFromName("EPSG:326" + zone);
        if (!isNorthernHemisphere) {
            utmCRS = crsFactory.createFromName("EPSG:327" + zone);
        }
        CoordinateReferenceSystem wgs84CRS = crsFactory.createFromName("EPSG:4326");
        CoordinateTransform transform = new BasicCoordinateTransform(utmCRS, wgs84CRS);
        ProjCoordinate utmCoord = new ProjCoordinate(easting, northing);
        ProjCoordinate latLonCoord = new ProjCoordinate();
        transform.transform(utmCoord, latLonCoord);
        String latitude = String.valueOf(latLonCoord.y);
        String longitude = String.valueOf(latLonCoord.x);
        return new String[]{latitude, longitude}; // latitude, longitude
    }
}
