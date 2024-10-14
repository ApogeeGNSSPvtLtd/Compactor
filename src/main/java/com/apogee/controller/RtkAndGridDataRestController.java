/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.controller;

import com.apogee.EntityModel.SingleFileUpload;
import com.apogee.repository.SingleFileUploadRepository;
import com.apogee.requestresponse.MyResponse;
import com.apogee.services.FileProcessorService;
import com.apogee.services.RtkAndGridDataService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author user
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/rtkandgrid")
public class RtkAndGridDataRestController {

    @Autowired
    RtkAndGridDataService rtkAndGridDataService;

    @Autowired
    private FileProcessorService fileProcessorService;

    @Autowired
    private SingleFileUploadRepository singleFileUploadRepository;

    private final String upload_dir = "D:/uploadFile";

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
//        System.out.println(minMaxValues);
        dataList1.put("minMaxValues", minMaxValues);

        return ResponseEntity.ok(dataList1);
    }

    @CrossOrigin(origins = "http://localhost:3002")
    @PostMapping("/mapdata")
    public ResponseEntity<String> mapData(@RequestBody Map<String, Object> utmData) {
        System.out.println(utmData);
        return ResponseEntity.ok("success");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/polygondata")
    public ResponseEntity<String> polygonData(@RequestBody List<Map<String, Double>> polygonCoordinates) {
        System.out.println(polygonCoordinates);
        return ResponseEntity.ok("success");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/savefile")
    public ResponseEntity<String> uploadFile(@RequestParam("fileName") String fileName, @RequestParam("file") MultipartFile file) {
        try {
            File directory = new File(upload_dir);
            if (!directory.exists()) {
                directory.mkdir();
            }
            String filePath = directory + File.separator + file.getOriginalFilename();

//        save file in directory
//        file.transferTo(new File(filePath));
            Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);

//        save data in database
            SingleFileUpload singleFileUpload = new SingleFileUpload();
            singleFileUpload.setFileName(fileName);
            singleFileUpload.setFilePath(filePath);
            singleFileUploadRepository.save(singleFileUpload);
            return new ResponseEntity<String>("File Upload SuccessFully", HttpStatus.ACCEPTED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>("Error uploading file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/downloadfile/{fileName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) {
        Optional<SingleFileUpload> singleFileUploadOpt = singleFileUploadRepository.findByFileName("NAMI.dxf");

        if (!singleFileUploadOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Return 404 if file not found
        }

        SingleFileUpload singleFileUpload = singleFileUploadOpt.get();

        // Load the file from the filePath
        File file = new File(singleFileUpload.getFilePath());

        if (!file.exists()) {
            return ResponseEntity.notFound().build(); // Return 404 if the file does not exist
        }

        try {
            // Read the file into a byte array
            byte[] fileContent = Files.readAllBytes(file.toPath());

            // Set the content type based on the file type
            String contentType = Files.probeContentType(file.toPath());

            // Return the file as an attachment
            return ResponseEntity.ok()
                    //                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(fileContent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return 500 if there's an error
        }
    }

    @DeleteMapping("/deletefile/{fileName}")
    @Transactional
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        try {
            Optional<SingleFileUpload> singleFileUploadOpt = singleFileUploadRepository.findByFileName("land1.xml");

            if (!singleFileUploadOpt.isPresent()) {
                return ResponseEntity.notFound().build(); // Return 404 if file not found
            }

            SingleFileUpload singleFileUpload = singleFileUploadOpt.get();

            // Delete the file from the file system
            File fileToDelete = new File(singleFileUpload.getFilePath());
            if (fileToDelete.exists()) {
                boolean deleted = fileToDelete.delete();
                if (!deleted) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error deleting file from the file system");
                }
            }

            // Now delete the record from the database
            singleFileUploadRepository.deleteByFileName("land1.xml");

            return ResponseEntity.ok("File deleted successfully from both file system and database");
        } catch (Exception e) {
            // Log the exception using a logger (recommended)
            e.printStackTrace(); // Replace this with logger
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting file: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/savemultiplefiles")
    public ResponseEntity<String> saveMultipleFiles(
            @RequestParam("projectName") String projectName,
            @RequestParam("xmlFiles") MultipartFile[] xmlFiles,
            @RequestParam("dxfFiles") MultipartFile[] dxfFiles,
            @RequestParam("calFilesData") MultipartFile[] calFilesData) {

        try {
            saveFiles(xmlFiles, "xmlFiles");  
            saveFiles(dxfFiles, "dxfFiles");
            saveFiles(calFilesData, "calFiles");

            return ResponseEntity.ok("Files uploaded successfully for project: " + projectName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving files: " + e.getMessage());
        }
    }

    private void saveFiles(MultipartFile[] files, String folderName) throws IOException {
        File directory = new File(upload_dir + "/" + folderName);
        if (!directory.exists()) {
            directory.mkdirs(); // Create the directory if it does not exist
        }

        for (MultipartFile file : files) {
            String destinationFile = directory + File.separator + file.getOriginalFilename();
//            file.transferTo(new File(destinationFile));
            Files.copy(file.getInputStream(), Paths.get(destinationFile), StandardCopyOption.REPLACE_EXISTING);
        }
    }

}
