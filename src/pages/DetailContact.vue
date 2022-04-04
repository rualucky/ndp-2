<script setup>
import { inject, ref, onBeforeMount } from 'vue'
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
        :class="{ 'cursor-progress': isProcessing }"
        @click="edit(contactId, { name, email, address, notes, status: contactStatus, contact_result_id: contactResultId })"
      >
        <div class="flex items-center">
          <span
            v-show="isProcessing"
            class="mr-2 spinner-border animate-spin inline-block w-5 h-5 rounded-full text-yellow-500"
            role="status"
          ></span>
          <span>Update</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
