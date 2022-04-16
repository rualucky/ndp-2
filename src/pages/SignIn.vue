<template>
<div class="min-w-screen min-h-screen flex justify-center items-center">
  <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
    <form @submit.prevent="signIn(username, password)">
      <div class="form-group mb-6">
        <label for="exampleInputEmail1" class="form-label inline-block mb-2 text-gray-700">Username</label>
        <input
          type="text"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter username"
          autocomplete="chrome-off"
          v-model="username"
        />
        <!-- <small id="emailHelp" class="block mt-1 text-xs text-gray-600">We'll never share your email with anyone
        else.</small>-->
      </div>
      <div class="form-group mb-6">
        <label
          for="exampleInputPassword1"
          class="form-label inline-block mb-2 text-gray-700"
        >Password</label>
        <input
          type="password"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="exampleInputPassword1"
          placeholder="Password"
          v-model="password"
          autocomplete="chrome-off"
        />
      </div>
      <button
        type="submit"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
      >Submit</button>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router' // import router
const $api = inject('$api')
const username = ref('')
const password = ref('')
const router = useRouter() // get a reference to our vue router
const signIn = (username, password) => { // we also renamed this method 
  $api.post('https://demo.nodeapis.com/auth/token', { username, password }, { ContentType: 'application/json' }).then(response => {
   if (response && response.data) {
     Object.keys(response.data.data).forEach(key => {
       localStorage.setItem(key, response.data.data[key])
     })
     localStorage.setItem('getAccessTokenAt', +new Date())
     router.push('/')
   }
  })
};
</script>
<!-- {"status_code":2000,"status_message":"INVALID_USERNAME_OR_PASSWORD","timestamp":"2022-03-29T17:05:51Z"} -->

 <!-- {
	"data": {
		"access_token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjQzMWRkMDJjMDZiNjUyOGM4MDcyNjIiLCJpc3MiOiJodHRwczovL2VzdHVhcnkuc29sdXRpb25zIiwiYXVkIjoiaHR0cHM6Ly9lc3R1YXJ5LnNvbHV0aW9ucyIsImlhdCI6MTY0ODU2NTcxMiwiZXhwIjoxNjQ4NTY2MzEyLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYyNDMwZmM2MmMwNmI2NTI4YzgwNzFkZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJIdW5nIFBoYW0iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6IjA5MDY3Nzc0MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjYWxpY2g4M0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiJ9.Nsy8ftNWTZyXxHkWFG-kxl9sY24gGexeWotqG8Ap--g",
		"token_type": "Bearer",
		"expires_in": "600",
		"refresh_token": "gK3NHwgrji0GllMltr3L31doWL8LZPuQIFpkUu0T3M0/AvzydF7pcwuPbSBt2ztj6r+FFF2u5cGm8coPYte8Uw=="
	},
	"status_code": 1000,
	"status_message": "Success",
	"timestamp": "2022-03-29T14:55:12Z"
} -->