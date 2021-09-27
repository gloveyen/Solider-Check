<template>
  <div>
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
            v-for="{ id, name, number, hadRetire } in soldiers"
            :key="id"
            :value="id"
          >
            {{ number }} {{ name }} {{ hadRetire ? '(已退伍)' : '' }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="回報內容:">
        <a-form-item extra="請選擇所在城市與鄉鎮並填入所在位置名稱">
          <section class="where-space">
            <a-form-item>
              <a-select placeholder="縣市" @change="handleCityChange" v-decorator="['city', { rules: [{ required: true, message: '請選擇所在縣市' }]}]">
                <a-select-option v-for="(city, index) in city" :key="`city_${index}`" :value="city">
                  {{ city }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
            <a-select placeholder="鄉鎮" v-decorator="['town', { rules: [{ required: true, message: '請選擇所在鄉鎮' }]}]">
              <template v-if="chooseCity">
                <a-select-option v-for="(town, index) in townsInCity" :key="`town_${index}`" :value="town">
                  {{ town }}
                </a-select-option>
              </template>
            </a-select>
            </a-form-item>
          </section>

          <a-input
            addon-before="地點名稱"
            placeholder="ex.家中"
            v-decorator="[
              'where',
              {
                rules: [
                  {
                    required: true,
                    message: '請填入你的所在地點',
                  }
                ],
              },
            ]"
          />

        </a-form-item>

        <a-form-item>
          <a-input
            addon-before="跟誰"
            placeholder="若無旁人請輸入「自己」"
            v-decorator="[
              'who',
              {
                rules: [
                  { required: true, message: '請填入你與誰同行若無請填「無」' },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item>
          <a-input
            addon-before="做什麼"
            placeholder="請輸入您正在做什麼"
            v-decorator="[
              'what',
              {
                rules: [{ required: true, message: '請填入你正在做什麼' }],
              },
            ]"
          />
        </a-form-item>
      </a-form-item>

      <a-form-item label="是否在家" v-if="replyStep === 1">
        <a-radio-group
          v-decorator="[
            'isAtHome',
            {
              rules: [{ required: true, message: '請選擇是否已在家中' }],
            },
          ]"
          v-model="isAtHome"
          @change="onChange"
          button-style="solid"
        >
          <a-radio-button class="radio-button" :value="'at'">
            已在家中
          </a-radio-button>
          <a-radio-button :value="'yet'">
            尚未回家
          </a-radio-button>
          <a-radio-button :value="'out'">
            在外住宿
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-if="replyStep === 1" :label="`幾點${liveState[isAtHome]}`">
        <a-input
          placeholder="ex.2200"
          v-decorator="[
            'stayHome',
            {
              rules: [
                {
                  required: true,
                  message: '請填入你正在做什麼',
                },
                {
                  pattern: /^\d{4}$/,
                  message: '請依照格式填寫(只能填入四碼數字)',
                },
              ],
            },
          ]"
        />
      </a-form-item>

      <section v-if="isAtHome === 'out'">
        <a-divider>外宿資訊</a-divider>
        <a-form-item label="外宿地址">
          <a-input
            placeholder="請輸入外宿確切地址"
            v-decorator="[
              'outAddress',
              {
                rules: [{ required: true, message: '請填入外宿地址' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="同行人姓名">
          <a-input
            placeholder="若無同行人請填「無」"
            v-decorator="[
              'outWho',
              {
                rules: [{ required: true, message: '請填入資料' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="同行人聯絡電話">
          <a-input
            placeholder="若無同行人請填「無」"
            v-decorator="[
              'outPhone',
              {
                rules: [{ required: true, message: '請填入資料' }],
              },
            ]"
          />
        </a-form-item>
      </section>

      <section v-if="backDay && this.replyStep===0">
        <a-divider>返營資訊</a-divider>
        <Back />
      </section>

      <a-form-item class="submit">
        <a-button type="primary" html-type="submit" :loading="loading" block>
          送出回報
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { rangeOfStep } from "../utils";
import Back from "@/components/Back.vue";
import country from "@/utils/country.json";

export default {
  mounted() {
    this.now = new Date();
    this.$store.dispatch("Vacations/queryVacationList", { m:this.now.getMonth() });

    const weekDay = this.now.getDay();
    if (weekDay===0 && rangeOfStep(this.now.getHours())===0) this.backDay = true;
  },
  props: {
    replyStep: Number,
  },
  data() {
    return {
      country,
      chooseCity: null,
      isAtHome: "at",
      now: null,
      formLayout: "horizontal",
      form: this.$form.createForm(this, {}),
      liveState: { at: "後不再出門", yet: "回到家", out: "後不再出門" },
      loading: false,
      backDay:false,
    };
  },
  computed: {
    ...mapState(["soldiers"]),
    ...mapState('Vacations', ["vacationList"]),

    city() {
      return Object.keys(this.country)
    },
    townsInCity() {
      if (this.chooseCity) {
        return country[this.chooseCity].towns
      }
      return []
    },
    now_hour() {
      return this.now.getHours();
    },
  },
  methods: {
    ...mapActions(["updateReply", "querySoldiers"]),

    handleSubmit(e) {
      e.preventDefault();
      const { squadId='nbHSds25HAauTGgdrnDs' } = this.$route.params;
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          // console.log(values);
          const where = `${values.city}${values.town}${values.where}`;
          console.log({ isBackDay: this.backDay, squadId, ...values, where });
          const response = await this.updateReply({ isBackDay: this.backDay, squadId, ...values, where });
          if (response) {
            this.form.resetFields();
            this.querySoldiers(squadId);
            setTimeout(() => {
              this.loading = false;
              this.$message.success("已送出回報內容");
            }, 1500);
          }
        }
      });
    },
    handleCityChange(e) {
      console.log(e)
      this.chooseCity = e;
    },
    onChange(e) {
      this.isAtHome = e.target.value;
    },
  },
  watch: {
    vacationList(newValue) {
      if (newValue.length && this.replyStep===0) { //比對　VacationList 確認收假日使否為平日
        const weekend = this.now.getDay()===0;
        const today = { ye: this.now.getFullYear(), me: this.now.getMonth(), de: this.now.getDate() };

        if (weekend) { //如果為週日則確認當天是否為非收假日
          const todayTimeStamp = new Date(today.ye, today.me, today.de).getTime();
          for (let i = 0; i <newValue.length; i++) {
            const { ys, ms, ds, ye, me, de } = newValue[i];
            const startTimeStamp = new Date(ys, ms, ds).getTime();
            const BackDayTimeStamp = new Date(ye, me, de).getTime();
            if (todayTimeStamp < BackDayTimeStamp && todayTimeStamp > startTimeStamp ) {
              this.backDay = false;
              break;
            }  
          }
          return;
        }

        for (let i = 0; i <newValue.length; i++) {
          const comparison = ['ye', 'me', 'de'].map(key => today[key]===newValue[i][key]);
          if (comparison.every(bool => bool)) {
            this.backDay = true;
            break;
          }  
        }
      }
    }
  },
  components: {
    Back
  }
};
</script>

<style lang="scss">
.ant-radio-group-default {
  float: left;
}

.ant-form-item.submit {
  display: flex;
  justify-content: center;
}

.ant-btn-block {
  margin: 30px 0;
}

section.where-space {
  display: flex;
  column-gap: 8px;

  .ant-form-item {
    flex-grow: 1;
  }
}
</style>
