<script setup>
import { ref, watch, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const redirectRoute = "/Halloween";
const router = useRouter()

onMounted(() => {
  router.push(redirectRoute);
})


</script>

<template>
  <div class="content">
   <h2>Redirecting...</h2>
  </div>
</template>


