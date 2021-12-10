<template>
  <!--黑名单-->
  <div class="blackList">
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
          <span slot="title" class="title">{{ item.blackGroupName }}</span>
          <span v-if="index > 3" slot class="action-bar">
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
      >
        <template slot="Other">
          <el-button type="primary" size="small" @click="handleBatchAdd"
            >批量添加</el-button
          >
        </template>
      </Search>

      <el-table
        :data="listData"
        border
        max-height="500"
        highlight-current-row
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column v-if="isShowUserId" prop="userId" label="账户编号" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="createUser" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" width="135">
          <template slot-scope="scope">{{
            scope.row.createTime | timeFormat
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">{{
            scope.row.remark ? scope.row.remark : "-"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="editBlackList(scope.row)"
              type="text"
              size="small"
              >修改</el-button
            >
            <el-button
              @click="deleteBlackList(scope.row.blackId)"
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
        top="20vh"
        width="30%"
      >
        <el-form ref="addGroupObj" :model="addGroupObj" label-width="100px">
          <el-form-item
            label="黑名单组："
            prop="blackGroupName"
            :rules="[
              { required: true, message: '黑名单组不能为空', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model.trim="addGroupObj.blackGroupName"
              clearable
              maxlength="15"
              show-word-limit
              placeholder="请输入黑名单组"
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

      <el-dialog
        :title="createOrUpdateBlackList"
        :visible.sync="isAddBlackList"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        top="20vh"
        width="30%"
      >
        <el-form ref="addBlackList" :model="addBlackList" label-width="100px">
          <el-form-item label="所属组：" :rules="[{ required: true }]">
            <span>{{
              groupList.length && groupList[activeIndex].blackGroupName
            }}</span>
          </el-form-item>
          <el-form-item
            label="手机号："
            prop="mobile"
            :rules="[{ required: true, trigger: 'blur', validator: $isPhone }]"
          >
            <el-input
              v-model.trim="addBlackList.mobile"
              clearable
              maxlength="11"
              show-word-limit
              placeholder="请输入手机号"
              :disabled="!!(createOrUpdateBlackList === '修改黑名单')"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model="addBlackList.remark"
              type="textarea"
              clearable
              show-word-limit
              placeholder="请输入备注"
              maxlength="300"
              :autosize="{ minRows: 3, maxRows: 4 }"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="isAddBlackList = false"
            >取消</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-throttle
            @click="handleConfirmBlackList"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <BatchAddition
        :isOpen="isOpen"
        :title="title"
        desc="文件大小 < 200M，支持xls/xlsx文档"
        :limitSize="1024 * 1024 * 200"
        downloadTemplateUrl="/template/smsBlacklist.xlsx"
        action="/sysBlacklist/importBatchAdd"
        @submit="batchSubmit"
        @cancel="cancelBatch"
      >
      </BatchAddition>
    </section>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { deepClone } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      //默认不查所有的，而是单独查groupList[0]的数据
      notSearch: true,
      listData: [],
      //接口地址
      searchAPI: {
        namespace: "sysBlacklist",
        list: "listBlacklistByPage",
        detele: "deleteSysBlackList"
      },
      //列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        { type: "input", label: "手机号", key: "mobile", isLonger: true }
      ],
      isOpen: false,
      title: "批量添加",
      defaultActive: "",
      groupList: [],
      createOrUpdate: "添加黑名单组",
      isAddGroup: false,
      addGroupObj: {},
      editId: "",
      activeIndex: 0,
      createOrUpdateBlackList: "添加黑名单",
      isAddBlackList: false,
      addBlackList: {}
    };
  },
  computed: {
    isShowUserId() {
      if (this.groupList.length) {
        const arr = ["系统级", "营销级", "BSATS级"];
        return (
          arr.indexOf(this.groupList[this.activeIndex].blackGroupName) === -1
        );
      }
      return false;
    }
  },
  mounted() {
    this.getGroupList();
  },
  activated() {
    this.getGroupList();
    this.activeIndex = 0;
  },
  methods: {
    // 点击搜索查询数据
    handleSearch(searchParam) {
      this.$nextTick(() => {
        const blackType = this.groupList[this.activeIndex].groupId || "";
        this._mxDoSearch({ blackType, ...searchParam });
      });
    },

    // 获取黑名单类别分组
    getGroupList() {
      this.$http.smsBlackGroup.listBlackGroup().then(res => {
        const { code, data } = res;
        if (code === 200) {
          this.groupList = data.reverse();
          this.defaultActive = this.groupList.length
            ? this.groupList[0].groupId + ""
            : "";
          // 请求当前选中分组的表格数据
          this.handleSelectGroup();
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },

    // 选中黑名单类别组-切换数据
    handleSelectGroup() {
      this.$refs.Search._mxHandleSubmit();
    },

    // 添加黑名单分组
    addGroup() {
      this.createOrUpdate = "添加黑名单组";
      this.addGroupObj = {};
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.$refs.addGroupObj.clearValidate();
      });
    },

    // 确认添加/修改黑名单分组
    handleConfirm() {
      this.$refs.addGroupObj.validate(valid => {
        if (valid) {
          const flag = this.createOrUpdate === "添加黑名单组";
          const postUrl = flag
            ? this.$http.smsBlackGroup.addOrUpdate
            : this.$http.smsBlackGroup.addOrUpdate;
          const data = flag
            ? this.addGroupObj
            : { groupId: this.editId, ...this.addGroupObj };
          postUrl(data).then(res => {
            if (res.code === 200) {
              this.activeIndex = 0;
              this.getGroupList();
              this.isAddGroup = false;
              this.$message.success(res.data || res.msg);
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      });
    },

    // 修改黑名单分组
    handleEditGroup({ groupId, blackGroupName }) {
      this.editId = groupId;
      this.createOrUpdate = "修改黑名单组";
      this.addGroupObj = { blackGroupName };
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.$refs.addGroupObj.clearValidate();
      });
    },

    // 删除黑名单分组
    handleDeleteGroup(id) {
      this.$confirm(
        "删除后组内的黑名单同步删除，请谨慎操作",
        "您确定要删除黑名单组吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.smsBlackGroup.delete({ id }).then(res => {
            if (res.code === 200) {
              this.activeIndex = 0;
              this.getGroupList();
              this.$message.success(res.data || res.msg);
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 批量添加
    handleBatchAdd() {
      this.isOpen = true;
    },

    // 批量添加-确认
    batchSubmit() {
      this.isOpen = false;
    },

    // 批量添加-取消
    cancelBatch() {
      this.isOpen = false;
    },

    // 添加单个黑名单
    create() {
      if (!this.groupList.length) {
        this.$message.warning("请先添加黑名单组");
        return;
      }
      this.createOrUpdateBlackList = "添加黑名单";
      this.addBlackList = {};
      this.isAddBlackList = true;
      this.$nextTick(() => {
        this.$refs.addBlackList.clearValidate();
      });
    },

    // 确认添加/修改黑名单
    handleConfirmBlackList() {
      this.$refs.addBlackList.validate(valid => {
        if (valid) {
          const flag = this.createOrUpdateBlackList === "添加黑名单";
          const postUrl = flag
            ? this.$http.sysBlacklist.addSysBlackList
            : this.$http.sysBlacklist.updateSysBlackList;
          const data = flag
            ? {
                data: {
                  blackType: this.groupList[this.activeIndex].groupId,
                  ...this.addBlackList
                }
              }
            : { data: this.addBlackList };
          postUrl(data).then(res => {
            if (res.code === 200) {
              this.handleSelectGroup();
              this.isAddBlackList = false;
              this.$message.success(res.data || res.msg);
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      });
    },

    // 修改黑名单
    editBlackList(row) {
      this.createOrUpdateBlackList = "修改黑名单";
      this.addBlackList = deepClone(row);
      this.isAddBlackList = true;
      this.$nextTick(() => {
        this.$refs.addBlackList.clearValidate();
      });
    },

    // 删除某个黑名单
    deleteBlackList(blackId) {
      this.$confirm("删除后将不可找回，请谨慎操作", "您确定要删除黑名单吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.sysBlacklist
            .deleteSysBlackList({ data: { blackId } })
            .then(res => {
              if (res.code === 200) {
                this.handleSelectGroup();
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
.blackList {
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
