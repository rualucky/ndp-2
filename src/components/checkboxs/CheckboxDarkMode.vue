<script setup>
import { ref, reactive } from 'vue'

const root = document.getElementsByTagName('html')[0];
const toggle = ref(localStorage.getItem('darkClass') === 'dark')
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
</script>
<template>
    <div class="form-check" @click.stop="click">
        <input
            class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value
            id="flexCheckDefault"
            v-model="toggle"
        />
        <label
            class="form-check-label inline-block text-gray-800"
            for="flexCheckDefault"
        >Dark mode</label>
    </div>
</template>