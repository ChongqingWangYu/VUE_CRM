import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import customer from './modules/customer'
import contact from './modules/contact'
import follow from './modules/follow'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    customer,
    contact,
    follow
  },
  getters
})

export default store
