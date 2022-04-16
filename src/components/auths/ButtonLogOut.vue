<template>
    <button @click="signOut">Log out</button>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
const $api = inject('$api')
const router = useRouter()

const signOut = () => {
    const configs = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }
    $api.post('https://demo.nodeapis.com/auth/token/revoke', { refresh_token: localStorage.getItem('refresh_token') }, configs).then(response => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_type')
        localStorage.removeItem('expires_in')
        router.push('/sign-in')
    })
}
</script>