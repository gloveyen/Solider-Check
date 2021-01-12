<template>
  <div class="admin-view-container">
    <section class="header">
      <h2 id="title">名單編輯後台</h2>
      <a-button @click="handleLogout">登出</a-button>
    </section>

    <a-divider />

    <div class="chooseSquad">
      <a-form-item>
        <a-radio-group v-model="focusSquad" @change="onSquadChange" buttonStyle="solid">
          <a-radio-button v-for="{ name, id } in squadList" :key="id" :value="id">
            {{ name }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
    </div>

    <div class="copyButton" v-if="focusSquad">
      <a-button @click="copyReport"><a-icon type="link" />複製該班回報表單網址</a-button>
      <a-button @click="toReply()"><a-icon type="export" />前往班級回報後台</a-button>
    </div>

    <a-card class="editCard">
      <template slot="title">
        <div class="title">
          <span>人員名單輸入區</span>
          <a-icon v-if="this.$refs.manual" type="question-circle" theme="filled" @click="this.$refs.manual.showDrawer" />
        </div>
      </template>

      <template slot="actions" class="ant-card-actions">
        <a-space>
          <a-icon type="down-square" theme="filled" />
          <span @click="parseStringToList">鍵入資料</span>
        </a-space>
      </template>
        
      <a-textarea v-model="listString" :placeholder="`ex.\n116 顏爾佑 0987878787 (換行)\n117 顏爾佐 0988888888`"></a-textarea>
    </a-card>

    <a-table
      class="editTable"
      v-if="listData.length"
      :columns="columns"
      :data-source="listData"
      :pagination="false"
      :scroll="{ x: 600 }"
      bordered
    >
      <template slot="title">
        <div class="tableTitle">
          <span slot="title" style="color: #333">人員名單編輯表</span>
          <a-button class="clearSoldiers" @click="eliminateOpen">殲滅全班</a-button>
        </div>
      </template>
      
      <template
        v-for="col in ['number', 'name', 'phone','retire']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            <span style="margin-left: 6px">{{ text }}{{ col==="name" && record.hadRetire ? '（退伍）' : '' }}</span>
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a-button type="primary" @click="() => save(record.key, record.id)">儲存</a-button>

            <a-popconfirm title="確定要取消?" @confirm="() => cancel(record.key)">
              <a-button type="danger">取消</a-button>
            </a-popconfirm>
          </span>
          <span v-else>
            <a style="margin-left: 12px;" :disabled="editingKey !== ''" @click="() => edit(record.key)">編輯</a>
            <a-popconfirm title="確定要刪除此資料?" okType="danger" @confirm="() => del(record.key, record.id)">
              <a style="margin-left: 12px;" :disabled="editingKey !== ''" >刪除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>

      <template
        slot="retire"
        slot-scope="text, record"
      >
        <div class="solder-form">
          <span v-if="record.editable">
            <div v-if="text!=='out'">
              <a-date-picker
                style="margin: -5px 5px"
                :value="text"
                @change="e => changeDate(e, record.key, 'retire')"
              />
              <a-button type="danger" @click="changeDate('out', record.key, 'retire')">驗退</a-button>
            </div>
            <p style="color:red;" v-else>驗退</p>
          </span>
          
          <template v-else>
            <span style="margin-left: 6px">{{ text | retireInfo }}</span>
          </template>
        </div>
      </template>

      <template slot="footer">
        <div class="addSoldier" @click="openModal">
          <a-space>
          <a-icon type="plus-circle" theme="filled" />
            新增班兵
          </a-space>
        </div>
      </template>
    </a-table>
    
    <a-button
      v-if="listData.length"
      :loading="loading"
      @click="() => { soldiers.length ? hendleSubmit() : handleCreate() }"
      type="primary"
      block
    >
      {{ soldiers.length ? '更新名單' : '新增名單' }}
    </a-button>

    <a-modal
      title="新增班兵資料"
      :visible="visible"
      :footer="null"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <SoldierForm :focusSquad="focusSquad" :handleAdd="handleAdd" />
    </a-modal>

    <a-modal
      title="破壞力強大請小心使用！"
      :visible="eliminateVisible"
      :footer="null"
      @cancel="eliminateCancel"
    >
      <RedButton :focusSquad="focusSquad" />
    </a-modal>

    <Manual ref="manual">
        <div slot="title">
          名單輸入區說明
        </div>
        <div slot="main">
          在剛建立各班級的班兵資料時，為了方便一次性建立大量的資料，所以會使用此名單輸入區進行名單建立：
          <a-divider />
          <h3><a-icon type="caret-down" />步驟一</h3>
          <span :style="{ marginBottom: '24px', display: 'block' }">
            每一行為一員班兵的資訊，依序以空格作為區分，以下為例：<br>
            <a-tag color="#607d8b" :style="{ marginTop: '4px' }">
              116 無名一 0987878787 <br>
              117 無名二 0988888888
            </a-tag>
          </span>

          <h3><a-icon type="caret-down" />步驟二</h3>
          <span>
            輸入完班兵資料後，按下下方的
            <a-tag><a-icon type="down-square" />鍵入資料</a-tag>
            按鈕，系統會自動將資料解析為一個可編輯的表格，可以在表格中編輯班兵資料內容，編輯完畢後，按下即可上傳班兵資料。
          </span>
        </div>
    </Manual>
  </div>
</template>

<script>
import firebase from "../store/firebase";
import moment from "moment";
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import SoldierForm from "@/components/SoldierForm";
import RedButton from "@/components/RedButton";
import Manual from "@/components/Manual";

const columns = [
  {
    title: 'number',
    dataIndex: 'number',
    title: '編號',
    fixed: 'left',
    width: '100px',
    scopedSlots: { customRender: 'number' },
  },
  {
    title: 'name',
    dataIndex: 'name',
    title: '姓名',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'phone',
    dataIndex: 'phone',
    title: '手機',
    scopedSlots: { customRender: 'phone' },
  },
  {
    title: 'retire',
    dataIndex: 'retire',
    title: '退伍日期',
    scopedSlots: { customRender: 'retire' },
  }, 
  {
    title: 'operation',
    dataIndex: 'operation',
    title: '編輯',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  async mounted() {
    const ref = firebase.firestore().collection("Squads");
    const snapshot = await ref.orderBy('order').get();
    const data = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
    this.squadList = [...data];
  },
  data() {
    return {
      loading: false,
      visible: false,
      eliminateVisible: false,
      focusSquad: "",
      listString: "",
      listData: [],
      cacheData: [],
      squadList: [],
      updateInfo: { delete: [], update: [] },
      addInfo: {},
      columns: columns,
      editingKey: "",
    }
  },
  methods: {
    ...mapActions(["bunchCreateSoldier", "querySoldiers", "bunchUpdateData", "deleteSoldier", "logout"]),

    parseStringToList() {
      const oneDList = this.listString.split('\n');
      const twoDList = oneDList.reduce((acc,doc,index) => {
        let newAcc = [...acc];
        const [number, name, phone] = doc.split(' ');
        newAcc = [...acc, { key: index.toString(), number, name, phone, squadId: this.focusSquad }];
        return newAcc;
      },[]);
      this.listData = twoDList;
      this.cacheData = twoDList.map(item => ({ ...item }));
    },
    onSquadChange(e) {
      this.focusSquad = e.target.value;
    },
    async hendleSubmit() {
      this.loading = true;
      const listDataWithoutKey = this.listData.map(({ key, ...data }) => ({ ...data }));
        let updateData = this.listData.reduce((acc, data) => {
          const newAcc = this.updateInfo.update.includes(data.id) ? [...acc, data] : [...acc];
          return newAcc;
        },[]);
        await this.bunchUpdateData(updateData);
        this.loading = false;
    },
    async handleCreate() {
      this.bunchCreateSoldier(this.listData.map(doc => ({ ...doc })));
    },
    handleChange(value, key, column) {
      const newData = [...this.listData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.listData = newData;
      }
    },
    changeDate(value, key, column) {
      const newData = [...this.listData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        if (value==='out') {
          const ensure = prompt("如該員確定驗退生效，請於輸入框中輸入「驗退」");
          if (ensure === '驗退') target[column] = value;

        } else {
          target[column] = value;
        }
        this.listData = newData;
      } 
    },
    openModal() {
      this.visible = true;
    },
    handleAdd(newSoldierInfo) {
      this.listData = [...this.listData, { ...newSoldierInfo }];
      this.cacheData = [...this.cacheData, { ...newSoldierInfo }];
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
      this.addInfo = {};
    },
    edit(key, id) {
      const newData = this.listData.map(doc => ({...doc}));
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.listData = newData;
      }
    },
    save(key, id) {
      const newData = [...this.listData.map(doc => ({...doc}))];
      const newCacheData = [...this.cacheData.map(doc => ({...doc}))];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.listData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.updateInfo.update.push(id);
      this.editingKey = '';
    },
    del(key, id) {
      const newData = [...this.listData.map(doc => ({...doc}))];
      const newCacheData = [...this.cacheData.map(doc => ({...doc}))];
      const target = newData.filter(item => key === item.key)[0];
      const response = this.deleteSoldier(id);
      if (response) {
        const otherTargets = newData.filter(item => key !== item.key);
        const otherTargetCaches = newCacheData.filter(item => key !== item.key);
        if (target && otherTargetCaches.length) {
          delete target.editable;
          this.listData = [...otherTargets];
          this.cacheData = [...otherTargetCaches];
        }
        this.updateInfo.delete.push(id);
        this.editingKey = '';
      }
    },
    cancel(key) {
      const newData = [...this.cacheData.map(doc => ({...doc}))];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.listData = newData;
      }
    },
    copyReport() {
      navigator.clipboard.writeText(`https://soldier-check.web.app/${this.focusSquad}/report`);
      this.$message.success("以複製內容到剪貼簿");
    },
    copyAdmin() {
      navigator.clipboard.writeText(`https://soldier-check.web.app/${this.focusSquad}/reply-secret`);
      this.$message.success("以複製內容到剪貼簿");
    },
    eliminateOpen() {
      this.eliminateVisible = true;
    },
    eliminateCancel() {
      this.eliminateVisible = false;
    },
    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },
    toReply() {
      this.$router.push(`/${this.focusSquad}/reply-secret`);
    }
  },
  computed: {
    ...mapState(["soldiers"])
  },
  filters: {
    retireInfo: (data) => {
      if (data){
        return data === "out" ? "驗退" : data.format("YYYY/M/DD");
      }
      return "尚未設定";
    }
  },
  watch: {
    focusSquad(newFocusSquad) {
      this.querySoldiers(newFocusSquad);
    },
    soldiers(){
      const list = this.soldiers.map((doc, index) => {
        const { id, name, number, phone, squadId, retire, hadRetire } = doc;
        if (retire) {
          return { key: index ,id, name, number, phone, squadId, hadRetire, retire: moment(retire.toDate()) };
        }
        return { key: index ,id, name, number, phone, squadId };
      });
      this.listData = list.map(doc => ({...doc}));
      this.cacheData = list.map(doc => ({...doc}));
    }
  },
  components: {
    SoldierForm,
    RedButton,
    Manual,
  }
}
</script>

<style lang="scss">
.admin-view-container {
  .header {
    position: relative;

    button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }

  #title {
    margin-bottom: 0;
  }

  .copyButton {
    margin-bottom: 30px;

    button {
      height: 60px;
      width: 100%;
      margin-bottom: 8px;
    }
  }

  .editCard {
    .ant-input {
      height: 300px;
    }

    .title {
      .anticon-question-circle {
        font-size: 18px;
        margin-left: 6px;
        color: #3898e4;
        cursor: pointer;
      }
    }
  }

  .chooseSquad {
    margin-bottom: 40px;
  }

  .tableTitle {
    position: relative;

    .clearSoldiers{
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
    }
  }

  .editTable {
    margin-top: 30px;

    .ant-table-row{
      td {
        padding: 16px 4px;
      }

      .ant-input {
        padding: 0;
        font-size: 12px;
      }
    }
  }

  .ant-table-footer {
    .ant-space{
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      color: rgba(0,0,0,0.45);
      transition: .3s;
      cursor: pointer;
      
      &:hover{
        color: #1890ff;
      }
    }
  }
}
</style>
