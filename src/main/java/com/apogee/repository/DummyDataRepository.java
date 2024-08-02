/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.repository;

import com.apogee.EntityModel.DummyData;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author user
 */
public interface DummyDataRepository extends JpaRepository<DummyData, Integer> {
    
//    @Query(value = "SELECT * FROM compactor.dummy_data Limit 10000", nativeQuery = true)
//    @Query(value = "SELECT * FROM dummy_data WHERE dummydata_id BETWEEN 1 AND 10000;", nativeQuery = true)

    @Query(value = "SELECT * FROM dummy_data WHERE dummydata_id % 2 = 0 LIMIT 10000;", nativeQuery = true)
    public List<DummyData> findSomeData();
}
