<template>
  <!--敏感词管理-->
  <div class="sysSensitiveWord">
    <section class="left-menu">
      <el-menu
        class="el-menu-group"
        :default-active="defaultActive"
        background-color="#F2F2F2"
        text-color="#000"
        active-text-color="#000"
        @select="handleSelectGroup"
      >
        <el-menu-item
          v-for="(item, index) in groupList"
          :key="item.groupId"
          :index="item.groupId + ''"
          :class="activeIndex === index ? 'hover' : ''"
          @click="activeIndex = index"
        >
          <span slot="title" class="title">{{ item.groupName }}</span>
          <span slot class="action-bar">
            <el-popover placement="bottom" trigger="hover">
              <div style="text-align: center">
                <i
                  class="el-icon-edit"
                  style="margin: 10px; cursor: pointer"
                  @click="handleEditGroup(item)"
                  >&nbsp;&nbsp;编辑</i
                >
              </div>
              <div style="text-align: center">
                <i
                  class="el-icon-delete"
                  style="margin: 10px; cursor: pointer"
                  @click="handleDeleteGroup(item.groupId)"
                  >&nbsp;&nbsp;删除</i
                >
              </div>
              <i slot="reference" class="el-icon-more" />
            </el-popover>
          </span>
        </el-menu-item>
      </el-menu>

      <el-button
        type="primary"
        size="medium"
        style="display: block; width: 50%; margin: 30px auto"
        @click="addGroup"
      >
        添加分组
      </el-button>
    </section>

    <section class="right-content">
      <Search
        ref="Search"
        :notSearch="notSearch"
        :searchFormConfig="searchFormConfig"
        @search="handleSearch"
        @create="create"
        @exportData="exportData"
      >
        <template slot="Other">
          <el-button type="primary" size="small" @click="exportExe"
            >导出</el-button
          >
        </template>
      </Search>

      <el-table
        :data="listData"
        highlight-current-row
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column prop="wordName" label="敏感词" show-overflow-tooltip />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" min-width="150">
          <template slot-scope="scope">{{
            scope.row.createTime | timeFormat
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.remark ? scope.row.remark : "-"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button
              @click="_mxDeleteItem(scope.row.wordId)"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <Page
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></Page>

      <el-dialog
        :title="createOrUpdate"
        :visible.sync="isAddGroup"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        top="45px"
        width="30%"
      >
        <el-form ref="addGroupObj" :model="addGroupObj" label-width="100px">
          <el-form-item
            label="敏感词组"
            prop="groupName"
            :rules="[
              { required: true, message: '敏感词组不能为空', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model.trim="addGroupObj.groupName"
              clearable
              maxlength="15"
              show-word-limit
              placeholder="请输入敏感词组"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="isAddGroup = false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            v-throttle
            @click="handleConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    return {
      //默认不查所有的，而是单独查groupList[0]的数据
      notSearch: true,
      listData: [],
      //接口地址
      searchAPI: {
        namespace: "sysSensitiveWord",
        list: "listSensitiveWordByPage"
      },
      // 列表参数
      namespace: "sensitiveWord",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [{ type: "input", label: "敏感词", key: "wordName", isLonger: true }],
      defaultActive: "",
      groupList: [],
      createOrUpdate: "添加敏感词组",
      isAddGroup: false,
      addGroupObj: {},
      editId: "",
      activeIndex: 0
    };
  },
  mounted() {
    //获取敏感词分组
    this.getGroupList();
  },
  activated() {
    this.$nextTick(() => {
      this.getGroupList(); //获取敏感词分组
      this._mxGetList(); //获取列表敏感词
      this.activeIndex = 0;
    });
  },
  methods: {
    //点击搜索查询数据
    handleSearch(searchParam) {
      const params = {
        groupId: this.groupList[this.activeIndex].groupId || "",
        ...searchParam
      };
      this._mxDoSearch(params);
    },
    //获取敏感词分组
    getGroupList() {
      this.$http.sysSensitiveWordGroup.listSensitiveWordGroup().then(res => {
        if (res.code === 200) {
          this.groupList = res.data;
          this.defaultActive = this.groupList.length
            ? this.groupList[0].groupId + ""
            : "";
          //获取敏感词分组的同时去请求默认第一项的敏感词列表数据
          const groupId = this.groupList.length
            ? this.groupList[0].groupId
            : "";
          this.handleSelectGroup(groupId);
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //添加敏感词分组
    addGroup() {
      this.createOrUpdate = "添加敏感词组";
      this.addGroupObj = {};
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.$refs.addGroupObj.clearValidate();
        this.activeIndex = 0;
      });
    },
    //确认添加/修改敏感词分组
    handleConfirm() {
      this.$refs.addGroupObj.validate(valid => {
        if (valid) {
          const postUrl =
            this.createOrUpdate === "添加敏感词组"
              ? this.$http.sysSensitiveWordGroup.addSensitiveWordGroup
              : this.$http.sysSensitiveWordGroup.updateSensitiveWordGroup;
          const data =
            this.createOrUpdate === "添加敏感词组"
              ? this.addGroupObj
              : { groupId: this.editId, ...this.addGroupObj };
          postUrl({ data }).then(res => {
            if (res.code === 200) {
              this.getGroupList();
              this.isAddGroup = false;
              this.activeIndex = 0;
              this.$message.success(res.data || res.msg);
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      });
    },
    //导出
    exportData(data) {
      const params = {
        groupId: this.groupList[this.activeIndex].groupId || "",
        ...data
      };
      this.$http.sysSensitiveWord.exportKeyword(params).then(res => {
        if (res.code === 200) this.$exportToast();
      });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    //修改敏感词分组
    handleEditGroup({ groupId, groupName }) {
      this.editId = groupId;
      this.createOrUpdate = "修改敏感词组";
      this.addGroupObj = { groupName };
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.activeIndex = 0;
        this.$refs.addGroupObj.clearValidate();
      });
    },
    //删除敏感词分组
    handleDeleteGroup(groupId) {
      this.$confirm(
        "删除后组内的敏感词同步删除，请谨慎操作",
        "您确定要删除敏感词组吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.sysSensitiveWordGroup
            .deleteSensitiveWordGroup({ data: { groupId } })
            .then(res => {
              if (res.code === 200) {
                this.getGroupList();
                this.activeIndex = 0;
                this.$message.success(res.data || res.msg);
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
        })
        .catch(() => {});
    },
    //选中敏感词分组-切换数据
    handleSelectGroup(groupId) {
      this.$http.sysSensitiveWord
        .listSensitiveWordByPage({ data: { sensitiveWord: { groupId } } })
        .then(res => {
          if (res.code === 200) {
            this.listData = res.data.list;
            this.$refs.Search._mxHandleSubmit(); //目的是更新分页页脚总数数据
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    create() {
      if (!this.groupList.length) {
        this.$message.warning("请先添加敏感词组");
        return;
      }
      this.$router.push({
        name: "sysSensitiveWordType",
        query: { type: "create" }
      });
    },
    edit(row, ID) {
      this.$router.push({
        name: "sysSensitiveWordType",
        query: { type: "update", row: JSON.stringify(row), ID }
      });
    },
    _mxDeleteItem(wordId) {
      this.$confirm("删除后将不可找回，请谨慎操作", "您确定要删除敏感词吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.sysSensitiveWord
            .deleteSensitiveWord({ data: { wordId } })
            .then(res => {
              if (res.code === 200) {
                this._mxGetList();
                this.$message.success(res.data || res.msg);
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.sysSensitiveWord {
  display: flex;
  justify-content: space-between;

  .left-menu {
    width: 18%;

    .el-menu-group {
      width: 100%;
      height: 600px;
      overflow-y: auto;

      .hover {
        background-color: #ccc !important;
      }

      .title {
        width: 100px;
        height: 14px;
        line-height: 1;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: normal;
        overflow: hidden;
      }

      .action-bar {
        position: absolute;
        right: 20px;
      }
    }
  }

  .right-content {
    width: 80%;
  }
}
</style>
