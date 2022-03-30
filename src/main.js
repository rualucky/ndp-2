import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import App from './App.vue'
import router from './router'
import './index.css'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_AkvMmxPye_CV6S4T-XriYHj9CdnLXps",
  authDomain: "ndp-2-f045f.firebaseapp.com",
  projectId: "ndp-2-f045f",
  storageBucket: "ndp-2-f045f.appspot.com",
  messagingSenderId: "90380981956",
  appId: "1:90380981956:web:0868bc9ac723f098165b91",
  measurementId: "G-R6RQYKYLVD"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)
.use(VueAxios, axios)
.provide('$api', app.config.globalProperties.axios)
.mount('#app')
