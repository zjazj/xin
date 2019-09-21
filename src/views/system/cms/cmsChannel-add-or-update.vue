<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="名称" prop="name">
        	<el-input v-model="dataForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        	<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>   
        </el-radio-group>
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
    data () {
      return {
        visible:false,
        isSubmit: false,
        dataForm: {
          id: null,
      	  name: '',
      	  sort: '',
      	  state: 1,
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
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
          this.Api.cmsChannelInfo(this.dataForm.id).then(result => {
            this.dataForm= result.data.data
            
          })
        }

      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isSubmit = true
            if (this.dataForm.id) {
              this.Api.cmsChannelUpdate(this.dataForm).then(result => {
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
            } else {
              let params = this.dataForm
              delete params.id
              this.Api.cmsChannelSave(params).then(result => {
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
