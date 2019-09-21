<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item style="margin-bottom:5px">
        <el-button size="mini" v-if="hasPermission('sys:sysLog:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading.body="dataLoading"
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="日志表id，uuid">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="用户id,记录操作用户">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="操作名称">
      </el-table-column>
      <el-table-column
        prop="moduleName"
        header-align="center"
        align="center"
        label="模块名称">
      </el-table-column>
      <el-table-column
        prop="className"
        header-align="center"
        align="center"
        label="类名称">
      </el-table-column>
      <el-table-column
        prop="methodName"
        header-align="center"
        align="center"
        label="方法名称">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        label="传入参数">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        label="操作ip">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="content">
      </el-table-column>
      <el-table-column
        prop="costTime"
        header-align="center"
        align="center"
        label="耗时">
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        label="执行结果：1正常0异常">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="请求地址">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="操作人姓名">
      </el-table-column>
      <el-table-column
        prop="organization"
        header-align="center"
        align="center"
        label="组织名称">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('sys:sysLog:update')" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('sys:sysLog:delete')" size="mini" type="danger" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './sysLog-add-or-update'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataLoading: false,
        addOrUpdateVisible: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 10
        }
      }
    },
    components: {
      AddOrUpdate
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataLoading = true
        this.Api.sysLogPage(this.listQuery).then(result => {
          if (result.data.code===0 && result.data.otal!=null) {
            console.log(result)
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, name) {
        this.$confirm('确定删除?', '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.Api.sysLogDelete(id).then(result => {
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
      }
    }
  }
</script>