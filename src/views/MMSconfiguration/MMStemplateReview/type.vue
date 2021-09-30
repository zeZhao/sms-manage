<template>
  <div>
    <h3>{{ renderTitle }}</h3>
    <div class="container">
      <section v-if="queryType === 'views' && formObj">
        <el-form :model="formObj" label-width="350px">
          <el-form-item label="模板编号：">
            <span>{{ formObj.mmsId }}</span>
          </el-form-item>
          <el-form-item label="彩信标题：">
            <span>{{ formObj.title }}</span>
          </el-form-item>
          <el-form-item label="签名：">
            <span>{{ formObj.sign }}</span>
          </el-form-item>
          <el-form-item label="彩信内容：" />
        </el-form>
        <div class="sms-preview">
          <div v-if="formViews.length" class="mss-content">
            <section v-for="(item, index) in formViews" :key="index">
              <div v-for="(it, idx) in item[index + 1]" :key="it.pageOrder">
                <p v-if="it.pageType === 0 && it.pageMedia" style="color: #909399">{{ it.pageMedia }}</p>
                <img v-if="it.pageType === 1 && it.pageMedia" :src="it.pageMedia" class="preview-content views-pic"
                  @click="viewsPic(it.pageMedia)" />
                <audio v-if="it.pageType === 2 && it.pageMedia" :src="it.pageMedia" controls="controls"
                  class="preview-content">
                  您的浏览器不支持 audio 标签
                </audio>
                <video v-if="it.pageType === 3 && it.pageMedia" :src="it.pageMedia" controls="controls"
                  class="preview-content">
                  您的浏览器不支持 video 标签
                </video>
              </div>
            </section>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img style="display: block; width: 50%; margin: auto" :src="dialogUrl" />
          </el-dialog>
        </div>
        <el-form :model="formObj" label-width="350px">
          <el-form-item label="驳回理由：">
            <div style="width: 60%; word-break: break-all; word-wrap: break-word">{{ formObj.refuseReason }}</div>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button v-if="queryAuditStatus == 1" type="primary" @click="bringToTrial(queryArraignId)">提 审
          </el-button>
          <el-button v-if="queryAuditStatus == 1" type="primary" @click="reject(queryArraignId)">驳 回</el-button>
          <el-button v-if="queryAuditStatus == 3" type="primary" @click="partiallyPassed(queryArraignId)">部分通过
          </el-button>
          <el-button @click="cancel">关 闭</el-button>
        </div>
      </section>

      <section v-if="queryType === 'channelConfig'" style="width: 80%; margin: 50px auto">
        <el-form :model="formData" label-width="150px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="模板编号：">
                <span>{{ formData.mmsId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户编号：">
                <span>{{ formData.corpId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户名称：">
                <el-tooltip effect="dark" placement="top" :content="formData.corpName">
                  <span class="text-ellipsis">{{ formData.corpName }}</span>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="账户编号：">
                <span>{{ formData.userId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="账户名称：">
                <el-tooltip effect="dark" placement="top" :content="formData.userName">
                  <span class="text-ellipsis">{{ formData.userName }}</span>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="type" label="通道类型" align="center" />
          <el-table-column label="通道" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.codeName" placeholder="请选择通道" clearable :loading="scope.row.loading"
                loading-text="加载中..." :disabled="scope.row.disabled" @focus="handleFocus(scope.row.type)">
                <el-option v-for="item in scope.row.options" :key="item.gatewayId" :label="item.name"
                  :value="item.gatewayId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button type="primary" @click="channelReview" :disabled="diffDisabled">提 审</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formViews: [],
      formObj: undefined,
      formData: {},
      tableData: [
        {
          type: '移动',
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        },
        {
          type: '联通',
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        },
        {
          type: '电信',
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        }
      ],
      dialogVisible: false,
      dialogUrl: undefined,
      diffObj: {} //比较的对象
    }
  },
  computed: {
    queryType () {
      return this.$route.query.type;
    },
    queryArraignId () {
      return this.$route.query.arraignId;
    },
    queryAuditStatus () {
      return this.$route.query.auditStatus;
    },
    renderTitle () {
      const viewTitle = "彩信模板提审/";
      return this.queryType === "views" ? `${viewTitle}预览` : `${viewTitle}通道配置`;
    },
    diffDisabled () {
      if (Object.keys(this.diffObj).length) {
        const { cmGatewayId, cuGatewayId, ctGatewayId } = this.diffObj;
        if (this.tableData[0].codeName === cmGatewayId && this.tableData[1].codeName === cuGatewayId && this.tableData[2].codeName === ctGatewayId) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  async mounted () {
    if (this.queryType === "views") {
      const { mmsId } = this.$route.query;
      this.$http.mmsTemplateCheck.getTemplateDetail({ mmsId }).then(res => {
        if (res.code === 200) {
          this.formObj = res.data;
          const data = this.typeConversion(res.data.mmsPages);
          // data.forEach((item, index) => {
          //   item[index + 1].forEach(it => {
          //     if (it.pageType !== 0) it.pageMedia = '/api' + it.pageMedia;
          //   })
          // })
          this.formViews = data;
        } else {
          this.$message.error(res.data || res.msg);
        }
      }).catch(err => { this.$message.error(err.data || err.msg) })
    } else {
      this.formData = JSON.parse(this.$route.query.row);
      await this.getTableSelectList(); //获取所有三网所有通道数据
      this.tableData[0].codeName = this.formData.cmGatewayId === '-' ? "" : this.formData.cmGatewayId;
      this.tableData[1].codeName = this.formData.cuGatewayId === '-' ? "" : this.formData.cuGatewayId;
      this.tableData[2].codeName = this.formData.ctGatewayId === '-' ? "" : this.formData.ctGatewayId;
      // 比较对象的赋值
      this.diffObj = {
        cmGatewayId: this.tableData[0].codeName,
        cuGatewayId: this.tableData[1].codeName,
        ctGatewayId: this.tableData[2].codeName
      };
      const reviewType = [2, 3]; //2.审核中 3.审核通过
      this.tableData[0].disabled = reviewType.includes(this.formData.cmStatus);
      this.tableData[1].disabled = reviewType.includes(this.formData.cuStatus);
      this.tableData[2].disabled = reviewType.includes(this.formData.ctStatus);
    }
  },
  methods: {
    async getTableSelectList () {
      for (let i = 1; i < 4; i++) {
        const res = await this.$http.MMSgatewayInitial.selectMmsInitUserGatewayDtoByUserID({ operaId: i });
        if (res.code === 200) this.tableData[i - 1].options = res.data;
      }
    },
    //查看大图
    viewsPic (url) {
      this.dialogUrl = url
      this.dialogVisible = true
    },
    //提审
    bringToTrial (arraignId) {
      const { cm, cu, ct } = this.$route.query;
      const flag = [cm, cu, ct].every(v => !v || v === '-');
      if (flag) {
        this.$alert('该账户暂未配置通道，请先配置通道', '提示', {
          confirmButtonText: '确定',
          callback: action => { }
        });
        return;
      }
      this.$http.mmsTemplateCheck.pushGatewayArraign({ arraignId }).then(res => {
        if (res.code === 200) {
          this.cancel();
          this.$message.success('提审成功');
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //部分通过
    partiallyPassed (arraignId) {
      this.$confirm('您确定要部分通过吗？通过后账户只能发送成功审核通过的通道', '部分通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.mmsTemplateCheck.partilyPass({ arraignId }).then(res => {
          if (res.code === 200) {
            this.cancel()
            this.$message.success('部分通过成功');
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => { });
    },
    //驳回
    reject (arraignId) {
      this.$prompt('请输入驳回理由', '驳回理由', {
        confirmButtonText: '驳回',
        cancelButtonText: '取消',
        inputType: 'textarea',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (!value) return '驳回理由不得为空';
          if (value.length > 200) return '驳回理由的长度不得超过200';
        }
      }).then(({ value }) => {
        this.$http.mmsTemplateCheck.refuseBasicArragin({ arraignId, refuseReason: value }).then(res => {
          if (res.code === 200) {
            this.cancel()
            this.$message.success('驳回成功');
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => { });
    },
    //获取不同运营商-通道的下拉数据
    handleFocus (type) {
      const idx = this.returnType(type);
      this.$http.MMSgatewayInitial.selectMmsInitUserGatewayDtoByUserID({ operaId: idx + 1 }).then((res) => {
        if (res.code === 200) {
          this.tableData[idx].options = res.data;
          this.tableData[idx].loading = false; //取消加载中的样式
        } else {
          this.$message.error(res.data || res.msg);
        }
      })
    },
    //通道确认提审
    channelReview () {
      const data = {
        arraignId: this.formData.arraignId,
        cmGatewayId: this.tableData[0].codeName,
        cuGatewayId: this.tableData[1].codeName,
        ctGatewayId: this.tableData[2].codeName
      }
      this.$http.mmsTemplateCheck.gatewayConfig(data).then(res => {
        if (res.code === 200) {
          this.cancel()
          this.$message.success('提审成功')
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //公共返回索引
    returnType (type) {
      let index;
      switch (type) {
        case '移动':
          index = 0;
          break;
        case '联通':
          index = 1;
          break;
        case '电信':
          index = 2;
          break;
      }
      return index;
    },
    //格式化+排序 res数据
    typeConversion (arr) {
      const result = [];
      const isForedPageNum = [];
      for (let i = 0; i < arr.length; i++) {
        const { pageNum } = arr[i];
        if (isForedPageNum.indexOf(pageNum) === -1) {
          const obj = {};
          obj[pageNum] = arr.filter(v => pageNum === v.pageNum);
          result.push(obj);
          isForedPageNum.push(pageNum);
        }
      }
      //按照pageOrder进行排序
      result.forEach((it, idx) => {
        it[idx + 1].sort((a, b) => a.pageOrder - b.pageOrder);
      })
      return result;
    },
    cancel () { this.$router.back() }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .sms-preview {
    width: 100%;
    position: relative;

    .preview-img {
      width: 100%;
    }

    .mss-content {
      width: 50%;
      max-height: 400px;
      margin: auto;
      margin-bottom: 20px;
      border-radius: 10px;
      padding: 9px 10px 10px 12px;
      font-size: 12px;
      color: #fff;
      word-break: break-all;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(144, 147, 153, 1);
        border-radius: 20px;
      }

      section {
        margin-top: 20px;

        .preview-content {
          width: 100%;
          position: static;
          margin: 10px 0 10px 0;
        }

        .views-pic {
          width: 25%;
          cursor: pointer;
        }
      }

      img {
        width: 15px;
        position: absolute;
        bottom: -2px;
        left: 0;
        margin-left: -5px;
      }
    }

    .title {
      font-size: 12px;
      font-weight: 500;
      color: #363f66;
      line-height: 22px;
      text-align: center;
    }

    .tip {
      font-weight: 400;
      color: #888fb3;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
    }
  }

  .footer {
    margin-top: 50px;
    text-align: center;
  }
}

/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 34px;
}

.text-ellipsis {
  display: inline-block;
  width: 60px;
  line-height: 32px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>