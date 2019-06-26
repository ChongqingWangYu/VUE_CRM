import {getInfo, login, logout, register} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import qs from 'qs'
import {Msg} from '@/utils/message';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  massage: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
}

const actions = {
  // user login
  login({commit}, user) {
    user = qs.stringify(user);
    return new Promise((resolve, reject) => {
      login(user).then(response => {
        console.log(response)
        commit('SET_TOKEN', response.token);
        setToken(response.token);
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },
  // user register
  register({commit}, user) {
    user = qs.stringify(user);
    return new Promise((resolve, reject) => {
      register(user).then(response => {
        if (response.message == "注册成功") {
          Msg.success(response.message);
        } else {
          Msg.error(response.message);
        }
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },
  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {data} = response;
        if (!data) {
          reject('Verification failed, please Login again.');
        }
        const {petName, avatar} = data;
        commit('SET_NAME', petName);
        commit('SET_AVATAR', avatar);
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((response) => {
        commit('SET_TOKEN', '');
        removeToken();
        resetRouter();
        Msg.success(response.message);
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

