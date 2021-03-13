import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import router from './router'
import MyServerHTTP from '@/plugins/http.js'
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyServerHTTP)

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
// npm i momment
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
