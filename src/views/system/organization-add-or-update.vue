<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="组织名称"></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="parentName" v-show="dataForm.parentId!=0">
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
        <el-input v-model="dataForm.parentName" v-popover:organizationListPopover :readonly="true" placeholder="点击选择上级菜单" class="organization-list__input"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="dataForm.state" label="1">启用</el-radio>
        <el-radio v-model="dataForm.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="外部编码" prop="extCode">
        <el-input v-model="dataForm.extCode" placeholder="外部编码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        treeVisible: false,
        dataForm: {
          id: null,
          name: '',
          parentId: 1,
          parentName: '',
          state: '1',
          lv:1,
          remark: '',
          extCode: ''
        },
        dataRule: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级菜单不能为空', trigger: 'change' }
          ],
        },
        organizationList: [],
        organizationListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || null

        this.Api.organizationList().then(result => {
          let data = result.data.rows
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
            this.Api.organizationInfo(this.dataForm.id).then(result => {
              this.dataForm.name= result.data.data.name
              this.dataForm.parentId = result.data.data.parentId
              this.dataForm.remark = result.data.data.remark
              this.dataForm.extCode = result.data.data.extCode
              this.dataForm.lv = result.data.data.lv
              this.dataForm.state = result.data.data.state + ''
              this.organizationListTreeSetCurrentNode()
            })
          }
        })

      },
      // 菜单树选中
      organizationListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
        this.dataForm.lv = data.lv + 1
        this.treeVisible = false
      },
      // 菜单树设置当前选中节点
      organizationListTreeSetCurrentNode () {
        this.$refs.organizationListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.organizationListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            
            if (this.dataForm.id) {
              this.Api.organizationUpdate(this.dataForm).then(result => {
                if (result.data && result.data.code === 0) {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                         this.visible = false
                         this.$emit('refreshDataList')
                     }
                   })
                 } else {
                    this.$message.error(data.msg)
                 }

              })
            } else {
              let params = this.dataForm
              delete params.id
              this.Api.organizationSave(params).then(result => {
                if (result.data && result.data.code === 0) {
                   this.$message({
                     message: '操作成功',
                     type: 'success',
                     duration: 1500,
                     onClose: () => {
                       this.visible = false
                       this.$emit('refreshDataList')
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