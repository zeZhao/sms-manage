<template>
  <section class="app-main">
    <tags-view v-if="needTagsView" />
    <div class="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </section>
</template>

<script>
import TagsView from "./TagsView/index.vue";
// import ResizeMixin from "../mixin/ResizeHandler";
import { mapState } from "vuex";
export default {
  name: "AppMain",
  // mixins: [ResizeMixin],
  components: {
    TagsView
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
    ...mapState({
      needTagsView: state => state.settings.tagsView
    })
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 108px);
  width: 100%;
  background: #e9eaf1;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 106px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 40 + 32 */
    min-height: calc(100vh - 122px);
  }

  .fixed-header + .app-main {
    padding-top: 106px;
  }

  .content {
    background: #fff;
    padding: 24px;
    min-height: calc(100vh - 122px);
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.sidebar-container .is-active > .el-submenu__title > i {
  color: #0964ff !important;
}
.hideSidebar {
  .el-tooltip,
  .el-submenu__title {
    text-align: center;
    // i {
    //   padding-left: 18px;
    // }
  }
}

.el-form .el-form-item .el-form-item__label,
.el-table .cell {
  color: #303133 !important;
}
</style>
