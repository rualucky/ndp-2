<script setup>
import { inject, ref, onBeforeMount, isProxy, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import IsLoggedIn from '../components/auths/IsLoggedIn.vue'

const route = useRoute()
const $api = inject('$api')
const contact = ref(Object)
const isError = ref(false)
const contactResults = ref([])
const contactResultId = ref('')

onBeforeMount(() => {
  get(route.params.id)
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
      contact.value = data
      contactResultId.value = data.contact_result?.id
    }
  }).catch(error => { 
      console.log(error)
      isError.value = true 
    })
}

const edit = (data, contactResultId) => {
  const rawData = isProxy(data) ? toRaw(data) : data
  rawData.contact_result_id = contactResultId
  const configs = {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    contentType: 'application/json'
  }
  $api.patch(`https://demo.nodeapis.com/contacts/${rawData.id}`, rawData, configs).then(response => {
    if (response && response.status === 200) {
      contact.value = response.data.data
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
    <div class="grid grid-cols-2 gap-4 p-4">
      <div class="form-group">
        <label for="inputName" class="form-label inline-block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputName"
          aria-describedby="inputName"
          placeholder="Enter name"
          v-model="contact.name"
        />
      </div>
      <div class="form-group">
        <label for="inputMobile" class="form-label inline-block mb-2 text-gray-700">Mobile</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200"
          id="inputMobile"
          placeholder="Enter mobile"
          :value="contact.mobile"
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
          v-model="contact.email"
        />
      </div>
      <div class="form-group">
        <label for="inputAddress" class="form-label inline-block mb-2 text-gray-700">Address</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputAddress"
          placeholder="Enter address"
          v-model="contact.address"
        />
      </div>
      <div class="form-group">
        <label for="inputNotes" class="form-label inline-block mb-2 text-gray-700">Notes</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputNotes"
          placeholder="Enter notes"
          v-model="contact.notes"
        />
      </div>
      <div class="form-group">
        <label for="inputContactSource" class="form-label inline-block mb-2 text-gray-700">Source</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200"
          id="inputSource"
          :value="contact.contact_source?.name"
          disabled
        />
      </div>
      <div class="form-group">
        <label for="inputStatus" class="form-label inline-block mb-2 text-gray-700">Status</label>
        <select
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputStatus" v-model="contact.status"
        >
          <option value="KhachHangMoi">KhachHangMoi</option>
          <option value="ChuaLienLacDuoc">ChuaLienLacDuoc</option>
        </select>
      
      </div>
        <div class="form-group">
        <label for="inputResult" class="form-label inline-block mb-2 text-gray-700">Result</label>
        <select
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="inputResult" v-model="contactResultId"
        >
        <option v-for="item in contactResults" :key="item.id" :value="item.id" >{{ item.name }}</option>
        </select>
      
      </div>
    </div>
    <div class="px-4 pt-1">
      <button
        type="submit"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        @click="edit(contact, contactResultId)"
      >Update</button>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
