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
      <el-table-column prop="supplierId" label="供应商编号" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="name" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          {{ scope.row.state === 1 ? '正常' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.state === 2"
            type="text"
            size="small"
            @click="handleUpdateState(scope.row.supplierId, 1)"
            >启用</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            style="color: red"
            @click="handleUpdateState(scope.row.supplierId, 2)"
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
        namespace: 'smsSupplierInfo',
        list: 'queryByPage'
      },
      // 列表参数
      namespace: 'smsSupplierInfo',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '供应商编号',
          key: 'supplierId'
        },
        {
          type: 'input',
          label: '供应商名称',
          key: 'supplierName'
        },
        {
          type: 'select',
          label: '状态',
          key: 'state',
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
          key: 'supplierName',
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
          key: 'contacts',
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
          key: 'mobile',
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
      supplierId: ''
    };
  },
  activated() {
    this._mxGetList();
  },
  methods: {
    handleUpdateState(supplierId, state) {
      const params = { data: { supplierId, state } };
      if (state === 2) {
        this.$confirm('停用后在短信通道中此供应商将不可被选择', '确认停用？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.updateState(params);
          })
          .catch(() => {});
      } else {
        this.updateState(params);
      }
    },
    updateState(source) {
      this.$http.smsSupplierInfo.updateState(source).then((res) => {
        if (res.code === 1009) {
          this.$alert(
            '此供应商有关联通道，请与全部通道取消关联后再进行停用。',
            '禁止停用',
            {
              confirmButtonText: '确定',
              showClose: false,
              type: 'warning',
              callback: (action) => {}
            }
          );
        } else {
          this._mxGetList();
          this.$message.success(res.msg || res.data);
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == '新增') {
        params = {
          data: {
            ...form
          }
        };
        this.$http.smsSupplierInfo.addSupplierInfo(params).then((res) => {
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
            supplierId: this.supplierId,
            ...form
          }
        };
        this.$http.smsSupplierInfo.updateSupplierInfo(params).then((res) => {
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
      this.supplierId = row.supplierId;
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