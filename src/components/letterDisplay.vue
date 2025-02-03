<script setup>
import { ref } from 'vue'

defineProps(['letter'])

</script>

<template>
  <div class="letterDisplay">
    <div v-if="letter.solved">{{ letter.name }}</div>
    <div v-else class="notSolved"></div>
  </div>
</template>

<style scoped>
.letterDisplay {
    margin: 10px;
    width: .5em;
    min-height: 2em;
    display:flex;
    flex-direction: column;
    align-content: end;
    justify-content: flex-end;
    font-size: 2em;
    text-align: center;
    color: var(--light-bg-color);

}

.notSolved {
    border-bottom: 3px var(--light-bg-color) solid;
    width: 100%;
    height: 100%;
}
</style>