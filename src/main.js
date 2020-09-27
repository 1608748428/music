import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

// Element-ui 框架 安装
// 导入 element-ui
import elementUI from "element-ui";
// 导入 element-ui 的样式
import "element-ui/lib/theme-chalk/index.css";
// use 一下
Vue.use(elementUI);

// vue-router 路由
// 导入
import VueRouter from "vue-router";
// use一下
Vue.use(VueRouter);
// 导入需要通过路由管理的组件
// 发现音乐
import discovery from './views/discovery.vue'
// 推荐歌单
import playlists from './views/playlists.vue'
// 最新音乐
import songs from './views/songs.vue'
// 最新MV
import mvs from './views/mvs.vue'
// 搜索
import result from './views/result.vue'
// 歌单详情
import playlist from './views/playlist.vue'
// mv详情
import mv from './views/mv.vue'
// 创建路由
let router = new VueRouter({
  routes: [
    // 配置地址和组件的对应关系
    {
      // 地址
      path: "/",
      // 组件
      component: discovery
    },
    {
      // 地址
      path: "/discovery",
      // 组件
      component: discovery
    },
    {
      // 地址
      path: "/playlists",
      // 组件
      component: playlists
    },
    {
      // 地址
      path: "/songs",
      // 组件
      component: songs
    },
    {
      // 地址
      path: "/mvs",
      // 组件
      component: mvs
    },
    {
      // 地址
      path: "/result",
      // 组件
      component: result
    },
    {
      // 地址
      path: "/playlist",
      // 组件
      component: playlist
    },
    {
      // 地址
      path: "/mv",
      // 组件
      component: mv
    },
  ],
});

new Vue({
  render: (h) => h(App),
  // 挂载到Vue实例对象上
  router, // router:router
}).$mount("#app");
