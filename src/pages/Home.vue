<script setup>
import { ref } from 'vue'

defineProps({
    msg: String
})

const isChecked = ref(localStorage.getItem('darkClass') === 'dark')

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

const toggleDarkMode = (event) => {
    const root = document.getElementsByTagName('html')[0];
    const theme = event.target.checked ? 'dark' : 'light'

    localStorage.setItem('darkClass', theme)
    root.setAttribute('class', theme)
}
</script>

<template>
    <div class="relative overflow-x-auto shadow-md">
        <div class="flex">
            <div class="p-4 pl-0 justify-start">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div
                        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                    >
                        <svg
                            class="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for items"
                    />
                </div>
            </div>

            <div class="flex items-center">
                <label for="toggleB" class="flex items-center cursor-pointer">
                    <!-- toggle -->
                    <div class="relative">
                        <!-- input -->
                        <input type="checkbox" id="toggleB" class="sr-only" v-model="isChecked" @change="toggleDarkMode" />
                        <!-- line -->
                        <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <!-- dot -->
                        <div
                            class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
                        ></div>
                    </div>
                    <!-- label -->
                    <div class="ml-3 text-gray-700 font-medium">Dark mode</div>
                </label>
            </div>
        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">Product name</th>
                    <th scope="col" class="px-6 py-3">Color</th>
                    <th scope="col" class="px-6 py-3">Category</th>
                    <th scope="col" class="px-6 py-3">Price</th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in items"
                    class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >{{ item.name }}</th>
                    <td class="px-6 py-4">{{ item.color }}</td>
                    <td class="px-6 py-4">{{ item.category }}</td>
                    <td class="px-6 py-4">{{ item.price }}</td>
                    <td class="px-6 py-4 text-right">
                        <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a>
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

/* Toggle Dark mode*/
input:checked ~ .dot {
    transform: translateX(100%);
    background-color: #48bb78;
}
</style>
