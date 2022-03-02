<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      style="border-right: 1px solid rgba(232,236,239,1)"
      wrap-class="scrollbar-wrapper"
    >
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
        <!-- <el-menu-item index="4" class="submenu-title-noDropdown">
          <svg-icon
            icon-class="duanxin"
            style="width: 20px;
            height: 20px;
            fill: currentColor;
            overflow: hidden;"
          />
          <a
            href="http://cspadmin.jvtd.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span slot="title">
              5G短信
            </span>
          </a>
        </el-menu-item>
        <el-menu-item index="5" class="submenu-title-noDropdown">
          <svg-icon
            icon-class="duanxin"
            style="width: 20px;
            height: 20px;
            fill: currentColor;
            overflow: hidden;"
          />
          <a
            href="https://rce-demo.rongcloud.net/admin/#/contact/org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span slot="title">
              移动端管理
            </span>
          </a>
        </el-menu-item> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return true;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .el-menu--collapse .svg-icon {
  margin-left: 16px;
}
</style>
