<template>
  <div class="results">
    <div class="results_hear">
      <!-- 取得别的页面传递过来的数据 -->
      <h3>{{ $route.query.p }}</h3>
      <span>找到{{ songall }}个结果</span>
    </div>
    <div class="result_body">
      <!-- 搜索列表 -->
      <el-tabs v-model="activeName">
        <!-- 歌曲 -->
        <el-tab-pane label="歌曲" name="first">
          <div class="table">
            <table>
              <!-- 表格头 -->
              <thead>
                <tr>
                  <th></th>
                  <th>音乐标题</th>
                  <th>歌手</th>
                  <th>专辑</th>
                  <th>时长</th>
                </tr>
              </thead>
              <!-- 表格体 -->
              <tbody>
                <!-- 歌曲列表  dblclick 双击事件 -->
                <tr
                  v-for="(item, index) in songList"
                  :key="index"
                  @dblclick="playmusic(item.id)"
                >
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="play_name">
                      {{ item.name }}
                      <i
                        v-show="item.mvid != 0"
                        class="el-icon-caret-right"
                      ></i>
                    </div>
                  </td>
                  <td>{{ item.artists[0].name }}</td>
                  <td>
                    <div class="album">{{ item.album.name }}</div>
                  </td>
                  <td>{{ item.duration }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
        <!-- 歌单 -->
        <el-tab-pane label="歌单" name="second">
          <!-- 歌单列表 -->
          <div class="playlists_songs">
            <div class="playlists_main">
              <div
                class="item"
                v-for="(item, index) in songs"
                :key="index"
                @click="toplaylist(item.id)"
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
        </el-tab-pane>
        <!-- MV -->
        <el-tab-pane label="MV" name="third">
          <!-- 歌曲MV列表 -->
          <div class="mvlist">
            <div class="mvs_main">
              <div
                class="mvs_item"
                v-for="(item, index) in mvlists"
                :key="index"
              >
                <div class="mvs_pic" @click="playMv(item.id)">
                  <img :src="item.cover" alt />
                  <div class="mvs_ico">
                    <i class="el-icon-caret-right"></i>
                    <span>{{ item.playCount }}</span>
                  </div>
                  <i class="el-icon-video-play"></i>
                  <div class="mvlength">
                    <span>{{ item.duration }}</span>
                  </div>
                </div>
                <span>{{ item.name }}</span>
                <p>{{ item.artistName }}</p>
              </div>
            </div>
          </div>
          <!-- 分页器 -->
          <div class="foot">
            <!-- 分页器   
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change  页码改变事件
      -->
            <el-pagination
              @current-change="handleCurrentChang"
              background
              layout="prev, pager, next"
              :total="total"
              :current-page="page"
              :page-size="8"
            ></el-pagination>
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
  // 侦听器
  watch: {
    activeName() {
      switch (this.activeName) {
        case "first":
          this.musictype = 1;
          this.searchData();
          break;
        case "second":
          this.musictype = 1000;
          this.songsData();
          break;
        case "third":
          this.musictype = 1004;
          this.mvData();
          break;
        default:
          break;
      }
    },
  },
  data() {
    return {
      // 总条数
      total: 10,
      // 页码
      page: 1,
      // 选项卡
      activeName: "first",
      // 歌曲列表
      songList: [],
      // 歌单列表
      songs: [],
      // MV列表
      mvlists: [],
      // 歌曲总数
      songall: "",
      // 选择类型
      musictype: "1",
    };
  },
  created() {
    this.searchData();
  },
  methods: {
    //歌单详情接口
    toplaylist(id) {
      this.$router.push("/playlist?q=" + id);
    },
    // mv 详情页面
    playMv(id) {
      this.$router.push("/mv?m=" + id);
    },
    // 封装搜索接口
    searchData() {
      // 搜索歌曲列表
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          // 歌曲搜索
          keywords: this.$route.query.p,
          type: this.musictype,
        },
      }).then((res) => {
        //保存歌曲列表
        this.songList = res.data.result.songs;
        // 保存歌曲总数
        this.songall = res.data.result.songCount;
        // 将时间转化为分秒
        for (let i = 0; i < this.songList.length; i++) {
          // 转化为分
          let min = parseInt(this.songList[i].duration / 1000 / 60);
          min = min < 10 ? "0" + min : min;
          // 转化为秒
          let sec = parseInt((this.songList[i].duration / 1000) % 60);
          sec = sec < 10 ? "0" + sec : sec;
          // 将最后转化的分秒传递回去
          this.songList[i].duration = `${min}:${sec}`;
        }
      });
    },
    // 封装搜索歌单接口
    songsData() {
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          // 歌曲搜索
          keywords: this.$route.query.p,
          type: this.musictype,
          // 返回数据量
          limit: 10,
          // 偏移数量
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        //保存歌曲列表
        this.songs = res.data.result.playlists;
        // 保存总条数
        this.total = res.data.result.playlistCount;
        // 超过10万显示万
        for (let i = 0; i < this.songs.length; i++) {
          if (this.songs[i].playCount > 100000) {
            this.songs[i].playCount =
              parseInt(this.songs[i].playCount / 10000) + "万";
          }
        }
      });
    },
    // 封装MV搜索接口
    mvData() {
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          // 歌曲搜索
          keywords: this.$route.query.p,
          type: this.musictype,
          limit: 8,
          offset: (this.page - 1) * 8,
        },
      }).then((res) => {
        //保存歌曲列表
        console.log(res);
        this.mvlists = res.data.result.mvs;
        // 保存MV数量
        this.total = res.data.result.mvCount;
        // 超过10万显示万
        for (let i = 0; i < this.mvlists.length; i++) {
          if (this.mvlists[i].playCount > 100000) {
            this.mvlists[i].playCount =
              parseInt(this.mvlists[i].playCount / 10000) + "万";
          }
        }
        // 将毫秒改为分秒
        for (let i = 0; i < this.mvlists.length; i++) {
          // 转换为分
          let min = parseInt(this.mvlists[i].duration / 1000 / 60);
          min = min < 10 ? "0" + min : min;
          // 转换为秒
          let sec = parseInt((this.mvlists[i].duration / 1000) % 60);
          sec = sec < 10 ? "0" + sec : sec;
          // 将最后结果返回去修改它的毫秒数
          this.mvlists[i].duration = min + ":" + sec;
        }
      });
    },
    // 鼠标双击事件
    playmusic(id) {
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
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存改变页码
      this.page = val;
      // 调用方法 搜索歌单
      this.songsData();
    },
    // 页码改变事件
    handleCurrentChang(val) {
      // 保存改变页码
      this.page = val;
      // 调用方法 搜索MV
      this.mvData();
    },
  },
};
</script>

<style>
.results {
  width: 80%;
  height: 650px;
  margin: 20px auto;
  overflow-x: hidden;
  /* 页面超出显示滚动条 */
  overflow-y: scroll;
}
/* 滚动条隐藏 */
.results::-webkit-scrollbar {
  display: none;
}
.results_hear {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
}
.results_hear h3 {
  float: left;
  font-size: 35px;
}
.results_hear span {
  float: left;
  padding-top: 25px;
  padding-left: 10px;
  font-size: 14px;
  color: #b1aeae;
}
/* 歌曲 */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 5px;
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
  height: 45px;
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
tbody > tr:hover .play i {
  display: block;
}
.play_name {
  margin-right: -40px;
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
/* 歌单列表 */
.mvlist {
  width: 100%;
  height: 450px;
  margin-top: 50px;
}
.mvs_main {
  width: 100%;
  height: 80%;
}
.mvs_item {
  width: 25%;
  height: 50%;
  float: left;
  padding-right: 20px;
  margin-bottom: 20px;
}
.mvs_item > span {
  display: block;
  width: 100%;
  overflow: hidden; /*内容超出后隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mvs_item > p {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
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
/* 时长 */
.mvlength {
  position: absolute;
  bottom: 7px;
  right: 5px;
  color: #ffffff;
  font-size: 12px;
}
/* 分页器 */
.foot {
  text-align: center;
  width: 100%;
  height: 100px;
}
</style>