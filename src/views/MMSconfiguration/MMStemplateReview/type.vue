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
                <p
                  v-if="it.pageType === 0 && it.pageMedia"
                  style="color: #909399"
                >
                  {{ it.pageMedia }}
                </p>
                <img
                  v-if="it.pageType === 1 && it.pageMedia"
                  :src="origin + it.pageMedia"
                  class="preview-content views-pic"
                  @click="viewsPic(it.pageMedia)"
                />
                <audio
                  v-if="it.pageType === 2 && it.pageMedia"
                  :src="origin + it.pageMedia"
                  controls="controls"
                  class="preview-content"
                >
                  您的浏览器不支持 audio 标签
                </audio>
                <video
                  v-if="it.pageType === 3 && it.pageMedia"
                  :src="origin + it.pageMedia"
                  controls="controls"
                  class="preview-content"
                >
                  您的浏览器不支持 video 标签
                </video>
              </div>
            </section>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img
              style="display: block; width: 50%; margin: auto"
              :src="origin + dialogUrl"
            />
          </el-dialog>
        </div>
        <!-- <el-form :model="formObj" label-width="350px">
          <el-form-item label="驳回理由：">
            <div
              style="width: 60%; word-break: break-all; word-wrap: break-word"
            >
              {{ formObj.refuseReason }}
            </div>
          </el-form-item>
        </el-form> -->
        <div class="footer">
          <!-- <el-button
            v-if="queryAuditStatus == 1"
            type="primary"
            @click="bringToTrial(queryArraignId)"
            >提 审
          </el-button>
          <el-button
            v-if="queryAuditStatus == 1"
            type="primary"
            @click="reject(queryArraignId)"
            >驳 回</el-button
          >
          <el-button
            v-if="queryAuditStatus == 3"
            type="primary"
            @click="partiallyPassed(queryArraignId)"
            >通过
          </el-button> -->
          <el-button @click="cancel">关 闭</el-button>
        </div>
      </section>

      <section
        v-if="queryType === 'channelConfig'"
        style="width: 80%; margin: 50px auto"
      >
        <el-form :model="formData" label-width="90px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="模板编号：">
                <span style="overflow-wrap: anywhere;">{{ formData.mmsId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户编号：">
                <span>{{ formData.corpId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户名称：">
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :content="formData.corpName"
                >
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
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :content="formData.userName"
                >
                  <span class="text-ellipsis">{{ formData.userName }}</span>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column prop="type" label="通道类型" align="center" />
          <el-table-column label="通道" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.codeName"
                placeholder="请选择通道"
                clearable
                :loading="scope.row.loading"
                loading-text="加载中..."
                :disabled="scope.row.disabled"
                @focus="handleFocus(scope.row.type)"
              >
                <el-option
                  v-for="item in scope.row.options"
                  :key="item.gatewayId"
                  :label="item.name"
                  :value="item.gatewayId"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button
            type="primary"
            @click="channelReview"
            :disabled="diffDisabled"
            >保 存</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </section>

      <!-- 通道审核 -->
      <section
        v-if="queryType === 'templateAudit'"
        style="width: 80%; margin: 50px auto"
      >
        <el-form :model="formData" label-width="90px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="模板编号：">
                <span style="overflow-wrap: anywhere;">{{ formData.mmsId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户编号：">
                <span>{{ formData.corpId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="商户名称：">
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :content="formData.corpName"
                >
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
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :content="formData.userName"
                >
                  <span class="text-ellipsis">{{ formData.userName }}</span>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="dialogTableVisible= true;">新增</el-button>
        <el-table
          :data="gatewayData"
          style="width: 100%"
          border
        >
          <el-table-column property="gatewayId" label="通道编号"></el-table-column>
          <el-table-column property="corpName" label="商户名称"></el-table-column>
          <el-table-column property="name" label="通道名称"></el-table-column>
          <el-table-column property="price" label="通道单价"></el-table-column>
          <el-table-column property="operator" label="运营商">
            <template slot-scope="{row}">
              <span v-if="row.operator === 0">三网</span>
              <span v-if="row.operator === 1">移动</span>
              <span v-if="row.operator === 2">联通</span>
              <span v-if="row.operator === 3">电信</span>
              <span v-if="row.operator === 3">电信</span>
              <span v-if="row.operator === 4">移动、联通</span>
              <span v-if="row.operator === 5">移动、电信</span>
              <span v-if="row.operator === 6">联通、电信</span>
            </template>
          </el-table-column>
          <el-table-column property="status" label="通道状态">
            <template slot-scope="{row}">
              <span v-if="row.status === 0">不可用</span>
              <span v-if="row.status === 1">可用</span>
            </template>
          </el-table-column>
          <el-table-column property="checkStatus" label="审核状态">
            <template slot-scope="{row}">
              <span v-if="row.checkStatus === 1">审核通过</span>
              <span v-if="row.checkStatus === 2">审核拒绝</span>
              <span v-if="row.checkStatus === 3">已删除</span>
              <span v-if="row.checkStatus === 4">审核中</span>
              <span v-if="row.checkStatus === 5">审核失败</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button @click="cancel">返 回</el-button>
        </div>
      </section>
      <el-dialog title="新增提审通道" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" ref="singleTable"
          @selection-change="handleCurrentChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="gatewayId" label="通道编号"></el-table-column>
          <el-table-column property="corpName" label="商户名称"></el-table-column>
          <el-table-column property="name" label="通道名称"></el-table-column>
          <el-table-column property="price" label="通道单价"></el-table-column>
          <el-table-column property="operator" label="运营商">
            <template slot-scope="{row}">
              <span v-if="row.operator === 0">三网</span>
              <span v-if="row.operator === 1">移动</span>
              <span v-if="row.operator === 2">联通</span>
              <span v-if="row.operator === 3">电信</span>
              <span v-if="row.operator === 3">电信</span>
              <span v-if="row.operator === 4">移动、联通</span>
              <span v-if="row.operator === 5">移动、电信</span>
              <span v-if="row.operator === 6">联通、电信</span>
            </template>
          </el-table-column>
          <el-table-column property="status" label="通道状态">
            <template slot-scope="{row}">
              <span v-if="row.status === 0">不可用</span>
              <span v-if="row.status === 1">可用</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setCurrent()">取 消</el-button>
          <el-button type="primary" @click="channelConfiguration">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formViews: [],
      formObj: undefined,
      formData: {},
      tableData: [
        {
          type: "移动",
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        },
        {
          type: "联通",
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        },
        {
          type: "电信",
          codeName: "",
          options: [],
          loading: true,
          disabled: false
        }
      ],
      dialogVisible: false,
      dialogUrl: undefined,
      diffObj: {}, //比较的对象
      // origin: window.location.origin
      origin: "http://manage.sms.jvtdtest.top/",
      gatewayData:[],
      gridData:[],
      dialogTableVisible: false,
      multipleSelection: [],
      arraignId:''
    };
  },
  computed: {
    queryType() {
      return this.$route.query.type;
    },
    queryArraignId() {
      return this.$route.query.arraignId;
    },
    queryAuditStatus() {
      return this.$route.query.auditStatus;
    },
    renderTitle() {
      const viewTitle = "彩信模板提审/";
      if(this.queryType === "views"){
        return `${viewTitle}预览`
      }else if(this.queryType === "channelConfig"){
        return `${viewTitle}通道配置`
      }else if(this.queryType === "templateAudit"){
        return `${viewTitle}通道审核`
      }
      // return this.queryType === "views"
      //   ? `${viewTitle}预览`
      //   : `${viewTitle}通道配置`;
    },
    diffDisabled() {
      if (Object.keys(this.diffObj).length) {
        const { cmGatewayId, cuGatewayId, ctGatewayId } = this.diffObj;
        if (
          this.tableData[0].codeName === cmGatewayId &&
          this.tableData[1].codeName === cuGatewayId &&
          this.tableData[2].codeName === ctGatewayId
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  async mounted() {
    if (this.queryType === "views") {
      const { mmsId } = this.$route.query;
      this.$http.mmsTemplateCheck
        .getTemplateDetail({ mmsId })
        .then(res => {
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
        })
        .catch(err => {
          this.$message.error(err.data || err.msg);
        });
    } else if (this.queryType === 'channelConfig') {
      this.formData = JSON.parse(this.$route.query.row);
      await this.getTableSelectList(); //获取所有三网所有通道数据
      let obj = await this.getMmsArraign(); //详情

      this.tableData[0].codeName = obj.cmGatewayId;
      this.tableData[1].codeName = obj.cuGatewayId;
      this.tableData[2].codeName = obj.ctGatewayId;
      // 比较对象的赋值
      this.diffObj = {
        cmGatewayId: this.tableData[0].codeName,
        cuGatewayId: this.tableData[1].codeName,
        ctGatewayId: this.tableData[2].codeName
      };
      // const reviewType = [2, 3]; //2.审核中 3.审核通过
      // this.tableData[0].disabled = reviewType.includes(this.formData.cmStatus);
      // this.tableData[1].disabled = reviewType.includes(this.formData.cuStatus);
      // this.tableData[2].disabled = reviewType.includes(this.formData.ctStatus);·
    }else{
      this.formData = JSON.parse(this.$route.query.row);
      this.getGatewayData()
      this.listMmsGatewayNoArraignment()
    }
    
  },
  methods: {
    //选中提审通道数据赋值
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },
    //通道配置
    channelConfiguration(){
      const { mmsId } = JSON.parse(this.$route.query.row);
      let arr = this.multipleSelection.map(item=> item.gatewayId)
      this.$http.templateArraignment.pushGatewayArraign({mmsId,gatewayId:arr}).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功");
            this.getGatewayData()
            this.listMmsGatewayNoArraignment()
            this.dialogTableVisible = false
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //取消新增通道审核
    setCurrent(row){
      this.dialogTableVisible = false
      this.$refs.singleTable.setCurrentRow(row);
    },
    //获取提审的通道列表
    getGatewayData(){
      const { mmsId } = JSON.parse(this.$route.query.row);
      this.$http.templateArraignment
        .listByPage({ mmsId })
        .then(res => {
          if (res.code === 200) {
            this.gatewayData = res.data
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取未提审的通道列表
    listMmsGatewayNoArraignment(){
      const { mmsId } = JSON.parse(this.$route.query.row);
      this.$http.templateArraignment
        .listMmsGatewayNoArraignment({ mmsId })
        .then(res => {
          if (res.code === 200) {
            this.gridData = res.data
            // this.$message.success("提审成功");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    async getTableSelectList() {
      const { mmsId } = JSON.parse(this.$route.query.row);
      for (let i = 1; i < 4; i++) {
        const res = await this.$http.templateArraignment.listMmsGatewayByOperator(
          { operator: i,mmsId }
        );
        if (res.code === 200) this.tableData[i - 1].options = res.data;
      }
    },
    async getMmsArraign() {
      let obj = null
      const { mmsId } = JSON.parse(this.$route.query.row);
      await this.$http.templateArraignment.getMmsArraign(
          { mmsId } 
        ).then(res=>{
          if (res.code === 200){
            this.arraignId = res.data.arraignId
            obj = res.data
          }
        })
      return obj
    },
    //查看大图
    viewsPic(url) {
      this.dialogUrl = url;
      this.dialogVisible = true;
    },
    //提审
    bringToTrial(arraignId) {
      const { cm, cu, ct } = this.$route.query;
      const flag = [cm, cu, ct].every(v => !v || v === "-");
      if (flag) {
        this.$alert("该账户暂未配置通道，请先配置通道", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.$http.mmsTemplateCheck
        .pushGatewayArraign({ arraignId })
        .then(res => {
          if (res.code === 200) {
            this.cancel();
            this.$message.success("提审成功");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //部分通过
    partiallyPassed(arraignId) {
      this.$confirm(
        "您确定要部分通过吗？通过后账户只能发送成功审核通过的通道",
        "部分通过",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.mmsTemplateCheck.partilyPass({ arraignId }).then(res => {
            if (res.code === 200) {
              this.cancel();
              this.$message.success("部分通过成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    //驳回
    reject(arraignId) {
      this.$prompt("请输入驳回理由", "驳回理由", {
        confirmButtonText: "驳回",
        cancelButtonText: "取消",
        inputType: "textarea",
        closeOnClickModal: false,
        inputValidator: value => {
          if (!value) return "驳回理由不得为空";
          if (value.length > 200) return "驳回理由的长度不得超过200";
        }
      })
        .then(({ value }) => {
          this.$http.mmsTemplateCheck
            .refuseBasicArragin({ arraignId, refuseReason: value })
            .then(res => {
              if (res.code === 200) {
                this.cancel();
                this.$message.success("驳回成功");
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    //获取不同运营商-通道的下拉数据
    handleFocus(type) {
      const { mmsId } = JSON.parse(this.$route.query.row);
      const idx = this.returnType(type);
      this.$http.templateArraignment.listMmsGatewayByOperator({
        mmsId,
        operator: idx+1
      }).then(res => {
        if (res.code === 200) {
          this.tableData[idx].loading = false; //取消加载中的样式
          this.tableData[idx].options = res.data;
          
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //通道确认提审
    channelReview() {
      const { mmsId } = JSON.parse(this.$route.query.row);
      const data = {
        mmsId,
        arraignId: this.arraignId,
        cmGatewayId: this.tableData[0].codeName,
        cuGatewayId: this.tableData[1].codeName,
        ctGatewayId: this.tableData[2].codeName
      };
      this.$http.templateArraignment.channelConfiguration(data).then(res => {
        if (res.code === 200) {
          this.cancel();
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //公共返回索引
    returnType(type) {
      let index;
      switch (type) {
        case "移动":
          index = 0;
          break;
        case "联通":
          index = 1;
          break;
        case "电信":
          index = 2;
          break;
      }
      return index;
    },
    //格式化+排序 res数据
    typeConversion(arr) {
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
      });
      return result;
    },
    cancel() {
      this.$router.back();
    }
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
