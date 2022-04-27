package com.lv.curd.service.impl;

import com.lv.curd.mapper.DepartmentMapper;
import com.lv.curd.pojo.Department;
import com.lv.curd.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    /**
     * 查询部门信息
     * @return
     */
    @Override
    public List<Department> getDepts() {
        return departmentMapper.selectByExample(null);
    }
}