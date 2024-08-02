/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.EntityModel;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 *
 * @author user
 */
@Entity
public class DummyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dummydata_id;
    private String name;

    /**
     * @return the dummydata_id
     */
    public int getDummydata_id() {
        return dummydata_id;
    }

    /**
     * @param dummydata_id the dummydata_id to set
     */
    public void setDummydata_id(int dummydata_id) {
        this.dummydata_id = dummydata_id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }
}
