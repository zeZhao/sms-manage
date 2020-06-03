
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

/**
 * 节流阀
 * 判断接口请求频率是否超出设定的限制
 */
function throttle() {
  const lastRequestTimeStamp = this.lastRequestTimeStamp;
  const requestFrequency = this.requestFrequency;
  const nowTimeStamp = new Date().getTime();
  this.lastRequestTimeStamp = nowTimeStamp;
  const timeDifference = nowTimeStamp - lastRequestTimeStamp;

  //时间差小于限定值
  if(timeDifference < requestFrequency){
    if(this.queryTask != null){
      clearTimeout(this.queryTask)
    }
  }

  this.loading = true;
  this.queryTask = setTimeout(queryData.bind(this), requestFrequency);
}


function DynamicKey(key,val) {
  let params = {
    data:{
      pageIndex: this.pageObj.currentPage,
      pageNumber: this.pageObj.currentPage,
      pageSize: this.pageObj.pageSize,
    },
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

    //将时间对象转为时间戳
    if(searchParam[key] instanceof Date){
      searchParam[key] = new Date(searchParam[key]).getTime();
    }
  }

  //手动调整一次提交的数据
  searchParam = this._formatRequestData(searchParam);



  let params = {}
  //提交参数做兼容处理
  if(this.namespace){
    let newF = DynamicKey.bind(this,this.namespace,searchParam)
    params = newF()
  }else{
    params = {
      ...searchParam,
      pageIndex: this.pageObj.currentPage,
      pageNumber: this.pageObj.currentPage,
      pageSize: this.pageObj.pageSize,
    }
  }

  const {namespace,list} = this.searchAPI //动态接口路径

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
        list:"",
        detele:""
      },
      namespace:'',
      delAPI: '',
      //增加请求接口节流阀
      //节流阀-最后一次请求的时间戳
      lastRequestTimeStamp: 0,
      //节流阀-接口请求频率限制(ms)
      requestFrequency: 300,
      //节流阀-查询接口任务
      queryTask: null,
    }
  },

  created(){
    console.log(111)
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
      throttle.call(this)
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
      this.searchParam = {
        ...param
      };
      this._mxGetList();
    },

    /**
     * 删除列表中项目
     * @param id
     * @private
     */
    _mxDeleteItem(key,id){
      const h = this.$createElement;
      this.$msgbox({
        title: '删除',
        message: h('div', null, [
          h('p', null, '您确定要删除此项吗？'),
          h('p', { style: 'color: red' }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(action => {
        const params = {
          data:{},
        }
        params.data[key] = id.toString()
        const {namespace,detele} = this.searchAPI
        this.$http[namespace][detele](params).then(res=>{
          const {code, msg} = res
          if(resOk(res)){
            this.$message.info('删除成功！');
            this._mxGetList();
          }else{
            this.$message.info('删除失败！');
          }
        })
      });
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
