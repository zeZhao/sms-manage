<template>
    <div class="sysWhitelist">
<!--      <h1>白名单 接口与原型不符</h1>-->
      <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch"></Search>
    </div>
</template>

<script>
  import { listMixin } from "@/mixin"
  export default {
    mixin :[listMixin],
    data() {
      return {
        searchAPI:{
          namespace:"",
          list:""
        },
        searchParam: {
          userId:"",
          mobile:"",
          type:"",
        },
        searchFormConfig:[
          {
            type:"input",
            label:"用户ID/通道ID",
            key:"userId",
            placeholder:"请输入用户ID/通道ID"
          },
          {
            type:"input",
            label:"手机号",
            key:"mobile",
            placeholder:"请输入手机号"
          },
          {
            type:"select",
            label:"类型",
            key:"type",
            placeholder:"请选择白名单类型"
          },
        ]
      }
    },
    mounted() {
    },
    computed: {},
    methods: {},
    watch: {},
  }
</script>

<style lang="scss" scoped>
    .sysWhitelist {

    }
</style>
