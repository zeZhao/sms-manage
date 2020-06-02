
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function DynamicKey(key,val) {
  let params = {
    data:{},
    pageIndex: this.pageObj.currentPage,
    pageSize: this.pageObj.pageSize,
  }
  params.data[key] = {...val}

  return params
}

/**
 * 调用接口查询数据
 */
function queryData() {
  this._mxBeforeGetList();

  this.loading = true;

  let searchParam = Object.assign({}, this.searchParam);
  for (const key in searchParam){
    //1.传递查询参数时清除空条件
    //2.将无用字段移除不参与请求(无用字段以“_”开头和结束)
    // const reg = /^_[\S]*_$/;
    //
    // if (isEmpty(searchParam[key]) || reg.test(key)) {
    //   delete searchParam[key];
    //   continue;
    // }

    //将时间对象转为时间戳
    if(searchParam[key] instanceof Date){
      searchParam[key] = new Date(searchParam[key]).getTime();
    }
  }

  //手动调整一次提交的数据
  searchParam = this._formatRequestData(searchParam);

  const {namespace,list} = this.searchAPI

  const params = DynamicKey(this.namespace,searchParam)

  this.$http[namespace][list](params).then(res => {
    this.loading = false;

    // if (!resOk(res)) {
    //     this.listData = [];
    //     this.$Message.error(res.message || res.msg);
    // }
    if (resOk(res)){
      let list = [];
      //兼容性处理
      if(res.data.list){
        list = res.data.list;
        this.pageObj.total = res.data.total;
      }else {
        list = res.data;
        if (res.totalCount !== undefined) {
          this.pageObj.total = res.totalCount;
        }
      }
      //使用钩子再次格式化数据
      this.listData = this._mxFormListData(list);
    }else{
      this.$message.error(res.msg || "获取数据失败")
    }
  })
}

export default {
  data: function () {
    return {
      pageObj: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      //查询条件参数
      searchParam: {},

      listData: [],
      loading: false,

      searchAPI: {
        namespace:"",
        list:""
      },
      namespace:'',
      delAPI: '',
    }
  },

  created(){

  },

  mounted(){
    this._mxGetList();
  },

  methods: {
    /***
     * 获取表格数据
     * @private
     */
    _mxGetList() {
      queryData.call(this)
    },

    /***
     * 页码改变触发
     * @private
     */
    handleCurrentChange(currentPage) {
      this.pageObj.currentPage = currentPage;
      this._mxGetList();
    },

    /***
     * 每页数据条数改变触发
     * @private
     */
    handleSizeChange(pageSize) {
      this.pageObj.pageSize = pageSize;
      this._mxGetList();
    },

    /**
     * 列表查询操作
     * @param param
     * @private
     */
    _mxDoSearch(param = this.searchParam) {
      //调用查询时默认跳转到第一页
      this.pageObj.currentPage = 1;
      this._mxGetList();
    },


    /**
     * 删除列表中项目
     * @param id
     * @param text
     * @param formUrl
     * @private
     */
    _mxDeleteItem(id, text = '确定删除吗？', formUrl = (url, id)=>{return `${url}/${id}`}) {
      this.$confirmDialog(() => this._mxDoDelete(id, formUrl(this.delAPI, id)), text);
    },

    /**
     * 确认删除项目操作
     * @param id
     * @param url
     * @private
     */
    _mxDoDelete(id, url){
      this.$delete.call(this, url).then(res => {
        if (resOk(res)) {
          this.$Message.info('删除成功！');
          this._mxGetList();
        } else {
          this.$Message.info('删除失败！');
        }
      });
    },

    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows){
      return rows;
    },



    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      return data;
    },

    /**
     * 调用列表查询方法前的钩子
     * @private
     */
    _mxBeforeGetList() {

    },

  }
}
