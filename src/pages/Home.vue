<script setup>
import { ref, inject, onMounted, watch, computed } from 'vue'
import { debounce } from 'lodash'

import router from '../router'
import DropdownHomePage from '../components/dropdowns/DropdownHomePage.vue'
import IsLoggedIn from '../components/auths/IsLoggedIn.vue'
import ModalImportContactsCSV from '../components/modals/ModalImportContactsCSV.vue'

const DEFAULT_LIMIT = 30
const DEFAULT_OFFSET = 0

const q = ref('')
const page = ref(0)
const offset = ref(DEFAULT_OFFSET)
const limit = ref(DEFAULT_LIMIT)
const totalEntries = ref(0)

const $api = inject('$api')
const items = ref([])
const columnsName = ref([
    'Name', 'Contact', 'Address', 'Notes', 'Source', 'Status'
])

const checkQueryPrefix = (query) => {
    if (query.includes('?')) {
        return
    }

    return `?${query}`
}

const fetchData = (q = '', offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT) => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        contentType: 'application/json'
    }
    let query = ''
    if (q) {
        query += `q=${q}`
    }
    query += `&offset=${offset}&limit=${limit}`
    query = checkQueryPrefix(query)
    //console.log(query)
    const url = `https://demo.nodeapis.com/contacts${query}`
    $api.get(url, configs).then(response => {
        items.value = response?.data?.data
        totalEntries.value = response?.headers?.['x-total-count'] ?? 0
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

const next = () => {
    page.value += 1
    offset.value = page.value * limit.value
    if (page.value * limit.value > totalEntries.value) {
        page.value -= 1
        offset.value = page.value * limit.value
        return
    }
    fetchData(q.value, offset.value, limit.value)
}

const previous = () => {
    page.value -= 1
    offset.value = page.value * limit.value
    if (page.value < 0) {
        page.value = 0
        offset.value = page.value * limit.value
      return
    }
    fetchData(q.value, offset.value, limit.value)
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

const fromEntry = computed(() => page.value * limit.value + 1)

const toEntry = computed(() => (page.value + 1) * limit.value > totalEntries.value ? totalEntries.value : (page.value + 1) * limit.value)

watch(q, debounce(() => fetchData(q.value, offset.value, limit.value), 300))
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
                <ModalImportContactsCSV />
                <div class="flex space-x-2 justify-center pl-4">
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
                    v-for="(item) in items"
                    :key="item?.id"
                    class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >{{ item?.name }}</th>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item?.mobile }}</span>
                        {{ item?.email }}
                    </td>
                    <td class="px-6 py-4 hidden">{{ item?.email }}</td>
                    <td class="px-6 py-4">{{ item?.address }}</td>
                    <td class="px-6 py-4">{{ item?.notes }}</td>
                    <td class="px-6 py-4">{{ item?.contact_source?.name }}</td>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item?.status }}</span>
                        <span>{{ item?.contact_result?.name }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            <router-link :to="{ name: 'contacts', params: { id: item?.id } }">Detail</router-link>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-start items-center p-4">
            <!-- Help text -->
            <span class="text-sm text-gray-700 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-900">{{ fromEntry }}</span> to
                <span class="font-semibold text-gray-900">{{ toEntry }}</span> of
                <span class="font-semibold text-gray-900">{{ totalEntries }}</span> Contacts
            </span>
            <!-- Buttons -->
            <div class="ml-auto flex items-center">
                <!-- Buttons -->
                <button
                    @click="previous"
                    class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <svg
                        class="mr-2 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    Prev
                </button>
                <button
                    @click="next"
                    class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    Next
                    <svg
                        class="ml-2 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
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
