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
public class Compaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int compaction_id;
    private String point_index;
    private String i;
    private String j;
    private String temp;
    private String vibration;
    private String pass;
    private String direction;
    private String heading_angle;
    private String times;
    private String speed;
    private String cut_fill;
    private String machine_id;

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
     * @return the compaction_id
     */
    public int getCompaction_id() {
        return compaction_id;
    }

    /**
     * @param compaction_id the compaction_id to set
     */
    public void setCompaction_id(int compaction_id) {
        this.compaction_id = compaction_id;
    }

    /**
     * @return the point_index
     */
    public String getPoint_index() {
        return point_index;
    }

    /**
     * @param point_index the point_index to set
     */
    public void setPoint_index(String point_index) {
        this.point_index = point_index;
    }

    /**
     * @return the i
     */
    public String getI() {
        return i;
    }

    /**
     * @param i the i to set
     */
    public void setI(String i) {
        this.i = i;
    }

    /**
     * @return the j
     */
    public String getJ() {
        return j;
    }

    /**
     * @param j the j to set
     */
    public void setJ(String j) {
        this.j = j;
    }

    /**
     * @return the temp
     */
    public String getTemp() {
        return temp;
    }

    /**
     * @param temp the temp to set
     */
    public void setTemp(String temp) {
        this.temp = temp;
    }

    /**
     * @return the vibration
     */
    public String getVibration() {
        return vibration;
    }

    /**
     * @param vibration the vibration to set
     */
    public void setVibration(String vibration) {
        this.vibration = vibration;
    }

    /**
     * @return the pass
     */
    public String getPass() {
        return pass;
    }

    /**
     * @param pass the pass to set
     */
    public void setPass(String pass) {
        this.pass = pass;
    }

    /**
     * @return the direction
     */
    public String getDirection() {
        return direction;
    }

    /**
     * @param direction the direction to set
     */
    public void setDirection(String direction) {
        this.direction = direction;
    }

    /**
     * @return the heading_angle
     */
    public String getHeading_angle() {
        return heading_angle;
    }

    /**
     * @param heading_angle the heading_angle to set
     */
    public void setHeading_angle(String heading_angle) {
        this.heading_angle = heading_angle;
    }

    /**
     * @return the times
     */
    public String getTimes() {
        return times;
    }

    /**
     * @param times the time to set
     */
    public void setTimes(String times) {
        this.times = times;
    }

    /**
     * @return the speed
     */
    public String getSpeed() {
        return speed;
    }

    /**
     * @param speed the speed to set
     */
    public void setSpeed(String speed) {
        this.speed = speed;
    }

    /**
     * @return the cut_fill
     */
    public String getCut_fill() {
        return cut_fill;
    }

    /**
     * @param cut_fill the cut_fill to set
     */
    public void setCut_fill(String cut_fill) {
        this.cut_fill = cut_fill;
    }

    /**
     * @return the machine_id
     */
    public String getMachine_id() {
        return machine_id;
    }

    /**
     * @param machine_id the machine_id to set
     */
    public void setMachine_id(String machine_id) {
        this.machine_id = machine_id;
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
