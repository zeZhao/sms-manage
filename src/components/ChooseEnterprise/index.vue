<template>
  <div class="ChooseEnterprise">
    <el-dialog :title="选择企业" :visible.sync="isEnterprise" :close-on-click-modal="false" width="30%">
      <el-row :gutter="20">
        <el-col :span="6">企业ID：<el-input placeholder="请输入企业ID" v-model="corpId" clearable></el-input></el-col>
        <el-col :span="6">企业名称：<el-input placeholder="请输入企业名称" v-model="corpName" clearable></el-input></el-col>
        <el-col :span="6"><el-button @click="search">查询</el-button></el-col>
      </el-row>
      <el-table :data="dataList" highlight-current-row height="750" style="width: 100%;">
        <el-table-column prop="corpId" label="企业ID"/>
        <el-table-column prop="corpName" label="企业名称"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="selected(scope.row)" type="text" size="small">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEnterprise = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
  </div>
</template>

<script>
  import Page from "@/components/Page"

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
          currentPage: 0,
          total: 0,
          pageSize: 10,
        },
        dataList:[],
        corpId:"",
        corpName:"",
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
          if(res === 200 || res === "200"){
            this.dataList = res.data
          }
        })
      },
      search(){
        this.init()
      },
      //选中
      selected(row){

      },
      //确定
      confirm(){

      },
      handleSizeChange(pageSize) {

      },
      handleCurrentChange(currentPage) {

      },
    },
    watch: {},
  }
</script>

<style lang="stylus" scoped>
  .index {

  }
</style>
