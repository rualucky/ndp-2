<script setup>
import { ref, inject, onBeforeMount, onMounted, watch } from 'vue'
import DropdownHomePage from '../components/dropdowns/DropdownHomePage.vue'
import IsLoggedIn from '../components/auths/IsLoggedIn.vue'
import router from '../router'
import { debounce } from 'lodash'

const q = ref('')

const $api = inject('$api')
const items = ref([])
const columnsName = ref([
    'Name', 'Contact', 'Address', 'Notes', 'Source', 'Status'
])

const fetchData = (q = '') => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        contentType: 'application/json'
    }
    let query = q ? '?' : ''
    if (q) {
        query += `q=${q}`
    }
    const url = `https://demo.nodeapis.com/contacts${query}`
    $api.get(url, configs).then(response => {
        items.value = response?.data?.data
    }).catch(error => {
        $api.post('https://demo.nodeapis.com/auth/token/refresh_token', { refresh_token: localStorage.getItem('refresh_token') }, configs).then(response => {
            if (response?.data) {
                $api.get(url, configs).then(response => {
                    items.value = response?.data?.data
                })
            }
        }).catch(error => router.push('/sign-in'))
    })
}

const exportCSV = () => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        contentType: 'application/json'
    }

    $api.get('https://demo.nodeapis.com/contacts/csv', configs).then(response => {
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", response.data]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `Contacts - ${new Date().toLocaleDateString('vi-VN')}.csv`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    })
}

// onBeforeMount(() => console.log('Home: before mount'))

onMounted(() => {
    fetchData()
})

watch(q, debounce(() => fetchData(q.value), 300))
</script>

<template>
    <IsLoggedIn />
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
                        v-model="q"
                    />
                </div>
            </div>
            <div class="flex items-center">
                
                <div class="flex space-x-2 justify-center">
                    <button
                        type="button"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        @click="exportCSV"
                    >Export</button>
                </div>
            </div>

            <div class="ml-auto flex items-center">
                <DropdownHomePage />
            </div>
        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th v-for="column in columnsName" scope="col" class="px-6 py-3">{{ column }}</th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, index) in items"
                    :key="item.id"
                    class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >{{ item.name }}</th>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item.mobile }}</span>
                        {{ item.email }}
                    </td>
                    <td class="px-6 py-4 hidden">{{ item.email }}</td>
                    <td class="px-6 py-4">{{ item.address }}</td>
                    <td class="px-6 py-4">{{ item.notes }}</td>
                    <td class="px-6 py-4">{{ item.contact_source.name }}</td>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item.status }}</span>
                        <span>{{ item.contact_result.name }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            <router-link :to="{ name: 'contacts', params: { id: item.id } }">Detail</router-link>
                        </a>
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
