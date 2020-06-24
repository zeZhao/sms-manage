import {
  toThousandFilter
} from "../filters";

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
  if (timeDifference < requestFrequency) {
    if (this.queryTask != null) {
      clearTimeout(this.queryTask)
    }
  }

  this.loading = true;
  this.queryTask = setTimeout(queryData.bind(this), requestFrequency);
}

/**
 * 处理参数格式
 * @param key
 * @param val
 */
function DynamicKey(key, val) {
  let params = {
    data: {
      pageIndex: this.pageObj.currentPage,
      pageNumber: this.pageObj.currentPage,
      pageSize: this.pageObj.pageSize,
    },
  }
  params.data[key] = {
    ...val
  }

  return params
}

/**
 * 调用接口查询数据
 */
function queryData() {
  this._mxBeforeGetList();

  this.loading = true;

  let searchParam = Object.assign({}, this.searchParam);
  // for (const key in searchParam){
  //
  //   //将时间对象转为时间戳
  //   if(searchParam[key] instanceof Date){
  //     searchParam[key] = new Date(searchParam[key]).getTime();
  //   }
  // }

  //手动调整一次提交的数据
  searchParam = this._formatRequestData(searchParam);



  let params = {}
  //提交参数做兼容处理
  if (this.namespace) {
    let newF = DynamicKey.bind(this, this.namespace, searchParam)
    params = newF()
  } else {
    params = {
      data: {
        ...searchParam,
        pageIndex: this.pageObj.currentPage,
        pageNumber: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
      }
    }
  }

  const {
    namespace,
    list
  } = this.searchAPI //动态接口路径

  this.$http[namespace][list](params).then(res => {
    this.loading = false;

    // if (!resOk(res)) {
    //     this.listData = [];
    //     this.$Message.error(res.message || res.msg);
    // }

    if (resOk(res)) {
      let list = [];
      //兼容性处理
      if (res.data.list) {
        list = res.data.list;
        this.pageObj.total = res.data.total;
      } else if (res.data.pageInfo) {
        list = res.data.pageInfo.list;
        this.pageObj.total = res.data.pageInfo.total;
        this.statistics = res.data.statistics
      }
      //使用钩子再次格式化数据
      this.listData = this._mxFormListData(list);
    } else {
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
      //统计
      statistics: {},
      loading: false,

      searchAPI: {
        namespace: "",
        list: "",
        detele: "",
        add: "",
        edit: ""
      },
      namespace: '',
      delAPI: '',
      id: '',
      editId: '',
      //增加请求接口节流阀
      //节流阀-最后一次请求的时间戳
      lastRequestTimeStamp: 0,
      //节流阀-接口请求频率限制(ms)
      requestFrequency: 300,
      //节流阀-查询接口任务
      queryTask: null,
    }
  },

  created() {},

  mounted() {
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
    _mxDeleteItem(key, id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '删除',
        message: h('div', null, [
          h('p', null, '您确定要删除此项吗？'),
          h('p', {
            style: 'color: red'
          }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(action => {
        const params = {
          data: {},
        }
        params.data[key] = id.toString()
        const {
          namespace,
          detele
        } = this.searchAPI
        this.$http[namespace][detele](params).then(res => {
          const {
            code,
            msg
          } = res
          if (resOk(res)) {
            this.$message.info('删除成功！');
            this._mxGetList();
          } else {
            this.$message.info('删除失败！');
          }
        })
      });
    },

    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
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

    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },

    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row)
      this.id = row[ID];
      this.editId = ID
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
      });
      this.addChannel = true;
    },
    /**
     * 关闭弹窗
     */
    _mxCancel() {
      this.addChannel = false;
    },

    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      return row;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      return formData;
    },

    /**
     * 提交表单操作
     * @param form    表单数据
     * @param editId        编辑修改id
     * @private
     */
    _mxHandleSubmit(form = {}, editId = this.editId) {
      form = this._mxArrangeSubmitData(form)
      const {
        namespace,
        add,
        edit
      } = this.searchAPI
      let params = {
        data: {
          ...form
        }
      };
      if (this.formTit == "新增") {
        this.$http[namespace][add](params).then(res => {
          this._mxSuccess(res)
        });
      } else {
        params.data = Object.assign(params.data, {
          [editId]: this.id
        })
        // params.data[editId] = this.id
        // this.$set(params.data, editId, this.id)
        this.$http[namespace][edit](params).then(res => {
          this._mxSuccess(res)
        });
      }
    },
    /**
     * 提交成功后执行
     * @param res
     */
    _mxSuccess(res) {
      if (resOk(res)) {
        this.$message.success(res.msg || res.data);
        this._mxGetList();
        this.addChannel = false;
      } else {
        this.$message.error(res.msg || res.data);
      }
    },

    /**
     * 设置默认选择项
     * @param list 选择项
     * @param data 获取的数据
     * @param key 选择项key值
     * @param optionKey 设置key的值
     * @param optionVal 设置value的值
     * @private
     */
    _setDefaultValue(list, data, key, optionKey, optionVal) {
      list.forEach(item => {
        if (item.key === key) {
          data.forEach(t => {
            let obj = {
              key: t[optionKey],
              value: t[optionVal]
            }
            item.optionData.push(obj)
          })

        }
      })
    },

    /**
     * 选择依赖项
     * @param data 选择项
     * @param itemKey 获取的数据
     * @param selectKey 选择项key值
     * @param Keys 设置key的值
     * @private
     */

    _changeDepend(data, itemKey, selectKey, Keys) {
      const {
        val,
        item
      } = data;
      let obj = {};
      if (item.key === itemKey) {
        item.optionData.map(t => {
          if (t[selectKey] == val) {
            obj = t;
          }
        });
        this._setDefaultValueKeys(Keys, obj)
      }
    },


    _setDefaultValueKeys(defaultKey, val) {
      this.formConfig.map(t => {
        const {
          key
        } = t;
        if (key === defaultKey) {
          t.defaultValue = val
        }
      });
    },


    /**
     * 设置表单项显示隐藏
     * @param list 选择项
     * @param key 选择项key值
     * @private
     */
    _setDisplayShow(list, key, show) {
      list.forEach(item => {
        if (item.key === key) {
          this.$set(item, 'isShow', show)
          // item.isShow = true
        }
      })
    }

  }
}
