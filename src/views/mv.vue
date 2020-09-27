<template>
  <div class="mv">
    <!-- 左边mv详情 -->
    <div class="mv_left">
      <h3>mv详情</h3>
      <!-- 播放MV界面 -->
      <video :src="mvinfo.url" controls :poster="mvdetails.cover"></video>
      <div class="left_hear">
        <!-- 歌手信息 -->
        <!-- 头像 -->
        <img :src="singer.picUrl" alt="" />
        <!-- 歌手名 -->
        <span>{{ singer.name }}</span>
      </div>
      <div class="left_body">
        <!-- MV标题 -->
        <h1>{{ mvdetails.briefDesc }}</h1>
        <div class="left_time">
          <!-- 播放次数 -->
          <span>发布:{{ mvdetails.publishTime }}</span>
          <span>播放:{{ mvdetails.playCount }}次</span>
        </div>
        <!-- MV详细信息 -->
        <p>{{ mvdetails.desc }}</p>
      </div>
      <!-- 精彩评论 -->
      <div class="comments">
        <h3>精彩评论</h3>
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
            :page-size="20"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 右边相关推荐 -->
    <div class="mv_right">
      <h3>相关推荐</h3>
      <div class="mv_item" v-for="(item, index) in relatedmv" :key="index">
        <div class="mv_pic" @click="tomv(item.id)">
          <img :src="item.cover" alt />
          <div class="mv_ico">
            <i class="el-icon-caret-right"></i>
            <span>{{ item.playCount }}</span>
          </div>
          <i class="el-icon-video-play"></i>
          <div class="mvlength">
            <span>{{ item.duration }}</span>
          </div>
        </div>
        <div class="mv_info">
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
      // mv详情
      mvinfo: {},
      // 相关的mv详情
      relatedmv: [],
      // mv信息
      mvdetails: {},
      // 歌手的信息
      singer: {},
      // MV的条数
      total: 0,
      // 页码
      page: 1,
      // 精彩评论
      hotcomment: 0,
      // 最新评论
      newComment: 0,
    };
  },
  created() {
    //mv详情
    axios({
      url: "https://autumnfish.cn/mv/url",
      method: "get",
      params: {
        // 获取传递过来的mvid
        id: this.$route.query.m,
      },
    }).then((res) => {
      this.mvinfo = res.data.data;
    });
    // 相关mv详情
    axios({
      url: "https://autumnfish.cn/simi/mv",
      method: "get",
      params: {
        mvid: this.$route.query.m,
      },
    }).then((res) => {
      this.relatedmv = res.data.mvs;
      // 将毫秒转换为分秒
      for (let i = 0; i < this.relatedmv.length; i++) {
        // 转换为分
        let min = parseInt(this.relatedmv[i].duration / 1000 / 60);
        min = min < 10 ? "0" + min : min;
        // 转换为秒
        let sec = parseInt((this.relatedmv[i].duration / 1000) % 60);
        sec = sec < 10 ? "0" + sec : sec;
        // 将最后转换的结果返回
        this.relatedmv[i].duration = `${min}:${sec}`;
      }
      // 超过十万显示万
      for (let i = 0; i < this.relatedmv.length; i++) {
        if (this.relatedmv[i].playCount > 100000) {
          this.relatedmv[i].playCount =
            parseInt(this.relatedmv[i].playCount / 10000) + "万";
        }
      }
    });
    // mv 信息
    axios({
      url: "https://autumnfish.cn/mv/detail",
      method: "get",
      params: {
        mvid: this.$route.query.m,
      },
    }).then((res) => {
      this.mvdetails = res.data.data;
      // 歌手信息
      axios({
        url: "https://autumnfish.cn/artists",
        method: "get",
        params: {
          id: this.mvdetails.artists[0].id,
        },
      }).then((res) => {
        this.singer = res.data.artist;
      });
    });
    // mv评论
    axios({
      url: "https://autumnfish.cn/comment/mv",
      method: "get",
      params: {
        id: this.$route.query.m,
        limit: 20,
        offset: (this.page - 1) * 20,
      },
    }).then((res) => {
      console.log(res);
      // 精彩评论
      this.hotcomment = res.data.hotComments;
      // 最新评论
      this.newComment = res.data.comments;
      // 评论的条数
      this.total = res.data.total;
    });
  },
  methods: {
    tomv(id) {
      //mv详情
      axios({
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          // 获取传递过来的mvid
          id, // id: id
        },
      }).then((res) => {
        this.mvinfo = res.data.data;
      });
      // mv 信息
      axios({
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: id,
        },
      }).then((res) => {
        this.mvdetails = res.data.data;
        // 歌手信息
        axios({
          url: "https://autumnfish.cn/artists",
          method: "get",
          params: {
            id: this.mvdetails.artists[0].id,
          },
        }).then((res) => {
          this.singer = res.data.artist;
        });
      });
      // mv评论
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: id,
          limit: 20,
          offset: (this.page - 1) * 20,
        },
      }).then((res) => {
        console.log(res);
        // 精彩评论
        this.hotcomment = res.data.hotComments;
        // 最新评论
        this.newComment = res.data.comments;
        // 评论的条数
        this.total = res.data.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      // mv评论
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.m,
          limit: 20,
          offset: (this.page - 1) * 20,
        },
      }).then((res) => {
        console.log(res);
        // 最新评论
        this.newComment = res.data.comments;
        // 评论的条数
        this.total = res.data.total;
      });
    },
  },
};
</script>

<style>
.mv {
  width: 80%;
  height: 650px;
  margin: 20px auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.mv::-webkit-scrollbar {
  display: none;
}
/* mv详情页 */
.mv_left {
  float: left;
  width: 63%;
}
.mv_left video {
  width: 100%;
  margin: 15px 0;
}
.left_hear img {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  vertical-align: middle;
  margin-right: 10px;
}
.left_body h1 {
  margin: 20px 0;
}
.left_time {
  font-size: 13px;
  color: #9b9a9a;
  margin-bottom: 15px;
}
.left_time span {
  margin-right: 20px;
}
/* mv相关推荐 */
.mv_right {
  float: right;
  width: 32%;
}
.mv_item {
  width: 100%;
  height: 120px;
  margin: 20px 0;
}
.mv_item > span {
  overflow: hidden; /*内容超出后隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mv_item > p {
  font-size: 12px;
  color: #999;
}
.mv_pic {
  position: relative;
  cursor: pointer;
  float: left;
  width: 70%;
  height: 120px;
  vertical-align: middle;
}
.mv_pic .el-icon-video-play {
  position: absolute;
  top: 50px;
  left: 120px;
  font-size: 30px;
  color: #ffffff;
  display: none;
}
.mv_pic:hover .el-icon-video-play {
  display: block;
}
.mv_pic > img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.mv_ico {
  position: absolute;
  top: 1px;
  right: 3px;
  color: #ffffff;
  font-size: 12px;
}
.mv_info {
  float: right;
  width: 25%;
  padding-top: 30px;
}
.mv_info > span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.mv_info > p {
  font-size: 13px;
  color: #999;
  margin-top: 3px;
}
/* 时长 */
.mvlength {
  position: absolute;
  bottom: 7px;
  right: 5px;
  color: #ffffff;
  font-size: 12px;
}
/* 精彩评论 */
.comments {
  margin-top: 30px;
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
}
.info_left > img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
.info_right {
  float: left;
  width: 90%;
}
.info_right > span {
  font-size: 12px;
  color: #bdbaba;
}
.right_hear {
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.right_hear span:nth-child(1),
.right_body span:nth-child(1) {
  color: #2995fae5;
  margin-right: 5px;
}
.right_body {
  background-color: #c4c3c3;
  width: 100%;
  font-size: 12px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>