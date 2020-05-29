<template>
  <div class="index">
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageObj.currentPage"
        :page-sizes="pageObj.pageSizes"
        :page-size="pageObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageObj.total">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      pageObj: {
        type: Object,
        default: () => {
          return {
            pageObj: {
              currentPage: 0,
              total: 0,
              pageSize: 10,
              pageSizes: [10, 20, 30, 40, 50]
            }
          }
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    computed: {},
    methods: {
      handleSizeChange(pageSize) {
        this.$emit("handleSizeChange", pageSize)
      },
      handleCurrentChange(currentPage) {
        this.$emit("handleCurrentChange", currentPage)
      }
    },
    watch: {},
  }
</script>

<style lang="stylus" scoped>
  .index {

  }
</style>
