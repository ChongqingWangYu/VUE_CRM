<template>
  <el-form :model="registerRuleForm" status-icon :rules="registerRules" ref="registerRuleForm" label-width="100px"
           class="demo-ruleForm">

    <el-form-item label="用户名" prop="userName">
      <el-input type="text" v-model="registerRuleForm.userName"></el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="registerRuleForm.password" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="registerRuleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('registerRuleForm')">提交</el-button>
      <el-button @click="resetForm('registerRuleForm')">重置</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
  import RegisterService from "./RegisterService"
  export default {
    name: "Register",
    data() {
      var checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        setTimeout(() => {
          if (value.length < 6) {
            callback(new Error('用户名不能少于6位'));
          } else {
            callback();
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerRuleForm.checkPass !== '') {
            this.$refs.registerRuleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerRuleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerRuleForm: {
          userName: '',
          password: '',
          checkPass: ''
        },
        registerRules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          userName: [
            {validator: checkUserName, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
</style>
