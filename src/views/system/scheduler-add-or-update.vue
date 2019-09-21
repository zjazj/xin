<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="任务类型" prop="jobClassName">
        <el-select @change="changeJob" v-model="dataForm.jobClassName" placeholder="请选择任务类型">
		      		<el-option :key="index" v-for="(item,index) in jobClass" :label="item.itemName" :value="item.itemValue"></el-option>
			   </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="dataForm.jobName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="任务分组" prop="jobGroup">
        <el-radio v-model="dataForm.jobGroup" label="1">1</el-radio>
        <el-radio v-model="dataForm.jobGroup" label="2">2</el-radio>
      </el-form-item>
      <el-form-item label="执行频率" prop="phone">
        <el-select v-model="dataForm.cronExpression" placeholder="请选择">
		      		<el-option :key="index" v-for="(item,index) in jobCrons" :label="item.itemName" :value="item.itemValue"></el-option>
			  </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :disabled="isSubmit" @click.prevent="dataFormSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import moment from 'moment'    
  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        treeVisible: false,
        isSubmit: false,
        dataForm: {
          id: null,
          jobName: '',
          jobGroup: '',
          jobClassName:'',
          triggerName:'',
          triggerDescription:'',
          jobDescription:'',
          cronExpression: '',
        },
        jobClass: [],
        jobCrons: [],
        dataRule: {
          jobClassName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          jobName: [
            { required: true, message: '组织不能为空', trigger: 'change' }
          ],
        },
      }
    },
    
    methods: {
      init (id,jobClass,jobCrons) {
        this.dataForm.id = id || null
        this.jobClass = jobClass
        this.jobCrons = jobCrons
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
          if (!this.dataForm.id) {
            // 新增
          } else {
            // 修改
            this.Api.userInfo(this.dataForm.id).then(result => {
              this.dataForm.username= result.data.data.username
              this.dataForm.code= result.data.data.code
              this.dataForm.realname = result.data.data.realname
              this.dataForm.organizationId = result.data.data.organizationId
              this.dataForm.organizationCode = result.data.data.organizationCode
              this.dataForm.organizationName = result.data.data.organizationName
              this.dataForm.gender = result.data.data.gender
              this.dataForm.phone = result.data.data.phone
              this.dataForm.email = result.data.data.email
              this.dataForm.remark = result.data.data.remark
              this.dataForm.state = result.data.data.state
              this.activateTime.push(result.data.data.activateStartTime)
              this.activateTime.push(result.data.data.activateEndTime)

              this.organizationListTreeSetCurrentNode()
            })
          }
      },
      changeJob() {

      },
      // 表单提交
      dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.isSubmit = true
              if (this.dataForm.id) {
                this.Api.quartzUpdate(this.dataForm).then(result => {
                  if (result.data && result.data.code === 0) {
                      this.$message({
                        message: '操作成功',
                        type: 'success',
                        //duration: 1500,
                        onClose: () => {
                            this.visible = false
                            this.$emit('refreshDataList')
                            setTimeout(()=>{
                                this.isSubmit = false
                            },2000)
                       }
                     })
                   } else {
                      this.isSubmit = false
                      this.$message.error('操作失败')
                   }
  
                })
              } else {
                let params = this.dataForm
                delete params.id
                this.Api.quartzSave(params).then(result => {
                  if (result.data && result.data.code === 0) {
                    this.$message({
                      message: '操作成功',
                       type: 'success',
                       duration: 1500,
                       onClose: () => {
                          this.visible = false
                          this.$emit('refreshDataList')
                          setTimeout(()=>{
                              this.isSubmit = false
                          },2000)

                       }
                     })
                   } else {
                     this.isSubmit = false
                     this.$message.error('操作失败')
                   }
                })
              }
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  .mod-organization {
    .organization-list__input,
    .icon-list__input {
      display: inline;
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>