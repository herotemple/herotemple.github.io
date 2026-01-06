// 导入 Vue 相关依赖
import Vue from 'vue';
import App from './App.vue';
import router from './router';

// 导入 Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入 Axios 和 qs
import axios from 'axios';
import qs from 'qs';

// 使用 Element UI
Vue.use(ElementUI);

// 配置 Axios
axios.defaults.baseURL = '/exam';  // 设置 API 代理
axios.defaults.withCredentials = true;  // 允许跨域携带 Cookie
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 挂载到 Vue 原型，使组件内可以直接使用 this.$http 和 this.$qs
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;

// 关闭生产环境的警告
Vue.config.productionTip = false;

// 创建 Vue 实例
new Vue({
  router,
  render: h => h(App)  // 更推荐的 Vue 2 写法
}).$mount('#app');
