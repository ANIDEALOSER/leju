<template>
  <div class="role-main">
    <div class="content">
      <el-card class="box">
        <div slot="header">
          <span>
            <el-button type="primary" @click="goAddRole">创建角色</el-button>
          </span>
        </div>
        <el-table :data="roleList" border stripe @row-click="handleSelect">
          <el-table-column type="index" label="#" :width="50" />

          <el-table-column prop="id" label="id" width="300" />
          <el-table-column prop="roleName" label="角色名称" width="120" />
          <el-table-column prop="desc" label="角色描述" width="300" />
          <el-table-column label="操作" :width="220">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看角色</el-button>
              <el-button
                type="text"
                style="color:green"
                size="small"
                @click="goEdit(scope.row.id)"
              >修改角色</el-button>
              <el-button type="text" style="color:red;" size="small" @click="goDel(scope.row.id)">删除角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog title="角色" :visible.sync="dialog" width="50%" @close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.desc" />
        </el-form-item>
        <el-card shadow="never">
          <div slot="header">
            <span>选择角色对应的菜单:</span>
          </div>
          <el-tree
            ref="tree"
            :data="menuListUse"
            show-checkbox
            node-key="id"
            :default-checked-keys="selected"
            :props="defaultProps"
          />
        </el-card>

      </el-form>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import authRoleApi from '@/api/auth/role'
import authMenuApi from '@/api/auth/menu'
// 动态菜单
import { asyncRoutes } from '@/router/index'
import { resetData } from '@/utils/index'

export default {
  name: 'AuthRole',

  data() {
    return {
      dialog: false,
      roleList: [],
      menuList: [],
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selected: [],
      asyncRoutes
    }
  },
  computed: {
    menuListUse() {
      return this.menuList.reduce((a, b) => {
        var obj = {
          id: b.menu.id,
          label: b.menu.title
        }
        if (b.list) {
          obj.children = b.list.map(item => {
            return {
              id: item.id,
              label: item.title
            }
          })
        }
        a.push(obj)
        return a
      }, [])
    }

  },
  created() {
    this.getRoleList()
    this.getMenuList()
    this.initMenus()
  },
  methods: {
    getRoleList() {
      authRoleApi.roleList().then(res => {
        this.roleList = res.data
      })
    },
    handleSelect(row) {
      console.log(row)
    },
    goAddRole() {
      this.dialog = true
    },
    handleClose() {
      resetData(this, 'form')
      this.$refs.tree.setCheckedKeys([])
      this.dialog = false
    },
    handleSave() {
      // console.log(this.$refs.tree.getCheckedKeys());
      var api = null
      // 修改
      if (this.form.id) {
        api = authRoleApi.updateRole
      } else {
        api = authRoleApi.saveRole
      }
      api({
        role: {
          id: this.form.id,
          roleName: this.form.roleName,
          desc: this.form.desc
        },
        menuIds: this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys())
      }).then(res => {
        if (res.code == 'success') {
          this.$message.success('保存成功!')
          this.getRoleList()
        } else {
          this.$message.error('保存失败!')
        }
        this.dialog = false
        resetData(this, 'form')
        this.$refs.tree.setCheckedKeys([])
        // console.log(res);
      })
    },
    getMenuList() {
      authMenuApi.menuList().then(res => {
        this.menuList = res.data
      })
    },
    goEdit(id) {
      this.dialog = true
      authRoleApi
        .getRoleDetail({
          id
        })
        .then(res => {
          this.form = res.data
        })
      authRoleApi
        .getMenuByRole({
          roleId: id
        })
        .then(res => {
          // 注意: tree组件的bug  如果传递了父类id,会默认选中所有子类id
          this.selected = res.data.reduce((a, b) => {
            a.push(b.menuId)
            return a
          }, [])
          // this.$refs.tree.setCheckedKeys(selected,false);
        })
    },
    goDel(id) {
      authRoleApi.delRole({
        roleId: id
      }).then(res => {
        if (res.code == 'success') {
          this.getRoleList()
        } else {
          this.$message.error('删除失败!')
        }
      })
    },
    initMenus() {

    }
  }
}
</script>

<style lang='scss' scoped>
.role-main {
  .content {
    .box {
      box-sizing: border-box;
      margin: 30px;
    }
  }
}
</style>
