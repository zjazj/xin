<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结果">
        <el-select v-model="listQuery.state" placeholder="请选择">
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="getDataList()">查询</el-button>
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
        prop="createTime"
        header-align="center"
        width="150"
        label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime|dateTimeFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        width="150"
        label="IP">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="operation"
        label="操作">
        <template slot-scope="scope">
          {{scope.row.moduleName + '--' + scope.row.operation}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="costTime"
        label="操作结果">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" size="small"  type="danger">失败</el-tag>
          <el-tag v-else-if="scope.row.state === 1" size="small" type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="costTime"
        label="耗时(ms)">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="username"
        label="操作人">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="organization"
        label="组织">
      </el-table-column>
      
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'    
  export default {
    data () {
      return {
        dataList: [],
        dataLoading: false,
        total: 0,
        createTime:[],
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          createTimeBegin: '',
          createTimeEnd: '',
          state: ''
        }
      }
    },
    mounted() {
      this.getDataList()
    },
    filters: {
      dateTimeFormat: function(el){
        return moment(el).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataLoading = true
        if (this.createTime.length===0) {
          delete this.listQuery.createTimeBegin
          delete this.listQuery.createTimeEnd
        } else {
          this.listQuery.createTimeBegin = moment(this.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
          this.listQuery.createTimeEnd = moment(this.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        
        if (this.listQuery.state==='') {
          delete this.listQuery.state
        }
        this.Api.logPage(this.listQuery).then(result => {
          if (result.data.code===0 && result.data.total!=null) {
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
      
    }
  }
</script>