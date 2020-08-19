<template>
  <div class="login-container">
    <div class="head-logo">
      <img :src="logo" alt />
    </div>
    <div class="login_box" style="display: block">
      <!-- <img class="loginImg" src="../../../src/image/login_bg.png" alt /> -->
      <div class="loginFormStyle">
        <div class="login_name">
          <h1>短信管理平台</h1>
          <p>
            <!-- <span>|</span>短信系统 -->
          </p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-form-item prop="verifyCode" style="overflow: hidden">
            <el-input
              v-model="loginForm.verifyCode"
              placeholder="验证码"
              prefix-icon="lj-icon-yanzhengma"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              maxlength="6"
              @keyup.enter.native="handleLogin"
              style="float: left;width: 50% "
            ></el-input>
            <div class="captcha_code">
              <img :src="captcha" ref="code" @click="getCaptcha" />
            </div>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="loginBut"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";
import logo from "@/assets/images/logo.png";
export default {
  name: "Login",
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        console.log("value", value);
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      logo: logo,
      captcha: "",
      loginForm: {
        username: "",
        password: "",
        verifyCode: "",
        uuid: this.common.randomNum(),
        time: this.common.getTime(),
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getCaptcha();
    localStorage.uuid = this.common.randomNum();
    localStorage.time = this.common.getTime();
    // window.localStorage.getItem('uuid')
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    getCaptcha() {
      var num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）

      // this.$http.sysLogin
      //   .captcha({ uuId: this.loginForm.uuid, num: num })
      //   .then(res => {
      //     this.captcha = res;
      //     console.log(res, "-----------");
      //   });
      this.captcha =
        process.env.VUE_APP_BASE_API +
        "/api/sysLogin/captcha?uuId=" +
        this.loginForm.uuid +
        "&num=" +
        num;
      console.log(this.captcha, "captcha----------");
    },
    handleLogin() {
      console.log("username", this.loginForm.username);
      if (this.loginForm.username.length === 0) {
        alert("请输入用户名");
        return;
      }
      if (this.loginForm.password.length === 0) {
        alert("请输入密码");
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 代码调到了src/store下的user.js,调用了里面的LoginByUsername方法
          let formDtat = {
            account: this.loginForm.username,
            pwd: this.loginForm.password,
            verifyCode: this.loginForm.verifyCode,
            uuId: this.loginForm.uuid,
          };
          this.$store
            .dispatch("user/LoginByUsername", formDtat)
            .then(() => {
              localStorage.userName = this.loginForm.username;
              this.$router.push({
                path: "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              localStorage.userName = this.loginForm.username;
              this.$router.push({
                path: "/",
                query: this.otherQuery,
              });
              this.getCaptcha();
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item {
    border: 1px solid #999;
    border-radius: 5px;
    color: #454545;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      background-color: #fff;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
      }
    }
  }

  .el-form-item {
    border: 1px solid #f2f2f2;
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #f8ffff;
$dark_gray: #889aa4;
$light_gray: #eee;
.el-form-item__content {
  background-color: #fff;
}
.loginFormStyle {
  height: 500px;
  border: 1px solid #cccccc;
  vertical-align: top;
  width: 45%;
  margin: 0 auto;
  background: #fff;
  &:hover {
    box-shadow: 0 5px 10px 0 rgba(51, 51, 51, 0.3);
  }
}
.login_name {
  width: 100%;
  float: left;
  text-align: left;
  margin-top: 20px;
  padding: 40px 35px 0;
  color: #666;
}
.login_name span {
  margin-right: 10px;
  font-weight: 700;
  color: #1890ff;
}
.login-container {
  min-height: 100%;
  width: 100%;

  background-color: $bg;
  background: url("../../assets/images/login-bg.png") no-repeat;
  overflow: hidden;
  .head-logo {
    position: fixed;
    top: 0;
    left: 0;
    padding: 32px;
    box-sizing: border-box;
    img {
      width: 91px;
      height: 41px;
      object-fit: fill;
      cursor: pointer;
    }
  }

  .login-form {
    position: relative;
    width: 100%;
    display: inline-block;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    vertical-align: top;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .captcha_code {
    width: 50%;
    display: inline-block;
    text-align: right;
    height: 47px;
  }
  .captcha_code img {
    display: inline-block;
    height: 100%;
    vertical-align: -webkit-baseline-middle;
  }
  .loginImg {
    width: 50%;
  }
  .login_box {
    width: 1000px;
    display: block;
    margin: 0 auto;
    vertical-align: middle;
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(50%);
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  .loginBut {
    display: inline-block;
    vertical-align: middle;
    padding: 12px 24px;
    margin: 0px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    color: #ffffff;
    // background-color: #69bebf;
    border-radius: 3px;
    border: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
  }
}
</style>
