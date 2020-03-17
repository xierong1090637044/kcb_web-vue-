import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


const state = {
	user: JSON.parse(localStorage.getItem('user')),
	userid: JSON.parse(localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')).objectId : '',
}
const mutations = {
	increment(state) {
		state.count++
	}
}

export default new Vuex.Store({
	state,
	mutations
})
