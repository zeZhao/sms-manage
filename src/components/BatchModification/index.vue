<template>
  <!--选择用户-->
  <div class="batchModification">
    <el-dialog :visible.sync="isOpen" :title="title" width="50%" top="120px" :show-close="false"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="原通道编号">
              <el-select v-model="form.oldCm" placeholder="移动通道" class="inputs" clearable>
                <el-option v-for="item in cmList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="改为">
              <el-select v-model="form.newCm" placeholder="请修改" class="inputs" clearable>
                <el-option v-for="item in cmList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="form.oldCu" placeholder="联通通道" class="inputs" clearable>
                <el-option v-for="item in cuList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="form.newCu" placeholder="请修改" class="inputs" clearable>
                <el-option v-for="item in cuList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="form.oldCt" placeholder="电信通道" class="inputs" clearable>
                <el-option v-for="item in ctList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="form.newCt" placeholder="请修改" class="inputs" clearable>
                <el-option v-for="item in ctList" :key="item.id" :label="item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="errorTips" class="errTpis">{{ errorTips }}</div>

      <div class="btnStyle">
        <slot name="Btn">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" style="margin-left: 15px" v-throttle @click="handleSubmit">确认
          </el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "批量修改"
    },
    cmList: {
      type: Array,
      default: () => {
        return []
      }
    },
    cuList: {
      type: Array,
      default: () => {
        return []
      }
    },
    ctList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      form: {},
      errorTips: ""
    }
  },
  watch: {
    //格式化数据 删除错误提示
    isOpen (oldVal, newVal) {
      if (newVal) {
        this.form = {};
        this.errorTips = "";
      }
    }
  },
  methods: {
    //确认批量修改操作
    handleSubmit () {
      const str = this.check();
      if (str) {
        this.errorTips = str;
        return;
      }
      this.errorTips = "";
      this.$emit("submit", this.form);
    },
    //校验是否选择正确并提示相应的错误
    check () {
      const { oldCm, newCm, oldCu, newCu, oldCt, newCt } = this.form;
      let str;
      if (!oldCm && !newCm && !oldCu && !newCu && !oldCt && !newCt) {
        str = `请选择 “需要修改的通道编号”`;
      }
      if (oldCm && !newCm) {
        str = `请选择 “移动改后通道编号”`;
      }
      if (!oldCm && newCm) {
        str = `请选择 “移动改前通道编号”`;
      }
      if (oldCu && !newCu) {
        str = `请选择 “联通改后通道编号”`;
      }
      if (!oldCu && newCu) {
        str = `请选择 “联通改前通道编号”`;
      }
      if (oldCt && !newCt) {
        str = `请选择 “电信改后通道编号”`;
      }
      if (!oldCt && newCt) {
        str = `请选择 “电信改前通道编号”`;
      }
      return str;
    },
    // 关闭
    cancel () {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.batchModification {
  >>> .el-dialog__body {
    padding: 16px 60px;

    .inputs {
      width: 100%;
    }

    .errTpis {
      color: red;
      position: relative;
      left: 10%;
    }

    .btnStyle {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>