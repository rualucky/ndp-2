<script setup>
import { ref, inject, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const $api = inject('$api')

const router = useRouter()
const file = ref(null)
const contactSource = ref('')
const isValid = ref(true)
const isImportSuccess = ref(false)
const isProcessing = ref(false)
const cancelButton = ref(null)
const emits = defineEmits(['reload'])

const clickImportCSV = ($event) => {
    file.value = $event.target.files[0]
}

const importCSV = (source, file) => {
    if (!source || !file) {
        return
    }

    isProcessing.value = true

    const formData = new FormData();
    formData.append("source", contactSource.value)
    formData.append("file", file)

    let configs = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data',
        },
    }
    $api.post('https://demo.nodeapis.com/contacts/csv', formData, configs).then(response => {
        isProcessing.value = false
        isImportSuccess.value = true
        cancelButton.value?.click();
        emits('reload')
        //    configs.headers['Content-Type'] = 'application/json'
        //$api.post('https://demo.nodeapis.com/auth/token/revoke', { refresh_token: localStorage.getItem('refresh_token') }, configs).then(response => {
        //localStorage.removeItem('access_token')
        //localStorage.removeItem('refresh_token')
        //localStorage.removeItem('token_type')
        //localStorage.removeItem('expires_in')
        //router.push('/sign-in')
        //})
    }).catch(_ => {
        isValid.value = false
        isProcessing.value = false
        setTimeout(() => { isValid.value = true }, 2000)
    })
}

</script>

<template>
    <!-- Button trigger modal -->
    <button type="button"
        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        data-bs-toggle="modal" data-bs-target="#modelImportContactsCSV">Import</button>

    <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="modelImportContactsCSV" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog model-sm modal-dialog-scrollable relative w-auto pointer-events-none">
            <div
                class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div
                    class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                    <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Import CSV</h5>
                    <button type="button" ref="cancelButton"
                        class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body relative p-4">
                    <div>
                        <label for="inputName" class="form-label inline-block mb-2 text-gray-700 text-left">Contacts
                            Source</label>
                        <input type="text"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="inputName" aria-describedby="nameHelp" v-model="contactSource" />
                    </div>
                    <div class="pt-4">
                        <div class="w-100">
                            <label for="formFile" class="form-label inline-block mb-2 text-gray-700">Choose CSV
                                File</label>
                            <input
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                type="file" id="formFile" @change="clickImportCSV" />
                        </div>
                    </div>
                    <div class="pt-4 flex items-center">
                        <button :disabled="isProcessing" type="button"
                            class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            @click="importCSV(contactSource, file)">
                            <svg v-show="isProcessing" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor" />
                            </svg>
                            {{ isProcessing ? 'Processing...' : 'Import' }}
                        </button>
                        <svg class="w-6 h-6 dark:text-green-500 ml-2"
                            :class="{ 'show': isImportSuccess, 'hidden': !isImportSuccess }" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="ml-2 flex" :class="{ 'show': !isValid, 'hidden': isValid }">
                            <svg class="w-6 h-6 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="ml-1 dark:text-red-500">Validation Failed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>