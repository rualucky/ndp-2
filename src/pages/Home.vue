<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const items = ref([
  { name: 'Apple MacBook Pro 17', color: 'Sliver', category: 'Laptop', price: '$2999' },
  { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
  { name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99' },
  { name: 'Google Pixel Phone', color: 'Gray', category: 'Phone', price: '$799' },
  { name: 'Apple Watch 5', color: 'Red', category: 'Wearables', price: '$999' },
  { name: 'Apple MacBook Pro 17', color: 'Sliver', category: 'Laptop', price: '$2999' },
  { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
  { name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99' },
  { name: 'Google Pixel Phone', color: 'Gray', category: 'Phone', price: '$799' },
  { name: 'Apple Watch 5', color: 'Red', category: 'Wearables', price: '$999' },
  { name: 'Apple MacBook Pro 17', color: 'Sliver', category: 'Laptop', price: '$2999' },
  { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
  { name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99' },
  { name: 'Google Pixel Phone', color: 'Gray', category: 'Phone', price: '$799' },
  { name: 'Apple Watch 5', color: 'Red', category: 'Wearables', price: '$999' },
  { name: 'Apple MacBook Pro 17', color: 'Sliver', category: 'Laptop', price: '$2999' },
  { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
  { name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99' },
  { name: 'Google Pixel Phone', color: 'Gray', category: 'Phone', price: '$799' },
  { name: 'Apple Watch 5', color: 'Red', category: 'Wearables', price: '$999' },
  { name: 'Apple MacBook Pro 17', color: 'Sliver', category: 'Laptop', price: '$2999' },
  { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
  { name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99' },
  { name: 'Google Pixel Phone', color: 'Gray', category: 'Phone', price: '$799' },
  { name: 'Apple Watch 5', color: 'Red', category: 'Wearables', price: '$999' },
])

const test = (event) => {
  const root = document.getElementsByTagName( 'html' )[0]; 
  const theme = localStorage.getItem('darkClass') === 'dark' ? 'light' : 'dark'

  localStorage.setItem('darkClass', theme)

  root.setAttribute('class', theme)
}
</script>

<template>
<button @click="test">Switch dark mode</button>

 <div class="relative overflow-x-auto shadow-md">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="fixed text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {{ item.name }}
                </th>
                <td class="px-6 py-4">
                  {{ item.color }}
                </td>
                <td class="px-6 py-4">
                    {{ item.category }}
                </td>
                <td class="px-6 py-4">
                    {{ item.price }}
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div> 
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
