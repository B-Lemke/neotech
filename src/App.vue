<template>
  
  <div>
    <router-view />
  </div>
</template>

<script>

export default {
  components: {

  },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Gay Web Dev",
    // all titles will be injected into this template
    titleTemplate: "%s | Gay Web Dev",
  },
};
</script>

<style>
@import "@/assets/main.css";
</style>