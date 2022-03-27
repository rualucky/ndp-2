<script setup>
import { ref } from 'vue'
import TableStickyHeader from '../components/tables/TableStickyHeader.vue';

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <TableStickyHeader/> 
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
