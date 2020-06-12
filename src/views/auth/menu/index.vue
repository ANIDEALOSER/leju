<template>
  <div class="menu-main">
    <div class="content">
      <el-card class="box">
        <div slot="header">
          <span>
            <el-button
              type="primary"
              @click="goAdd(1)"
            >添加一级菜单</el-button>
          </span>
          <span>
            <el-button
              type="primary"
              @click="goInitMenus"
            >初始化菜单</el-button>
          </span>
        </div>
        <el-table
          :data="menuList"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >

          <el-table-column
            prop="title"
            label="标题"
            width="160"
          >
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon" />
              {{ scope.row.title }}
            </template>
          </el-table-column>

          <el-table-column
            prop="sort"
            label="排序(倒序)"
            width="100"
          />

          <el-table-column
            prop="name"
            label="组件名称"
            width="120"
          />

          <el-table-column
            label="路由path"
            width="220"
          >
            <template slot-scope="scope">
              {{ scope.row.pname?'/'+scope.row.pname:'' }}/{{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="url"
            label="url"
            width="120"
          />
          <el-table-column
            prop="hidden"
            label="是否隐藏"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="260"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.level==1"
                type="text"
                @click="goAdd(2,scope.row.name)"
              >添加子菜单</el-button>
              <el-button
                type="text"
                @click="goEdit(scope.row.id)"
              >修改</el-button>
              <el-button
                type="text"
                @click="doDel(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog
      title="dialogTitle"
      :visible.sync="dialog"
      width="60%"
      @close="handleClose"
    >
      <el-form
        ref="menuForm"
        :model="menuForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="选择菜单">
              <el-select v-model="seleMenuName" clearable :options="menuOptions" placeholder="" @change="onSeleMenu">
                <el-option
                  v-for="item in menuOptions"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                />
              </el-select>

            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="菜单层级">
              <el-input
                v-model="menuForm.level"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="父类菜单">
              <el-input
                v-model="menuForm.pname"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="路由名称:">
              <el-input
                v-model="menuForm.name"
                readonly
                placeholder="路由名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="redirect">
              <el-input
                v-model="menuForm.redirect"
                placeholder
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8">
            <el-form-item label="是否外联">
              <el-radio-group v-model="menuForm.outline">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="路由url">
              <el-input
                v-model="menuForm.url"
                placeholder="如果外联,这里输入url"
              />
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="菜单排序">
              <el-input-number
                v-model="menuForm.sort"
                placeholder="倒序"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="icon:">

              <el-input v-model="menuForm.icon" placeholder="">
                <div slot="prepend">
                  <!-- <svg-icon :icon-class="menuForm.icon" /> -->
                </div>

              </el-input>

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否隐藏">
              <el-input v-model="menuForm.hidden" readonly placeholder="" />

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="doSave"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择初始化菜单"
      :visible.sync="menuDialog"
      width="30%"
      @close="handleClose2"
    >
      <el-card shadow="never">
        <div slot="header">
          <span>选择角色对应的菜单:</span>
        </div>
        <el-tree
          ref="tree"
          :data="menuListNew"
          show-checkbox
          node-key="id"
          :default-checked-keys="selected"
          :props="defaultProps"
        />
      </el-card>
      <span slot="footer">
        <el-button @click="handleClose2">取 消</el-button>
        <el-button
          type="primary"
          @click="saveInitMenus"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import authMenuApi from '@/api/auth/menu'
import { resetData } from '@/utils/index'
import { asyncRoutes } from '@/router/index'
import menu from '@/api/auth/menu'

export default {
  name: 'AuthMenu',
  data() {
    return {
      dialog: false,
      menuDialog: false,
      asyncRoutes,
      menuList: [],
      selected: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuOptions: [], // 手动添加菜单 必须从选项选择 自动填充 避免误操作
      pMenuTitle: '', // 父类菜单
      seleMenuName: '',
      menuForm: {
        outline: '0' // 默认没有外联
      }
    }
  },
  computed: {
    menuListNew() {
      for (var i = 0; i < this.asyncRoutes.length; i++) {
        var route = this.asyncRoutes[i]
        route.id = route.name
        route.label = route.meta.title
        if (route.children) {
          for (var j = 0; j < route.children.length; j++) {
            var innerRoute = route.children[j]
            innerRoute.id = innerRoute.name
            innerRoute.label = innerRoute.meta.title
          }
        }
      }
      return this.asyncRoutes
    }

  },
  created() {
    this.getMenuList()
    // console.log(asyncRoutes)
  },
  methods: {
    getMenuList() {
      authMenuApi.menuList().then(res => {
        this.menuList = res.data.reduce((a, b) => {
          var obj = b.menu
          obj.children = b.list
          a.push(obj)
          return a
        }, [])
      })
    },
    handleSelect(row) {
      console.log(row)
    },

    doDel(id) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          authMenuApi
            .delMenu({
              id
            })
            .then(res => {
              if (res.code) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMenuList()
              } else {
                this.$message.error('删除失败!')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleClose() {
      this.dialog = false
      resetData(this, 'menuForm')
    },

    // 添加 等级  key为菜单唯一标识
    goAdd(level, key) {
      resetData(this, 'menuForm')
      this.menuForm.level = level
      // 设置父Id
      if (level == 1) {
        this.menuOptions = asyncRoutes.filter(item => item.level == 1)
        this.menuForm.pname = ''
      } else {
        var pmenu = this.asyncRoutes.find(item => item.name == key)
        this.menuOptions = pmenu.children
        this.menuForm.pname = pmenu.name
      }

      this.dialog = true
    },
    goEdit(id, pId) {
      this.dialog = true
      this.menuForm.id = id
      authMenuApi
        .detail({
          id
        })
        .then(res => {
          this.menuForm = res.data
        })
    },
    doSave() {
      var api = null
      if (this.menuForm.id) {
        api = authMenuApi.updateMenu
      } else {
        api = authMenuApi.saveMenu
      }
      api({
        menu: {
          ...this.menuForm
        }
      }).then(res => {
        if (res.code == 'success') {
          this.$message.success('保存成功!')
          this.handleClose()
          this.getMenuList()
        } else {
          this.$message.error('保存失败!')
        }
      })
    },
    goInitMenus() {
      this.menuDialog = true
    },
    handleClose2() {
      this.menuDialog = false
    },
    // 保存初始化菜单
    saveInitMenus() {
      var menusUseParams = {}
      // 包含父节点 而且包含半选父节点
      var treeNodes = this.$refs.tree.getCheckedNodes(false, true)
      // console.log('treeNode', treeNodes)
      // 计算一级节点的长度
      var lengthLevel1 = treeNodes.filter(item => item.level == 1).length
      var menusUse = []
      // 循环修饰 所有node节点
      for (let i = 0; i < treeNodes.length; i++) {
        var node = treeNodes[i]
        node.component = ''
        node.title = node.meta.title
        node.icon = node.meta.icon
        // 给所有的子节点 添加sort  因为子节点和父节点是同级保存在treeNodes中的，只能通过children获取字节的
        if (node.level == 1) {
          node.sort = lengthLevel1--
          if (node.children) {
            for (let j = 0; j < node.children.length; j++) {
              node.children[j].pname = node.name
              node.children[j].sort = node.children.length - j
            }
          }
        }
        menusUseParams['menu[' + i + ']'] = node
      }

      authMenuApi.initMenus(menusUseParams).then(res => {
        this.$message.success(res.data.join())
        this.handleClose2()
        this.getMenuList()
        // console.log(res);
      })
    },
    onSeleMenu() {
      console.log(this.seleMenuName, this.asyncRoutes)
      var menu = ''
      if (this.menuForm.level == 1) {
        menu = this.asyncRoutes.find(item => item.name == this.seleMenuName)
      } else {
        menu = this.menuOptions.find(item => item.name == this.seleMenuName)
      }

      console.log('menu===>', menu)
      if (menu.meta) {
        this.menuForm.title = menu.meta.title
        this.menuForm.icon = menu.meta.icon
      }

      this.menuForm.hidden = menu.hidden ? 1 : 0
      this.menuForm.redirect = menu.redirect
      this.menuForm.sort = 0
      this.menuForm.name = menu.name
    }
  }
}
</script>

<style lang='scss' scoped>
.menu-main {
  .content {
    .box {
      margin: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
