<template>
  <div class="back-views-component">
    <a-modal
      title="專車返營資訊提醒"
      :visible="modal_visible"
    >
      <h3>記得專車返營資訊的第二欄是填寫你預計<span style="color: red">抵達專車地點的時間！</span></h3>
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">
          我了解了
        </a-button>
      </template>
    </a-modal>
      <a-form-item label="返營方式">
        <a-radio-group
          v-model="method"
          button-style="solid"
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

      <a-form-item label="預計出門時間">
        <a-input
          placeholder="ex.1830"
          v-decorator="[
          'getOff',
            {
              rules: [
                { required: true, message: '請輸入出門時間' },
                {
                  pattern: /^\d{4}$/,
                  message: '請依照格式填寫(只能填入四碼數字)',
                },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item :label="method==='BUS'?'預計抵達專車地點時間':'預計抵達營門口時間'">
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
  </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import { BACK_METHODS } from "../utils";

  const radioGroups = [
    { label: "家人接送", value: BACK_METHODS.FAMILY },
    { label: "朋友接送", value: BACK_METHODS.FRIEND },
    { label: "搭乘專車", value: BACK_METHODS.BUS },
  ];

  export default {
    data() {
      return {
        radioGroups,
        form: this.$form.createForm(this, {}),
        method: "",
        loading: false,
        modal_visible: false
      };
    },
    methods: {
      showModal() {
        this.$confirm({
          title: '專車返營提醒事項：',
          content: '記得專車返營資訊的第二欄是填寫你預計「抵達專車地點」的時間！',
          onOk() {
            return new Promise((resolve, reject) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
          },
          onCancel() {},
        });
      },
      handleOk(e) {
        this.modal_visible = false;
      },
    },
    computed: {
      ...mapState(["soldiers"]),
    },
    watch: {
      method() {
        if (this.method === "BUS") {
          this.showModal();
        }
      }
    }
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
