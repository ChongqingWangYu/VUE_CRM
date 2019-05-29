<template>
  <div class="login_body">
    <div class="login_form">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户登录" name="login">

        </el-tab-pane>

        <el-tab-pane label="用户注册" name="register">
          <Register></Register>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import Register from "./Register";
  export default {
    name: "Home",
    components: {Register},
    data() {
      return {
        activeName: 'register',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style scoped>
  .login_body {
    width: 500px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .login_form {
    width: auto;
    height: auto;
    padding: 30px;
  }
</style>
