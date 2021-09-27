<template>
  <div class="about" v-if="(replies.length || repliesOfSquad.length) && soldiers.length">
    <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          關閉
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          複製資訊
        </a-button>
      </template>
      <p>外宿地址：{{ ourModalInfo.outAddress }}</p>
      <p>同行人：{{ ourModalInfo.outWho }}</p>
      <p>同行人聯絡電話：{{ ourModalInfo.outPhone }}</p>
    </a-modal>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="最新時段回報">
        <section @click="cleanAll">
          <a-divider orientation="left">
            <span style="color: #9e9e9e">編輯複製區</span>
          </a-divider>

          <CopyAndEdit :currentRangeReplies="currentRangeReplies" />

          <a-divider style="margin-top: 60px" orientation="left">
            <span style="color: #9e9e9e">回報列表</span>
          </a-divider>

          <ul class="current-list">
            <li
              class="list-item"
              v-for="item in currentRangeReplies"
              :key="item.id"
              @touchstart="mouseEnter(item.id)"
              @touchend="mouseLeave"
              @touchmove="mouseMove"
            >
              <div>
                <section>
                  <h3>
                    {{ soldiersObj[item.soldier].number }}
                    {{ soldiersObj[item.soldier].name }}
                  </h3>
                  <p
                    :class="{ outdoorAnchor: item.isAtHome === 'out' }"
                    @click="showModal(item)"
                  >
                    {{ item | formatContent }}
                  </p>
                </section>
                <i>{{ moment(item.updateAt) }}</i>
              </div>
              <span
                class="delete"
                @click="deleteReplyWithId(item.id)"
                :style="onFire === item.id ? { ...focusStyle } : {}"
                >刪除</span
              >
            </li>
          </ul>
          <!-- <a-list item-layout="horizontal" :data-source="currentRangeReplies">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta :description="item | formatContent">
              <h3 slot="title">
                {{ soldiersObj[item.soldier].number }}
                {{ soldiersObj[item.soldier].name }}
              </h3>
            </a-list-item-meta>
            <i>{{ moment(item.updateAt) }}</i>
            <div>Content {{ item.id }}</div>
            <span class="delete">刪除</span>
          </a-list-item>
          <a-spin v-if="loading" class="demo-loading" />
        </a-list> -->
          <!-- <a-table
          :style="{ marginBottom: '50px' }"
          :columns="columns"
          :data-source="currentRangeReplies"
          :pagination="false"
        >
          <span
            slot="soldierNumber"
            slot-scope="text"
          >
            {{ soldiersObj[text]["number"] }}
          </span>
          <span
            slot="soldierFormat"
            slot-scope="text"
          >
            {{ soldiersObj[text]["name"] }}
          </span>
          <span
            slot="timeFormat"
            slot-scope="text"
          >
            {{ moment(text) }}
          </span>

          <span
            :class="{outdoorAnchor: record.isAtHome === 'out'}"
            slot="content"
            slot-scope="text, record"
            @click="showModal(record)"
          >
            {{ record | formatContent }}
          </span>
        </a-table> -->
        </section>
      </a-tab-pane>

      <a-tab-pane key="2" tab="過去回報紀錄" force-render>
        <a-table
        :columns="columns"
        :data-source="repliesOfSquad"
        :locale="{ filterConfirm: '確定', filterReset: '重置' }">
          <span slot="soldierNumber" slot-scope="text">
            {{ soldiersObj[text]["number"] }}
          </span>
          <span slot="soldierFormat" slot-scope="text">
            {{ soldiersObj[text]["name"] }}
          </span>
          <span slot="timeFormat" slot-scope="text">
            {{ moment(text) }}
          </span>

          <span slot="content" slot-scope="text, record">
            {{ record | formatContent }}
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: "soldier",
    key: "number",
    title: "編號",
    scopedSlots: { customRender: "soldierNumber" },
  },
  {
    dataIndex: "soldier",
    key: "soldier",
    title: "姓名",
    scopedSlots: { customRender: "soldierFormat" },
    onFilter: (value, record) => record.soldier.indexOf(value) === 0,
  },
  {
    dataIndex: "updateAt",
    key: "updateAt",
    title: "回報時間",
    scopedSlots: { customRender: "timeFormat" },
  },
  {
    dataIndex: "where",
    key: "where",
    title: "回報內容",
    scopedSlots: { customRender: "content" },
  },
];

import { mapActions, mapGetters, mapState } from "vuex";
import CopyAndEdit from "../components/CopyAndEdit";
import moment from "moment";
import { rangeOfStep } from "../utils";

export default {
  async mounted() {
    // const { squadId } = this.$route.params;
    const { squadId='nbHSds25HAauTGgdrnDs' } = this.$route.params;
    if (this.$route.params.squadId) {
      const response = await this.$store.dispatch("queryUserSquad", squadId);
    }
    this.$store.dispatch("querySoldiers", squadId);
    this.$store.dispatch(`${squadId?'queryRepliesBySquadId':'queryReplies'}`, squadId);
    this.$store.dispatch("queryBackReplies");
    const now = new Date();
    this.nowRange = [
      now.getMonth() + 1,
      now.getDate(),
      rangeOfStep(now.getHours()),
    ].join("-");
  },
  data() {
    return {
      columns,
      nowRange: null,
      visible: false,
      ourModalInfo: {},
      onFire: false,
      startX: null,
      clientX: null,
      startY: null,
      clientY: null,
    };
  },
  methods: {
    ...mapActions(["deleteReply"]),

    copyText() {
      const { outAddress, outWho, outPhone } = this.ourModalInfo;
      navigator.clipboard.writeText(`${outAddress}\n${outWho}\n${outPhone}`);
      this.$message.success("已複製內容到剪貼簿");
    },
    moment(text) {
      return moment(text.toDate()).format("MM/DD HH:mm");
    },
    showModal({ isAtHome, outAddress = null, outWho = null, outPhone = null }) {
      if (isAtHome === "out") {
        this.visible = true;
        this.ourModalInfo = { outAddress, outWho, outPhone };
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk(e) {
      this.copyText();
      this.visible = false;
    },
    mouseEnter(id) {
      if (this.onFire !== id) {
        this.onFire = null;
        this.cleanX();
      }
      this.onFire = id;
      console.log("enter");
    },
    mouseLeave() {
      if (this.startX - this.clientX <= 100) {
        this.onFire = null;
        this.cleanX();
      }
      console.log("leave");
    },
    mouseMove(event) {
      event.preventDefault();
      if (this.onFire) {
        if (!this.startX) this.startX = event.changedTouches[0].clientX;
        if (!this.startY) this.startY = event.changedTouches[0].clientY;
        this.clientX = event.changedTouches[0].clientX;
        this.clientY = event.changedTouches[0].clientY;
        console.log(this.startX - this.clientX);
      }
    },
    cleanX() {
      this.startX = null;
      this.clientX = null;
      this.startY = null;
      this.clientY = null;
    },
    cleanAll(event) {
      event.stopPropagation();
      this.onFire = null;
      this.cleanX();
    },
    deleteReplyWithId(id) {
      const ensure = confirm("是否要刪除此回覆？");
      if (ensure) {
        this.deleteReply(id);
      }
    },
  },
  computed: {
    ...mapState(["soldiers", "replies", "repliesOfSquad"]),
    ...mapGetters(["rangeReplies","rangeRepliesOfSquad"]),

    soldiersObj() {
      return this.soldiers.reduce(
        (acc, { id, ...data }) => ({ ...acc, [id]: { ...data } }),
        {}
      );
    },
    currentRangeReplies() {
      const rangeRepliesFromParams = !this.$route.params.squadId ? this.rangeReplies : this.rangeRepliesOfSquad;
      if (
        Object.keys(this.rangeRepliesOfSquad).length &&
        this.nowRange &&
        this.soldiers.length
      ) {
        return (
          (this.rangeRepliesOfSquad[this.nowRange] &&
            this.rangeRepliesOfSquad[this.nowRange].sort(
              (a, b) =>
                this.soldiersObj[a.soldier].number -
                this.soldiersObj[b.soldier].number
            )) ||
          []
        );
      }
      return [];
    },
    focusStyle() {
      if (this.onFire !== null && this.startX) {
        const diff = this.startX - this.clientX;
        return { width: `${diff <= 100 ? diff : 100}px` };
      }
      return;
    },
  },
  filters: {
    formatContent: ({ where, who, what, isAtHome = null, stayHome }) => {
      const liveState = {
        at: "後不再出門",
        yet: "回到家中",
        out: "後不再出門",
      };
      const whereCheck =
        where[0] === "在" ? where.slice(1, where.length) : where;
      if (isAtHome !== null && stayHome) {
        return `在${whereCheck}${
          /[跟,與,和]/g.test(who[0]) ? "" : `與`
        }${who}${what}，預計${stayHome}${liveState[isAtHome]}${
          isAtHome === "out" ? " (外宿)" : ""
        }`;
      }
      return `在${whereCheck}${
        /[跟,與,和]/g.test(who[0]) ? "" : `與`
      }${who}${what}`;
    },
  },
  watch: {
    soldiers() {
      this.columns[1].filters = this.soldiers.map(({ id, name }) => ({ value: id, text: name }));
    },
    clientY() {
      var bodyTop = 0;
      if (typeof window.pageYOffset != "undefined") {
        bodyTop = window.pageYOffset;
      } else if (
        typeof document.compatMode != "undefined" &&
        document.compatMode != "BackCompat"
      ) {
        bodyTop = document.documentElement.scrollTop;
      } else if (typeof document.body != "undefined") {
        bodyTop = document.body.scrollTop;
      }
      const diff = this.startY - this.clientY;
      window.scrollTo(0, bodyTop + diff * 0.2);
    },
  },
  components: {
    CopyAndEdit,
  },
};
</script>

<style lang="scss" scope>
.current-list {
  list-style: none;
  text-align: left;
  padding: 0;

  .list-item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 0px;
    border-bottom: 1px solid #eee;

    div {
      display: grid;
      grid-template-columns: 1fr 120px;

      h3 {
        margin-top: 10px;
        margin-bottom: 4px;
      }

      p {
        margin: 0;
      }

      i {
        text-align: right;
        line-height: 68px;
        margin-right: 16px;
      }
    }

    .delete {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 0px;
      background: rgb(253, 108, 108);
      right: 0;
      text-align: center;
      color: #fff;
    }
  }
}

.ant-list-item {
  position: relative;
  text-align: left;

  .delete {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 120px;
    background: rgb(253, 108, 108);
    right: 0;
    text-align: center;
    color: #fff;
  }
}

.outdoorAnchor {
  cursor: pointer;
  color: rgb(253, 108, 108);

  &:hover {
    text-decoration-line: underline;
  }
}
</style>
