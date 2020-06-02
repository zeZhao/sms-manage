<template>
  <div class="ChooseEnterprise">
    <el-dialog title="选择企业" :visible.sync="isEnterprise" style="margin: 0 auto" @close="cancel">
      <el-row :gutter="20">
        <el-col :span="10"><span class="label">企业ID：</span><el-input placeholder="请输入企业ID" v-model="corpId" clearable></el-input></el-col>
        <el-col :span="10"><span class="label">企业名称：</span><el-input placeholder="请输入企业名称" v-model="corpName" clearable></el-input></el-col>
        <el-col :span="4"><el-button @click="search">查询</el-button></el-col>
      </el-row>
      <el-table :data="dataList" highlight-current-row style="width: 100%;margin-top: 20px">
        <el-table-column prop="corpId" label="企业ID"/>
        <el-table-column prop="corpName" label="企业名称"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="selected(scope.row)" type="text" size="small">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="confirm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </span>-->
    </el-dialog>

  </div>
</template>

<script>
  import Page from "@/components/Page/index"

  export default {
    name: "index",
    components: {Page},
    props: {
      isEnterprise: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pageObj: {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
        dataList:[],
        corpId:"",
        corpName:"",
        currentRowData:{}
      }
    },
    mounted() {
      this.init()
    },
    computed: {},
    methods: {
      init(){
        const params = {
          data: {
            corp: {
              corpId:this.corpId,
              corpName:this.corpName,
              // reductModel:this.reductModel,
              // contact:this.contact,
            },
            pageNumber: this.pageObj.currentPage,
            pageSize: this.pageObj.pageSize,
          }
        }
        this.$http.corp.queryByPage(params).then(res=>{
          const {code,data,msg} = res
          if(code === 200 || code === "200"){
            this.dataList = data.list
            // this.pageObj.currentPage = data.pages
            this.pageObj.total = data.total
          }
        })
      },
      search(){
        this.init()
      },
      //选中
      selected(row){
        this.$emit('cancel',false)
        this.$emit("getCorpId",row.corpId)
        this.corpId=""
        this.corpName=""
      },
      //确定
      confirm(){

      },
      cancel(){
        this.currentRowData = {}
        this.$emit('cancel',false)
      },
      handleSizeChange(pageSize) {
        this.pageObj.pageSize = pageSize
        this.init()
      },
      handleCurrentChange(currentPage) {
        this.pageObj.currentPage = currentPage
        this.init()
      },
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .ChooseEnterprise {
    >>>.el-col{
      display: flex;
      align-items: center;
      .label{
        width: 120px;
      }
    }

  }
</style>
