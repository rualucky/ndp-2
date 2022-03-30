<template></template>
<script setup>
import { useRouter } from 'vue-router'
import { inject, onBeforeMount, onBeforeUnmount } from 'vue'
const $api = inject('$api')
const router = useRouter()
let getAccessTokenAt
let expiresIn

onBeforeMount(() => {
    // console.log('Before mount IsLoggedIn')
    getAccessTokenAt = +localStorage.getItem('getAccessTokenAt')
    expiresIn = +localStorage.getItem('expires_in')
    if (+new Date() - getAccessTokenAt < expiresIn * 1000) {
        return
    }

    if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) {
        router.push('/sign-in')
        return
    }

    $api.post('https://demo.nodeapis.com/auth/token/refresh_token', { refresh_token: localStorage.getItem('refresh_token') }, { ContentType: 'application/json' }).then(response => {
       if (response && response.data) {
           Object.keys(response.data.data).forEach(key => {
               localStorage.setItem(key, response.data.data[key])
           })
           localStorage.setItem('getAccessTokenAt', +new Date())
       }
    }).catch(error => router.push('/sign-in'))
})

onBeforeUnmount(() => {
    // console.log('Before unmount IsLoggedIn')
})
</script>