<template>
  <div>
    <!-- 头部区域 -->
    <top></top>
    <!-- 主体区域 -->
    <index></index>
  </div>
</template>

<script>
// 导入组件
import top from "./components/top.vue";
import index from "./components/index.vue";
export default {
  components:{
    top,
    index
  }
}
</script>

<style>

</style>