<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="内容" prop="itemName">
        <el-input v-model="dataForm.itemName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="值" prop="itemValue">
        <el-input v-model="dataForm.itemValue" placeholder="请输入值"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="itemOrder">
        <el-input-number v-model="dataForm.itemOrder" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :disabled="isSubmit"  @click="dataFormSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name:'add-or-update-dict-item',
    data () {
      return {
        visible:false,
        isSubmit: false,
        dataForm: {
          id: null,
          dictCode: '',
          itemName: '',
          itemValue: '',
          itemOrder:1,
          remark:''
        },
        dataRule: {
          itemName: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          itemValue: [
            { required: true, message: '值不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      init (id,code) {
        this.dataForm.id = id || null
        this.dataForm.dictCode = code
        this.visible = true
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.id !== null) {
          // 修改
          this.Api.dictItemInfo(this.dataForm.id).then(result => {
            this.dataForm.dictCode= result.data.data.dictCode
            this.dataForm.itemName = result.data.data.itemName
            this.dataForm.itemValue = result.data.data.itemValue
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
              this.Api.dictItemUpdate(this.dataForm).then(result => {
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
            } else {
              let params = this.dataForm
              delete params.id
              this.Api.dictItemSave(params).then(result => {
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
