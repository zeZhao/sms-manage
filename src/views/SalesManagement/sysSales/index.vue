<template>
  <!--销售员-->
  <div class="sysSales">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userName" label="登录名" />
      <el-table-column prop="actualName" label="真实姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="groupName" label="所属组" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type === 1 ? '主管' : (scope.row.type === 2 ? '组长' : (scope.row.type === 3 ? '组员':'介绍人'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="150">
        <template slot-scope="scope">{{scope.row.modifyTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column prop="modifier" label="修改人" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status === 1 ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="updateStatus(scope.row,'2')"
            type="text"
            size="small"
            v-if="scope.row.status === 1"
            style="color: red"
          >停用</el-button>
          <el-button
            @click="updateStatus(scope.row,'1')"
            type="text"
            size="small"
            v-else
            style="color: #3a835d"
          >启动</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
    </el-dialog>
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
        namespace: "sysSales",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "saleGroup",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "登录名",
          key: "userName",
          placeholder: "请输入登录名"
        },
        {
          type: "input",
          label: "真实姓名",
          key: "actualName",
          placeholder: "请输入真实姓名"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            },
            {
              key: 4,
              value: "介绍人"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "登录名称",
          key: "userName",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "登录密码",
          key: "password",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "真实姓名",
          key: "actualName",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            },
            {
              key: 4,
              value: "介绍人"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "销售组",
          key: "groupId",
          defaultValue: "",
          optionData: []
        }
      ],
      id: "",
      salesData: []
    };
  },
  mounted() {
    this.getEditData();
  },
  computed: {},
  methods: {
    // 获取 组
    getEditData() {
      this.$http.sysSales.getEditData({}).then(res => {
        if (res.code === 200) {
          this.salesData = res.data;
          this.formConfig.forEach(item => {
            const { key } = item;
            if (key === "groupId") {
              res.data.forEach(t => {
                let obj = {
                  key: t.sid,
                  value: t.groupName
                };
                item.optionData.push(obj);
              });
            }
          });
        }

        console.log(res, "----res");
      });
    },
    //修改状态
    updateStatus(row, status) {
      const { id } = row;
      this.$http.sysSales.updateStatus({ id, status }).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this._mxGetList();
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
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
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSales {
}
</style>
