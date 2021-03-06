import '@/assets/reset.css'
import 'swiper/dist/css/swiper.css'
import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import router from './router/router'
import store from './store/store'
import axios from 'axios'
import MyHeader from '@/components/MyHeader.vue'
import NavBar from '@/components/NavBar.vue'
import MySwiper from '@/components/Swiper.vue'
import MyTitle from '@/components/MyTitle.vue'
import MusicItem from '@/components/MusicItem.vue'
import MusicShow from '@/components/MusicShow.vue'
import LogoFooter from '@/components/LogoFooter.vue'
import SingerItem from '@/components/SingerItem.vue'
import IndexList from '@/components/IndexList.vue'
import MyProgress from '@/components/Progress.vue'
import Loading from '@/components/Loading.vue'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://139.199.64.35:3001'

//懒加载
Vue.use(VueLazyload,{
  preLoad: 1.3,
  error: '',
  loading: '@/../img/touxiang.png',
  attempt: 1
})

//过滤器
Vue.filter('numChange',(value) =>{
  if(value == undefined){
    return 0;
  }
  return  (value/10000).toFixed(1);
})

//全局组件
Vue.component(MyHeader.name,MyHeader)
Vue.component(NavBar.name,NavBar)
Vue.component(MySwiper.name,MySwiper)
Vue.component(MyTitle.name,MyTitle)
Vue.component(MusicItem.name,MusicItem)
Vue.component(MusicShow.name,MusicShow)
Vue.component(LogoFooter.name,LogoFooter)
Vue.component(SingerItem.name,SingerItem)
Vue.component(IndexList.name,IndexList)
Vue.component('MyProgress',MyProgress)
Vue.component(Loading.name,Loading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
