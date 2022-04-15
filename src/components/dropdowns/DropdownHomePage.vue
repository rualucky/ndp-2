<script setup>
import CheckboxDarkModeVue from '../checkboxs/CheckboxDarkMode.vue';
import ButtonLogOut from '../auths/ButtonLogOut.vue'
</script>
<template>
  <div class="flex justify-center">
    <div>
      <div class="dropdown relative">
        <button
          class="dropdown-toggle px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap rounded-tl rounded-bl"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Options
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="caret-down"
            class="w-2 ml-2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
            />
          </svg>
        </button>
        <ul
          class="dropdown-menu min-w-max absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none"
          aria-labelledby="dropdownMenuButton1"
        >
          <li class="dropdown-item py-2 px-4">
            <CheckboxDarkModeVue />
          </li>
          <li class="dropdown-item py-2 px-4 flex">
            <svg class="w-6 h-6 pr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <router-link to="/employees">Employees</router-link>
            </li>
          <hr class="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
          <li class="dropdown-item py-2 px-4 divide-y">
            <ButtonLogOut />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>