<script setup>
import { ref, reactive } from 'vue'

const root = document.getElementsByTagName('html')[0];
const toggle = ref(localStorage.getItem('darkClass') === 'dark')
const checkBoxRef = ref(null)
const state = reactive({
  toggle 
})

const setDarkClass = (theme) => {
    localStorage.setItem('darkClass', theme)
    root.setAttribute('class', theme)
}

const click = () => {
  state.toggle = !state.toggle
   setDarkClass(toggle.value ? 'dark' : 'light')
}
const clickLabel = () => {
    checkBoxRef.value?.click()
}
</script>
<template>
    <div class="form-check" @click.stop="click">
        <input
            ref="checkBoxRef"
            class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value
            id="flexCheckDefault"
            v-model="toggle"
        />
        <label
            @click="clickLabel"
            class="form-check-label inline-block text-gray-800 cursor-pointer"
            for="flexCheckDefault"
        >Dark mode</label>
    </div>
</template>