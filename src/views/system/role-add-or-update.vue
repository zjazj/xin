<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="角色编码"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="dataForm.state" label="1">启用</el-radio>
        <el-radio v-model="dataForm.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name:'add-or-update-role',
    data () {
      return {
        visible:false,
        dataForm: {
          id: null,
          name: '',
          code: '',
          state: '1',
          remark:''
        },
        dataRule: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || null
        this.visible = true
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.id !== null) {
          // 修改
          this.Api.roleInfo(this.dataForm.id).then(result => {
            this.dataForm.name= result.data.data.name
            this.dataForm.code = result.data.data.code
            this.dataForm.state = result.data.data.state+''
            this.dataForm.remark = result.data.data.remark
          })
        }

      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            
            if (this.dataForm.id) {
              this.Api.roleUpdate(this.dataForm).then(result => {
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
              this.Api.roleSave(params).then(result => {
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
