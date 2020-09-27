<template>
  <div class="playlists_center">
    <!-- 精品歌单 -->
    <div class="playlists_hear">
      <div class="porarait">
        <!-- 头像 -->
        <img :src="topList.coverImgUrl" alt />
      </div>
      <div class="content">
        <div class="content_good">
          <span>精品歌单</span>
        </div>
        <!-- 标题 -->
        <span>{{ topList.name }}</span>
        <!-- 介绍 -->
        <p>{{ topList.description }}</p>
      </div>
      <!-- 背景图片 -->
      <img :src="topList.coverImgUrl" alt class="bg" />
    </div>
    <!-- 标签栏 -->
    <div class="playlists_nav">
      <div
        class="items"
        :class="{ align: tag == '全部' }"
        @click="tag = '全部'"
      >
        全部
      </div>
      <div
        class="items"
        :class="{ align: tag == '欧美' }"
        @click="tag = '欧美'"
      >
        欧美
      </div>
      <div
        class="items"
        :class="{ align: tag == '华语' }"
        @click="tag = '华语'"
      >
        华语
      </div>
      <div
        class="items"
        :class="{ align: tag == '流行' }"
        @click="tag = '流行'"
      >
        流行
      </div>
      <div
        class="items"
        :class="{ align: tag == '说唱' }"
        @click="tag = '说唱'"
      >
        说唱
      </div>
      <div
        class="items"
        :class="{ align: tag == '摇滚' }"
        @click="tag = '摇滚'"
      >
        摇滚
      </div>
      <div
        class="items"
        :class="{ align: tag == '民谣' }"
        @click="tag = '民谣'"
      >
        民谣
      </div>
      <div
        class="items"
        :class="{ align: tag == '电子' }"
        @click="tag = '电子'"
      >
        电子
      </div>
      <div
        class="items"
        :class="{ align: tag == '轻音乐' }"
        @click="tag = '轻音乐'"
      >
        轻音乐
      </div>
      <div
        class="items"
        :class="{ aign: tag == '影视原声' }"
        @click="tag = '影视原声'"
      >
        影视原声
      </div>
      <div class="items" :class="{ align: tag == 'ACG' }" @click="tag = 'ACG'">
        ACG
      </div>
      <div
        class="items"
        :class="{ align: tag == '怀旧' }"
        @click="tag = '怀旧'"
      >
        怀旧
      </div>
      <div
        class="items"
        :class="{ align: tag == '治愈' }"
        @click="tag = '治愈'"
      >
        治愈
      </div>
      <div
        class="items"
        :class="{ align: tag == '旅行' }"
        @click="tag = '旅行'"
      >
        旅行
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="playlists_songs">
      <div class="playlists_main">
        <div
          class="item"
          v-for="(item, index) in songs"
          :key="index"
          @click="toplay(item.id)"
        >
          <div class="item_list">
            <div class="ssp">
              <span>播放量:{{ item.playCount }}</span>
            </div>
            <img :src="item.coverImgUrl" alt />
            <i class="el-icon-video-play"></i>
          </div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 分页栏 -->
    <div class="playlists_page">
      <!-- 分页器   
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change  页码改变事件
      -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="10"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// 导入 axios
import axios from "axios";
export default {
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 顶部的精品歌单
      topList: {},
      // 歌单列表
      songs: [],
      // 当前选择的数据
      tag: "全部",
    };
  },
  // 侦听器  可以获取变化的数据
  watch: {
    // 监听当前选择的标签
    tag() {
      // 顶部歌单方法调用
      this.topData();
      // 歌单列表方法调用
      this.listData();
      // 点击标签时，显示的是第一页的数据  把页码改为1即可
      this.page = 1;
    },
  },

  //声明周期函数  页面加载时调用里面的方法
  created() {
    // 顶部歌单方法调用
    this.topData();
    // 歌单列表方法调用
    this.listData();
  },
  methods: {
    // 跳转到歌单详情页面
    toplay(id) {
      this.$router.push("/playlist?q=" + id);
    },
    // 1.抽取顶部歌单的axios 封装成一个方法 需要时调用
    topData() {
      axios({
        url: "https://autumnfish.cn/top/playlist/highquality",
        method: "get",
        params: {
          // 获取的个数
          limit: 1,
          // 歌单的标签
          cat: this.tag,
        },
      }).then((res) => {
        this.topList = res.data.playlists[0];
      });
    },
    // 2.抽取歌单列表的axios 封装成一个方法 需要时调用
    listData() {
      axios({
        url: "https://autumnfish.cn/top/playlist",
        method: "get",
        params: {
          // 获取的个数
          limit: 10,
          // 偏移数量,用于分页 如 (页数-1)*20,其中20为limit的值
          offset: (this.page - 1) * 10,
          // 歌单的标签
          cat: this.tag,
        },
      }).then((res) => {
        // 保存总条数
        this.total = res.data.total;
        // 保存数据
        this.songs = res.data.playlists;
        for (let i = 0; i < this.songs.length; i++) {
          if (this.songs[i].playCount > 100000) {
            this.songs[i].playCount =
              parseInt(this.songs[i].playCount / 10000) + "万";
          }
        }
      });
    },
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存改变页码
      this.page = val;
      // 再次调用方法2
      this.listData();
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.playlists_center {
  width: 80%;
  height: 650px;
  margin: 10px auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.playlists_center::-webkit-scrollbar {
  display: none;
}
/* 精品歌单 */
.playlists_hear {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300%;
  filter: blur(25px);
  z-index: 0;
}
.porarait {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 15%;
  height: 100%;
  z-index: 1;
}
.porarait > img {
  width: 80%;
  height: 80%;
}
.content {
  position: absolute;
  top: 0;
  right: 0;
  width: 85%;
  height: 100%;
  z-index: 1;
}
.content > span {
  color: #ffffff;
  margin: 10px 0;
  font-size: 15px;
}
.content > p {
  color: #827771;
  font-size: 12px;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  padding-right: 25px;
}
.content_good > span {
  display: block;
  border: 1.5px solid #8a6434;
  border-radius: 4px;
  width: 90px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: #8a6434;
  font-size: 14px;
  margin-top: 15px;
  margin-bottom: 8px;
}
/* 标签栏 */
.playlists_nav {
  width: 100%;
  height: 30px;
  margin-top: 30px;
  padding-left: 30%;
}
.items {
  float: left;
  margin-left: 20px;
  font-size: 14px;
  cursor: pointer;
  color: #5f5e5e;
}
.align {
  color: #da6e62;
}
/* 推荐歌单 */
.playlists_songs {
  width: 100%;
  height: 530px;
}
.item {
  position: relative;
  width: 20%;
  height: 200px;
  margin: 20px 0;
  cursor: pointer;
  float: left;
  padding-right: 15px;
}
.item > p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  padding-top: 5px;
}
.ssp {
  display: none;
  color: #ffffff;
}
.item_list span {
  position: absolute;
  top: 0;
  width: 93%;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  padding: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item_list:hover .ssp {
  display: block;
}
.item_list img {
  width: 100%;
}
.item_list .el-icon-video-play {
  position: absolute;
  top: 160px;
  right: 25px;
  display: none;
  font-size: 25px;
  color: #ffffff;
}
.item_list:hover .el-icon-video-play {
  display: block;
}
/* 分页栏 */
.playlists_page {
  text-align: center;
  margin-bottom: 20px;
}
</style>