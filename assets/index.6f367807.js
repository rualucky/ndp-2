import{r as f,o as d,c as p,a as t,t as i,F as _,p as m,b as h,d as a,e as g,f as v}from"./vendor.1ffc6782.js";const y=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function l(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=l(e);fetch(e.href,o)}};y();var b="/assets/logo.03d6d6da.png";var V=(r,n)=>{const l=r.__vccOpts||r;for(const[s,e]of n)l[s]=e;return l};const u=r=>(m("data-v-3d3c9e2e"),r=r(),h(),r),k=u(()=>t("p",null,[a(" Recommended IDE setup: "),t("a",{href:"https://code.visualstudio.com/",target:"_blank"},"VSCode"),a(" + "),t("a",{href:"https://github.com/johnsoncodehk/volar",target:"_blank"},"Volar")],-1)),S=u(()=>t("p",null,[t("a",{href:"https://vitejs.dev/guide/features.html",target:"_blank"}," Vite Documentation "),a(" | "),t("a",{href:"https://v3.vuejs.org/",target:"_blank"},"Vue 3 Documentation")],-1)),x=u(()=>t("p",null,[a(" Edit "),t("code",null,"components/HelloWorld.vue"),a(" to test hot module replacement. ")],-1)),I={props:{msg:String},setup(r){const n=f(0);return(l,s)=>(d(),p(_,null,[t("h1",null,i(r.msg),1),k,S,t("button",{type:"button",onClick:s[0]||(s[0]=e=>n.value++)},"count is: "+i(n.value),1),x],64))}};var N=V(I,[["__scopeId","data-v-3d3c9e2e"]]);const L=t("h1",null,"KMF",-1),O=t("img",{alt:"Vue logo",src:b},null,-1),D={setup(r){return(n,l)=>(d(),p(_,null,[L,O,g(N,{msg:"Hello Vue 3 + Vite"})],64))}};v(D).mount("#app");
