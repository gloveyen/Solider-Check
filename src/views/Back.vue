<template>
  <div class="back-views-component">
    <h2 id="title">
      收假返營回報表單
    </h2>

    <a-form
      :form="form"
      hideRequiredMark
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      @submit="handleSubmit"
    >
      <a-form-item label="選擇班兵編號與名稱:">
        <a-select
          placeholder="請選擇你的班兵編號與姓名"
          v-decorator="[
            'soldier',
            {
              rules: [{ required: true, message: '請選擇你的班兵資料' }],
            },
          ]"
        >
          <a-select-option
            v-for="{ id, name, number } in soldiers"
            :key="id"
            :value="id"
          >
            {{ number }} {{ name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="返營方式">
        <a-radio-group
          v-model="method"
          button-style="solid"
          @change="onChange"
          v-decorator="[
            'backMethod',
            {
              rules: [{ required: true, message: '請選擇返營方式' }],
            },
          ]"
        >
          <a-radio-button
            v-for="{label, value} in radioGroups"
            :value="value"
            :key="value"
          >
            {{ label }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="預計出發時間">
        <a-input
          placeholder="ex.1830"
          v-decorator="[
          'start',
            {
              rules: [
                { required: true, message: '請輸入出發時間' },
                {
                  pattern: /^\d{4}$/,
                  message: '請依照格式填寫(只能填入四碼數字)',
                },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item label="預計抵達營門口時間">
        <a-input
          placeholder="ex.1900"
          v-decorator="[
          'arrive',
            {
              rules: [
                { required: true, message: '請輸入預計抵達時間' },
                {
                  pattern: /^\d{4}$/,
                  message: '請依照格式填寫(只能填入四碼數字)',
                },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item class="submit">
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          block
        >
          送出回報
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { BACK_METHODS } from "../utils";

  const radioGroups = [
    { label: "家人接送", value: BACK_METHODS.FAMILY },
    { label: "朋友接送", value: BACK_METHODS.FRIEND },
    { label: "搭乘專車", value: BACK_METHODS.BUS },
    { label: "自行返營", value: BACK_METHODS.SELF },
  ];

  export default {
    data() {
      return {
        radioGroups,
        form: this.$form.createForm(this, {}),
        method: "",
        loading: false,
      };
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields(async (err, values) => {
          if (!err) {
            this.loading = true;
            // const response = await this.updateReply(values);
            // if (response) {
            //   this.form.resetFields();
            //   this.querySoldiers();
            //   setTimeout(() => {
            //     this.loading = false;
            //     this.$message.success("已送出回報內容");
            //   }, 1500);
            // }
          }
        });
      },
      onChange(e) {
        this.method = e.target.value;
      },
    },
    computed: {
      ...mapState(["soldiers"]),
    },
  };
</script>

<style lang="scss">
  .back-views-component {
    .ant-radio-button-wrapper {
      width: 60px;
      height: 60px;
      // margin-right: 16px;
      // border-radius: 4px;
    }
  }
</style>
