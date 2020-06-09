<template>
  <!--收入信息-->
  <div class="sysCompanyIncome">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="650"
      style="width: 100%;"
    >
      <el-table-column prop="corpId" label="序号"/>
      <el-table-column prop="corporateId" label="企业ID"/>
      <el-table-column prop="companyName" label="公司名称"/>
      <el-table-column prop="count" label="条数"/>
      <el-table-column prop="receivableMoeny" label="应收款(元)"/>
      <el-table-column prop="factMoney" label="	实收款(元)	"/>
      <el-table-column prop="poorMoeny" label="欠收款(元)"/>
      <el-table-column prop="countDate" label="账单月"/>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" style="margin: 0 auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel" @selectChange="selectChange"></FormItem>
    </el-dialog>
  </div>
</template>

<script>
  import listMixin from "@/mixin/listMixin"

  export default {
    mixins: [listMixin],
    data() {
      return {
        formTit: "新增",
        addChannel: false,
        //接口地址
        searchAPI: {
          namespace: "sysCompanyIncome",
          list: "listCompanyIncomeByPage",
          detele: "deleteCompanyIncome",
        },
        // 列表参数
        namespace: "companyIncome",
        //搜索框数据
        searchParam: {},
        //搜索框配置
        searchFormConfig: [
          {
            type: "input",
            label: "企业ID",
            key: "corporateId",
            placeholder: "请输入企业ID"
          },
          {
            type: "date",
            label: "账单月",
            key: "countDate",
            placeholder: "请选择账单月"
          },
          {
            type: "select",
            label: "是否出明细",
            key: "isDetail",
            placeholder: "请选择明细",
            optionData:[
              {
                key: 1,
                value: "否"
              },
              {
                key: 2,
                value: "是"
              },
            ]
          },
          {
            type: "select",
            label: "排序类型",
            key: "sortType",
            placeholder: "请选择查询类型",
            optionData:[
              {
                key: 0,
                value: "条数"
              },
              {
                key: 1,
                value: "应收款"
              },
              {
                key: 2,
                value: "实收款"
              },{
                key: 3,
                value: "欠收款"
              },
            ]
          },
          {
            type: "select",
            label: "排序方式",
            key: "sort",
            placeholder: "请选择排序方式",
            optionData:[
              {
                key: 0,
                value: "正序"
              },
              {
                key: 1,
                value: "倒序"
              }
            ]
          },
        ],
        // 表单配置
        formConfig: [
          {
            type: "select",
            label: "用户ID",
            key: "userId",
            defaultValue:'',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'change'},
            ]
          },
          {
            type: "input",
            label: "企业ID",
            key: "corpId",
            disabled: true,
            defaultValue:'',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "select",
            label: "计费类型",
            key: "reductType",
            optionData: [
              {
                key:1,
                value: "用户id计费"
              },
              {
                key:2,
                value: "企业id计费"
              },
            ],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'change'},
            ]
          },
          {
            type: "select",
            label: "信息类型",
            key: "chargeType",
            optionData: [
              {
                key:"1",
                value: "短信"
              },
              {
                key:"2",
                value: "彩信"
              },
            ],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'change'},
            ]
          },{
            type: "select",
            label: "操作类型",
            key: "optType",
            optionData: [
              {
                key: "1",
                value: "充值"
              },
              {
                key: "2",
                value: "补款"
              },
              {
                key: "3",
                value: "扣款"
              },
              {
                key: "4",
                value: "失败退款"
              },
              {
                key: "5",
                value: "授信"
              },
            ],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'change'},
            ]
          }, {
            type: "input",
            label: "当前操作条数",
            key: "optBalance",
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "textarea",
            label: "备注信息",
            key: "remark"
          },
        ],
        ugId: "",
        GatewayList: [] //通道列表
      }
    },
    mounted() {
      this.queryMainInfo()
    },
    computed: {},
    methods: {
      selectChange(data){
        const {val, item} = data
        let obj = {}
        if(item.key==="userId"){
          item.optionData.map(t =>{
            if(t.userId == val){
              obj = t
            }
          })
          this.formConfig.map(t =>{
            const {key} = t
            if(key === "userId"){
              t.defaultValue = obj.userId
            }
            if(key === "corpId"){
              t.defaultValue = obj.corpId
            }
          })
        }
      },
      /*
      * 获取用户企业列表
      * */
      queryMainInfo() {
        this.$http.queryMainInfo().then(res => {
          res.data.map(item => {
            this.$set(item, "key", item.userId)
            this.$set(item, "value", item.userName)
          })
          this.formConfig.map(t => {
            const {key} = t
            if (key === "userId") {
              t.optionData = res.data
            }
          })
        })
      },
      submit(form) {
        let params = {}
        if (this.formTit == "新增") {
          params = {

            ...form,
            // userId:"5826",
            // corpId:"3",
          }
          this.$http.smsBalanceopt.add(params).then(res => {
            if (resOk(res)) {
              this.$message.success(res.msg || res.data)
              this._mxGetList();
              this.addChannel = false
            } else {
              this.$message.error(res.msg || res.data)
            }
          })
        }
      },
      create() {
        this.addChannel = true
        this.formTit = "新增"
        setTimeout(() => {
          this.$refs.formItem.resetForm()
        }, 0)

      },
      edit(row) {
        this.ugId = row.ugId
        this.formTit = "修改"
        this.formConfig.forEach(item => {
          for (let key in row) {
            if (item.key === key) {
              this.$set(item, 'defaultValue', row[key])
            }
          }
        })
        this.addChannel = true
      },
      cancel() {
        this.addChannel = false
      },
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysCompanyIncome {

  }
</style>
