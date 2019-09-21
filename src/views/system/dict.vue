<template>
  <div class="mod-menu">
    <el-row :gutter="20">
      <el-col :span="12">
          <el-form :inline="true" >
            <el-form-item >
              <el-button size="mini" v-if="hasPermission('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
            <el-form-item class="my-form-item">
              <el-input placeholder="请输入内容" v-model="queryForm.value" class="input-with-select">
                <el-select v-model="queryForm.type" slot="prepend" placeholder="请选择">
                  <el-option label="" value=""></el-option>
                  <el-option label="名称" value="name"></el-option>
                  <el-option label="编码" value="code"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="handleQuery()"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <el-table
            v-loading.body="dataLoading"
            :data="dataList"
            border
            @row-click="rowClick"
            style="width: 100%;">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              treeKey="id"
              width="150"
              label="名称">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="code"
              label="编码">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="remark"
              label="描述">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button  size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <!-- <el-button  size="mini" type="danger" @click="deleteHandle(scope.row.id, scope.row.name)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber"
              :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeTab" >
          <el-tab-pane label="字典项管理" name="item">
            <el-form :inline="true" >
              <el-form-item  class="my-form-item">
                <el-button size="mini" v-if="dictItemQuery.dictCode!=''" type="primary" @click="addOrUpdateItemHandle(null)">新增</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="itemDataList"
              border
              style="width: 100%;">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="itemName"
                header-align="center"
                align="center"
                label="内容">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="itemValue"
                label="值">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="itemOrder"
                label="排序">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="remark"
                label="描述">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button  size="mini" @click="addOrUpdateItemHandle(scope.row.id)">修改</el-button>
                  <el-button size="mini" type="danger" @click="deleteItemHandle(scope.row.id, scope.row.itemName)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      
    </el-row>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-or-update-item v-if="addOrUpdateItemVisible" ref="addOrUpdateItem" @refreshDataList="getDictItemDataList"></add-or-update-item>
  
  </div>
</template>

<script>
  import AddOrUpdate from './dict-add-or-update'
  import AddOrUpdateItem from './dictItem-add-or-update'
  
  export default {
    data () {
      return {
        activeTab: 'item',
        dataList: [],
        dataLoading: false,
        addOrUpdateVisible: false,
        addOrUpdateItemVisible:false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          name: null,
          code:null
        },
        queryForm: {
          type: '',
          value: ''
        },
        itemDataList: [],
        dictItemQuery: {
          pageNumber: 1,
          pageSize: 10,
          dictCode: ''
        },
      }
    },
    components: {
      AddOrUpdate,
      AddOrUpdateItem
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataLoading = true
        this.Api.dictPage(this.listQuery).then(result => {
          if (result.data.code===0 && result.data.total!=null) {
            this.total = result.data.total
            this.dataList = result.data.rows
            this.dataLoading = false
          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getDataList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getDataList()
      },
      handleQuery(){
        if (this.queryForm.type === 'name'){
          this.listQuery.name = this.queryForm.value || null
        } else if (this.queryForm.type === 'code') {
          this.listQuery.code = this.queryForm.value || null
        }
        else if (this.queryForm.type === '') {
          this.listQuery.name = null
          this.listQuery.code = null
        }
        this.getDataList()
      },
      rowClick(row, event, column){
        this.dictItemQuery.dictCode = row.code
        this.getDictItemDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, name) {
        this.$confirm(`确定删除[${name}]?`, '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.Api.dictDelete(id).then(result => {
            if (result.data && result.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },

      // 获取数据列表
      getDictItemDataList () {
        this.Api.dictItemList(this.dictItemQuery).then(result => {
          if (result.data.code===0 && result.data.total!=null) {
            this.itemDataList = result.data.rows
          }
        })
      },
      handleUserSizeChange(val) {
        this.dictItemQuery.pageSize = val
        this.getUserDataList()
      },
      handleUserCurrentChange(val) {
        this.dictItemQuery.pageNumber = val
        this.getUserDataList()
      },
      handledictItemQuery(){
        if (this.queryForm.type === 'name'){
          this.listQuery.name = this.queryForm.value || null
        } else if (this.queryForm.type === 'code') {
          this.listQuery.code = this.queryForm.value || null
        }
        else if (this.queryForm.type === '') {
          this.listQuery.name = null
          this.listQuery.code = null
        }
        this.getDataList()
      },
      addOrUpdateItemHandle(id){
        this.addOrUpdateItemVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateItem.init(id,this.dictItemQuery.dictCode)
        })
      },
      
      // 删除
      deleteItemHandle (id, name) {
        this.$confirm(`确定移除[${name}]?`, '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.Api.dictItemDelete(id).then(result => {
            if (result.data && result.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDictItemDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
    }
  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>