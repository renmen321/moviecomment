<template>
  <h1>评心而论</h1>
<div class="background"><span style="user-select: none; font-size: 11vw ; margin-top: 20vh ">你的观点，是电影的另一种结局</span>
</div>
  <h2>网站简介</h2>
  <p>本网站采用wiki_word2vec_50模型，通过50维词向量精准分析电影评论情感，基于海量维基数据训练实现高效文本分类，可快速区分好评与差评，助您快速了解评论情感倾向。</p>


</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted} from 'vue'
onMounted(() => {
  const background=document.querySelector<Element>('.background');
  if (!background) {
    console.error('Background element not found');
    return;
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY !== 0) {
      background.style.backgroundPosition = `calc(50% + ${scrollY}px) calc(50% + ${scrollY}px)`;
    } else {
      background.style.backgroundPosition = '55% 55%'; // 设置默认值
    }
  };

  window.addEventListener('scroll', handleScroll);

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});


</script>


<style scoped>
.background{
  margin: 0;
  background-image: url("../assets/images/background3.jpg");
  background-size: cover;
  background-position: 55% 55%;
  height: 200vh;
  font: 900 39rem '';
  -webkit-background-clip: text;
  padding-top: 20vh;
  -webkit-text-fill-color: transparent;
  display: flex;
  justify-content: center;
  position: relative;
  text-align: center;
  overflow: hidden;
}

.background::before{
  content: '';
  background-size: cover;
  background-image: inherit;
  background-position: 50% 50%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -99;
}

h1{
  top: 5vh;
  position: absolute;
  text-align: center;
  font-size: 100px;
  width: 100%;
  letter-spacing: 10px;
  color: #5b8797;
}
h2
{  top: 110vh;
  position: absolute;
  text-align: center;
  font-size: 50px;
  width: 100%;
  letter-spacing: 10px;
  color: #cdb6b6;
}
p{
  position: absolute;
  text-align: center;
  top: 125vh;
  width: 80%;
  letter-spacing: 2px;
  background-color: rgba(0, 0, 0, .3);
  transform: translateX(-50%);
  padding: 30px;
  left: 50%;
  color: white;
  font-size: 50px;
}
</style>