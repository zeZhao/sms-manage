<template>
    <div class="FormItem">
      <el-form ref="form" label-width="120px" :model="formData" v-if="formConfig.length" class="demo-ruleForm">
        <el-row>
          <el-col :span="24"  >

            <el-form-item v-for="(item,index) in formConfig"
                          :label="item.label ? `${item.label}：` : ``"
                          :prop="item.key"
                          :rules="item.rules"
                          :key="index">

              <!--输入框-->
              <template v-if="item.type === 'input'">
                <el-input v-model="formData[item.key]" clearable :maxlength="item.max?item.max:''" :placeholder="item.placeholder"/>
              </template>

              <!--下拉列表-->
              <template v-if="item.type === 'select'">
                <el-select v-model="formData[item.key]" filterable clearable>
                  <el-option v-for="option in item.optionData" :value="option.key" :key="option.key" :label="option.value"/>
                </el-select>
              </template>

              <!--多选框-->
              <template v-if="item.type === 'checkbox'">
                <el-checkbox-group v-model="formData[item.key]">
                  <el-checkbox v-for="option in item.optionData" :key="option.key" :label="option.key"></el-checkbox>
                </el-checkbox-group>
              </template>

            </el-form-item>
          </el-col>
          <slot name="Btn">
            <el-button type="primary" @click="onSubmit('form')">{{btnTxt}}</el-button>
            <el-button @click="cancel">取消</el-button>
          </slot>
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="onSubmit">立即创建</el-button>-->
<!--            <el-button>取消</el-button>-->
<!--          </el-form-item>-->
        </el-row>

      </el-form>
    </div>
</template>

<script>
  export default {
    props:{
      formConfig:{
        type: Array,
        default() {
          return [];
        },
      },
      btnTxt:{
        type: String,
        default() {
          return "新增";
        }
      }
    },
    data() {
      return {
        formData:{}
      }
    },
    mounted() {
      this.initComponent()
    },
    computed: {},
    methods: {
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$emit('submit',this.formData)
          }else{
            // this.$message.error("请输入必填项")
            return false;
          }
        })
      },
      initComponent(){
        const form = {};
        this.formConfig.forEach(item => {
          const {key,defaultValue} = item;
          if(defaultValue){
            form[key] = item.defaultValue
          }
        });
        this.formData = form;
      },
      cancel(){
        this.$emit('cancel')
      },
      //重置表单
      resetForm() {
        this.formConfig.forEach(item=>{
          item.defaultValue = null
        })
        this.$refs.form.resetFields();
      }
    },
    watch: {
      formConfig:{
        handler(){
          this.initComponent()
        },
        deep:true,
        immediate:true
      }
    },
  }
</script>

<style lang="scss" scoped>
    .FormItem {

    }
</style>
