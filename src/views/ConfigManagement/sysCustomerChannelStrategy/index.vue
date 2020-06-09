<template>
  <!--客户通道策略-->
  <div class="sysCustomerChannelStrategy">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="strategyLevel" label="策略类型"/>
      <el-table-column prop="corpId" label="企业ID"/>
      <el-table-column prop="userId" label="用户ID"/>
      <el-table-column prop="userName" label="用户名称"/>
      <el-table-column prop="code" label="特服号"/>
      <el-table-column prop="cmPassagewayId" label="移动网关"/>
      <el-table-column prop="cuPassagewayId" label="联通网关"/>
      <el-table-column prop="ctPassagewayId" label="电信网关"/>
      <el-table-column prop="modifier" label="修改人"/>
      <el-table-column prop="modifyTime" label="修改时间"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('strategyId',scope.row.strategyId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
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
          namespace: "sysCustomerChannelStrategy",
          list: "listStrategyByPage",
          detele: "deleteStrategy"
        },
        //搜索框数据
        searchParam: {
          strategyLevel:"",
          userId:"",
          userName:"",
          cmPassageway:"",
          cuPassageway:"",
        },
        // 列表参数
        namespace: "",
        //搜索框配置
        searchFormConfig: [
          {
            type: "select",
            label: "策略类型",
            key: "strategyLevel",
            placeholder: "请选择类型",
            optionData: [
              {key: "1", value: "系统级"},
              {key: "2", value: "特服号级"},
              {key: "3", value: "客户级"},
              {key: "4", value: "企业级"},
            ]
          },
          {
            type: "input",
            label: "用户ID",
            key: "userId",
            placeholder: "请输入用户ID"
          },
          {
            type: "input",
            label: "用户名称",
            key: "userName",
            placeholder: "请输入用户名称"
          },
          {
            type: "input",
            label: "移动通道编号",
            key: "cmPassageway",
            placeholder: "请输入移动通道编号"
          },
          {
            type: "input",
            label: "联通通道编号",
            key: "cuPassageway",
            placeholder: "请输入联通通道编号"
          },
        ],
        // 表单配置
        formConfig: [
          {
            type: "select",
            label: "用户ID",
            key: "userId",
            defaultValue:'',
            // change: this.selectUser,
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "input",
            label: "企业ID",
            key: "corporateId",
            disabled: true,
            defaultValue:'',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "input",
            label: "特服号",
            disabled: true,
            key: "code",
            defaultValue:'',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "select",
            label: "类型",
            key: "type",
            optionData: [
              {key: 1, value: "特服号"},
              {key: 2, value: "客户ID"},
              {key: 3, value: "企业ID"},
            ],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "select",
            label: "省份",
            key: "province",
            optionData: [],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "select",
            label: "移动通道",
            key: "cm",
            optionData: [],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          }, {
            type: "select",
            label: "联通通道",
            key: "cu",
            optionData: [],
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          }, {
            type: "select",
            label: "电信通道",
            optionData: [],
            key: "ct",
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
        routeId: "",
        ProvinceList: [], //省列表
        GatewayList: [] //通道列表
      }
    },
    mounted() {
      this.gateway()
      this.listSysProvince()
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
            if(key === "corporateId"){
              t.defaultValue = obj.corpId
            }
            if(key === "code"){
              t.defaultValue = obj.code
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
          console.log(res)
        })
      },
      /*
      * 获取省份列表
      * */
      listSysProvince() {
        const params = {
          data: {
            provinceName: ""
          }
        }
        this.$http.listSysProvince(params).then(res => {
          this.ProvinceList = res.data
          this.formConfig.forEach(item => {
            const {key} = item
            if (key === "province") {
              res.data.forEach(t => {
                let obj = {
                  key: t.provinceId,
                  value: t.provinceName
                }
                item.optionData.push(obj)
              })

            }
          })

        })
      },
      /*
      * 获取通道列表
      * */
      gateway() {
        const params = {
          data: {
            gatewayName: "",
            isCu: "",
            isCt: "",
            isCm: "",
          }
        }
        this.$http.gateway.listGateway(params).then(res => {
          this.GatewayList = res.data
          this.formConfig.forEach(item => {
            const {key} = item
            if (key === "cu" || key === "cm" || key === "ct") {
              res.data.forEach(t => {
                let obj = {
                  key: t.gatewayId,
                  value: t.gatewayName
                }
                item.optionData.push(obj)
              })

            }
          })

        })
      },
      submit(form) {
        let params = {}
        if (this.formTit == "新增") {
          params = {
            data: {
              ...form
            }
          }
          this.$http.sysCustomerChannelStrategy.addProvinceRoute(params).then(res => {
            if (resOk(res)) {
              this.$message.success(res.msg || res.data)
              this._mxGetList();
              this.addChannel = false
            } else {
              this.$message.error(res.msg || res.data)
            }
          })
        } else {
          params = {
            data: {
              routeId: this.routeId,
              ...form,
            }
          }
          this.$http.sysCustomerChannelStrategy.updateProvinceRoute(params).then(res => {
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
        this.routeId = row.routeId
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
      /*
      * 表格数据处理
      * */
      _mxFormListData(list) {
        list.forEach(item => {
          item.province && this.ProvinceList.forEach(t => {
            if (item.province == t.provinceId) {
              item.province = t.provinceName
            }
          })
          this.GatewayList.forEach(t => {
            const {gatewayId, gatewayName} = t
            if (item.cu == gatewayId) {
              item.cu = gatewayName
            }
            if (item.cm == gatewayId) {
              item.cm = gatewayName
            }
            if (item.ct == gatewayId) {
              item.ct = gatewayName
            }
          })
        })
        return list
      }
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysCustomerChannelStrategy {

  }
</style>
