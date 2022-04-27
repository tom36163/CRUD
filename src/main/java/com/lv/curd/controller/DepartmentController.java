package com.lv.curd.controller;

import com.lv.curd.pojo.Department;
import com.lv.curd.pojo.Msg;
import com.lv.curd.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @RequestMapping("/depts")
    @ResponseBody
    public Msg getDepts(){
        List<Department> departmentList = departmentService.getDepts();
        return Msg.success().add("depts",departmentList);
    }
}