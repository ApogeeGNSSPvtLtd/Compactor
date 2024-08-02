<%-- 
    Document   : success
    Created on : 18 May, 2023, 6:05:58 PM
    Author     : Vikranth
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Thank You</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f1f1f1;
            }

            .message {
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                color: green;
                opacity: 0;
                animation: fade-in 2s ease-in-out forwards;
            }

            @keyframes fade-in {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        </style>
    </head>
    <body>
        <div class="message">
            Thank You!
        </div>
    </body>
</html>

