<template>
  <div class="top">
    <div class="logo">
      <img src="../assets/logo.png" alt />
    </div>
    <span class="logo-name">猿猿播放器</span>
    <input
      type="text"
      placeholder="输入歌曲, 歌星, 歌单"
      class="search"
      v-model="inputValue"
      @keyup.enter="searchData"
    />
    <div class="hear">
      <div class="hear-logo">
        <img src="../assets/hear.png" alt="" />
      </div>
      <span>Jack</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索内容
      inputValue: "",
      hearUrl: "../assets/hear.png",
    };
  },
  methods: {
    searchData() {
      if (this.inputValue == "") {
        // 如果为空提示
        this.$message.warning("请输入内容");
      } else {
        // 不为空则 携带数据到跳转页面
        this.$router.push("/result?p=" + this.inputValue);
      }
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
.top {
  position: relative;
  width: 100%;
  height: 80px;
  line-height: 60px;
  background-color: #f5f5fa;
}
.logo {
  position: absolute;
  top: 15px;
  left: 50px;
  width: 50px;
  height: 50px;
}
.logo img {
  width: 100%;
  height: 100%;
}
.logo-name {
  position: absolute;
  left: 110px;
  top: 15px;
  color: #c24f03;
  font-size: 18px;
}
.search {
  position: absolute;
  top: 25px;
  right: 160px;
  width: 200px;
  height: 30px;
  padding-left: 5px;
  outline: none;
}
.hear {
  position: absolute;
  right: 50px;
  top: 10px;
}
.hear-logo {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #999;
  margin-top: 10px;
}
.hear img {
  width: 100%;
  height: 100%;
}
.hear span {
  vertical-align: middle;
  margin: 0 8px;
}
</style>