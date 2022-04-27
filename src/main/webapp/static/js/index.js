window.addEventListener("load",function () {

    //总记录数
    var totalRecord;
    //当前页数
    var currentPage;
//页面加载完成直接发送ajax请求，要到分页数据
    $(function () {
        to_page(1);
    });

    function to_page(pageNum) {
        $.ajax({
            url:"/emps",
            type:"GET",
            data:"pageNum="+pageNum,
            success:function (result) {
                //console.log(result);
                //1.解析并显示员工数据
                build_emps_table(result);
                //2.解析并显示分页信息
                build_page_info(result);
                //3.解析并显示分页条
                build_page_nav(result);
            }
        });
    }

//1.解析并显示员工数据
    function build_emps_table(result) {
        $("#emps_table tbody").empty();
        var emps = result.map.pageInfo.list;
        $.each(emps,function (index, item) {
            var cheakBoxTd = $("<td><input type='checkbox' class='check_item'/></td>");
            var empIdTd = $("<td></td>").append(item.empId);
            var empNameTd = $("<td></td>").append(item.empName);
            var genderTd = $("<td></td>").append(item.gender=='M'?"男":"女")
            var emailTd = $("<td></td>").append(item.email);
            var deptNameTd = $("<td></td>").append(item.department.deptName);
            var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-pencil"))
                .append("编辑");
            editBtn.attr("edit_id",item.empId);
            var delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-trash"))
                .append("删除");
            delBtn.attr("del_id",item.empId);
            var btnTd = $("<td></td>").append(editBtn).append("").append(delBtn);

            $("<tr></tr>")
                .append(cheakBoxTd)
                .append(empIdTd)
                .append(empNameTd)
                .append(genderTd)
                .append(emailTd)
                .append(deptNameTd)
                .append(btnTd)
                .appendTo("#emps_table tbody");
        });
    }

//2.解析并显示分页信息
    function build_page_info(result) {
        $("#page_info_area").empty();
        $("#page_info_area").append("当前"+
            result.map.pageInfo.pageNum +"页,共"+
            result.map.pageInfo.pages + "页,总计"+
            result.map.pageInfo.total+"条记录");
        totalRecord = result.map.pageInfo.total;
        currentPage = result.map.pageInfo.pageNum;
    }

//3.解析并显示分页条
    function build_page_nav(result) {
        $("#page_nav_area").empty();
        var ul = $("<ul></ul>").addClass("pagination");
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href","#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href","#"));

        if (result.map.pageInfo.hasPreviousPage == false){
            firstPageLi.addClass("disabled");
            prePageLi.addClass("disabled");
        }else {
            //添加点击事件
            firstPageLi.click(function () {
                to_page(1);
            })

            prePageLi.click(function () {
                to_page(result.map.pageInfo.pageNum-1);
            })
        }

        if (result.map.pageInfo.hasNextPage == false){
            nextPageLi.addClass("disabled");
            lastPageLi.addClass("disabled");
        }else {
            //添加点击事件
            lastPageLi.click(function () {
                to_page(result.map.pageInfo.pages);
            })

            nextPageLi.click(function () {
                to_page(result.map.pageInfo.pageNum+1);
            })
        }
        ul.append(firstPageLi).append(prePageLi);
        //遍历页码号
        $.each(result.map.pageInfo.navigatepageNums,function (index,item) {
            var numLi = $("<li></li>").append($("<a></a>").append(item));
            if (result.map.pageInfo.pageNum == item){
                numLi.addClass("active");
            }
            numLi.click(function () {
                to_page(item);
            })
            ul.append(numLi);
        })
        ul.append(nextPageLi).append(lastPageLi);
        var navElv = $("<nav></nav>").append(ul);
        navElv.appendTo("#page_nav_area");
    }

    //重置表单
    function reset_form(ele) {
        $(ele)[0].reset();
        //清除表单样式
        $(ele).find("*").removeClass("has-success has-error");
        $(ele).find(".help-block").text("");
    }

//点击增加按钮打开模态框
    $("#emp_add_model_btn").click(function () {
        //每次点击前表单重置
        reset_form("#empAddModal form");
        //查询部门号显示模态框部门信息
        getDepts("#empAddModal select");
        $("#empAddModal").modal({
            backdrop:"static"
        });
    });

    //获取部门信息
    function getDepts(ele) {
        $(ele).empty();
        $.ajax({
            url: "/depts",
            type: "GET",
            async:false,
            success:function (result){
                //console.log(result);
                //将部门信息显示在模态框中
                $.each(result.map.depts,function () {
                    var optionEle = $("<option></option>").append(this.deptName).attr("value",this.deptId);
                    optionEle.appendTo(ele);
                })
            }
        });
    }

    //校验要提交的数据
    function validata_add_form() {
        //检查用户名是否合法
        var empName = $("#empName_add_input").val();
        var regName = /(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5})/;
        if (!regName.test(empName)){
            show_validata_msg("#empName_add_input","error","用户名可以是2-5位中文或者6-16位英文和数字的组合");
            return false;
        }else {
            show_validata_msg("#empName_add_input","success","");
        }
        
        //检查邮箱是否合法
        var email = $("#email_add_input").val();
        var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (!regEmail.test(email)){
            //alert("邮箱格式不正确");
            //避免重复添加控件没有效果出现，每次重新添加前要清空之前的样式控件信息
            show_validata_msg("#email_add_input","error","邮箱格式不正确");
            return false;
        }else {
            show_validata_msg("#email_add_input","success","");
        }
        return true;
    }

    //显示校验结果的提示信息
    function show_validata_msg(ele,status,msg) {
        //清除上一次的校验信息
        $(ele).parent().removeClass("has-success has-error");
        $(ele).next("span").text("");
        if ("success"==status){
            $(ele).parent().addClass("has-success");
            $(ele).next("span").text(msg);
        }else if ("error"==status){
            $(ele).parent().addClass("has-error");
            $(ele).next("span").text(msg);
        }
    }

    //检验用户名是否可用
    $("#empName_add_input").change(function () {
        var empName = this.value;
        $.ajax({
            url:"/checkuser",
            type:"POST",
            data:"empName="+empName,
            success:function (result) {
                if (result.code == 100){
                    //用户名可用
                    show_validata_msg("#empName_add_input","success","用户名可用");
                    $("#emp_save_btn").attr("ajax-va","success");
                }else {
                    show_validata_msg("#empName_add_input","error","用户名不可用");
                    $("#emp_save_btn").attr("ajax-va","error");
                }
            }
        });
    });

    //点击保存，保存员工
    $("#emp_save_btn").click(function () {
        //校验数据是否合法
        if (!validata_add_form()){
            return false;
        }

        //对要提交给服务器的数据进行检验
        if ($(this).attr("ajax-va")=="error"){
            return false;
        }
        //发送ajax请求添加数据
        $.ajax({
            url:"emp",
            type:"POST",
            data:$("#empAddModal form").serialize(),
            success:function (result) {
                if (result.code==100){
                    //员工保存成功
                    //1.关闭模态框 2.跳转到最后一页查看添加数据
                    $("#empAddModal").modal("hide");
                    to_page(totalRecord);
                }else {
                    //员工保存失败，显示错误信息
                    //有哪个字段的错误信息就显示哪一个
                    if (undefined!=result.map.errorFields.email){
                        //显示邮箱错误信息
                        show_validata_msg("#email_add_input","error",result.map.errorFields.email);
                    }
                    if (undefined != result.map.errorFields.empName){
                        //显示用户名错误信息
                        show_validata_msg("#empName_add_input","error",result.map.errorFields.empName);
                    }
                }
            }
        });
    });

    //点击编辑弹出修改模态框
    $(document).on("click",".edit_btn",function () {
         getDepts("#empUpdateModal select");
         getEmp($(this).attr("edit_id"));
         $("#emp_update_btn").attr("edit_id",$(this).attr("edit_id"));
         $("#empUpdateModal").modal({
             backdrop: "static"
         });
    });

    function getEmp(id) {
        $.ajax({
            url:"/emp/"+id,
            type:"GET",
            success:function (result) {
                var empData = result.map.emp;
                $("#empName_update_static").text(empData.empName);
                $("#email_update_input").val(empData.email);
                $("#empUpdateModal input[name=gender]").val([empData.gender]);
                $("#empUpdateModal select").val([empData.dId]);
            }
        });
    }

    //点击更新，更新员工信息
    $("#emp_update_btn").click(function () {
        //校验邮箱是否合法
        var email = $("#email_update_input").val();
        var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (!regEmail.test(email)){
            show_validata_msg("#emp_update_btn","error","邮箱格式不正确")
            return false;
        }else {
            show_validata_msg("#emp_update_btn","success","")
        }

        $.ajax({
            url:"/emp/"+$(this).attr("edit_id"),
            type:"POST",
            data:$("#empUpdateModal form").serialize()+"&_method=PUT",
            success:function (result) {
                $("#empUpdateModal").modal("hide");
                to_page(currentPage);
            }
        });
    });

    //点击删除，删除员工
    $(document).on("click",".del_btn",function () {
        var empName = $(this).parents("tr").find("td:eq(2)").text();
        //弹出是否确认删除
        if (confirm("确认删除"+empName+"吗？")){
            $.ajax({
                url:"/emp/"+$(this).attr("del_id"),
                type:"DELETE",
                success:function (result) {
                    alert(result.msg);
                    to_page(currentPage);
                }
            });
        }
    })

    //完成全选，取消全选
    $("#check_all").click(function () {
       $(".check_item").prop("checked",$(this).prop("checked"));
    });

    //check_item
    $(document).on("click",".check_item",function () {
        var flag = $(".check_item:checked").length==$(".check_item").length;
        $("#check_all").prop("checked",flag);
    })

    //实现批量删除
    $("#emp_delete_all_btn").click(function () {
        var empNames = "";
        var del_idstr = "";
        $.each($(".check_item:checked"),function () {
            empNames += $(this).parents("tr").find("td:eq(2)").text() + ",";
            del_idstr += $(this).parents("tr").find("td:eq(1)").text()+"-";
        })
        //去除多余符号
        empNames = empNames.substring(0,empNames.length-1);
        del_idstr = del_idstr.substring(0,empNames.length-1);
        if (confirm("确认删除"+empNames+"吗？")){
            $.ajax({
                url:"/emp/"+del_idstr,
                type:"DELETE",
                success:function (result) {
                    alert(result.msg);
                    to_page(currentPage);
                }
            });
        }
    });
})