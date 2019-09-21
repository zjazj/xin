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
            @row-click="roleSelect"
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
              prop="state"
              header-align="center"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state === 0" size="small"  type="danger">禁用</el-tag>
                <el-tag v-else-if="scope.row.state === 1" size="small" type="success">启用</el-tag>
              </template>
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
                <el-button v-if="hasPermission('sys:role:update')" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button v-if="hasPermission('sys:role:delete')" size="mini" type="danger" @click="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
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
          <el-tab-pane label="用户管理" name="user">
            <el-form :inline="true" >
              <el-form-item  class="my-form-item">
                <el-button size="mini" v-if="hasPermission('sys:roleUser:save') && userQuery.roleId!=''" type="primary" @click="addUserHandle()">新增</el-button>
              </el-form-item>
            </el-form>
            <el-table
            v-loading.body="dataLoading"
            :data="userDataList"
            border
            style="width: 100%;">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="realname"
              header-align="center"
              treeKey="id"
              width="150"
              label="用户">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="organizationName"
              label="所属组织">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="hasPermission('sys:roleUser:delete')" size="mini" type="danger" @click="deleteUserHandle(scope.row.id, scope.row.realname)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleUserSizeChange" @current-change="handleUserCurrentChange" :current-page="userQuery.pageNumber"
              :page-sizes="[10,20,30,50]" :page-size="userQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="userTotal">
            </el-pagination>
          </div>
          </el-tab-pane>
          <el-tab-pane label="权限管理" name="resource">
            <el-tree
              ref="resourceTree"
              :props="tree.props"
              :data="tree.data"
              node-key="id"
              show-checkbox
              default-expand-all
              :check-on-click-node=true
              :check-strictly=true
              @check="checkTree">
            </el-tree>

          </el-tab-pane>
        </el-tabs>
      </el-col>
      
    </el-row>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <select-user v-if="selectUserVisible" ref="selectUser" @selectedUser="selectedUser"></select-user>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  import SelectUser from '@/components/Select/select-user'
  import { treeDataTranslate } from '@/utils'
  
  export default {
    data () {
      return {
        activeTab: 'user',
        dataList: [],
        dataLoading: false,
        addOrUpdateVisible: false,
        selectUserVisible:false,
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
        userDataList: [],
        userTotal: 0,
        userQuery: {
          pageNumber: 1,
          pageSize: 10,
          roleId: ''
        },
        tree: {
          data: [],
          props: {
            label: 'name',
          },
        }
      }
    },
    components: {
      AddOrUpdate,
      SelectUser
    },
    mounted() {
      this.getDataList()
      this.loadResourceData()
    },
    methods: {
        loadResourceData() {
          this.Api.resourceList().then(result => {
            this.tree.data = treeDataTranslate(result.data.list, 'id')
            console.log(this.tree.data)
          })
        },
      // 获取数据列表
      getDataList () {
        this.dataLoading = true
        this.Api.rolePage(this.listQuery).then(result => {
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
      roleSelect(row, event, column){
        this.userQuery.roleId = row.id
        this.getUserDataList()
        this.Api.roleResourceList({roleId:row.id}).then(result => {
            let nodes = new Array()
            result.data.list.forEach((item,index) => {
              nodes.push({id:item.resourceId})
            })
            this.$refs.resourceTree.setCheckedNodes(nodes);
        })
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
          this.Api.roleDelete(id).then(result => {
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
      getUserDataList () {
        this.Api.roleUserPage(this.userQuery).then(result => {
          if (result.data.code===0 && result.data.total!=null) {
            this.userTotal = result.data.total
            this.userDataList = result.data.rows
          }
        })
      },
      handleUserSizeChange(val) {
        this.userQuery.pageSize = val
        this.getUserDataList()
      },
      handleUserCurrentChange(val) {
        this.userQuery.pageNumber = val
        this.getUserDataList()
      },
      handleUserQuery(){
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
      addUserHandle(){
        this.selectUserVisible = true
        this.$nextTick(() => {
          this.$refs.selectUser.init(this.userQuery.roleId, 'role')
        })
      },
      selectedUser(records){
          if (records.length>0) {
            let params = new Array()
            records.forEach((item,index) => {
                params.push(item.id)
            })
          let userIds =  params.join(',')
          this.Api.roleUserSaveBatch({userId:userIds,roleId:this.userQuery.roleId}).then(result => {
              this.getUserDataList()
              if (result.data.code === 0) {
                this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                })
              } else {
                this.$message.error(result.data.msg);
              }
          })

          }
      },
      // 删除
      deleteUserHandle (id, name) {
        this.$confirm(`确定移除[${name}]?`, '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.Api.roleUserDelete(id).then(result => {
            if (result.data && result.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getUserDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      checkTree(data, checked, indeterminate) {
        let nodes = this.$refs.resourceTree.getCheckedNodes()
        let params = new Array()
        nodes.forEach((item,index) => {
            params.push(item.id+'_'+item.perms)
        })
        let resourceIds =  params.join(',')
        this.Api.roleResourceSaveBatch({resourceId:resourceIds,roleId:this.userQuery.roleId,type:'role'}).then(result => {
          if (result.data && result.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getUserDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
        })
        //console.log(data, checked, indeterminate);
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