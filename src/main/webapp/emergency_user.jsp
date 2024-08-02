<%-- 
    Document   : emergency_user
    Created on : 25 May, 2023, 10:01:16 AM
    Author     : Vikranth
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }

            h1 {
                text-align: center;
            }

            .container {
                max-width: 500px;
                margin: 0 auto;
            }

            /*            .form-group {
                            margin-bottom: 20px;
                        }
            
                        label {
                            display: block;
                            margin-bottom: 5px;
                            font-weight: bold;
                        }
            
                        input[type="text"],
                        input[type="email"],
                        input[type="tel"],
                        textarea {
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }*/

            button {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            button:hover {
                background-color: #45a049;
            }

            .custom-file-input {
                /* Hide the default file input */
                display: none;
            }

            .custom-file-label {
                /* Style the label to resemble a button */
                display: inline-block;
                padding: 10px 15px;
                background-color: #e9e9e9;
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .custom-file-label::after {
                /* Add a label text */
                content: 'Camera';
            }

            .custom-file-input:focus + .custom-file-label {
                /* Style the label when the input is focused */
                outline: dotted;
            }
            input[type=file] {
                display: none;
            }

        </style>
        <script>
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            }

            function showPosition(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                document.getElementById("lat").value = latitude;
                document.getElementById("lng").value = longitude;
            }

            window.addEventListener("load", getLocation);

        </script>
    </head>
    <body>
        <h1>Emergency Form</h1>
        <div class="container">
            <form name="form" method="POST" action="EmergencyDataController" enctype="multipart/form-data">

                <div class="form-group">
                    <!--                    <label for="message">File Upload:</label>
                                        <input type="file" id="fileData" name="fileData" placeholder="Upload DL Image">-->

                    <input type="file" id="file-upload" name="file-upload" class="custom-file-input">
                    <label for="file-upload" class="custom-file-label"></label>

                    <input type="hidden" id="typeE" name="typeE" value="${type}">
                    <input type="hidden" id="lat" name="lat" value="">
                    <input type="hidden" id="lng" name="lng" value="">
                </div>

                <div class="form-group">
                    <label for="name">Emergency Type:</label>
                    <select class="form-control" name="emergency_type" id="emergency_type">
                        <c:forEach var="map" items="${emerTypeList}">
                            <option value="${map.key}">${map.value}</option>
                        </c:forEach>
                    </select>                    
                </div>

                <div class="form-group">
                    <label for="name">File Type:</label>
                    <select class="form-control" name="file_type" id="file_type">
                        <c:forEach var="mapfile" items="${fileTypeList}">
                            <option value="${mapfile.key}">${mapfile.value}</option>
                        </c:forEach>
                    </select>                    
                </div>               

                <div class="form-group">
                    <label for="phone">Name:</label>
                    <input class="form-control" type="text" id="user_name" name="user_name" placeholder="Enter your Name">
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    </body>
</html>

