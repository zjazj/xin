<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item style="margin-top:10px;margin-bottom:10px">
        <el-button size="small" v-if="hasPermission('sys:organization:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        width="150"
        label="名称">
      </table-tree-column>
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
        prop="remark"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="extCode"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="外部编码">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('sys:organization:update')" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('sys:organization:delete')" size="mini" type="danger" @click="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/TableTree'
  import AddOrUpdate from './organization-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.Api.organizationList().then(result => {
          if (result.data.code===0 && result.data.list!=null) {
            this.dataList = treeDataTranslate(result.data.list, 'id')
            //console.log(this.dataList);
          }
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
          this.Api.organizationDelete(id).then(result => {
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