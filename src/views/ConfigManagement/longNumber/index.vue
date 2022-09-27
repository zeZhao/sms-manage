<template>
  <!--推送长号码配置-->
  <div class="longNumber">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    >
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="smsLongNum" label="长号码" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('userId', scope.row.userId,scope.row.id)"
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
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "smslongnum",
        list: "list",
        detele: "delete"
      },
      // 列表参数
      namespace: "configs",
      namespaceType: "Array",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "长号码",
          key: "smsLongNum",
          maxlength:30
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "长号码",
          key: "smsLongNum",
          defaultValue: "",
          maxlength: 30
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ['blur', 'change']
          //   }
          // ]
        }
      ],
      id: "",
      isChooseUser: false
    };
  },
  mounted() {},
  activated() {
    this._mxGetList();
  },
  computed: {},
  methods: {
    /**
     * 删除列表中项目
     * @param id
     * @param isData 参数是否需要data包含
     * @param isQuery  参数是否拼接在路径上
     * @private
     */
    _mxDeleteItem(
      userId,
      id,
      tip = "您确定要删除此项吗？"
    ) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, tip)
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          let params = {};
          params = {
            data: {
              configs: [
                {userId:userId.toString(),id:id.toString()}
              ]
            }
          };
          const { namespace, detele } = this.searchAPI;
          this.$http[namespace][detele](params).then(res => {
            if (resOk(res)) {
              this.$message.success("删除成功！");
              this.pageObj.currentPage = 1;
              this._mxGetList();
            } else {
              this.$message.error(res.msg || "删除失败！");
            }
          });
        })
        .catch(() => {});
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            configs: [{ ...form }]
          }
        };
        this.$http.smslongnum.add(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          data: {
            configs: [
              {
                id: this.id,
                ...form
              }
            ]
          }
        };
        this.$http.smslongnum.edit(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }

      this.addChannel = false;
    },
    create() {
      this.formTit = "新增";
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key] !== "-" ? row[key] : "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
      this.bulkEditingVisible = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.longNumber {
}
</style>
