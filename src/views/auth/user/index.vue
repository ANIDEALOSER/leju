<template>
  <div class="user-main">
    <div class="content">
      <el-card class="box">
        <div slot="header">
          <el-button type="primary" @click="goAddUser">添加用户</el-button>
          <span />
        </div>
        <el-table :data="userList" border stripe @row-click="handleSelect">
          <el-table-column label="#" type="index" :width="50" />
          <el-table-column prop="id" label="id" width="300" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="roleNames" label="角色" width="300" />
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goAddRoles(scope.row.id)">修改角色</el-button>
              <el-button type="text" style="color:green" size="small" @click="goEditUser(scope.row.id,scope.row.username)">编辑用户</el-button>
              <el-button type="text" style="color:red;" size="small" @click="goDelUser(scope.row.id,scope.row.username)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 用户的dialog -->
    <el-dialog title="编辑用户" :visible.sync="dialog" width="40%" @close="handleClose">
      <el-form ref="adminUser" :model="adminUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="adminUser.username" placeholder="建议使用英文" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="adminUser.password" />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="doSaveUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色的dialog -->
    <el-dialog title="角色" :visible.sync="dialog2" width="40%" @close="handleClose2">
      <el-transfer v-model="roleId" :titles="['全部','已选']" :data="roleListUse" />
      <span slot="footer">
        <el-button @click="handleClose2">取 消</el-button>
        <el-button type="primary" @click="doSaveRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/auth/user'
import roleApi from '@/api/auth/role'
import { resetData } from '@/utils/index'
export default {
  name: 'AuthUser',

  data() {
    return {
      dialog: false,
      dialog2: false,
      userList: [], // 所有用户列表
      roleList: [], // 所有角色列表
      roleId: [], // 当下选中的id集合
      adminUser: {},
      tempId: '' // 临时id
    }
  },
  computed: {
    roleListUse() {
      return this.roleList.map(item => {
        var obj = {
          key: item.id,
          label: item.roleName
        }
        return obj
      })
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    getUserList() {
      userApi.userList().then(res => {
        this.userList = res.data.list
      })
    },
    getRoleList() {
      roleApi.roleList().then(res => {
        this.roleList = res.data
      })
    },
    handleSelect(row) {
      console.log(row)
    },
    goAddUser() {
      resetData(this, 'adminUser')
      this.dialog = true
    },
    goEditUser(id, username) {
      this.adminUser = {
        id,
        username
      }
      this.dialog = true
    },
    handleClose() {
      this.dialog = false
    },
    handleClose2() {
      this.dialog2 = false
    },
    // 保存用户信息   角色是异步的单独处理 后期更新
    doSaveUser(id) {
      var api = null
      if (this.adminUser.id) {
        api = userApi.updateUser
      } else {
        api = userApi.saveUser
      }
      api({
        adminUser: this.adminUser
      })
        .then(res => {
          if (res.code == 'success') {
            this.$message.success('保存成功!')
            this.dialog = false
            this.getUserList()
          } else {
            this.$message.error('保存失败!')
          }
        })
    },
    goAddRoles(id) {
      this.roleId = []
      this.dialog2 = true
      this.tempId = id
      userApi
        .getRoleIdsByUser({
          userId: id
        })
        .then(res => {
          // 拼接结构
          this.roleId = res.data.reduce((a, b) => {
            a.push(b.roleId)
            return a
          }, [])
        })
    },
    // 保存角色
    doSaveRoles() {
      var api = null
      if (this.tempId) {
        api = userApi.roleUpdate
      } else {
        api = userApi.saveUserRole
      }
      api({
        userId: this.tempId,
        roleId: this.roleId
      }).then(res => {
        if (res.code == 'success') {
          this.$message.success('保存成功!')
          this.getUserList()
          this.dialog2 = false
        } else {
          this.$message.error('保存失败!')
        }
      })
    },
    // 删除角色
    goDelUser(id, username) {
      if (username == 'admin') {
        alert('想干啥嘞!超级管理员也想删!')
        return
      }
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.delUser({
          id
        }).then(res => {
          if (res.code) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          } else {
            this.$message.error('删除失败!')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    .user-main{
      .content{
        .box{
          margin: 30px;
          box-sizing: border-box;
        }
      }
    }
</style>
