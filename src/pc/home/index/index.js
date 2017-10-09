import Vue from 'vue'
import App from '../index/index.vue'
console.log(Vue);
new Vue({
	el:"#app",
	render: h => h(App)
});