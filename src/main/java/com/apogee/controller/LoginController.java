/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author user
 */
@Controller
public class LoginController {

    @GetMapping("/")
    public String redirectToLogin() {
        return "WEB-INF/views/compactor";
    }
//    @GetMapping("/")
//    public String redirectToLogin() {
//        return "WEB-INF/views/dummy";
//    }

    @GetMapping("/graph")
    public String graph() {
        return "WEB-INF/views/graph";
    }
}
