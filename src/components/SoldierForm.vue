<template>
  <div class="component-soldier-form-container">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="班兵姓名">
        <a-input
          v-decorator="[
          'name',
            {
              rules: [
                { required: true, message: '請設定班兵姓名' },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item label="班兵編號">
        <a-input
          pattern="\d*"
          v-decorator="[
          'number',
            {
              rules: [
                { required: true, message: '請設定班兵編號' },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item label="手機號碼">
        <a-input
          pattern="\d*"
          v-decorator="[
          'phone',
            {
              rules: [
                { required: true, message: '請輸入班兵手機號碼' },
                {
                  pattern: /^09\d{8}$/,
                  message: '請填入正確手機格式',
                },
              ],
            },
          ]"
        />
      </a-form-item>

      <a-form-item label="退伍日期" extra="若退伍日期尚未確定可先留空">
        <a-date-picker
          v-decorator="['retireDate']"
        />
      </a-form-item>

      <a-form-item class="submit">
        <a-button type="primary" html-type="submit" :loading="loading" block>
          上傳班兵資料
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";

export default {
  props: {
    focusSquad: String,
    handleAdd: Function,
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, {}),
    }
  },
  methods: {
    ...mapActions(["createSoldier"]),

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          const { retireDate, ...data } = values;
          const retire = retireDate ? retireDate.toDate() : null;
          const newSoldierInfo = { ...data, retire, squadId: this.focusSquad };
          if (retire === null) delete newSoldierInfo['retire'];
          const { status, id } = await this.createSoldier(newSoldierInfo);
          if (status) {
            this.handleAdd({
              ...newSoldierInfo,
              id,
              key: id,
              hadRetire: false,
              retire: newSoldierInfo.retire ? moment(newSoldierInfo.retire) : undefined });
            setTimeout(() => {
              this.$message.success("已上傳班兵資訊");
            }, 500);
          }
        }
      });
    }
  }
}
</script>
