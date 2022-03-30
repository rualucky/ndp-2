<script setup>
import {watch, ref} from 'vue'
import {VueCsvToggleHeaders, VueCsvSubmit, VueCsvMap, VueCsvInput, VueCsvErrors, VueCsvImport} from 'vue-csv-import';

const csv = ref(null)

</script>

<template>
<vue-csv-import
      v-model="csv"
      :autoMatchFields="true"
      :autoMatchIgnoreCase="true"
      :map-fields="['name', 'Age', 'grade']"
    >
    </vue-csv-import>
      <p>Results</p>
      {{ csv }}
</template>
