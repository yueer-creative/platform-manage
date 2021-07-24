import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login/Login.vue'
// @ -> src
import Login from '@/components/login/Login.vue'
import Home from '@/components/home/Home.vue'
import Users from '@/components/users/Users.vue'
import GoodsList from '@/components/goods/GoodsList.vue'
import GoodsAdd from '@/components/goods/GoodsAdd.vue'
import GoodsCategory from '@/components/goods/GoodsCategory.vue'

Vue.use(VueRouter)

const routes = [{
  name: 'login',
  path: '/login',
  component: Login
},
{
  name: 'home',
  path: '/',
  component: Home,
  children: [{
    name: 'users',
    path: '/users',
    component: Users
  }, {
    name: 'goods',
    path: '/goods',
    component: GoodsList
  }, {
    name: 'goodsadd',
    path: '/goodsadd',
    component: GoodsAdd
  }, {
    name: 'category',
    path: '/category',
    component: GoodsCategory
  }]
}
]

const router = new VueRouter({
  routes
})

export default router
