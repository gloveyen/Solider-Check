import Vue from "vue";
import Vuex from "vuex";
import firebase from "./firebase";
import { rangeOfStep, hadRetire } from "../utils";
import Vacations from "./modules/Vacations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userSquad: "nbHSds25HAauTGgdrnDs",
    userSquadName: "",
    soldiers: [],
    replies: [],
    repliesOfSquad: [],
    announcments: [],
    backReplies: [],
    loginState: null
  },
  mutations: {
    saveUserSquad: (state, payload) => {
      const { id, name } = payload;
      state.userSquad = id;
      state.userSquadName = name;
    },
    saveSoldiers: (state, payload) => {
      const unabsence = payload.filter(doc => !doc.absence);
      unabsence.sort((a,b) => a.number - b.number);
      state.soldiers = [...unabsence];
    },
    saveReplies: (state, payload) => {
      state.replies = [...payload];
    },
    saveRepliesOfSquad: (state, payload) => {
      state.repliesOfSquad = [...payload];
    },
    saveNewReply: (state, payload) => {
      state.replies = [{ ...payload }, ...state.replies];
    },
    saveAnnouncments: (state, payload) => {
      state.announcments = [...payload];
    },
    saveBackReplies: (state, payload) => {
      state.backReplies = [...payload];
    },
    updateSoldier: (state, payload) => {
      const { id, updateAt } = payload;
      const index = state.soldiers.map((person) => person.id).indexOf(id);
      state.soldiers.splice(index, 1, { ...state.soldiers[index], updateAt });
    },
    deleteReply: (state, payload) => {
      const index = state.replies.map((doc) => doc.id).indexOf(payload);
      const newReplies = [...state.replies];
      newReplies.splice(index, 1);
      state.replies = [...newReplies];
    },
    saveLoginState: (state, payload) => {
      state.loginState = payload;
    },
    logout: (state) => {
      state.loginState = null;
    },
    openFire: (state) => {
      state.soldiers = [];
    }
  },
  actions: {
    queryUserSquad: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection("Squads").doc(payload);
      const snapShot = await ref.get();
      const data = { id: snapShot.id, ...snapShot.data() };
      commit("saveUserSquad", data);
      return true;
    },
    querySoldiers: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection("Soldiers");
      const snapshot = await ref.where('squadId', '==', payload).get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), hadRetire: hadRetire(doc.data().retire) }));
      commit("saveSoldiers", data);
    },
    queryReplies: async ({ commit }) => {
      const ref = firebase.firestore().collection("Replies");
      const snapshot = await ref.orderBy("updateAt", "desc").get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commit("saveReplies", data);
    },
    queryRepliesBySquadId: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection("Replies");
      const snapshot = await ref.where('squadId', '==', payload).get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a,b) => b.updateAt.toDate() - a.updateAt.toDate());
      commit("saveRepliesOfSquad", data);
    },
    queryAnnouncments: async ({ commit }) => {
      const ref = firebase.firestore().collection("Announcments");
      const snapshot = await ref.orderBy("createAt", "desc").get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commit("saveAnnouncments", data);
    },
    queryBackReplies: async ({ commit }) => {
      const ref = firebase.firestore().collection("BackReplies");
      const snapshot = await ref.orderBy("updateAt", "desc").get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commit("saveBackReplies", data);
    },
    updateReply: async (_, payload) => {
      const { soldier, isBackDay, getOff, backMethod, arrive, squadId, ...checkFormData } = payload;
      console.log(checkFormData);
      console.log({soldier, isBackDay, getOff, backMethod, arrive});
      const ref = firebase.firestore().collection("Replies");
      const soldierRef = firebase.firestore().collection("Soldiers");
      const reply = {
        ...checkFormData,
        soldier,
        squadId,
        updateAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await ref.add({ ...reply });

      if (isBackDay) {
        const backRepliesRef = firebase.firestore().collection("BackReplies");
        const backInfo = { soldier, getOff, backMethod, arrive, squadId, updateAt: firebase.firestore.FieldValue.serverTimestamp() }
        await backRepliesRef.add({ ...backInfo });
      }

      await soldierRef
        .doc(soldier)
        .update({ updateAt: firebase.firestore.FieldValue.serverTimestamp() });

      return true;
    },
    deleteReply: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection("Replies");
      ref.doc(payload).delete();
      commit("deleteReply", payload);
    },
    submitProblem: async (_, payload) => {
      const ref = firebase.firestore().collection("Problems");
      ref.add({
        problem: payload,
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    },
    createSoldier: async (_, payload) => {
      const ref = firebase.firestore().collection("Soldiers");
      const res = await ref.add({ ...payload });
      return { status: true, id: res.id };
    },
    bunchCreateSoldier: async (_, payload) => {
      let ref = firebase.firestore().collection("Soldiers");
      const promises = payload.map(doc => new Promise(async (res, rej) => {
        await ref.add({ ...doc });
        res({ ...doc });
      }));
      try {
        await Promise.all(promises);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    bunchUpdateData: async (_, payload) => {
      if (payload.length) {
        const ref = firebase.firestore().collection("Soldiers");
        const promises = payload.map(({ id, ...doc }) => new Promise(async (res, rej) => {
          const retire = doc.retire=='out' || doc.retire===undefined ? doc.retire : doc.retire.toDate();
          if (doc.hadRetire!==undefined) delete doc.hadRetire;
          await ref.doc(id).update({ ...doc, retire });
          res();
        }))
        await Promise.all(promises);
      }
    },
    deleteSoldier: async (_, payload) => {
      const ref = firebase.firestore().collection("Soldiers").doc(payload);
      await ref.update({ absence: true });
      return true;
    },
    login: async ({ commit }, payload) => {
      const { account, password } = payload;
      const ref = firebase.firestore().collection("Admin")
        .where('account', '==', account)
        .where('password', '==', password);
      const snapShot = await ref.get();
      if (snapShot.docs && snapShot.docs.length) {
        commit('saveLoginState', true);
        return true;
      }
      return false;
    },
    logout: ({ commit }) => {
      commit("logout");
    },
    openFire: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection('Soldiers');
      const snapshot = await ref.where('squadId', '==', payload).get();
      const promises = snapshot.docs.map(({ id }) => new Promise(async (res, rej) => {
        const soldierRef = ref.doc(id);
        await soldierRef.delete();
        res();
      }));
      await Promise.all(promises);
      commit('openFire');
    }
  },
  getters: {
    soldierObj: ({ soldiers = [] }) => {
      return soldiers.reduce(
        (acc, { id, ...data }) => ({ ...acc, [id]: { ...data } }),
        {}
      );
    },
    rangeReplies: ({ replies = [] }) => {
      const rangeData = replies.reduce((acc, doc) => {
        const { updateAt, data } = doc;
        const time = updateAt.toDate();
        const m = time.getMonth();
        const d = time.getDate();
        const h = time.getHours();
        const step = rangeOfStep(h);
        const docKey = [m + 1, d, step].join("-");
        const newAcc = { ...acc };
        if (acc[docKey]) {
          newAcc[docKey] = [{ ...doc }, ...acc[docKey]];
        } else {
          newAcc[docKey] = [{ ...doc }];
        }
        return newAcc;
      }, {});
      return rangeData;
    },
    rangeRepliesOfSquad: ({ repliesOfSquad = [] }) => {
      const rangeData = repliesOfSquad.reduce((acc, doc) => {
        const { updateAt, data } = doc;
        const time = updateAt.toDate();
        const m = time.getMonth();
        const d = time.getDate();
        const h = time.getHours();
        const step = rangeOfStep(h);
        const docKey = [m + 1, d, step].join("-");
        const newAcc = { ...acc };
        if (acc[docKey]) {
          newAcc[docKey] = [{ ...doc }, ...acc[docKey]];
        } else {
          newAcc[docKey] = [{ ...doc }];
        }
        return newAcc;
      }, {});
      return rangeData;
    },
    newestVersion:({ announcments = [] }) => {
      return announcments.length ? announcments[0].version : '1.0.0';
    },
    thisWeekBackReplies: ({ backReplies = [] }) => {
      let now = new Date().getTime();
      const info = backReplies.filter(doc => {
        let fromNow = now-doc.updateAt.toDate();
        return fromNow/1000/60/60/24 <= 1;
      });
      return info;
    }
  },
  modules: {
    Vacations: {
      namespaced: "Vacations",
      ...Vacations
    }
  }
});
