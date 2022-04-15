<script setup>
import { ref, inject, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'
import { useRoute } from 'vue-router'
import moment from 'moment'

import router from '../router'
import DropdownHomePage from '../components/dropdowns/DropdownHomePage.vue'
import IsLoggedIn from '../components/auths/IsLoggedIn.vue'
import ModalImportContactsCSV from '../components/modals/ModalImportContactsCSV.vue'

const DEFAULT_LIMIT = 30
const STATUS = {
    KHACH_HANG_MOI: 'KhachHangMoi',
    CHUA_LIEN_LAC_DUOC: 'ChuaLienLacDuoc'
}

const route = useRoute()
const q = ref('')
const page = ref(1)
const limit = ref(DEFAULT_LIMIT)
const totalEntries = ref(0)
const isNameAsc = ref(true)
const contactResults = ref([])
const contactSources = ref([])
const filterResultId = ref(0)
const filterStatus = ref(0)
const filterSourceId = ref(0)

const $api = inject('$api')
const items = ref([])
const columnsName = ref([
    'Contacts', 'Address-Note', 'Source', 'Status-Result', 'Updated At'
])

const fetchData = (query = '') => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }
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
    if (notAllowNext.value) {
        return
    }

    page.value += 1
    updateRouteQuery(updatedQuery.value)
}

const previous = () => {
    if (notAllowPrevious.value) {
        return
    }

    page.value -= 1
    updateRouteQuery(updatedQuery.value)
}

const exportCSV = () => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }

    $api.get(`https://demo.nodeapis.com/contacts/csv${toQueryString(route.query)}`, configs).then(response => {
        const downloadLink = document.createElement("a");
        const blob = new Blob(["\ufeff", response.data]);
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `Contacts - ${new Date().toLocaleDateString('vi-VN')}.csv`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    })
}

const getContactResults = () => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }
    $api.get(`https://demo.nodeapis.com/contact-results/names`, configs).then(response => {
        if (response && response.data) {
            contactResults.value = response?.data?.data
        }
    })
}

const getContactSources = () => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }
    $api.get(`https://demo.nodeapis.com/contact-sources/names`, configs).then(response => {
        if (response && response.data) {
            contactSources.value = response?.data?.data
        }
    })
}

onMounted(() => {
    const { q: routeQ, source_id, result_id, status, sort, page: routePage = 1 } = route.query
    q.value = routeQ ?? ''
    if (source_id) {
        filterSourceId.value = source_id
    }
    if (status) {
        filterStatus.value = status
    }
    if (result_id) {
        filterResultId.value = result_id
    }
    isNameAsc.value = sort?.includes('asc')
    page.value = +routePage
    getContactResults()
    getContactSources()
})

const sortByName = () => {
    isNameAsc.value = !isNameAsc.value
}
const removeAllFilters = () => {
    q.value = ''
    filterResultId.value = 0
    filterStatus.value = 0
    filterSourceId.value = 0
}
const removeQ = () => {
  q.value = ''
}
const removeSourceId = () => {
    filterSourceId.value = 0
}
const removeStatus = () => {
    filterStatus.value = 0
}
const removeResultId = () => {
    filterResultId.value = 0
}
const updateRouteQuery = (data) => {
    const query = { ...data }
    if (query.page < 2) {
        delete query.page
    }
    router.push({ path: '', query })
}
const toQueryString = (query) => {
    const { q = '', source_id = '', result_id = '', status = '', sort = '' } = query
    return `?q=${q}&source_id=${source_id}&result_id=${result_id}&status=${status}&sort=${sort}&offset=${offset.value ?? ''}&limit=${limit.value ?? ''}`
}
const reloadContacts = () => {
    fetchData(updatedQueryToString.value)
}

const notAllowNext = computed(() => (page.value + 1) > Math.ceil(totalEntries.value / limit.value))
const notAllowPrevious = computed(() => page.value - 1 < 0 || page.value === 1)
const fromEntry = computed(() => totalEntries.value === '0' ? 0 : (offset.value + 1))
const toEntry = computed(() => notAllowNext.value ? totalEntries.value : limit.value * page.value)
const sortByNameQuery = computed(() => isNameAsc.value ? 'name.asc' : 'name.desc')
const offset = computed(() => limit.value * (page.value - 1))
const updatedQuery = computed(() => {
    let query = {}
    if (q.value) {
        query.q = q.value
    }

    if (filterSourceId.value) {
        query.source_id = filterSourceId.value
    }
    if (filterStatus.value) {
        query.status = filterStatus.value
    }
    if (filterResultId.value) {
        query.result_id = filterResultId.value
    }

    query.sort = sortByNameQuery.value

    query.page = page.value > 0 ? page.value : 1

    return query
})
const updatedQueryToString = computed(() => toQueryString(updatedQuery.value))

watch(isNameAsc, () => updateRouteQuery(updatedQuery.value))
watch(q, debounce(() => {
    page.value = 1
    updateRouteQuery(updatedQuery.value)
}, 300))
watch(filterResultId, () => {
    page.value = 1
    updateRouteQuery(updatedQuery.value)
})
watch(filterStatus, () => {
    page.value = 1
    updateRouteQuery(updatedQuery.value)
}
)
watch(filterSourceId, () => {
    page.value = 1
    updateRouteQuery(updatedQuery.value)
})

watch(updatedQuery, () => {
    fetchData(updatedQueryToString.value)
})

</script>

<template>
    <IsLoggedIn />
    <div class="relative overflow-x-auto shadow-md">
        <div class="flex items-center">
            <div class="p-4 pl-0 justify-start">
                <label for="home-table-search" class="sr-only">Search</label>
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
                        id="home-table-search"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-tr rounded-br"
                        placeholder="Search for contacts"
                        v-model="q"
                    />
                     <svg
                    @click="removeQ"
                    :class="{ 'hidden': !q }"
                    class="w-5 h-5 absolute right-3 top-2.5 cursor-pointer text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                </div>
            </div>
            <div class="relative min-w-min">
                <select
                    class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    v-model="filterSourceId"
                >
                    <option value="0" disabled selected>Select Source</option>
                    <option
                        v-for="item in contactSources"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}</option>
                </select>
                <svg
                    @click="removeSourceId"
                    :class="{ 'hidden': !filterSourceId }"
                    class="w-5 h-5 absolute right-1 top-2 cursor-pointer bg-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <div class="px-4 relative min-w-min">
                <select
                    class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    v-model="filterStatus"
                >
                    <option value="0" disabled selected>Select Status</option>
                    <option :value="STATUS.KHACH_HANG_MOI">{{ STATUS.KHACH_HANG_MOI }}</option>
                    <option :value="STATUS.CHUA_LIEN_LAC_DUOC">{{ STATUS.CHUA_LIEN_LAC_DUOC }}</option>
                </select>
                <svg
                    @click="removeStatus"
                    :class="{ 'hidden': !filterStatus }"
                    class="w-5 h-5 absolute right-5 top-2 cursor-pointer bg-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <div class="relative min-w-min">
                <select
                    class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    v-model="filterResultId"
                >
                    <option value="0" disabled selected>Select Result</option>
                    <option
                        v-for="item in contactResults"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}</option>
                </select>
                <svg
                    @click="removeResultId"
                    :class="{ 'hidden': !filterResultId }"
                    class="w-5 h-5 absolute right-1 top-2 cursor-pointer bg-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <div class="pl-4">
                <button
                    type="button"
                    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    @click="removeAllFilters"
                >Clear All</button>
            </div>

            <div class="ml-auto flex items-center">
                <ModalImportContactsCSV @reload="reloadContacts"/>
                <div class="flex space-x-2 justify-center px-4">
                    <button
                        type="button"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        @click="exportCSV"
                    >Export</button>
                </div>
                <DropdownHomePage />
            </div>
        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">
                        <div>
                            <span class="flex items-center cursor-pointer" @click="sortByName">
                                Name
                                <svg
                                    v-show="isNameAsc"
                                    class="pl-1 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                                <svg
                                    v-show="!isNameAsc"
                                    class="pl-1 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                                    />
                                </svg>
                            </span>
                        </div>
                    </th>
                    <th v-for="column in columnsName" scope="col" class="px-6 py-3">{{ column }}</th>
                    <!-- <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th> -->
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
                    >
                     <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            <router-link :to="{ name: 'contacts', params: { id: item?.id } }">{{item?.name}}</router-link>
                        </a> 
                    </th>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item?.mobile }}</span>
                        {{ item?.email }}
                    </td>
                    <td class="px-6 py-4 hidden">{{ item?.email }}</td>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span>{{ item?.address }}</span>
                            <span>Note: {{ item?.notes }}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">{{ item?.contact_source?.name }}</td>
                    <td class="px-6 py-4 flex flex-col">
                        <span>{{ item?.status }}</span>
                        <span>{{ item?.contact_result?.name }}</span>
                    </td>
                    <td class="px-6 py-4">
                    <div class="flex flex-col">
                        {{ moment(item?.updated_at).format('DD/MM/YYYY hh:mm:ss') }}
                        <span>By {{item?.updated_user?.name}}</span>
                    </div>
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
                    :class="{ 'cursor-not-allowed': notAllowPrevious }"
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
                    :class="{ 'cursor-not-allowed': notAllowNext }"
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
