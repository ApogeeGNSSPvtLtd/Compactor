/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.repository;

import com.apogee.EntityModel.SingleFileUpload;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author user
 */
public interface SingleFileUploadRepository extends JpaRepository<SingleFileUpload, Integer> {

    Optional<SingleFileUpload> findByFileName(String fileName);

    void deleteByFileName(String fileName);
}
