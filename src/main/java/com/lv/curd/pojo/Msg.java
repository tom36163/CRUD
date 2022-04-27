package com.lv.curd.pojo;

import java.util.HashMap;
import java.util.Map;

public class Msg {
    //状态码  100成功  200失败
    private Integer code;
    //提示信息
    private String msg;
    //用户返回浏览器的数据
    private Map<String,Object> map = new HashMap<>();

    //处理成功
    public static Msg success(){
        Msg result = new Msg();
        result.setCode(100);
        result.setMsg("处理成功");
        return result;
    }
    //处理失败
    public static Msg fail(){
        Msg result = new Msg();
        result.setCode(200);
        result.setMsg("处理失败");
        return result;
    }
    //map集合链式添加
    public Msg add(String key,Object value){
        this.map.put(key,value);
        return this;
    }
    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Map<String, Object> getMap() {
        return map;
    }

    public void setMap(Map<String, Object> map) {
        this.map = map;
    }
}