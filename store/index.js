import VueX from 'vuex';
import createPersistedState from "vuex-persistedstate";

export const plugins = [
  createPersistedState()
]