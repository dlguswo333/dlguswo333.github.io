import{w as u}from"./index.1b92e39a.js";var _;const m=((_=globalThis.__sveltekit_pvj4d4)==null?void 0:_.base)??"";var h;const w=((h=globalThis.__sveltekit_pvj4d4)==null?void 0:h.assets)??m,E="1716631573669",y="sveltekit:snapshot",I="sveltekit:scroll",S="sveltekit:index",f={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},g=location.origin;function x(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function O(){return{x:pageXOffset,y:pageYOffset}}function c(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const d={...f,"":f.hover};function b(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function U(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=b(e)}}function j(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const o=e instanceof SVGAElement?e.target.baseVal:e.target,r=!n||!!o||R(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),l=(n==null?void 0:n.origin)===g&&e.hasAttribute("download");return{url:n,external:r,target:o,download:l}}function L(e){let t=null,n=null,o=null,r=null,l=null,a=null,s=e;for(;s&&s!==document.documentElement;)o===null&&(o=c(s,"preload-code")),r===null&&(r=c(s,"preload-data")),t===null&&(t=c(s,"keepfocus")),n===null&&(n=c(s,"noscroll")),l===null&&(l=c(s,"reload")),a===null&&(a=c(s,"replacestate")),s=b(s);function i(k){switch(k){case"":case"true":return!0;case"off":case"false":return!1;default:return null}}return{preload_code:d[o??"off"],preload_data:d[r??"off"],keep_focus:i(t),noscroll:i(n),reload:i(l),replace_state:i(a)}}function p(e){const t=u(e);let n=!0;function o(){n=!0,t.update(a=>a)}function r(a){n=!1,t.set(a)}function l(a){let s;return t.subscribe(i=>{(s===void 0||n&&i!==s)&&a(s=i)})}return{notify:o,set:r,subscribe:l}}function A(){const{set:e,subscribe:t}=u(!1);let n;async function o(){clearTimeout(n);try{const r=await fetch(`${w}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!r.ok)return!1;const a=(await r.json()).version!==E;return a&&(e(!0),clearTimeout(n)),a}catch{return!1}}return{subscribe:t,check:o}}function R(e,t){return e.origin!==g||!e.pathname.startsWith(t)}let v;function N(e){v=e.client}function P(e){return(...t)=>v[e](...t)}const V={url:p({}),page:p({}),navigating:u(null),updated:A()};export{S as I,f as P,I as S,y as a,j as b,L as c,V as d,m as e,U as f,x as g,N as h,R as i,P as j,g as o,O as s};
