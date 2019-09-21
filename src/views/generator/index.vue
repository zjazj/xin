<template>
    <el-form ref="form" :model="form" :inline="false" :rules="rules"  label-width="110px" style="padding: 15px;">
        <!-- <el-row >
            <el-col :span="24">
                <el-form-item  prop="name" >
                    <MDinput name="name" v-model="form.title" required :maxlength="100">
                        模块名称
                    </MDinput>
                </el-form-item>
            </el-col>
        </el-row>  -->
        
        <el-row v-if="message.show" type="flex" class="row-bg" style="margin-bottom:20px">
            <el-col :span="24">
                    <el-alert
                        :title="message.title"
                        :type="message.type"
                        :description="message.description"
                        show-icon>
                    </el-alert>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="功能名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入功能名称"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="所属模块" >
                    <el-radio-group v-model="form.module">
                        <el-radio label="sys">sys</el-radio>
                        <el-radio label="cms">cms</el-radio> 
                        <el-radio label="manage">manage</el-radio> 
                        <el-radio label="bis">bis</el-radio>    
                    </el-radio-group>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="接口注释" >
                    <el-radio-group v-model="form.api">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>   
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="RestController" prop="restControllerStyle">
                    <el-radio-group v-model="form.restControllerStyle">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>   
                    </el-radio-group>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row type="flex" class="row-bg" style="display:none">
            <el-col :span="12">
                <el-form-item label="作者" prop="author">
                    <el-input v-model="form.author" placeholder="请输入作者名称"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="数据库类型" >
                    <el-radio-group v-model="form.dbType">
                        <el-radio label="mysql">MySql</el-radio>
                        <el-radio label="oracle">Oracle</el-radio>
                        <el-radio disabled  label="sql_server">Sql Server</el-radio>
                        <el-radio disabled  label="postgre_sql">PostgreSQL</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="数据库地址" prop="dbUrl">
                    <el-input v-model="form.dbUrl" placeholder="请输入数据库地址"/>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="数据库用户名" prop="dbUsername">
                    <el-input v-model="form.dbUsername" placeholder="请输入数据库用户名"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="数据库密码" prop="dbPassword">
                    <el-input v-model="form.dbPassword" placeholder="请输入数据库密码"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="数据库表名称" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="数据库表名称"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="表前缀" >
                    <el-input v-model="form.tablePrefix" placeholder="请输入表前缀"/>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="控制器继承类" prop="superController">
                    <el-input v-model="form.superController" placeholder="Controller的父级 com.xin.core.bean.BaseController"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="包目录" prop="packageDir">
                    <el-input v-model="form.packageDir" placeholder="请输入包目录"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="是否分页" prop="isPage">
                    <el-radio-group v-model="form.page">
                        <el-radio :label="true">分页</el-radio>
                        <el-radio :label="false">不分页</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="输出目录" prop="outputDir" >
                    <el-input v-model="form.outputDir" placeholder="请输入功能名称"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12">
                <el-form-item label="页面类型" prop="frontType">
                    <el-radio-group v-model="form.frontType">
                        <el-radio label="vue">VUE</el-radio>
                        <el-radio label="html_vue">HTML_VUE</el-radio>
                        <el-radio label="html_layui">Layui</el-radio>
                        <el-radio label="html_material">Material</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="页面位置" prop="frontDir" >
                    <el-input v-model="form.frontDir" placeholder="请输入前台页面目录"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="12"> 
                <el-form-item label="页面功能" prop="opts">
                    <el-checkbox-group v-model="form.opts">
                        <el-checkbox label="save" >新增</el-checkbox>
                        <el-checkbox label="update" >修改</el-checkbox>
                        <el-checkbox label="delete" >删除</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                
            </el-col>
        </el-row>

                <el-form-item >
                    <el-button type="primary" @click="submit" >立即创建</el-button>
                </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'generator',
    data(){
        return {
            isSubmit:false,
            message:{
                show:false,
                type:'success',
                title:'',
                description:'',
            },
            form:{
                name:'功能名称',
                module:'cms',
                outputDir:'D:\\Programs\\eclipse\\workspaces\\default\\xin-root\\xin-cms\\src\\main\\java',
                author:'zhoujun',
                dbType:'mysql',
                dbUrl:'jdbc:mysql://127.0.0.1:3306/db_xin?useUnicode=true&characterEncoding=utf-8',
                dbUsername:'root',
                dbPassword:'root',
                tableName:'t_cms_channel',
                tablePrefix:'t_',
                superController:'com.xin.core.bean.BaseController',
                packageDir:'com.xin.cms',
                page:true,
                restControllerStyle:true,
                api:true,
                frontType:'vue',
                frontDir:'D:\\Programs\\eclipse\\workspaces\\default\\xin-root\\xin-cms\\src\\main\\resources',
                opts: ['save','update','delete']
            },
            rules:{
                name:[
                    {required:true,message:'请输入内容'}     
                ],
                author:[
                    {required:true,message:'请输入内容'}     
                ],
                dbUrl:[
                    {required:true,message:'请输入内容'}     
                ],
                dbUsername:[
                    {required:true,message:'请输入内容'}     
                ],
                dbPassword:[
                    {required:true,message:'请输入内容'}     
                ],
                tableName:[
                    {required:true,message:'请输入内容'}     
                ],
                superController:[
                    {required:true,message:'请输入内容'}     
                ],
                
            },
        }
    },
    methods: {
        submit:function(){
            var _this = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.isSubmit = true;
                    //NProgress.start();
                    this.Api.generator(this.form).then(result => {
                        //NProgress.done();
                        let { msg, code, data } = result.data;
                            this.$message({
                            message: msg,
                            type: code===0?'success':'error'
                        });
                        this.message.title = "【"+this.form.name + "】 生成 " + msg
                        this.message.type = code===0?'success':'error'
                        this.message.description = '[表：'+this.form.tableName+ ']'
                        this.message.show = true
                    });
                } else {
                console.log('error submit!!');
                return false;
                }
            })
        },
    }

}
</script>

