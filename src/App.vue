<template>
  <div id="app">
    <ImageGalleryInput />
  </div>
</template>

<script>
import ImageGalleryInput from './components/ImageGalleryInput.vue'

export default {
  name: 'App',
  components: {
    ImageGalleryInput
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
