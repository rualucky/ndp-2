<script setup>
import { isProxy, toRaw, inject, ref, defineProps, defineExpose, defineEmits, computed } from 'vue'

const ROLE = {
  ADMIN: 'Admin',
  TELESALES: 'Telesales'
}
const STATUS = {
  INACTIVE: 'Inactive',
  ACTIVE: 'Active'
}

const ACTION = {
  CREATE: 'Create',
  UPDATE: 'Update'
}

const $api = inject('$api')
const props = defineProps({
  index: String,
  data: Object,
  title: String,
  action: String,
  isHiddenTrigger: Boolean
})

const triggerButton = ref(null)
const triggerCancelButton = ref(null)
const employee = ref({
  id: '',
  name: '',
  mobile: '',
  email: '',
  password: '',
  role: '',
  status: ''
})
const isEyeOff = ref(true)

const modalId = computed(() => `modalCRUD-${props.index}`)
const modalTarget = computed(() => `#${modalId.value}`)
const roles = computed(() => [ROLE.ADMIN, ROLE.TELESALES])
const statuses = computed(() => [STATUS.ACTIVE, STATUS.INACTIVE])
const emits = defineEmits(['reload'])

const update = (action, data) => {
  const rawData = isProxy(data) ? toRaw(data) : data
  Object.keys(rawData).forEach(key => {
    if (!rawData[key]) {
      delete rawData[key]
    }
  })
  const configs = {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  }
  if (action === ACTION.CREATE) {
    $api.post(`https://demo.nodeapis.com/users`, rawData, configs).then(response => {
      if (response && [200, 201].includes(response.status)) {
        emits('reload')
        close()
      }
    })
    return
  }

  $api.patch(`https://demo.nodeapis.com/users/${rawData.id}`, rawData, configs).then(response => {
    if (response && [200, 201].includes(response.status)) {
        emits('reload')
        close()
    }
  })
}

const actionButtonName = computed(() => props.action ?? 'Action Name')
const toggleEye = () => {
  isEyeOff.value = !isEyeOff.value
}
const open = (data) => {
  employee.value = data
  triggerButton.value?.click()
}

const close = () => triggerCancelButton.value?.click()

defineExpose({
  open
})
</script>

<template>
  <!-- Button trigger modal -->
  <button type="button" ref="triggerButton" :class="{ 'hidden': isHiddenTrigger }"
    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    data-bs-toggle="modal" :data-bs-target="modalTarget">
    {{ props.title }}
  </button>

  <!-- Text trigger modal -->
  <!-- <span class="font-medium text-blue-600 dark:text-blue-500 hover:underline" data-bs-toggle="modal" :data-bs-target="modalTarget">Edit</span> -->

  <!-- Modal -->
  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
    :id="modalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable relative w-auto pointer-events-none">
      <div
        class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div
          class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">{{ props.title }}</h5>
          <button type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body relative p-4">
          <div>
            <label for="inputName" class="form-label inline-block mb-2 text-gray-700 text-left">Name</label>
            <input type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputName" aria-describedby="nameHelp" placeholder v-model="employee.name" />
          </div>
          <div class="pt-4">
            <label for="inputMobile" class="form-label inline-block mb-2 text-gray-700 text-left">Mobile</label>
            <input type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputMobile" aria-describedby="mobileHelp" placeholder v-model="employee.mobile" />
          </div>
          <div class="pt-4">
            <label for="inputEmail" class="form-label inline-block mb-2 text-gray-700 text-left">Email</label>
            <input type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputEmail" aria-describedby="emailHelp" placeholder v-model="employee.email" />
          </div>
          <div class="pt-4">
            <label for="inputPassword" class="form-label inline-block mb-2 text-gray-700 text-left">Password</label>
            <div class="relative">
              <input :type="isEyeOff ? 'password' : 'text'"
                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="inputPassword" aria-describedby="passwordHelp" placeholder v-model="employee.password" />
              <div class="flex absolute inset-y-0 right-2 items-center pl-3 cursor-pointer">
                <svg @click="toggleEye" :class="{ 'hidden': isEyeOff }" class="w-5 h-5" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                  </path>
                </svg>
                <svg @click="toggleEye" :class="{ 'hidden': !isEyeOff }" class="w-5 h-5" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21">
                  </path>
                </svg>
              </div>
            </div>
          </div>
          <div class="pt-4">
            <label for="inputRole" class="form-label inline-block mb-2 text-gray-700 text-left">Role</label>
            <select id="inputRole"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              v-model="employee.role">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div class="pt-4">
            <label for="inputStatus" class="form-label inline-block mb-2 text-gray-700 text-left">Status</label>
            <select id="inputStatus"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              v-model="employee.status">
              <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          <div
            class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
            <button type="button"
            ref="triggerCancelButton"
              class="inline-block px-6 py-2.5 bg-slate-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out"
              data-bs-dismiss="modal">Cancel</button>
            <button type="button"
              class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
              @click="update(action, employee)">{{ actionButtonName }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
