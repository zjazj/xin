<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary"  :disabled="isSubmit"  @click="dataFormSubmit()">确定</el-button>
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
        isSubmit: false,
        dataForm: {
          id: null,
          name: '',
          code: '',
          remark:''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
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
          this.Api.dictInfo(this.dataForm.id).then(result => {
            this.dataForm.name= result.data.data.name
            this.dataForm.code = result.data.data.code
            this.dataForm.remark = result.data.data.remark
          })
        }

      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isSubmit = true
            if (this.dataForm.id) {
              this.Api.dictUpdate(this.dataForm).then(result => {
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
                    this.$message.error(data.msg)
                 }

              })
            } else {
              let params = this.dataForm
              delete params.id
              this.Api.dictSave(params).then(result => {
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
