<script setup>
import { ref, inject, onMounted, watch, computed } from 'vue'
import { debounce } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'

import IsLoggedIn from '../components/auths/IsLoggedIn.vue'
import ModalCRUD from '../components/modals/ModalCRUD.vue'
import ModalConfirmDelete from '../components/modals/ModalConfirmDelete.vue'

const DEFAULT_LIMIT = 30
const ROLE = {
    ADMIN: 'Admin',
    TELESALES: 'Telesales'
}
const STATUS = {
    INACTIVE: 'Inactive',
    ACTIVE: 'Active'
}

const router = useRouter()
const route = useRoute()
const q = ref('')
const page = ref(1)
const limit = ref(DEFAULT_LIMIT)
const totalEntries = ref(0)
const isNameAsc = ref(true)
const $api = inject('$api')
const items = ref([])
const columnsName = ref([
    'Contacts', 'Role', 'Status', 'Updated At'
])
const modalCRUD = ref(null)
const modalConfirmDelete = ref(null)

const fetchData = (query = '') => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }
    const url = `https://demo.nodeapis.com/users${query}`
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

onMounted(() => {
    const { q: routeQ, role, status, sort, page: routePage = 1 } = route.query
    q.value = routeQ ?? ''
    isNameAsc.value = sort?.includes('asc')
    page.value = +routePage
})

const sortByName = () => {
    isNameAsc.value = !isNameAsc.value
}

const removeQ = () => {
    q.value = ''
}
const updateRouteQuery = (data) => {
    const query = { ...data }
    if (query.page < 2) {
        delete query.page
    }
    router.push({ path: '', query })
}
const toQueryString = (query) => {
    const { q = '', role = '', status = '', sort = '' } = query
    return `?q=${q}&role=${role}&status=${status}&sort=${sort}&offset=${offset.value ?? ''}&limit=${limit.value ?? ''}`
}
const convertDate = (date) => moment(date).format('DD/MM/YYYY hh:mm:ss')

const notAllowNext = computed(() => (page.value + 1) > Math.ceil(totalEntries.value / limit.value))
const notAllowPrevious = computed(() => page.value - 1 < 0 || page.value === 1)
const fromEntry = computed(() => Number(totalEntries.value) > 0 ? (offset.value + 1) : 0)
const toEntry = computed(() => notAllowNext.value ? totalEntries.value : limit.value * page.value)
const sortByNameQuery = computed(() => isNameAsc.value ? 'name.asc' : 'name.desc')
const offset = computed(() => limit.value * (page.value - 1))
const updatedQuery = computed(() => {
    const query = {}
    if (q.value) {
        query.q = q.value
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

watch(updatedQuery, () => {
    fetchData(updatedQueryToString.value)
})

const modalTitle = ref('')
const modalAction = ref('')
const createEmployee = () => {
    modalTitle.value = 'Create User'
    modalAction.value = 'Create'
    openCRUDModal({
        role: ROLE.TELESALES,
        status: STATUS.ACTIVE
    })
}
const updateEmployee = (employee) => {
    modalTitle.value = 'Update User'
    modalAction.value = 'Update'
    openCRUDModal(employee)
}
const openCRUDModal = (employee = {}) => {
    modalCRUD.value?.open(employee)
}
const reloadEmployees = () => {
    fetchData(updatedQueryToString.value)
}
const openConfirmDelete = () => {
    modalConfirmDelete.value?.open()
}
const backToHome = () => {
    router.push('/')
}
</script>

<template>
    <IsLoggedIn />
    <ModalConfirmDelete></ModalConfirmDelete>
    <ModalCRUD ref="modalCRUD" :isHiddenTrigger="true" :index="'employee-0'" :title="modalTitle" :action="modalAction"
        @reload="reloadEmployees"></ModalCRUD>
    <div class="relative overflow-x-auto shadow-md">
        <div class="flex items-center">
            <div class="p-4 pl-0 justify-start">
                <label for="employee-table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input type="text" id="employee-table-search"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-tr rounded-br"
                        placeholder="Search for users" v-model="q" autocomplete="chrome-off" />
                    <svg @click="removeQ" :class="{ 'hidden': !q }"
                        class="w-5 h-5 absolute right-3 top-2.5 cursor-pointer text-white" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <button type="button" @click="createEmployee"
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                Create User
            </button>
            <div class="ml-auto flex items-center">
                <div class="flex space-x-2 justify-center px-4">
                    <button type="button"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        @click="backToHome">Home</button>
                </div>
            </div>

        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        <div>
                            <span class="flex items-center cursor-pointer" @click="sortByName">
                                Name
                                <svg v-show="isNameAsc" class="pl-1 w-4 h-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                <svg v-show="!isNameAsc" class="pl-1 w-4 h-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </span>
                        </div>
                    </th>
                    <th v-for="column in columnsName" scope="col" class="px-6 py-3">{{ column }}</th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in items" :key="item?.id"
                    class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{{
                        item?.name
                    }}</th>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span>{{ item?.mobile }}</span>
                            {{ item?.email }}
                        </div>
                    </td>
                    <td class="px-6 py-4">{{ item?.role }}</td>
                    <td class="px-6 py-4">{{ item?.status }}</td>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            {{ convertDate(item?.updated_at) }}
                            <span>By {{ item?.updated_user?.name }}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <svg @click="updateEmployee(item)" class="w-5 h-5 mr-2 text-blue-500 cursor-pointer"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                </path>
                            </svg>
                            <svg @click="openConfirmDelete" class="w-5 h-5 text-red-500 cursor-pointer" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
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
                <span class="font-semibold text-gray-900">{{ totalEntries }}</span> Users
            </span>
            <!-- Buttons -->
            <div class="ml-auto flex items-center">
                <!-- Buttons -->
                <button @click="previous" :class="{ 'cursor-not-allowed': notAllowPrevious }"
                    class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                            clip-rule="evenodd" />
                    </svg>
                    Prev
                </button>
                <button @click="next" :class="{ 'cursor-not-allowed': notAllowNext }"
                    class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Next
                    <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
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
input:checked~.dot {
    transform: translateX(100%);
    background-color: #48bb78;
}
</style>
