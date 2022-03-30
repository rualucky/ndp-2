<template>
  <!-- Button trigger modal -->
  <!-- <button type="button"
  class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
  </button>-->

  <!-- Text trigger modal -->
  <span class="font-medium text-blue-600 dark:text-blue-500 hover:underline" data-bs-toggle="modal" :data-bs-target="modalTarget">Edit</span>

  <!-- Modal -->
  <div
    class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
    :id="modalId"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable relative w-auto pointer-events-none">
      <div
        class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current"
      >
        <div
          class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"
        >
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Update</h5>
          <button
            type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body relative p-4">
          <div>
            <label for="inputName" class="form-label inline-block mb-2 text-gray-700 text-left">Name</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputName"
              aria-describedby="nameHelp"
              placeholder
              v-model="contact.name"
            />
          </div>
          <div class="pt-4">
            <label
              for="inputMobile"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Mobile</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputMobile"
              aria-describedby="mobileHelp"
              placeholder
              v-model="contact.mobile"
            />
          </div>
          <div class="pt-4">
            <label
              for="inputEmail"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Email</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputEmail"
              aria-describedby="emailHelp"
              placeholder
              v-model="contact.email"
            />
          </div>
          <div class="pt-4">
            <label
              for="inputAddress"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Address</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputAddress"
              aria-describedby="addressHelp"
              placeholder
              v-model="contact.address"
            />
          </div>
          <div class="pt-4">
            <label
              for="inputNotes"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Notes</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputNotes"
              aria-describedby="notesHelp"
              placeholder
              v-model="contact.notes"
            />
          </div>
          <div class="pt-4">
            <label
              for="inputSource"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Source</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200"
              id="inputSource"
              aria-describedby="sourceHelp"
              placeholder
              v-model="contact.contact_source.name"
              disabled
            />
          </div>
          <div class="pt-4">
            <label
              for="inputStatus"
              class="form-label inline-block mb-2 text-gray-700 text-left"
            >Status</label>
            <input
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputStatus"
              aria-describedby="statusHelp"
              placeholder
              v-model="contact.status"
            />
          </div>
        </div>
        <div
          class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"
        >
          <button
            type="button"
            class="inline-block px-6 py-2.5 bg-slate-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out"
            data-bs-dismiss="modal"
          >Cancel</button>
          <button
            type="button"
            class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
            @click="edit(contact)"
          >Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, isProxy, toRaw, inject, ref, defineProps, defineEmits, computed, withCtx } from 'vue'
const $api = inject('$api')
const props = defineProps({
  index: Number,
  data: Object
})

const contact = ref({
  ...props.data
})

const modalId = computed(() => `modalCRUD-${props.index}`)
const modalTarget = computed(() => `#${modalId.value}`)

onBeforeMount(() => {
  console.log('before mount modals')
})

onMounted(() => {
  console.log('on mounted modals')
})

// const get = (id) => {
//   console.log(id)
//   const configs = {
//         headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//         contentType: 'application/json'
//     }
//   $api.get(`https://demo.nodeapis.com/contacts/${id}`, configs).then(response => {
//    if (response && response.data) {
//      const data = response.data.data
//      this.name.value = data.name
//      mobile.value = data.mobile
//      email.value = data.email
//      address.value= data.address
//      status.value = data.status
//      contact_source.value = data.contact_source
//    }
//   })
// }

const edit = (data) => {
  const rawData = isProxy(data) ? toRaw(data) : data
  const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        contentType: 'application/json'
    }
  $api.patch(`https://demo.nodeapis.com/contacts/${rawData.id}`, rawData, configs).then(response => {
   if (response && response.status === 200) {
   }
  })
}


</script>