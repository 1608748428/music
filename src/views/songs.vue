<template>
  <div class="songss">
    <!-- 标签页 -->
    <div class="tags">
      <div class="tags_item" @click="tag = 0" :class="{ algin: tag == 0 }">
        全部
      </div>
      <div class="tags_item" @click="tag = 7" :class="{ algin: tag == 7 }">
        华语
      </div>
      <div class="tags_item" @click="tag = 96" :class="{ algin: tag == 96 }">
        欧美
      </div>
      <div class="tags_item" @click="tag = 8" :class="{ algin: tag == 8 }">
        日本
      </div>
      <div class="tags_item" @click="tag = 16" :class="{ algin: tag == 16 }">
        韩国
      </div>
    </div>
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
              <div class="play" @click="playmusic(item.id)">
                <img :src="item.album.picUrl" alt="" />
                <i class="el-icon-video-play"></i>
              </div>
            </td>
            <td>
              <div class="play_name">
                {{ item.name }}
                <i v-if="item.mvid != 0" class="el-icon-caret-right"></i>
              </div>
            </td>
            <td>{{ item.album.artists[0].name }}</td>
            <td>
              <div class="album">{{ item.album.name }}</div>
            </td>
            <td>{{ item.duration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  // 侦听器
  watch: {
    tag() {
      this.listData();
    },
  },
  data() {
    return {
      // 标签
      tag: 0,
      //最新音乐数据
      musiclist: [],
    };
  },
  created() {
    // 直接调用最新音乐方法
    this.listData();
  },
  methods: {
    listData() {
      axios({
        url: "https://autumnfish.cn/top/song",
        method: "get",
        params: {
          type: this.tag,
        },
      }).then((res) => {
        this.musiclist = res.data.data;
        // 处理时长 毫秒 转为 分秒
        for (let i = 0; i < this.musiclist.length; i++) {
          // 获取总毫秒数
          let duration = this.musiclist[i].duration;
          // 总秒数=总毫秒数/1000
          // 转换为分钟  总秒数/60
          // 剩余的转化为秒  总秒数%60
          // 转换为分
          let min = parseInt(duration / 1000 / 60);
          min = min < 10 ? "0" + min : min;
          // 转换为秒
          let sec = parseInt((duration / 1000) % 60);
          sec = sec < 10 ? "0" + sec : sec;
          // 将毫秒数转换为 分秒传递回去
          this.musiclist[i].duration = `${min}:${sec}`;
        }
      });
    },
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
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.songss {
  width: 80%;
  height: 650px;
  margin: 20px auto;
  overflow-x: hidden;
  overflow-y: scroll;
}
.songss::-webkit-scrollbar {
  display: none;
}
/* 标签 */
.tags {
  width: 100%;
  overflow: hidden;
  padding-left: 68%;
  cursor: pointer;
}
.tags_item {
  float: left;
  margin-left: 35px;
  font-size: 14px;
  color: #999797;
}
.algin {
  color: #dd7f60;
}
/* 主体内容 */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 30px;
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
tbody > tr:hover .play i {
  display: block;
}
.play {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 10px 10px;
  margin-right: 35px;
}
.play > img {
  width: 100%;
  height: 100%;
}
.play > i {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 25px;
  color: #ffffff;
  display: none;
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
</style>