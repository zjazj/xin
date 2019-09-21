<template>
  <el-dialog
    title="用户选择"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form :inline="true" ref="queryForm" >
      <el-form-item style="margin-bottom:5px">
        <el-input placeholder="搜索姓名" v-model="listQuery.realname" class="input-with-select">
             <el-button slot="append" @click="getDataList" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-table
        ref="table"
      v-loading.body="dataLoading"
      :data="dataList"
      @row-click="rowClick"
      @selection-change="selectChange"
      border
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        width="150"
        label="账号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="code"
        label="编号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="realname"
        label="姓名">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="organizationName"
        label="组织">
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" size="small"  type="danger">禁用</el-tag>
          <el-tag v-else-if="scope.row.state === 1" size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name:'select-user',
    data () {
      return {
        visible:false,
        dataList: [],
        dataLoading: false,
        addOrUpdateVisible: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          realname:null,
          roleNot: null
        },
        selectedRow:[]
        
      }
    },
    mounted() {
      //this.getDataList()
    },
    methods: {
      init (id,type) {
        this.visible = true
        if (type === 'role') {
            this.listQuery.roleNot = id
        }
        this.$nextTick(() => {
            this.$refs['queryForm'].resetFields()
        })
        this.getDataList()

      },
       // 获取数据列表
      getDataList () {
        this.dataLoading = true
        if (this.listQuery.realname === '') {
            delete this.listQuery.realname
        }
        this.Api.userPage(this.listQuery).then(result => {
          if (result.data.code===0 && result.data.total!=null) {
            this.total = result.data.total
            this.dataList = result.data.rows
            this.dataLoading = false
          }
        })
      },
      
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getDataList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNumber = val
        this.getDataList()
      },
      rowClick(row,event,column){
          this.$refs.table.toggleRowSelection(row);
      },
      selectChange(val){
          this.selectedRow = val
      },
      // 表单提交
      dataFormSubmit () {
          this.$emit('selectedUser',this.selectedRow)
          this.visible = false
      }
    }
  }
</script>
