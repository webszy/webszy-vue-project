<template>
  <div id="app" class="w-full h-full">
    <router-view/>
  </div>
</template>
<script>
import { isIphonex } from "@/utils"

export default {
  name: 'App',
  created () {
    window._env = {
      buildTime: process.env.VUE_APP_BUILD_TIME,
      appENV: process.env.VUE_APP_ENV,
      buildType: process.env.NODE_ENV,
      version: process.env.VUE_APP_VERSION
    }
    if (isIphonex()) {
      document.body.style.setProperty('--safe-top', '.4rem')
      document.body.style.setProperty('--safe-bottom', '.34rem')
    } else {
      document.body.style.setProperty('--safe-top', '.1rem')
      document.body.style.setProperty('--safe-bottom', '.1rem')
    }
  }
}
</script>
<style>

</style>
