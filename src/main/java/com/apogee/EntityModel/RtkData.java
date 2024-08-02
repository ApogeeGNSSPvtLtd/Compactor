/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.apogee.EntityModel;

import java.security.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 *
 * @author user
 */
@Entity
public class RtkData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rtkdata_id;
    private String lat;
    private String lon;
    private String elevation;

    @Column(nullable = false, length = 1, columnDefinition = "char(1) default 'Y'")
    private char active = 'Y';

    @Column(name = "revision_no", nullable = false, columnDefinition = "int(10) unsigned")
    private int revisionNo;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default current_timestamp on update current_timestamp")
    private Timestamp createdAt;

    @Column(name = "created_by", length = 45)
    private String createdBy;

    @Column(length = 255)
    private String remark;

    /**
     * @return the rtkdata_id
     */
    public int getRtkdata_id() {
        return rtkdata_id;
    }

    /**
     * @param rtkdata_id the rtkdata_id to set
     */
    public void setRtkdata_id(int rtkdata_id) {
        this.rtkdata_id = rtkdata_id;
    }

    /**
     * @return the lat
     */
    public String getLat() {
        return lat;
    }

    /**
     * @param lat the lat to set
     */
    public void setLat(String lat) {
        this.lat = lat;
    }

    /**
     * @return the lon
     */
    public String getLon() {
        return lon;
    }

    /**
     * @param lon the lon to set
     */
    public void setLon(String lon) {
        this.lon = lon;
    }

    /**
     * @return the elevation
     */
    public String getElevation() {
        return elevation;
    }

    /**
     * @param elevation the elevation to set
     */
    public void setElevation(String elevation) {
        this.elevation = elevation;
    }

    /**
     * @return the active
     */
    public char getActive() {
        return active;
    }

    /**
     * @param active the active to set
     */
    public void setActive(char active) {
        this.active = active;
    }

    /**
     * @return the revisionNo
     */
    public int getRevisionNo() {
        return revisionNo;
    }

    /**
     * @param revisionNo the revisionNo to set
     */
    public void setRevisionNo(int revisionNo) {
        this.revisionNo = revisionNo;
    }

    /**
     * @return the createdAt
     */
    public Timestamp getCreatedAt() {
        return createdAt;
    }

    /**
     * @param createdAt the createdAt to set
     */
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * @return the createdBy
     */
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * @param createdBy the createdBy to set
     */
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * @return the remark
     */
    public String getRemark() {
        return remark;
    }

    /**
     * @param remark the remark to set
     */
    public void setRemark(String remark) {
        this.remark = remark;
    }
}
