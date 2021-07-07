<template>
  <div class="navbar">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <span class="el-breadcrumb__item fontColor">
        登录名：{{ custName }}
      </span>

      <span class="el-breadcrumb__item fontColor" style="margin: 0 30px 0 30px">
        平台时间：{{ oneSecondForGetNow }}
      </span>

      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
      </template>

      <div class="right-menu-item split ">
        <!-- <span class="line"></span> -->
      </div>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <!-- {{ custName }} -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span
              style="
                display: block;
                width: 100px;
                height: 35px;
                text-align: center;
              "
              @click="logout"
              >退出</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import { Message } from "element-ui";
import { getNewTimeForSecond } from "@/utils";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      oneSecondForGetNow: getNewTimeForSecond(),
      custName: window.localStorage.getItem("userName"),
      balance: "",
      creditLine: ""
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"])
  },
  mounted() {
    //每一秒都获取当前时间
    setInterval(() => {
      this.oneSecondForGetNow = getNewTimeForSecond();
    }, 1000);
    // this.userInfo()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      // state.token = ''

      this.$store.dispatch("user/logout").then(() => {
        this.$message({
          message: "退出成功！",
          type: "success"
        });
        Cookies.remove("Admin-Token");
        Cookies.remove("token");

        window.location.reload();
      });
    },
    userInfo: function() {
      this.$axios
        .get("/manage/sys/user/info", {
          headers: { token: window.localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.custName = res.data.result.userName;
          } else {
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.fontColor {
  color: #fff;
  font-size: 14px;
}
.fontRed {
  color: #ec5858;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #0f1b2e;
  // background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .split {
      color: #ffffff;
      padding: 0 16px;
      .line {
        width: 1px;
        height: 8px;
        background: #fff;
        display: inline-block;
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
