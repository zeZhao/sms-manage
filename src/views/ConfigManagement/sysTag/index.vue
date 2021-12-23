<template>
  <div class="sysTag">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="标签名称" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button @click="deleteTag(scope.row.id)" type="text" size="small"
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
        ref="form"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    const validatorSign = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("此项不能为空"));
      } else {
        if (value > 10) {
          callback(new Error("不能大于10"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysTag",
        list: "tagList",
        detele: "deleteTag"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {
        userId: ""
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "标签名称",
          key: "name"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "标签名称",
          key: "name",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            }
          ]
        }
      ],
      id: "",
      isChooseUser: false
    };
  },
  mounted() {},
  computed: {},
  methods: {
    deleteTag(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, "您确定要删除此项吗？")
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        this.$http.sysTag.deleteTag(id).then(res => {
          if (resOk(res)) {
            this.$message.success("删除成功");
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.sysTag.tagPost(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.sysTag.tagPut(params).then(res => {
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
      this.addChannel = true;
      this.formTit = "新增";
      // await
      setTimeout(() => {
        this.$refs.form.resetForm();
      }, 0);
    },
    edit(row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
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
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysTag {
}
</style>
