package com.lv.curd.service;

import com.lv.curd.pojo.Department;

import java.util.List;

public interface DepartmentService {
    /**
     * 获取所有部门信息
     * @return
     */
    List<Department> getDepts();
}
