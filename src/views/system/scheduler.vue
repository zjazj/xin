<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item style="margin-bottom:5px">
        <el-button size="mini" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
		      prop="jobName"
		      label="任务名称"
		      sortable 
		      show-overflow-tooltip>
      </el-table-column>
      
      <el-table-column
        prop="jobDescription"
        label="任务描述"
        sortable>
      </el-table-column>
      
        <el-table-column
        prop="triggerName"
        label="触发器名称"
        sortable>
      </el-table-column>
      
      <el-table-column
        prop="cronExpression"
        label="执行频率"
        :formatter="cronFormatter"
        sortable>
      </el-table-column>
      
      <el-table-column
        prop="prevFireTime"
        label="上次执行"
        sortable>
        <template slot-scope="scope">
          {{scope.row.prevFireTime|dateTimeFormat}}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="nextFireTime"
        label="下次执行"
        sortable>
        <template slot-scope="scope">
          {{scope.row.nextFireTime|dateTimeFormat}}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="startTime"
        label="开始时间"
        sortable>
        <template slot-scope="scope">
          {{scope.row.startTime|dateTimeFormat}}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="triggerState"
        label="状态"
        :formatter="stateFormatter"
        sortable>
      </el-table-column>
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" v-show="scope.row.triggerState!='PAUSED'" @click="handlePause(scope.$index, scope.row)">暂停</el-button>
          <el-button type="success" size="mini" v-show="scope.row.triggerState!='ACQUIRED' && scope.row.triggerState!='WAITING' " @click="handleResume(scope.$index, scope.row)">恢复</el-button>
          <el-button type="danger"  size="mini"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  import moment from 'moment'   
  import AddOrUpdate from './scheduler-add-or-update'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataLoading: false,
        addOrUpdateVisible: false,
        jobCrons:[],
        jobClass:[],
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
    filters: {
      dateTimeFormat: function(el){
        return moment(el).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    created () {
      this.Api.dictItemList({dictCode:'jobClassName'}).then(result => {
        this.jobClass = result.data.data
      })
      this.Api.dictItemList({dictCode:'jobCrons'}).then(result => {
        this.jobCrons = result.data.data
      })
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataLoading = true
        this.Api.quartzPage(this.listQuery).then(result => {
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.jobClass,this.jobCrons)
        })
      },
      cronFormatter:function(row, column, value){
        let obj = {};
        obj = this.jobCrons.find((item)=>{
            return item.itemValue === value;
        });
        return obj==null ? value : obj.itemName;
      },
      stateFormatter:function(row, column, value){
        if (value=='WAITING') {
          return '等待执行';
        } else if (value=='PAUSED') {
          return '暂停';
        } else if (value=='ACQUIRED') {
          return '正在执行';
        } else if (value=='BLOCKED') {
          return '阻塞';
        } else if (value=='ERROR') {
          return '错误';
        }
      },

      //暂停任务
      handlePause(index, row){
        this.Api.quartzPause({"jobClassName":row.jobName,"jobGroupName":row.jobGroup}).then(result => {
          this.getDataList()
        })
      },

      //恢复任务
      handleResume(index, row){
        this.Api.quartzResume({"jobClassName":row.jobName,"jobGroupName":row.jobGroup}).then(result => {
          this.getDataList()
        })
      },



      // 删除
      handleDelete (index, row) {
        this.$confirm(`确定删除[${row.jobName}]?`, '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.Api.quartzDelete({"jobClassName":row.jobName,"jobGroupName":row.jobGroup}).then(result => {
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