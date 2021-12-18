<template>
  <!-- 供应商信息 -->
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>

    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="供应商编号" />
      <el-table-column prop="userName" label="供应商名称" />
      <el-table-column prop="sign" label="联系人" />
      <el-table-column prop="cm" label="手机号" />
      <el-table-column prop="cu" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="cu" label="状态" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleEnable('routeId', scope.row.routeId)"
            >启用</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="handleDeactivate('routeId', scope.row.routeId)"
            >停用</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>

    <el-drawer
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-press-escape="false"
      :wrapperClosable="false"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-drawer>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';
import { isPhone } from '@/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: '新增',
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: 'sysSignRoute',
        list: 'listSignRouteByPage',
        detele: 'deleteSignRoute'
      },
      // 列表参数
      namespace: 'signRoute',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '供应商编号',
          key: 'corporateId'
        },
        {
          type: 'input',
          label: '供应商名称',
          key: 'userName'
        },
        {
          type: 'select',
          label: '状态',
          key: 'type',
          optionData: [
            {
              key: 1,
              value: '正常'
            },
            {
              key: 2,
              value: '停用'
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: '供应商名称',
          key: 'corporateId',
          maxlength: 20,
          defaultValue: '',
          rules: [
            {
              required: true,
              message: '请输入必填项',
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'input',
          label: '联系人',
          key: 'asd',
          maxlength: 10,
          defaultValue: '',
          rules: [
            {
              required: true,
              message: '请输入必填项',
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'input',
          label: '手机号',
          key: 'ad',
          maxlength: 11,
          defaultValue: '',
          rules: [
            {
              required: true,
              trigger: 'blur',
              validator: isPhone
            }
          ]
        }
      ],
      routeId: ''
    };
  },
  activated() {
    this._mxGetList();
  },
  methods: {
    handleEnable() {},
    handleDeactivate() {
      // this.$alert(
      //   '此供应商有关联通道，请与全部通道取消关联后再进行停用。',
      //   '禁止停用',
      //   {
      //     confirmButtonText: '确定',
      //     showClose: false,
      //     type: 'warning',
      //     callback: (action) => {}
      //   }
      // );
      // this.$confirm('停用后在短信通道中此供应商将不可被选择', '确认停用？', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {})
      //   .catch(() => {});
    },
    submit(form) {
      let params = {};
      if (this.formTit == '新增') {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysSignRoute.addSignRoute(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSignRoute.updateSignRoute(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.formTit = '新增';
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row, ID) {
      this.formTit = '修改';
      this.routeId = row.routeId;
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key && row[key] !== '-') {
            this.$set(item, 'defaultValue', row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, 'defaultValue', '');
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    }
  }
};
</script>