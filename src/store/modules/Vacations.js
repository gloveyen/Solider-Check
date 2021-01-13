import firebase from "../firebase";

export default {
  state: {
    vacationList: []
  },
  mutations: {
    saveVacationList: (state, payload) => {
      state.vacationList = payload.map(doc => ({...doc}));
    },
    addVacation: (state, payload) => {
      state.vacationList = [...state.vacationList, { ...payload }];
    }
  },
  actions: {
    queryVacationList: async ({ commit }, { y, m }) => {
      const ref = firebase.firestore().collection("Vacations")
        .where("me", "in", [m, m+1===12 ? 0 : m+1]);
      const snapshot = await ref.get();
      const data = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
      commit("saveVacationList", data);
    },
    addVacation: async ({ commit }, payload) => {
      const ref = firebase.firestore().collection("Vacations");
      const response = await ref.add({ ...payload });
      commit("addVacation", { id: response.id ,...payload });
      
    }
  },
  getters: {

  }
}
