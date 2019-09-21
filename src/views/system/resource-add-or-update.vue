<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          v-model="treeVisible"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="linkUrl">
        <el-input v-model="dataForm.linkUrl" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item  label="授权标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              v-model="iconVisible"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.iconName }">
                  <!-- <icon-svg :name="item"></icon-svg> -->
                  <icon v-if="item!=null" :name="item"></icon>
                </el-button>
              </div>
            </el-popover>
            <icon v-if="dataForm.iconName && dataForm.iconName.length>0" :name="dataForm.iconName" :w='24' :h='24'></icon>
            {{dataForm.iconName}}
            <el-input type="hidden" v-model="dataForm.iconName" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
            <el-button @click="handleIconSelect" type="text">选择图标</el-button>
            <!-- <el-input v-model="dataForm.iconName" @click="handleIconSelect" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
           -->
          </el-col>
          <!-- <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <el-button @click="handleIconSelect" type="text">选择图标</el-button>
            </el-tooltip>
          </el-col> -->
        </el-row>
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
  import myIcon from '@/icons/index'
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
        iconVisible: false,
        treeVisible: false,
        typeList: ['目录', '菜单', '按钮'],
        iconList: [],
        dataForm: {
          id: null,
          name: '',
          type: 1,
          parentId: 0,
          parentName: '',
          linkUrl: '',
          perms: '',
          sort: 0,
          iconName: '',
          state: 1,
          lv:1
        },
        dataRule: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级菜单不能为空', trigger: 'change' }
          ],
          url: [
            { validator: validateUrl, trigger: 'blur' }
          ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = myIcon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || null

        this.Api.resourceList({typeIn:'1,2'}).then(result => {
          let data = result.data.rows
          data.push({id:0,name:'根目录'})
          this.menuList = treeDataTranslate(data, 'id') 
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.dataForm.iconName = ''
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode()
          } else {
            // 修改
            this.Api.resourceInfo(this.dataForm.id).then(result => {
              this.dataForm.name= result.data.data.name
              this.dataForm.type = result.data.data.type
              this.dataForm.parentId = result.data.data.parentId
              this.dataForm.linkUrl = result.data.data.linkUrl
              this.dataForm.perms = result.data.data.perms
              this.dataForm.sort = result.data.data.sort
              this.dataForm.iconName = result.data.data.iconName
              this.dataForm.state = result.data.data.state
              this.dataForm.lv = result.data.data.lv
              this.menuListTreeSetCurrentNode()
            })
          }
        })

      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
        this.treeVisible = false
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.iconName = iconName
        this.iconVisible = false
      },
      handleIconSelect(){
      this.iconVisible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            
            if (this.dataForm.id) {
              this.Api.resourceUpdate(this.dataForm).then(result => {
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
              this.Api.resourceSave(params).then(result => {
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
  .mod-menu {
    .menu-list__input,
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