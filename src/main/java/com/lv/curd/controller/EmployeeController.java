package com.lv.curd.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lv.curd.pojo.Employee;
import com.lv.curd.pojo.Msg;
import com.lv.curd.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @RequestMapping("/emps")
    @ResponseBody
    public Msg getEmpsWithJson(@RequestParam(value = "pageNum",defaultValue = "1")Integer pageNum){
        //引用分页插件 传入页码跟每页的大小
        PageHelper.startPage(pageNum,5);
        //startPage紧跟的就是一个分页查询
        List<Employee> employeeList = employeeService.selectByExampleWithDept();
        //连续显示的页面位5
        PageInfo<Employee> pageInfo = new PageInfo<>(employeeList,5);
        return Msg.success().add("pageInfo",pageInfo);
    }

    //@RequestMapping("/emps")
    //public String getEmps(@RequestParam(value = "pageNum",defaultValue = "1") Integer pageNum, Model model){
    //
    //    //这不是一个分页查询
    //    //引入PageHelper分页插件
    //    //在查询之前需要调用,传入页码，以及每页的大小
    //    PageHelper.startPage(pageNum,5);
    //    //在startPage之后紧跟的就是一个分页查询
    //    List<Employee> emps = employeeService.selectByExampleWithDept();
    //    //连续显示的页数为5
    //    PageInfo<Employee> pageInfo = new PageInfo<Employee>(emps,5);
    //    model.addAttribute("pageInfo",pageInfo);
    //    return "list";
    //}

    /**
     * 添加用户
     * @param employee
     * @param result
     * @return
     */
    @RequestMapping(value = "/emp",method = RequestMethod.POST)
    @ResponseBody
    public Msg addEmp(@Valid Employee employee, BindingResult result){
        if (result.hasErrors()){
            //显示错误信息
            Map<String,Object> map = new HashMap<>();
            List<FieldError> errors = result.getFieldErrors();
            for (FieldError fieldError : errors) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Msg.success().add("errorFields",map);
        }else {
            employeeService.addEmp(employee);
            return Msg.success();
        }
    }

    /**
     * 检查用户名是否合法
     * @param empName
     * @return
     */
    @RequestMapping("/checkuser")
    @ResponseBody
    public Msg checkUser(@RequestParam("empName") String empName){
        //先判断用户名是否合法
        String regx = "(^[a-zA-Z0-9_-]{6,16}$)|(^[\\u2E80-\\u9FFF]{2,5})";
        if (!empName.matches(regx)){
            return Msg.fail().add("va_msg","用户名必须是6-16位数字和字母的组合或者2-8位中文");
        }
        boolean b = employeeService.checkUser(empName);
        if (b){
            return Msg.success();
        }else {
            return Msg.fail().add("va_msg","用户名不可用");
        }
    }

    /**
     * 查询指定员工信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/emp/{id}",method = RequestMethod.GET)
    @ResponseBody
    public Msg getEmp(@PathVariable("id")Integer id){
        Employee emp = employeeService.getEmp(id);
        return Msg.success().add("emp",emp);
    }

    /**
     * 修改员工信息
     * @param employee
     * @return
     */
    @RequestMapping(value = "/emp/{empId}",method = RequestMethod.PUT)
    @ResponseBody
    public Msg updateEmp(Employee employee){
        employeeService.updateEmp(employee);
        return Msg.success();
    }

    /**
     * 单一，批量删除功能
     * @param ids
     * @return
     */
    @RequestMapping(value = "/emp/{ids}",method = RequestMethod.DELETE)
    @ResponseBody
    public Msg delEmp(@PathVariable("ids")String ids){
        if (ids.contains("-")){
            List<Integer> del_ids = new ArrayList<>();
            String[] str_Ids = ids.split("-");
            for (String s : str_Ids) {
                int i = Integer.parseInt(s);
                del_ids.add(i);
            }
            employeeService.delBatch(del_ids);
        }else {
            int id = Integer.parseInt(ids);
            employeeService.delEmp(id);
        }
        return Msg.success();
    }
}