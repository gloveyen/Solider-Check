<template>
  <a-card title="回報統整編輯區" v-if="currentRangeReplies.length">
    <!-- <div slot="actions">
      <a-space>
        <a-button @click="toggleBackInfo">{{ showBackInfo ? "隱藏" : "顯示" }}返營</a-button>
      <a-button @click="copyText">複製</a-button>
      </a-space> -->

    <template slot="actions" class="ant-card-actions">
      <a-space>
        <a-icon :type="showBackInfo ? 'eye-invisible' : 'eye'" />
        <span @click="toggleBackInfo">{{ showBackInfo ? "隱藏" : "顯示" }}返營訊息</span>
      </a-space>
      <a-space>
        <a-icon type="copy" />
        <span @click="copyText">複製訊息</span>
      </a-space>
    </template>
      
    <a-textarea v-model="replyString"></a-textarea>
  </a-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

const combineInfo = ({ soldier, where, who, what, isAtHome = null, stayHome }, self) => {
  const whereCheck =where[0] === "在" ? where.slice(1, where.length) : where;
  const { name, number } = self.soldierObj[soldier];
  if (isAtHome !== null && stayHome) {
    return `${number}${name}，在${whereCheck}${/[自己]/g.test(who) ? "" : /[跟,與,和]/g.test(who[0]) ? "" + who : `與`+ who}${what},預計${stayHome}${self.liveState[isAtHome]}${isAtHome === "out" ? " (外宿)" : ""}`;
  }
  return `${number}${name}，在${whereCheck}${/[自己]/g.test(who) ? "" : /[跟,與,和]/g.test(who[0]) ? "" + who : `與`+ who}${what}`;
};

export default {
  // mounted() {
  //   this.replyString =
  //     `${this.userSquadName || "9班"}\n`+
  //     this.currentRangeReplies.map(doc => combineInfo(doc, this)).join("\n");
  // },
  props: {
    currentRangeReplies: Array,
  },
  data() {
    return {
      replyString: "",
      liveState: { at: "後不再出門", yet: "回到家中", out: "後不再出門" },
      methodName: {FAMILY: "由家人載",FRIEND:"由朋友載",BUS:"搭專車"},
      showBackInfo: false,
    };
  },
  methods: {
    copyText() {
      navigator.clipboard.writeText(this.replyString);
      this.$message.success("以複製內容到剪貼簿");
    },
    toggleBackInfo() {
      this.showBackInfo = !this.showBackInfo;
    },

  },
  computed: {
    ...mapState(["soldiers", "userSquadName"]),
    ...mapGetters(["soldierObj", "thisWeekBackReplies"]),
    soldierBackRepliesObj() {
      return this.thisWeekBackReplies.reduce((acc, doc) => {
        const { soldier, ...info } = doc;
        return { ...acc, [doc.soldier]: { ...info }};
      },{});
    }
  },
  watch: {
    soldierObj: { 
      immediate: true,
      handler() {
        this.replyString =
        `${this.userSquadName || "9班"}\n`+ this.currentRangeReplies.map(doc => combineInfo(doc, this)).join("\n");
      }
    },
    showBackInfo(newVal) {
      this.replyString =
      `${this.userSquadName || "9班"}\n`+
      this.currentRangeReplies
        .map(doc => {
          const backInfo = newVal ? this.soldierBackRepliesObj[doc.soldier] || null : null;
          const backInfoString = backInfo ? `，預計${backInfo.getOff}出發返營，${this.methodName[backInfo.backMethod]}，預計${backInfo.arrive}${backInfo.backMethod==='BUS'?"抵達專車地點":"到營"}` : "";
          const originalCombineInfo = combineInfo(doc, this);
          return originalCombineInfo+backInfoString;
        }).join("\n");
    }
  },
};
</script>

<style lang="scss" scoped>
.ant-input {
  height: 300px;
}
</style>
