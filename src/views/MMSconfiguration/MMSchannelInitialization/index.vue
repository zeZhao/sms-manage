<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="cmGatewayId" label="彩信移动通道编号" />
      <el-table-column prop="cuGatewayId" label="彩信联通通道编号" />
      <el-table-column prop="ctGatewayId" label="彩信电信通道编号" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleConfig(scope.row.userId)"
            >通道配置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="通道配置"
      width="80%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" label-width="150px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="商户编号：">
              <span>{{ formData.corpId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称：">
              <span>{{ formData.corpName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账户编号：">
              <span>{{ formData.userId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账户名称：">
              <span>{{ formData.userName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="type" label="通道类型" align="center" />
        <el-table-column label="通道" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.codeName"
              placeholder="请选择通道"
              clearable
              :loading="scope.row.loading"
              loading-text="加载中..."
              @clear="handleClear(scope.row.type)"
              @focus="handleFocus(scope.row.type)"
              @change="(e) => handleChange(e, scope.row.type)"
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
        <el-table-column label="通道编号" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.code" class="tips">请先选择通道名称</span>
            <span v-else>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';
export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: 'MMSgatewayInitial',
        list: 'queryByPage'
      },
      // 列表参数
      namespace: '',
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '商户编号',
          key: 'corpId'
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpName'
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId'
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'userName'
        },
        {
          type: 'inputNum',
          label: '移动通道编号',
          key: 'cmGatewayId'
        },
        {
          type: 'inputNum',
          label: '联通通道编号',
          key: 'cuGatewayId'
        },
        {
          type: 'inputNum',
          label: '电信通道编号',
          key: 'ctGatewayId'
        }
      ],
      dialogVisible: false,
      formData: {},
      tableData: [
        {
          type: '移动',
          codeName: null,
          options: [],
          code: null,
          loading: true
        },
        {
          type: '联通',
          codeName: null,
          options: [],
          code: null,
          loading: true
        },
        {
          type: '电信',
          codeName: null,
          options: [],
          code: null,
          loading: true
        }
      ]
    };
  },
  methods: {
    //点击通道配置打开弹窗
    handleConfig(userId) {
      this.$http.MMSgatewayInitial.selectMmsInitUserGatewayByUserID({
        userId
      }).then((res) => {
        if (res.code === 200) {
          const e = res.data;
          this.formData = e;
          this.tableData[0].codeName = e.cmGatewayName;
          this.tableData[1].codeName = e.cuGatewayName;
          this.tableData[2].codeName = e.ctGatewayName;
          this.tableData[0].code = e.cmGatewayId;
          this.tableData[1].code = e.cuGatewayId;
          this.tableData[2].code = e.ctGatewayId;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //获取不同运营商-通道的下拉数据
    handleFocus(type) {
      const idx = this.returnType(type);
      this.$http.MMSgatewayInitial.selectMmsInitUserGatewayDtoByUserID({
        operaId: idx + 1
      }).then((res) => {
        if (res.code === 200) {
          this.tableData[idx].options = res.data;
          this.tableData[idx].loading = false; //取消加载中的样式
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //选择通道根据不同的运营商进行通道编号的赋值
    handleChange(val, type) {
      this.$set(this.tableData[this.returnType(type)], 'code', val);
    },
    //清楚某一个下拉
    handleClear(type) {
      this.$set(this.tableData[this.returnType(type)], 'code', null);
    },
    //确认通道的配置
    handleConfirm() {
      const data = {
        corpId: this.formData.corpId,
        userId: this.formData.userId,
        ugId: this.formData.ugId,
        cmGatewayId: this.tableData[0].code,
        cuGatewayId: this.tableData[1].code,
        ctGatewayId: this.tableData[2].code
      };
      this.$http.MMSgatewayInitial.update(data).then((res) => {
        if (res.code === 200) {
          this._mxGetList();
          this.dialogVisible = false;
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //公共返回索引
    returnType(type) {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  color: #999999;
}
.dialog-footer {
  text-align: center;
}
</style>