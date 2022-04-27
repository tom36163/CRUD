import com.lv.curd.mapper.DepartmentMapper;
import com.lv.curd.mapper.EmployeeMapper;
import com.lv.curd.pojo.Department;
import com.lv.curd.pojo.Employee;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 测试mapper层的工作
 * 推荐spring的项目就可以使用spring的单元测试,可以自动注入我们需要的组件
 * 1.导入springTest模板
 * 2.@ContextConfiguration指定spring配置文件的位置
 * 3.直接autowried要使用的组件即可
 */
@RunWith(value = SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class MapperTest {
    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private EmployeeMapper employeeMapper;
    /**
     * 测试DepartmentMapper
     */
    @Test
    public void testCRUD(){
        ////1.创建springIOC容器
        //ApplicationContext ioc = new ClassPathXmlApplicationContext("applicationContext.xml");
        ////2.从容其中获取mapper
        //DepartmentMapper bean = ioc.getBean(DepartmentMapper.class);
        //System.out.println(departmentMapper);
        //1.插入几个部门
        //departmentMapper.insertSelective(new Department(null,"开发部"));
        //departmentMapper.insertSelective(new Department(null,"测试部"));
        //2.生成员工数据，测试员工插入
        employeeMapper.insertSelective(new Employee(null,"李四","F","123@163.com",1));

    }
}