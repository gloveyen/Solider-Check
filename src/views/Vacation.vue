<template>
  <div class="vacation-view-container">
    <a-calendar @select="onSelect" @panelChange="onPanelChange">
      <ul style="list-style: none;" slot="dateCellRender" slot-scope="value" class="events">
        <li>
          <div class="vacation" v-if="isVacation(value)" />
          <a-icon type="right-square" v-if="chooseVacation.start && value.format()===chooseVacation.start.format()" />
          <a-icon type="left-square" v-if="chooseVacation.end && value.format()===chooseVacation.end.format()" />
        </li>
      </ul>
    </a-calendar>

    <a-button
      v-if="chooseVacation.start && chooseVacation.end"
      @click="handleSubmit"
      type="primary"
      block
    >
      <a-icon type="carry-out" />更新假期
    </a-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  mounted() {
    const now = moment({});
    this.$store.dispatch("Vacations/queryVacationList", { y:now.year(), m:now.month() });
  },
  data() {
    return {
      selectedValue: null,
      chooseVacationArray: [null, null]
    }
  },
  methods: {
    ...mapActions("Vacations", ["queryVacationList", "addVacation"]),

    isVacation(value) {
      for (let i = 0; i < this.vacationList.length; i++) {
        let { ys, ye, ms, me, ds, de, id } = this.vacationList[i];
        let start = moment([ys, ms, ds]).unix();
        let end = moment([ye, me, de]).unix();
        let date = moment([value.year(), value.month(), value.date()]).unix();

        // if (date > end) break;
        if (start <= date && date <= end) return true;
      }
      if (value.weekday() === 0 || value.weekday() === 6) return true;
      return false;
    },
    onPanelChange(value, mode) {
      const y = value.year();
      const m = value.month();
      this.queryVacationList({ y, m });
      
    },
    onSelect(value) {
      const condition = Boolean(this.chooseVacationArray[0]) + Boolean(this.chooseVacationArray[1]);
      const vacationArrayFormat = this.chooseVacationArray.map(value => value && value.format());
      const newVacationArray = [...this.chooseVacationArray];

      switch (condition) {
        case 2: //start & end is choosed
          var coverIndex = vacationArrayFormat.indexOf(value.format());
          if (coverIndex !== -1) newVacationArray[coverIndex] = null;
          break;
        case 1: //start or end is choosed
          var notNullIndex = Number(!vacationArrayFormat.indexOf(null));
          if (vacationArrayFormat[notNullIndex] === value.format()) {
            newVacationArray[notNullIndex] = null;
          } else {
            newVacationArray[Number(!notNullIndex)] = value;
          }
          break;
        case 0: //no choose
          newVacationArray[0] = value;
          break;
        default:
          break;
      }

      this.chooseVacationArray = [...newVacationArray];
      },
    handleSubmit() {
      const { start, end } = this.chooseVacation;
      if (end.unix() > start.unix()) {
        const payload = {
          ys: start.year(),
          ms: start.month(),
          ds: start.date(),
          ye: end.year(),
          me: end.month(),
          de: end.date(),
        }
        this.addVacation(payload);
        this.$message.success('已新增假日');
      } else {
        this.$message.warning('收假日不能比放假日早');
      }
      this.cleanChooseVacation();
    },
    cleanChooseVacation() {
      this.chooseVacationArray = [null, null]
    }
  },
  computed: {
    ...mapState('Vacations', ["vacationList"]),
    chooseVacation() {
      return { start: this.chooseVacationArray[0], end: this.chooseVacationArray[1] }
    }
  }
}
</script>

<style lang="scss">
.vacation-view-container {
  .ant-radio-group {
    display: none;
  }

  .ant-fullcalendar-cell {
    border-left: 0.5px dashed #ddd;
    border-right: 0.5px dashed #ddd;
    padding: 0;
  }

  .ant-fullcalendar-fullscreen  {
    .ant-fullcalendar-date {
      padding: 0;
      margin: 0;

      .vacation{
        width: 100%;
        height: 24px;
        background-color:#607d8b;
        color: #fff;
        text-align: center;
        border-radius: 4px;
      }

      .anticon {
        font-size: 20px;
        color: #d68f8f;
      }

      .anticon-left-square {
        float: right;
      }
    }
  }
}


.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>
