import{r as u,u as ie,j as e}from"./index-B8o203Dy.js";import{a as N}from"./api-Bn9k31HA.js";import{c as T}from"./createLucideIcon-6V63RTku.js";import{C as le}from"./calendar-BM_hIWUY.js";import{T as q}from"./trending-up-DVfqBxjQ.js";import{D as $}from"./dumbbell-DtL6o3GP.js";import{T as ne}from"./trophy-0nWyc6si.js";import{T as B}from"./target-gy6unRp3.js";import{C as de}from"./clock-C_TUpbht.js";import{A as ce}from"./award-C32pBd5Q.js";/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],J=T("camera",me);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],pe=T("map-pin",ue);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}]],xe=T("pen-line",ge);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],fe=T("settings",he),H="user_profile",be=()=>{try{const t=localStorage.getItem(H);return t?JSON.parse(t):null}catch(t){return console.error("Erro ao carregar perfil do localStorage:",t),null}},D=t=>{try{localStorage.setItem(H,JSON.stringify(t))}catch(a){console.error("Erro ao salvar perfil no localStorage:",a)}},ve=()=>{const t=be();return t?(t.email==="usuario@saga.com"&&(t.email="matheus.aalves@hotmail.com",D(t)),t):{id:"1",username:"usuario_saga",email:"matheus.aalves@hotmail.com",name:"Matheus Alves",full_name:"Matheus Alves",bio:"Apaixonado por fitness e vida saudável",height:"",weight:"",age:"",fitnessGoal:"",profile_image_url:"",profileImage:"",role:"USER"}};let _=ve();const ye={totalWorkouts:15,totalExercises:45,totalWeight:12500,currentStreak:5,bestStreak:12,personalRecords:8},je=[{exercise:"Supino Reto",weight:80,date:"2024-12-01"},{exercise:"Agachamento",weight:100,date:"2024-11-28"},{exercise:"Levantamento Terra",weight:120,date:"2024-11-25"}],we=[{id:2,name:"João Silva",avatar:"/avatars/joao.jpg",status:"ativo"},{id:3,name:"Maria Santos",avatar:"/avatars/maria.jpg",status:"ativo"},{id:4,name:"Pedro Costa",avatar:"/avatars/pedro.jpg",status:"offline"}],Ne=[{id:5,name:"Ana Oliveira",avatar:"/avatars/ana.jpg",sentAt:"2024-12-05T14:30:00Z"}],W={getProfile:async()=>{try{const a=(await N.get("/users/profile")).data;return D(a),a}catch{return console.log("Backend indisponível, usando dados locais do usuário"),_}},updateProfile:async t=>{try{const r=(await N.put("/users/profile",t)).data;return D(r),r}catch{console.log("Backend indisponível, salvando perfil localmente");const r={..._,...t};return _=r,D(r),r}},getStats:async t=>{try{return(await N.get(`/users/${t}/stats/progress`)).data}catch{return ye}},updateUserInfo:async(t,a)=>{try{return(await N.put(`/users/${t}`,a)).data}catch{return{..._,...a}}},getPersonalRecords:async()=>{try{return(await N.get("/users/personal-records")).data}catch{return je}},getFriends:async t=>{try{return(await N.get(`/friends/${t}`)).data}catch{return we}},getPendingRequests:async t=>{try{return(await N.get(`/friends/pending/received/${t}`)).data}catch{return Ne}},acceptFriend:async t=>{try{return(await N.post(`/friends/accept/${t}`)).data}catch{return{message:"Amizade aceita (modo offline)",friendshipId:t}}}};let ke={data:""},Se=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||ke,Pe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ae=/\/\*[^]*?\*\/|  +/g,V=/\n+/g,k=(t,a)=>{let r="",l="",c="";for(let s in t){let d=t[s];s[0]=="@"?s[1]=="i"?r=s+" "+d+";":l+=s[1]=="f"?k(d,s):s+"{"+k(d,s[1]=="k"?"":a)+"}":typeof d=="object"?l+=k(d,a?a.replace(/([^,])+/g,m=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,p=>/&/.test(p)?p.replace(/&/g,m):m?m+" "+p:p)):s):d!=null&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=k.p?k.p(s,d):s+":"+d+";")}return r+(a&&c?a+"{"+c+"}":c)+l},j={},Y=t=>{if(typeof t=="object"){let a="";for(let r in t)a+=r+Y(t[r]);return a}return t},Ce=(t,a,r,l,c)=>{let s=Y(t),d=j[s]||(j[s]=(p=>{let g=0,x=11;for(;g<p.length;)x=101*x+p.charCodeAt(g++)>>>0;return"go"+x})(s));if(!j[d]){let p=s!==t?t:(g=>{let x,b,y=[{}];for(;x=Pe.exec(g.replace(Ae,""));)x[4]?y.shift():x[3]?(b=x[3].replace(V," ").trim(),y.unshift(y[0][b]=y[0][b]||{})):y[0][x[1]]=x[2].replace(V," ").trim();return y[0]})(t);j[d]=k(c?{["@keyframes "+d]:p}:p,r?"":"."+d)}let m=r&&j.g?j.g:null;return r&&(j.g=j[d]),((p,g,x,b)=>{b?g.data=g.data.replace(b,p):g.data.indexOf(p)===-1&&(g.data=x?p+g.data:g.data+p)})(j[d],a,l,m),d},Ie=(t,a,r)=>t.reduce((l,c,s)=>{let d=a[s];if(d&&d.call){let m=d(r),p=m&&m.props&&m.props.className||/^go/.test(m)&&m;d=p?"."+p:m&&typeof m=="object"?m.props?"":k(m,""):m===!1?"":m}return l+c+(d??"")},"");function M(t){let a=this||{},r=t.call?t(a.p):t;return Ce(r.unshift?r.raw?Ie(r,[].slice.call(arguments,1),a.p):r.reduce((l,c)=>Object.assign(l,c&&c.call?c(a.p):c),{}):r,Se(a.target),a.g,a.o,a.k)}let Z,F,z;M.bind({g:1});let w=M.bind({k:1});function Ee(t,a,r,l){k.p=a,Z=t,F=r,z=l}function S(t,a){let r=this||{};return function(){let l=arguments;function c(s,d){let m=Object.assign({},s),p=m.className||c.className;r.p=Object.assign({theme:F&&F()},m),r.o=/ *go\d+/.test(p),m.className=M.apply(r,l)+(p?" "+p:"");let g=t;return t[0]&&(g=m.as||t,delete m.as),z&&g[0]&&z(m),Z(g,m)}return c}}var $e=t=>typeof t=="function",O=(t,a)=>$e(t)?t(a):t,_e=(()=>{let t=0;return()=>(++t).toString()})(),De=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let a=matchMedia("(prefers-reduced-motion: reduce)");t=!a||a.matches}return t}})(),Te=20,K=(t,a)=>{switch(a.type){case 0:return{...t,toasts:[a.toast,...t.toasts].slice(0,Te)};case 1:return{...t,toasts:t.toasts.map(s=>s.id===a.toast.id?{...s,...a.toast}:s)};case 2:let{toast:r}=a;return K(t,{type:t.toasts.find(s=>s.id===r.id)?1:0,toast:r});case 3:let{toastId:l}=a;return{...t,toasts:t.toasts.map(s=>s.id===l||l===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return a.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(s=>s.id!==a.toastId)};case 5:return{...t,pausedAt:a.time};case 6:let c=a.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+c}))}}},Me=[],R={toasts:[],pausedAt:void 0},G=t=>{R=K(R,t),Me.forEach(a=>{a(R)})},Re=(t,a="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:a,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...r,id:r?.id||_e()}),I=t=>(a,r)=>{let l=Re(a,t,r);return G({type:2,toast:l}),l.id},h=(t,a)=>I("blank")(t,a);h.error=I("error");h.success=I("success");h.loading=I("loading");h.custom=I("custom");h.dismiss=t=>{G({type:3,toastId:t})};h.remove=t=>G({type:4,toastId:t});h.promise=(t,a,r)=>{let l=h.loading(a.loading,{...r,...r?.loading});return typeof t=="function"&&(t=t()),t.then(c=>{let s=a.success?O(a.success,c):void 0;return s?h.success(s,{id:l,...r,...r?.success}):h.dismiss(l),c}).catch(c=>{let s=a.error?O(a.error,c):void 0;s?h.error(s,{id:l,...r,...r?.error}):h.dismiss(l)}),t};var Fe=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ze=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Oe=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ge=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Fe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ze} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Oe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Le=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ue=S("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${Le} 1s linear infinite;
`,qe=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Be=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Je=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Be} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,We=S("div")`
  position: absolute;
`,Ve=S("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,He=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ye=S("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${He} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ze=({toast:t})=>{let{icon:a,type:r,iconTheme:l}=t;return a!==void 0?typeof a=="string"?u.createElement(Ye,null,a):a:r==="blank"?null:u.createElement(Ve,null,u.createElement(Ue,{...l}),r!=="loading"&&u.createElement(We,null,r==="error"?u.createElement(Ge,{...l}):u.createElement(Je,{...l})))},Ke=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Qe=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,Xe="0%{opacity:0;} 100%{opacity:1;}",et="0%{opacity:1;} 100%{opacity:0;}",tt=S("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,at=S("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,rt=(t,a)=>{let r=t.includes("top")?1:-1,[l,c]=De()?[Xe,et]:[Ke(r),Qe(r)];return{animation:a?`${w(l)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};u.memo(({toast:t,position:a,style:r,children:l})=>{let c=t.height?rt(t.position||a||"top-center",t.visible):{opacity:0},s=u.createElement(Ze,{toast:t}),d=u.createElement(at,{...t.ariaProps},O(t.message,t));return u.createElement(tt,{className:t.className,style:{...c,...r,...t.style}},typeof l=="function"?l({icon:s,message:d}):u.createElement(u.Fragment,null,s,d))});Ee(u.createElement);M`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;const ht=()=>{const{user:t,setUser:a}=ie(),[r,l]=u.useState(!1),[c,s]=u.useState(!1),[d,m]=u.useState("overview"),[p,g]=u.useState("Last 12 weeks"),[x,b]=u.useState(null),[y,E]=u.useState(null),[f,P]=u.useState({name:"mathalves",email:"",bio:"",height:"",weight:"",age:"",fitnessGoal:"",profileImage:""}),[A]=u.useState({totalWorkouts:488,followers:4,following:4,totalWeight:"125.5kg",currentStreak:7,maxStreak:23,weeklyDuration:[{week:"Mar 23",hours:5},{week:"Apr 06",hours:5},{week:"Apr 20",hours:4},{week:"May 04",hours:4},{week:"May 18",hours:5},{week:"Jun 01",hours:2},{week:"Jun 15",hours:5},{week:"Jun 29",hours:3},{week:"Jul 13",hours:6},{week:"Jul 27",hours:5},{week:"Aug 10",hours:4},{week:"Aug 24",hours:3}],totalHours:52}),[Q]=u.useState([{id:1,name:"A - peito + tríceps",date:"an hour ago",duration:"52min",volume:"21,625 kg",records:1,exercises:[{name:"4 sets Butterfly (Pec Deck)",sets:4,icon:"🦋"},{name:"4 sets Bench Press (Barbell)",sets:4,icon:"🏋️"},{name:"4 sets Incline Bench Press (Dumbbell)",sets:4,icon:"💪"}]},{id:2,name:"B - ombro + antebraço",date:"20 May 2025, 16:08",duration:"1h 3min",volume:"27,030 kg",records:1,exercises:[{name:"3 sets Crucifixo Inverso Cross",sets:3,icon:"✋"},{name:"3 sets Single Arm Lateral Raise (Cable)",sets:3,icon:"💪"},{name:"4 sets Straight Leg Deadlift",sets:4,icon:"🏋️"}]}]),[st,ot]=u.useState(new Date),X=[{id:"1",title:"Primeira Semana",description:"Complete 7 dias consecutivos",icon:"🎯",unlocked:!0,date:"2023-12-01"},{id:"2",title:"100 Treinos",description:"Complete 100 treinos",icon:"💯",unlocked:!0,date:"2024-01-10"},{id:"3",title:"Maratonista",description:"Complete 30 dias consecutivos",icon:"🏃",unlocked:!1,progress:23}];u.useEffect(()=>{t&&L()},[t]);const L=async()=>{s(!0);try{const i=await W.getProfile(),n={name:i.name||i.full_name||t?.name||"mathalves",email:i.email||t?.email||"matheus.aalves@hotmail.com",bio:i.bio||"",height:i.height||"",weight:i.weight||"",age:i.age||"",fitnessGoal:i.fitnessGoal||"",profileImage:i.profileImage||i.profile_image_url||""};P(n)}catch(o){console.error("Erro ao carregar perfil:",o);const i=localStorage.getItem("user_profile");if(i)try{const n=JSON.parse(i);P({name:n.name||n.full_name||t?.name||"mathalves",email:n.email||t?.email||"matheus.aalves@hotmail.com",bio:n.bio||"",height:n.height||"",weight:n.weight||"",age:n.age||"",fitnessGoal:n.fitnessGoal||"",profileImage:n.profileImage||n.profile_image_url||""})}catch(n){console.error("Erro ao parsear dados salvos:",n),P({name:t?.name||"mathalves",email:t?.email||"matheus.aalves@hotmail.com",bio:"",height:"",weight:"",age:"",fitnessGoal:"",profileImage:""})}else P({name:t?.name||"mathalves",email:t?.email||"matheus.aalves@hotmail.com",bio:"",height:"",weight:"",age:"",fitnessGoal:"",profileImage:""})}finally{s(!1)}},C=o=>{const{name:i,value:n}=o.target;P(v=>({...v,[i]:n}))},ee=o=>{const i=o.target.files?.[0];if(i){if(i.size>5*1024*1024){h.error("A imagem deve ter no máximo 5MB");return}if(!i.type.startsWith("image/")){h.error("Por favor, selecione apenas arquivos de imagem");return}E(i);const n=new FileReader;n.onloadend=()=>{b(n.result)},n.readAsDataURL(i)}},te=()=>{E(null),b(null),P(o=>({...o,profileImage:""}))},ae=()=>{l(!1),E(null),b(null),L()},re=o=>o?.charAt(0).toUpperCase()||"M",U=async o=>{o.preventDefault(),s(!0);try{const i={...f};if(y){const v=await se(y);i.profileImage=v}const n=await W.updateProfile(i);if(P({name:n.name||n.full_name||i.name,email:n.email||i.email,bio:n.bio||i.bio,height:n.height||i.height,weight:n.weight||i.weight,age:n.age||i.age,fitnessGoal:n.fitnessGoal||i.fitnessGoal,profileImage:n.profileImage||n.profile_image_url||i.profileImage}),t){const v={...t,name:n.name||n.full_name||i.name,email:n.email||i.email};a(v),localStorage.setItem("saga-user",JSON.stringify(v))}b(null),E(null),l(!1),h.success("Perfil atualizado com sucesso!")}catch(i){console.error("Erro ao atualizar perfil:",i),h.error("Erro ao atualizar perfil. Tente novamente.")}finally{s(!1)}},se=o=>new Promise((i,n)=>{const v=new FileReader;v.readAsDataURL(o),v.onload=()=>i(v.result),v.onerror=oe=>n(oe)});return Math.max(...A.weeklyDuration.map(o=>o.hours)),c&&!r?e.jsx("div",{className:"pt-20 pb-6 flex justify-center items-center min-h-[60vh]",children:e.jsx("div",{className:"animate-pulse text-primary text-xl",children:"Carregando perfil..."})}):r?e.jsx("div",{className:"bg-[#0a0a0b] min-h-screen text-white",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-4 py-8",children:[e.jsxs("div",{className:"mb-6 flex justify-between items-center",children:[e.jsx("h1",{className:"text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",children:"Editar Perfil"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:ae,className:"bg-[#2d2d30] border border-[#404040] text-white px-4 py-2 rounded-lg hover:bg-[#3d3d40] transition-colors",disabled:c,children:"Cancelar"}),e.jsx("button",{onClick:U,className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300",disabled:c,children:c?"Salvando...":"Salvar"})]})]}),e.jsx("div",{className:"bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-6",children:e.jsxs("form",{onSubmit:U,className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[e.jsx("div",{className:"relative",children:e.jsx("div",{className:"w-24 h-24 rounded-full overflow-hidden bg-[#2d2d30] flex items-center justify-center",children:x||f.profileImage?e.jsx("img",{src:x||f.profileImage,alt:"Profile",className:"w-full h-full object-cover"}):e.jsx("span",{className:"text-2xl font-bold text-[#8b8b8b]",children:re(f.name)})})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("label",{className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer text-sm",children:["Escolher Foto",e.jsx("input",{type:"file",accept:"image/*",onChange:ee,className:"hidden"})]}),(x||f.profileImage)&&e.jsx("button",{type:"button",onClick:te,className:"bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm",children:"Remover"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Nome *"}),e.jsx("input",{type:"text",name:"name",value:f.name,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Email *"}),e.jsx("input",{type:"email",name:"email",value:f.email,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-[#8b8b8b] placeholder-[#666] cursor-not-allowed",readOnly:!0,disabled:!0,title:"O email não pode ser alterado após o registro"}),e.jsx("p",{className:"text-xs text-[#666] mt-1",children:"O email não pode ser alterado"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Altura (cm)"}),e.jsx("input",{type:"number",name:"height",value:f.height,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500",placeholder:"170"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Peso (kg)"}),e.jsx("input",{type:"number",name:"weight",value:f.weight,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500",placeholder:"70"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Idade"}),e.jsx("input",{type:"number",name:"age",value:f.age,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500",placeholder:"25"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Objetivo"}),e.jsxs("select",{name:"fitnessGoal",value:f.fitnessGoal,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500",children:[e.jsx("option",{value:"",children:"Selecione um objetivo"}),e.jsx("option",{value:"PERDA_PESO",children:"Perda de Peso"}),e.jsx("option",{value:"GANHO_MASSA",children:"Ganho de Massa"}),e.jsx("option",{value:"DEFINICAO",children:"Definição"}),e.jsx("option",{value:"RESISTENCIA",children:"Resistência"}),e.jsx("option",{value:"FORCA",children:"Força"})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-[#8b8b8b] mb-2",children:"Bio"}),e.jsx("textarea",{name:"bio",value:f.bio,onChange:C,className:"w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none h-24",placeholder:"Conte um pouco sobre você..."})]})]})})]})}):e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",children:[e.jsx("div",{className:"h-32 bg-gradient-to-r from-purple-500 to-pink-500 relative",children:e.jsx("button",{className:"absolute top-4 right-4 p-2 bg-black/20 rounded-lg text-white hover:bg-black/30 transition-colors",children:e.jsx(J,{className:"w-4 h-4"})})}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-10 border-4 border-white dark:border-gray-800",children:e.jsx("span",{className:"text-white font-bold text-2xl",children:t?.name?.charAt(0)||"U"})}),e.jsx("button",{className:"absolute -bottom-1 -right-1 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors",children:e.jsx(J,{className:"w-3 h-3"})})]}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:t?.name||"Usuário"}),e.jsx("button",{onClick:()=>l(!r),className:"p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",children:e.jsx(xe,{className:"w-4 h-4"})})]}),e.jsxs("p",{className:"text-gray-600 dark:text-gray-400 mb-2",children:["@",t?.email?.split("@")[0]||"usuario"]}),e.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(pe,{className:"w-4 h-4"}),e.jsx("span",{children:"São Paulo, BR"})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(le,{className:"w-4 h-4"}),e.jsx("span",{children:"Membro desde Dez 2023"})]})]})]})]}),e.jsxs("button",{className:"bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",children:[e.jsx(fe,{className:"w-4 h-4"}),"Configurações"]})]}),e.jsxs("div",{className:"grid grid-cols-3 md:grid-cols-6 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.totalWorkouts}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Treinos"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.following}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Seguindo"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.followers}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Seguidores"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.totalWeight}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Volume Total"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.currentStreak}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Sequência"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:A.maxStreak}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Recorde"})]})]})]})]}),e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",children:[e.jsx("div",{className:"flex border-b border-gray-200 dark:border-gray-700",children:[{id:"overview",label:"Visão Geral",icon:q},{id:"workouts",label:"Treinos",icon:$},{id:"achievements",label:"Conquistas",icon:ne},{id:"progress",label:"Progresso",icon:B}].map(o=>e.jsxs("button",{onClick:()=>m(o.id),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${d===o.id?"text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`,children:[e.jsx(o.icon,{className:"w-4 h-4"}),o.label]},o.id))}),e.jsxs("div",{className:"p-6",children:[d==="overview"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsx("div",{className:"bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg",children:e.jsx($,{className:"w-5 h-5 text-purple-600 dark:text-purple-400"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Esta Semana"}),e.jsx("div",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:"4 treinos"})]})]})}),e.jsx("div",{className:"bg-green-50 dark:bg-green-900/20 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-green-100 dark:bg-green-900/30 rounded-lg",children:e.jsx(B,{className:"w-5 h-5 text-green-600 dark:text-green-400"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Meta Semanal"}),e.jsx("div",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:"4/5 dias"})]})]})}),e.jsx("div",{className:"bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg",children:e.jsx(de,{className:"w-5 h-5 text-orange-600 dark:text-orange-400"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Tempo Médio"}),e.jsx("div",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:"58 min"})]})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white mb-4",children:"Atividade Recente"}),e.jsx("div",{className:"space-y-3",children:Q.map(o=>e.jsxs("div",{className:"flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center",children:e.jsx($,{className:"w-5 h-5 text-purple-600 dark:text-purple-400"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-gray-900 dark:text-white",children:o.name}),e.jsxs("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:[new Date(o.date).toLocaleDateString("pt-BR")," • ",o.duration," • ",o.exercises.length," exercícios"]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"font-semibold text-gray-900 dark:text-white",children:o.volume}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Volume"})]})]},o.id))})]})]}),d==="achievements"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:"Conquistas"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:X.map(o=>e.jsx("div",{className:`p-4 rounded-lg border-2 ${o.unlocked?"border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20":"border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`text-2xl ${o.unlocked?"":"grayscale opacity-50"}`,children:o.icon}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:`font-semibold ${o.unlocked?"text-gray-900 dark:text-white":"text-gray-500 dark:text-gray-400"}`,children:o.title}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-2",children:o.description}),o.unlocked?e.jsxs("div",{className:"flex items-center gap-1 text-xs text-green-600 dark:text-green-400",children:[e.jsx(ce,{className:"w-3 h-3"}),"Desbloqueado em ",new Date(o.date).toLocaleDateString("pt-BR")]}):o.progress?e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Progresso: ",o.progress,"/30"]}),e.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",children:e.jsx("div",{className:"bg-purple-600 h-2 rounded-full",style:{width:`${o.progress/30*100}%`}})})]}):null]})]})},o.id))})]}),d==="workouts"&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-16 h-16 text-gray-400 mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 dark:text-white mb-2",children:"Histórico de Treinos"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Aqui você verá todo seu histórico de treinos"})]}),d==="progress"&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx(q,{className:"w-16 h-16 text-gray-400 mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 dark:text-white mb-2",children:"Gráficos de Progresso"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Visualize sua evolução ao longo do tempo"})]})]})]})]})};export{ht as default};
