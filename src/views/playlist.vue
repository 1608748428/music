<template>
  <div class="playlist">
    <!-- 歌单简单介绍 -->
    <div class="playlist_hear">
      <!-- 封面 -->
      <div class="playlist_left">
        <img :src="playlists.coverImgUrl" alt="" />
      </div>
      <!-- 封面内容 -->
      <div class="playlist_right">
        <!-- 封面名字 -->
        <div class="playlist_top">{{ playlists.name }}</div>
        <!-- 用户信息 -->
        <div class="playlist_name">
          <img :src="playlists.creator.avatarUrl" alt="" />
          <span>{{ playlists.creator.nickname }}</span>
          <span>{{ playlists.createTime }} 创建</span>
        </div>
        <!-- 播放全部 -->
        <div class="playlist_all">
          <i class="el-icon-video-play"></i>
          播放全部
        </div>
        <!-- 标签 -->
        <div class="playlist_tag">
          <span>标签:</span>
          <ul>
            <li v-for="(item, index) in playlists.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <!-- 简介 -->
        <div class="playlist_info">
          <span>简介:</span>
          <p>{{ playlists.description }}</p>
        </div>
      </div>
    </div>
    <!-- 歌单详情内容 -->
    <div class="playlist_body">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="first">
          <div class="table">
            <table>
              <!-- 表格头 -->
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>音乐标题</th>
                  <th>歌手</th>
                  <th>专辑</th>
                  <th>时长</th>
                </tr>
              </thead>
              <!-- 表格体 -->
              <tbody>
                <!-- 歌曲列表 -->
                <tr v-for="(item, index) in musiclist" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="plays" @click="playmusic(item.id)">
                      <img :src="item.al.picUrl" alt="" />
                      <i class="el-icon-video-play"></i>
                    </div>
                  </td>
                  <td>
                    <div class="play_name">
                      {{ item.name }}
                      <i class="el-icon-caret-right" v-if="item.mv != 0"></i>
                    </div>
                  </td>
                  <td>{{ item.ar[0].name }}</td>
                  <td>
                    <div class="album">{{ item.al.name }}</div>
                  </td>
                  <td>{{ item.dt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <!-- 精彩评论 -->
          <div class="comments">
            <h3>精彩评论({{ hotCount }})</h3>
            <div
              class="comments_info"
              v-for="(item, index) in hotcomment"
              :key="index"
            >
              <div class="info_left">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="info_right">
                <div class="right_hear">
                  <span>{{ item.user.nickname }}:</span>
                  <span>{{ item.content }}</span>
                </div>
                <div class="right_body" v-if="item.beReplied.length != 0">
                  <span>{{ item.beReplied[0].user.nickname }}:</span>
                  <span>{{ item.beReplied[0].content }}</span>
                </div>
                <span>2020-09-27 17:22:16</span>
              </div>
            </div>
          </div>
          <!-- 最新评论 -->
          <div class="newcomments">
            <h3>最新评论({{ total }})</h3>
            <div
              class="comments_info"
              v-for="(item, index) in newComment"
              :key="index"
            >
              <div class="info_left">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="info_right">
                <div class="right_hear">
                  <span>{{ item.user.nickname }}:</span>
                  <span>{{ item.content }}</span>
                </div>
                <div class="right_body" v-if="item.beReplied.length != 0">
                  <span>{{ item.beReplied[0].user.nickname }}:</span>
                  <span>{{ item.beReplied[0].content }}</span>
                </div>
                <span>2020-09-27 17:22:16</span>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  data() {
    return {
      activeName: "first",
      // 歌单详情
      playlists: {},
      // 歌曲列表
      musiclist: [],
      // 歌曲精彩评论
      hotcomment: [],
      // 精彩评论的条数
      hotCount: "",
      // 歌曲最新评论
      newComment: [],
      // 最新评论的条数
      total: 0,
      // 当前页
      page: 1,
    };
  },
  created() {
    // 歌单详情
    axios({
      url: "https://autumnfish.cn/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      // 歌单详情
      this.playlists = res.data.playlist;
      // 歌单里的歌曲详情
      this.musiclist = res.data.playlist.tracks;
      // 将时间转化为分秒
      for (let i = 0; i < this.musiclist.length; i++) {
        // 转化为分
        let min = parseInt(this.musiclist[i].dt / 1000 / 60);
        min = min < 10 ? "0" + min : min;
        // 转化为秒
        let sec = parseInt((this.musiclist[i].dt / 1000) % 60);
        sec = sec < 10 ? "0" + sec : sec;
        // 将最后转化的分秒传递回去
        this.musiclist[i].dt = `${min}:${sec}`;
      }
    });
    // 精彩评论
    axios({
      url: "https://autumnfish.cn/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.q,
        type: 2,
      },
    }).then((res) => {
      this.hotcomment = res.data.hotComments;
      // 获取精彩评论的条数
      this.hotCount = res.data.total;
    });
    // 最新评论
    axios({
      url: "https://autumnfish.cn/comment/playlist",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 20,
        offset: (this.page - 1) * 20,
      },
    }).then((res) => {
      this.newComment = res.data.comments;
      // 最新评论的条数
      this.total = res.data.total;
    });
  },
  methods: {
    playmusic(id) {
      //播放音乐
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id, // id:id
        },
      }).then((res) => {
        // 保存播放地址
        let url = res.data.data[0].url;
        // 将拿到的播放地址传递给父组件的播放组件
        this.$parent.musicUrl = url;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      // 最新评论
      axios({
        url: "https://autumnfish.cn/comment/playlist",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 20,
          offset: (this.page - 1) * 20,
        },
      }).then((res) => {
        this.newComment = res.data.comments;
        // 最新评论的条数
        this.total = res.data.total;
      });
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
.playlist {
  width: 80%;
  height: 650px;
  margin: 20px auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.playlist::-webkit-scrollbar {
  display: none;
}
/* 头部歌单详情 */
.playlist_hear {
  width: 100%;
  height: 200px;
}
.playlist_left {
  float: left;
  width: 20%;
  height: 190px;
  padding-right: 20px;
}
.playlist_left > img {
  width: 100%;
  height: 90%;
}
.playlist_right {
  float: left;
  width: 80%;
  height: 200px;
}
.playlist_name {
  margin: 15px 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.playlist_name > img {
  width: 30px;
  height: 100%;
  border-radius: 15px;
  vertical-align: middle;
}
.playlist_name > span {
  padding: 0 8px;
  font-size: 12px;
}
.playlist_all {
  width: 110px;
  height: 30px;
  line-height: 30px;
  background-color: #252525;
  color: #eeeded;
  text-align: center;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
}
.playlist_tag {
  margin: 8px 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.playlist_tag > span {
  float: left;
}
.playlist_tag ul li {
  float: left;
  list-style: none;
  font-size: 14px;
  padding: 0 10px;
}
.playlist_info {
  width: 100%;
  height: 50px;
  position: relative;
}
.playlist_info > span {
  position: absolute;
  left: 0;
}
.playlist_info > p {
  position: absolute;
  left: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 14px;
  padding: 3px;
}
/* 歌曲列表 */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12px;
}
thead {
  padding: 10px auto;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}
thead > tr > th {
  font-weight: 200;
  color: #504f4f;
}
tbody > tr {
  width: 100%;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  color: #4c4d4d;
  margin: 10px 0;
}
tbody > tr:nth-child(even) {
  background-color: #f5f3f3;
}
tbody > tr:hover {
  background-color: #f5f7fb;
}
tbody > tr:hover .plays i {
  display: block;
}
.plays {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 10px 10px;
  margin-right: -10px;
}
.plays > img {
  width: 100%;
  height: 100%;
}
.plays > i {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 25px;
  color: #ffffff;
  display: none;
}
.play_name {
  margin-right: -80px;
}
.play_name > i {
  border: 1px solid red;
  padding: 0 3px;
  border-radius: 3px;
  color: red;
  font-size: 12px;
}
.album {
  margin-right: -30px;
}
/* 精彩评论 */
.comments {
  width: 100%;
  margin-bottom: 100px;
}
.comments_info {
  margin: 20px 0;
  height: 80px;
}

.info_left {
  float: left;
  margin-right: 10px;
  height: 60px;
}
.info_left > img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
.info_right {
  float: left;
  width: 90%;
  overflow: hidden;
}
.info_right > span {
  font-size: 12px;
  color: #bdbaba;
}
.right_hear {
  height: 30px;
  line-height: 30px;
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  overflow-y: scroll;
  text-overflow: ellipsis;
}
.right_hear::-webkit-scrollbar,
.right_body::-webkit-scrollbar {
  display: none;
}
.right_hear span:nth-child(1),
.right_body span:nth-child(1) {
  color: #2995fae5;
  margin-right: 5px;
}
.right_body {
  height: 30px;
  line-height: 30px;
  background-color: #c4c3c3;
  width: 100%;
  font-size: 12px;
  padding-left: 10px;
  overflow: hidden;
  overflow-y: scroll;
  text-overflow: ellipsis;
}
</style>