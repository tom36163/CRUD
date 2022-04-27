package com.lv.curd.service;

import com.lv.curd.pojo.Employee;

import java.util.List;

public interface EmployeeService {
    /**
     * 获取员工信息
     * @return
     */
    List<Employee> selectByExampleWithDept();

    /**
     * 添加员工
     * @param employee
     */
    void addEmp(Employee employee);

    boolean checkUser(String empName);

    Employee getEmp(Integer id);

    void updateEmp(Employee employee);

    void delEmp(Integer id);

    void delBatch(List<Integer> ids);
}
