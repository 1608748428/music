<template>
  <div class="discovery">
    <div class="lbt">
      <!-- 轮播图 -->
      <el-carousel :interval="4000" type="card" height="200px">
        <!-- 循环获取到的接口数据 -->
        <el-carousel-item v-for="(item, index) in lbt" :key="index">
          <img :src="item.imageUrl" alt />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="playlists">
      <h3>推荐歌单</h3>
      <div class="playlists_main">
        <div
          class="item"
          v-for="(item, index) in result"
          :key="index"
          @click="toplay(item.id)"
        >
          <div class="item_list">
            <div class="ssp">
              <span>{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" alt />
            <i class="el-icon-video-play"></i>
          </div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="songs">
      <h3>最新音乐</h3>
      <div class="songs_main">
        <div class="song_item" v-for="(item, index) in songs" :key="index">
          <img :src="item.picUrl" alt />
          <i class="el-icon-video-play" @click="picUrl(item.id)"></i>
          <span>{{ item.name }}</span>
          <p>{{ item.song.artists[0].name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新MV -->
    <div class="mvs">
      <h3>推荐MV</h3>
      <div class="mvs_main">
        <div class="mvs_item" v-for="(item, index) in mvs" :key="index">
          <div class="mvs_pic" @click="playMv(item.id)">
            <img :src="item.picUrl" alt />
            <div class="mvs_ico">
              <i class="el-icon-caret-right"></i>
              <span>{{ item.playCount }}</span>
            </div>
            <i class="el-icon-video-play"></i>
          </div>
          <span>{{ item.name }}</span>
          <p>{{ item.artistName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  data() {
    return {
      // 轮播图数组
      lbt: [],
      // 推荐歌单
      result: [],
      // 最新音乐
      songs: [],
      // 最新MV
      mvs: [],
    };
  },
  // 生命周期函数
  // 页面加载就执行下面的函数
  created() {
    // 轮播图接口
    axios({
      // 接口地址
      url: "https://autumnfish.cn/banner",
      // 请求方式
      method: "get",
      // 传递的参数
      params: 10,
    }).then((res) => {
      this.lbt = res.data.banners;
    });
    // 推荐歌单接口
    axios({
      // 请求地址接口
      url: "https://autumnfish.cn/personalized",
      // 请求方式
      method: "get",
      // 传递的参数
      params: {
        // 获取的数据量
        limit: 10,
      },
    }).then((res) => {
      this.result = res.data.result;
    });
    // 最新音乐接口
    axios({
      // 请求地址接口
      url: "https://autumnfish.cn/personalized/newsong",
      // 请求方式
      method: "get",
      // 传递的参数
      params: {},
    }).then((res) => {
      this.songs = res.data.result;
    });
    // 最新MV接口
    axios({
      // 请求地址接口
      url: "https://autumnfish.cn/personalized/mv",
      // 请求方法
      method: "get",
    }).then((res) => {
      this.mvs = res.data.result;
    });
  },
  methods: {
    // 歌单详情页面
    toplay(id) {
      this.$router.push("/playlist?q=" + id);
    },
    // mv 详情页面
    playMv(id) {
      this.$router.push("/mv?m=" + id);
    },
    picUrl(id) {
      // console.log(id);
      axios({
        // 请求的地址接口
        url: "https://autumnfish.cn/song/url",
        // 请求的方式
        method: "get",
        // 传递的参数
        params: {
          id, // id:id
        },
      }).then((res) => {
        // console.log(res);
        let url = res.data.data[0].url;
        // 获取父组件里的属性值
        // console.log(this.$parent.musicUrl);
        // 设置给父组件的 音乐播放地址
        this.$parent.musicUrl = url;
      });
    },
  },
};
</script>

<style>
.discovery {
  position: relative;
  width: 80%;
  height: 650px;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.discovery::-webkit-scrollbar {
  display: none;
}
.lbt img {
  width: 100%;
}
.playlists {
  margin: 20px 0;
}
.playlists h3 {
  font-weight: 400;
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
.songs {
  position: absolute;
  top: 800px;
  width: 100%;
}
.songs h3 {
  font-weight: 400;
  padding-bottom: 20px;
  width: 100%;
}
.song_item {
  position: relative;
  width: 50%;
  height: 80px;
  cursor: pointer;
  float: left;
  margin-bottom: 20px;
}
.song_item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.song_item > img {
  width: 80px;
  height: 80px;
}
.song_item > span {
  position: absolute;
  top: 5px;
  left: 85px;
  width: 100%;
}
.song_item > p {
  position: absolute;
  bottom: 5px;
  left: 85px;
  width: 100%;
  font-size: 12px;
  color: #333;
}
.song_item .el-icon-video-play {
  position: absolute;
  top: 26px;
  left: 28px;
  font-size: 25px;
  display: none;
  color: #ffffff;
}
.song_item:hover .el-icon-video-play {
  display: block;
}
.mvs {
  position: absolute;
  top: 1380px;
  width: 100%;
}
.mvs h3 {
  font-weight: 400;
  margin-bottom: 20px;
}
.mvs_main {
  width: 100%;
}
.mvs_item {
  width: 25%;
  float: left;
  padding-right: 20px;
}
.mvs_item > p {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
.mvs_pic {
  position: relative;
  cursor: pointer;
}
.mvs_pic .el-icon-video-play {
  position: absolute;
  top: 50px;
  left: 100px;
  font-size: 30px;
  color: #ffffff;
  display: none;
}
.mvs_pic:hover .el-icon-video-play {
  display: block;
}
.mvs_pic img {
  width: 100%;
}
.mvs_ico {
  position: absolute;
  top: 1px;
  right: 3px;
  color: #ffffff;
  font-size: 12px;
}
</style>