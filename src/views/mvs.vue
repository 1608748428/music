<template>
  <div class="mvss">
    <!-- 地区 -->
    <div class="region">
      <dl>
        <dt>地区:</dt>
        <dd>
          <span :class="{ alging: area == '全部' }" @click="area = '全部'"
            >全部</span
          >
        </dd>
        <dd>
          <span :class="{ alging: area == '内地' }" @click="area = '内地'"
            >内地</span
          >
        </dd>
        <dd>
          <span :class="{ alging: area == '港台' }" @click="area = '港台'"
            >港台</span
          >
        </dd>
        <dd>
          <span :class="{ alging: area == '欧美' }" @click="area = '欧美'"
            >欧美</span
          >
        </dd>
        <dd>
          <span :class="{ alging: area == '日本' }" @click="area = '日本'"
            >日本</span
          >
        </dd>
        <dd>
          <span :class="{ alging: area == '韩国' }" @click="area = '韩国'"
            >韩国</span
          >
        </dd>
      </dl>
    </div>
    <!-- 类型 -->
    <div class="type">
      <dl>
        <dt>类型:</dt>
        <dd>
          <span :class="{ alging: type == '全部' }" @click="type = '全部'"
            >全部</span
          >
        </dd>
        <dd>
          <span :class="{ alging: type == '官方版' }" @click="type = '官方版'"
            >官方版</span
          >
        </dd>
        <dd>
          <span :class="{ alging: type == '原声' }" @click="type = '原声'"
            >原声</span
          >
        </dd>
        <dd>
          <span :class="{ alging: type == '现场版' }" @click="type = '现场版'"
            >现场版</span
          >
        </dd>
        <dd>
          <span
            :class="{ alging: type == '网易出品' }"
            @click="type = '网易出品'"
            >网易出品</span
          >
        </dd>
      </dl>
    </div>
    <!-- 排序 -->
    <div class="sorting">
      <dl>
        <dt>排序:</dt>
        <dd>
          <span
            :class="{ alging: order == '上升最快' }"
            @click="order = '上升最快'"
            >上升最快</span
          >
        </dd>
        <dd>
          <span :class="{ alging: order == '最热' }" @click="order = '最热'"
            >最热</span
          >
        </dd>
        <dd>
          <span :class="{ alging: order == '最新' }" @click="order = '最新'"
            >最新</span
          >
        </dd>
      </dl>
    </div>
    <!-- 歌曲MV列表 -->
    <div class="mvlist">
      <div class="mvs_main">
        <div class="mvs_item" v-for="(item, index) in mvlists" :key="index">
          <div class="mvs_pic" @click="playMv(item.id)">
            <img :src="item.cover" alt />
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
    <!-- 分页器 -->
    <div class="foot">
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
        :page-size="8"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  // 侦听器
  watch: {
    area() {
      // 显示第一页
      this.page = 1;
      // 地区变化侦听
      this.mvsData();
    },
    type() {
      // 显示第一页
      this.page = 1;
      // 类型变化侦听
      this.mvsData();
    },
    order() {
      // 显示第一页
      this.page = 1;
      // 排序变化侦听
      this.mvsData();
    },
  },
  data() {
    return {
      mvs: "",
      // mv列表
      mvlists: [],
      // 总条数
      total: "10",
      // 当前页码
      page: 1,
      // 地区
      area: "全部",
      // 类型
      type: "全部",
      // 排序
      order: "上升最快",
      // 取出数量
      limit: 8,
    };
  },
  created() {
    this.mvsData();
  },
  methods: {
    // mv 详情页面
    playMv(id) {
      this.$router.push("/mv?m=" + id);
    },
    mvsData() {
      axios({
        url: "https://autumnfish.cn/mv/all",
        method: "get",
        params: {
          // 地区
          area: this.area,
          // 类型
          type: this.type,
          // 排序
          order: this.order,
          // 取出数量
          limit: this.limit,
          // 偏移数量 (this.page - 1) * this.limit
          offset: (this.page - 1) * this.limit,
        },
      }).then((res) => {
        this.mvlists = res.data.data;
        // 超过1万显示万
        for (let i = 0; i < this.mvlists.length; i++) {
          if (this.mvlists[i].playCount > 100000) {
            this.mvlists[i].playCount =
              parseInt(this.mvlists[i].playCount / 10000) + "万";
          }
        }
        // 取总条数
        if (res.data.count) {
          this.total = res.data.count;
        }
      });
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.mvsData();
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
.mvss {
  width: 80%;
  height: 650px;
  margin: 30px auto;
  overflow-x: hidden;
  /* 超出内容提供滚动 */
  overflow-y: scroll;
}
/* 滚动条隐藏 */
.mvss::-webkit-scrollbar {
  display: none;
}
/* 标签 */
.region {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-bottom: 25px;
}
.type {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-bottom: 25px;
}
.sorting {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-bottom: 25px;
}
dl dt {
  float: left;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}
dl dd {
  float: left;
  color: #898a8b;
  font-size: 14px;
  padding: 0 30px;
  border-right: 1px solid #ebe9e9;
  text-align: center;
  /* 将鼠标变成小手 */
  cursor: pointer;
}
/* 选择dd 最后一个元素  dd后面不能有空格*/
dl dd:last-child {
  border-right: 0;
}
dl dd span {
  display: block;
  padding: 0 30px;
  border-radius: 15px;
}
.alging {
  background-color: #333;
  color: #f0eeee;
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
/* 分页器 */
.foot {
  text-align: center;
  width: 100%;
  height: 100px;
}
</style>