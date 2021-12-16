<template>
  <!--待审-->
  <div class="smsCheckWait">
    <Search
      ref="search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      @getForm="getForm"
    >
      <template slot="Other">
        <el-button
          type="primary"
          size="small"
          @click="$refs.search.renderForm()"
          >超审</el-button
        >
        <el-button type="primary" size="small" @click="addCheck"
          >增加分配</el-button
        >
        <el-button type="primary" size="small" @click="stopCheck"
          >撤回分配</el-button
        >
        <!-- <el-button type="primary" size="small" @click="handleOption(2)"
          >通过选择项</el-button
        >
        <el-button type="primary" size="small" @click="handleOption(3)"
          >驳回选择项</el-button
        > -->
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      @selection-change="selectionChange"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="source" label="审核根源">
        <template slot-scope="scope">
          <span v-if="scope.row.source === '1'">没有配置免审</span>
          <span v-if="scope.row.source === '2'">敏感词</span>
          <span v-if="scope.row.source === '3'">模板不匹配</span>
          <span v-if="scope.row.source === '5'">免审数量超标</span>
          <span v-if="scope.row.source === '6'">组合redis出错</span>
          <span v-if="scope.row.source === '7'">组合超时</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="cmGateway" label="移动通道">
        <template slot-scope="scope">
          <el-select v-model="scope.row.cmGateway">
            <el-option
              v-for="item in gatewayCmList"
              :key="item.id"
              :value="item.id"
              :label="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="cuGateway" label="联通通道">
        <template slot-scope="scope">
          <el-select v-model="scope.row.cuGateway">
            <el-option
              v-for="item in gatewayCuList"
              :key="item.id"
              :value="item.id"
              :label="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="ctGateway" label="电信通道">
        <template slot-scope="scope">
          <el-select v-model="scope.row.ctGateway">
            <el-option
              v-for="item in gatewayCtList"
              :key="item.id"
              :value="item.id"
              :label="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column prop="submitType" label="提交类型">
        <template slot-scope="scope">
          <span v-if="scope.row.submitType == 1">平台提交</span>
          <span v-if="scope.row.submitType == 2">接口提交</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="135">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="supperCheck(scope.row)"
            >超审</el-button
          >
        </template>
      </el-table-column> -->
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
        @cancel="_mxCancel"
        @selectChange="selectChange"
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
      formTit: "超审",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "smsCheckWait",
        list: "listCheckWaitByPage",
        detele: "",
        add: "",
        edit: ""
      },
      // 列表参数
      namespace: "checkWait",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "select",
          label: "审核根源",
          key: "source",
          optionData: [
            {
              key: "1",
              value: "没有配置免审"
            },
            {
              key: "2",
              value: "敏感词"
            },
            {
              key: "3",
              value: "模板不匹配"
            },
            {
              key: "5",
              value: "免审数量超标"
            },
            {
              key: "6",
              value: "组合redis错"
            },
            {
              key: "7",
              value: "组合超时"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "提交类型",
          key: "submitType",
          optionData: [
            {
              key: "1",
              value: "平台提交"
            },
            {
              key: "2",
              value: "接口提交"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "date",
          label: "提交时间",
          key: "submitTime",
          placeholder: "请选择提交时间"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          defaultValue: "",
          maxlength: "12"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "审核内容",
          key: "content",
          defaultValue: ""
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "电信通道",
          key: "ct",
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "radio",
          label: "审核状态",
          key: "checkStatus",
          initDefaultValue: "2",
          defaultValue: "2",
          optionData: [
            {
              key: "2",
              value: "通过"
            },
            {
              key: "3",
              value: "拒绝"
            }
          ],
          rules: [
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value || value == "1") {
                  callback(new Error("请选择审核状态"));
                } else {
                  callback();
                }
              }
            }
          ]
        }
      ],
      gatewayCuList: [],
      gatewayCtList: [],
      gatewayCmList: [],
      selection: []
    };
  },
  created() {
    this.gateway("cu", "2", "1");
    this.gateway("ct", "3", "1");
    this.gateway("cm", "1", "1");
  },
  mounted() {},
  computed: {},
  methods: {
    handleOption(status) {
      if (this.selection && this.selection.length != 0) {
        const checkWaitList = this.selection.map(v => {
          const { checkWaitId, cmGateway, ctGateway, cuGateway } = v;
          return { checkWaitId, cmGateway, ctGateway, cuGateway };
        });
        //2通过 3拒绝
        this.$http.smsCheckWait
          .checkSms({ status, checkWaitList })
          .then(res => {
            if (res.code === 200) {
              this._mxGetList();
              this.$message.success("操作成功");
            }
          });
      } else {
        this.$message.error("请至少选择一个任务");
      }
    },
    selectionChange(arr) {
      this.selection = arr;
    },
    /**
     * 调整筛选条件提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      //待审列表分页查询,submitType 1是平台提交 2是接口提交
      // data.submitType = 1;
      // console.log(data, "-----");
      return data;
    },
    /*
     * 获取通道列表
     * */
    gateway(keys, status, orderStatus) {
      const params = {
        data: {
          status: status,
          orderStatus: orderStatus
        }
      };
      this.$http.sysGatewayGroup.listGatewayAndGroup(params).then(res => {
        if (status === "2") {
          this.gatewayCuList = res.data;
        } else if (status === "3") {
          this.gatewayCtList = res.data;
        } else if (status === "1") {
          this.gatewayCmList = res.data;
        }

        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.name);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    getForm(form) {
      const { userId, content } = form;
      if (!userId) {
        this.$alert("请输入账户编号进行超审", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.$http.smsCheckWait
        .supperCheckUser({ data: { userId } })
        .then(res => {
          if (res.code === 200) {
            const code = res.data;
            this.supperCheck(userId, code, content);
          } else {
            this.$message.error(res.data);
          }
        });
    },
    supperCheck(userId, code, content) {
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "defaultValue", userId);
        }
        // if (item.key === 'code') {
        //   this.$set(item, "defaultValue", code);
        // }
        if (item.key === "content") {
          this.$set(item, "defaultValue", content);
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },
    submit(form) {
      if (form.checkStatus == "2") {
        if (!form.ct || !form.cm || !form.cu) {
          this.$message.error("请选择通道");
          return;
        }
      }
      this.$http.smsCheckWait.supperCheck({ data: { ...form } }).then(res => {
        this._mxSuccess(res);
      });
    },
    addCheck() {
      this.$http.smsCheckWait.addCheck().then(res => {
        if (resOk(res)) {
          this.$message.success("请求成功");
        }
      });
    },
    stopCheck() {
      this.$http.smsCheckWait.stopCheck().then(res => {
        if (resOk(res)) {
          this.$message.success("请求成功");
        }
      });
    },
    selectChange(data) {}
  },
  watch: {
    listData(newArr) {
      if (newArr.length) {
        newArr.forEach(v => {
          v.cuGateway = this.gatewayCuList.length
            ? this.gatewayCuList[0].id
            : "";
          v.cmGateway = this.gatewayCmList.length
            ? this.gatewayCmList[0].id
            : "";
          v.ctGateway = this.gatewayCtList.length
            ? this.gatewayCtList[0].id
            : "";
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.smsCheckWait {
}
</style>
