import{c as p,j as a,a as l}from"./app-Cj0lJvmW.js";import{c as r}from"./createLucideIcon-uViRZVq6.js";import{B as x}from"./baby-ChLhMGS4.js";import{C as f}from"./clipboard-list-BYmBXeyI.js";import{A as b}from"./activity-C1tVztsR.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],m=r("House",d);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]],u=r("UserRound",h),y=[{section:"home",label:"Beranda",icon:a.jsx(m,{size:20}),href:"/patient-app/home"},{section:"baby",label:"Bayi",icon:a.jsx(x,{size:20}),href:"/patient-app/baby"},{section:"screening",label:"Skrining",icon:a.jsx(f,{size:20}),href:"/patient-app/screening"},{section:"history",label:"Riwayat",icon:a.jsx(b,{size:20}),href:"/patient-app/history"},{section:"profile",label:"Profil",icon:a.jsx(u,{size:20}),href:"/patient-app/profile"}];function N(c){const e=p.c(5),{active:i,onNavigate:s}=c;let o;e[0]!==i||e[1]!==s?(o=y.map(t=>a.jsxs("button",{type:"button","aria-current":i===t.section?"page":void 0,onClick:()=>{if(s){s(t.section,t.href);return}l.visit(t.href)},className:`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold ${i===t.section?"text-rose-500":"text-slate-400"}`,children:[t.icon,t.label]},t.section)),e[0]=i,e[1]=s,e[2]=o):o=e[2];let n;return e[3]!==o?(n=a.jsx("nav",{"aria-label":"Navigasi aplikasi pasien",className:"fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-xl justify-around border-t border-rose-100 bg-white/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur",children:o}),e[3]=o,e[4]=n):n=e[4],n}export{N as P,u as U};
