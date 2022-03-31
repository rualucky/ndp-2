<script setup>
import { inject, ref, onBeforeMount, isProxy, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import IsLoggedIn from '../components/auths/IsLoggedIn.vue'

const route = useRoute()
const $api = inject('$api')
const isError = ref(false)
const contactResults = ref([])
const contactResultId = ref('')
const name = ref('')
const mobile = ref('')
const email = ref('')
const address = ref('')
const notes = ref('')
const contactSource = ref({ id: String, name: String })
const contactStatus = ref('')
const contactId = ref(route.params.id)
const isProcessing = ref(false)
const isShowAlert = ref(false)

onBeforeMount(() => {
  get(contactId.value)
  getContactResults()
})


const get = (id) => {
  const configs = {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    contentType: 'application/json'
  }
  $api.get(`https://demo.nodeapis.com/contacts/${id}`, configs).then(response => {
    isError.value = false
    if (response && response.data) {
      const data = response.data.data
      name.value = data?.name
      mobile.value = data?.mobile
      email.value = data?.email
      address.value = data?.address
      notes.value = data?.notes
      contactSource.value = data?.contact_source
      contactStatus.value = data?.status
      contactResultId.value = data?.contact_result?.id
    }
  }).catch(error => {
    console.log(error)
    isError.value = true
  })
}

const edit = (id, data) => {
  isProcessing.value = true
  const configs = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  }
  $api.patch(`https://demo.nodeapis.com/contacts/${id}`, data, configs).then(response => {
    if (response && response.status === 200) {
      // notify here
      isProcessing.value = false
      isShowAlert.value = true
      setTimeout(() => {
        isShowAlert.value = false
      }, 1000)
    }
  })
}

const getContactResults = () => {
  const configs = {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    contentType: 'application/json'
  }
  $api.get(`https://demo.nodeapis.com/contact-results/names`, configs).then(response => {
    if (response && response.data) {
      contactResults.value = response.data.data
    }
  })
}

</script>

<template>
  <IsLoggedIn />
  <div v-if="isError">Contact not found</div>
  <div v-else class="min-w-screen min-h-screen">
    <div
      class="bg-green-100 rounded-lg py-5 px-6 m-3 text-base text-green-700 inline-flex items-center absolute right-0"
      :class="{ show: isShowAlert, hidden: !isShowAlert }"
      role="alert"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="check-circle"
        class="w-4 h-4 mr-2 fill-current"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
        />
      </svg>
      Update succeeded
    </div>
    <div class="grid grid-cols-2 gap-4 p-4">
      <div class="form-group">
        <label for="inputName" class="form-label inline-block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputName"
          aria-describedby="inputName"
          placeholder="Enter name"
          v-model="name"
        />
      </div>
      <div class="form-group">
        <label for="inputMobile" class="form-label inline-block mb-2 text-gray-700">Mobile</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200"
          id="inputMobile"
          placeholder="Enter mobile"
          :value="mobile"
          disabled
        />
      </div>
      <div class="form-group">
        <label for="inputEmail" class="form-label inline-block mb-2 text-gray-700">Email</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputEmail"
          placeholder="Enter email"
          v-model="email"
        />
      </div>
      <div class="form-group">
        <label for="inputAddress" class="form-label inline-block mb-2 text-gray-700">Address</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputAddress"
          placeholder="Enter address"
          v-model="address"
        />
      </div>
      <div class="form-group">
        <label for="inputNotes" class="form-label inline-block mb-2 text-gray-700">Notes</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputNotes"
          placeholder="Enter notes"
          v-model="notes"
        />
      </div>
      <div class="form-group">
        <label for="inputContactSource" class="form-label inline-block mb-2 text-gray-700">Source</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200"
          id="inputSource"
          :value="contactSource.name"
          disabled
        />
      </div>
      <div class="form-group">
        <label for="inputStatus" class="form-label inline-block mb-2 text-gray-700">Status</label>
        <select
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputStatus"
          v-model="contactStatus"
        >
          <option value="KhachHangMoi">KhachHangMoi</option>
          <option value="ChuaLienLacDuoc">ChuaLienLacDuoc</option>
        </select>
      </div>
      <div class="form-group">
        <label for="inputResult" class="form-label inline-block mb-2 text-gray-700">Result</label>
        <select
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputResult"
          v-model="contactResultId"
        >
          <option v-for="item in contactResults" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
    </div>
    <div class="px-4 pt-1">
      <button
        :disabled="isProcessing"
        type="submit"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        @click="edit(contactId, { name, email, address, notes, status: contactStatus, contact_result_id: contactResultId })"
      >
        <svg
          v-show="isProcessing"
          role="status"
          class="inline mr-3 w-4 h-4 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        {{ isProcessing ? 'Processing...' : 'Update' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
