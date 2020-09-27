<template>
  <div class="index">
    <div class="nav">
      <ul>
        <li>
          <router-link to="discovery">发现音乐</router-link>
        </li>
        <li>
          <router-link to="playlists">推荐歌单</router-link>
        </li>
        <li>
          <router-link to="songs">最新音乐</router-link>
        </li>
        <li>
          <router-link to="mvs">最新MV</router-link>
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <audio :src="musicUrl" loop="loop" autoplay="autoplay" controls="controls"></audio>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicUrl: "",
    };
  },
};
</script>

<style>
.index {
  width: 100%;
  height: 100%;
}
.nav {
  float: left;
  width: 15%;
  height: 650px;
  background-color: #f3f3f5;
  border-right: 1px solid #d2d4d2a1;
  border-top: 1px solid #d2d4d2a1;
}
.nav ul li {
  list-style: none;
  padding: 20px 50px;
  cursor: pointer;
}
.nav ul li:hover {
  background-color: #333;
}
a {
  text-decoration: none;
  color: #333;
}
.nav ul li:hover a {
  color: #ffffff;
}
.main {
  border-top: 1px solid #d2d4d2a1;
  float: right;
  width: 85%;
  height: 650px;
  background-color: #ffffff;
}
.footer {
  background-color: #f1f3f4;
}
.footer audio {
  width: 100%;
}
</style>