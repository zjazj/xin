<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="dataForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="所属组织" prop="organizationId">
        <el-popover
          ref="organizationListPopover"
          placement="bottom-start"
          v-model="treeVisible"
          trigger="click">
          <el-tree
            :data="organizationList"
            :props="organizationListTreeProps"
            node-key="id"
            ref="organizationListTree"
            @current-change="organizationListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.organizationName" v-popover:organizationListPopover :readonly="true" placeholder="点击选择上级菜单" class="organization-list__input"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="dataForm.realname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="dataForm.gender" label="1">男</el-radio>
        <el-radio v-model="dataForm.gender" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱" >
          <el-input v-model="dataForm.email"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-radio v-model="dataForm.state" label="1">启用</el-radio>
        <el-radio v-model="dataForm.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="有效时间">
        <el-date-picker
          v-model="activateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
          username: '',
          code: '',
          realname: '',
          organizationId: '1',
          organizationCode: '',
          organizationName: '',
          gender: '1',
          phone: '',
          email: '',
          remark: '',
          state: '1',
          activateStartTime: '',
          activateEndTime: '',
        },
        activateTime: [],
        dataRule: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          organizationName: [
            { required: true, message: '组织不能为空', trigger: 'change' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        },
        organizationList: [],
        organizationListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      
    },
    methods: {
      init (id) {
        this.dataForm.id = id || null

        this.Api.organizationList().then(result => {
          let data = result.data.data
          this.organizationList = treeDataTranslate(data, 'id') 
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.organizationListTreeSetCurrentNode()
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
        })

      },
      // 菜单树选中
      organizationListTreeCurrentChangeHandle (data, node) {
        this.dataForm.organizationId = data.id
        this.dataForm.organizationCode = data.code
        this.dataForm.organizationName = data.name
        this.treeVisible = false
      },
      // 菜单树设置当前选中节点
      organizationListTreeSetCurrentNode () {
        this.$refs.organizationListTree.setCurrentKey(this.dataForm.organizationId)
        this.dataForm.organizationName = (this.$refs.organizationListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.isSubmit = true
              this.dataForm.activateStartTime = moment(this.activateTime[0]).format('YYYY-MM-DD HH:mm:ss')
              this.dataForm.activateEndTime = moment(this.activateTime[1]).format('YYYY-MM-DD HH:mm:ss')
              if (this.dataForm.id) {
                this.Api.userUpdate(this.dataForm).then(result => {
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
                      this.$message.error(data.msg)
                   }
  
                })
              } else {
                let params = this.dataForm
                delete params.id
                this.Api.userSave(params).then(result => {
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
                     this.$message.error(result.data.msg)
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