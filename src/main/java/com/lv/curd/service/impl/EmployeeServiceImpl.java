package com.lv.curd.service.impl;

import com.lv.curd.mapper.EmployeeMapper;
import com.lv.curd.pojo.Employee;
import com.lv.curd.pojo.EmployeeExample;
import com.lv.curd.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeMapper employeeMapper;
    @Override
    public List<Employee> selectByExampleWithDept() {
        return employeeMapper.selectByExampleWithDept(null);
    }

    @Override
    public void addEmp(Employee employee) {
        employeeMapper.insertSelective(employee);
    }

    @Override
    public boolean checkUser(String empName) {
        EmployeeExample example = new EmployeeExample();
        EmployeeExample.Criteria criteria = example.createCriteria();
        criteria.andEmpNameEqualTo(empName);
        long count = employeeMapper.countByExample(example);
        return count == 0;
    }

    @Override
    public Employee getEmp(Integer id) {
        return employeeMapper.selectByPrimaryKey(id);
    }

    @Override
    public void updateEmp(Employee employee) {
        employeeMapper.updateByPrimaryKeySelective(employee);
    }

    @Override
    public void delEmp(Integer id) {
        employeeMapper.deleteByPrimaryKey(id);
    }

    @Override
    public void delBatch(List<Integer> ids) {
        EmployeeExample example = new EmployeeExample();
        EmployeeExample.Criteria criteria = example.createCriteria();
        criteria.andEmpIdIn(ids);
        employeeMapper.deleteByExample(example);
    }
}