import{s as K,e as P,u as Q,g as U,f as V,c as w,o as X,d as _,b as Y}from"./scheduler.6402f0dd.js";import{S as Z,i as v,g as x,s as $,h as tt,j as et,c as lt,f as y,k as L,a as A,x as st,d as nt,t as it,H as at,e as O,F as ot}from"./index.0cc09f3a.js";import{t as ht,s as b,h as S}from"./store.be990f37.js";const ct=(n,t)=>{let i=0,l=0,a=0;return function(){l=Date.now(),clearTimeout(a),l-i>=t?(i=l,n()):a=setTimeout(n,t)}};function q(n){let t,i;return{c(){t=new at(!1),i=O(),this.h()},l(l){t=ot(l,!1),i=O(),this.h()},h(){t.a=i},m(l,a){t.m(n[0],l,a),A(l,i,a)},p(l,a){a&1&&t.p(l[0])},d(l){l&&(y(i),t.d())}}}function ut(n){let t,i,l,a;const r=n[6].default,h=P(r,n,n[5],null);let o=n[0]&&q(n);return{c(){t=x("main"),h&&h.c(),i=$(),o&&o.c(),this.h()},l(s){t=tt(s,"MAIN",{class:!0});var c=et(t);h&&h.l(c),i=lt(c),o&&o.l(c),c.forEach(y),this.h()},h(){L(t,"class",l=`max-w-[900px] w-full py-2 ${n[1]?n[1]:""}`)},m(s,c){A(s,t,c),h&&h.m(t,null),st(t,i),o&&o.m(t,null),n[7](t),a=!0},p(s,[c]){h&&h.p&&(!a||c&32)&&Q(h,r,s,s[5],a?V(r,s[5],c,null):U(s[5]),null),s[0]?o?o.p(s,c):(o=q(s),o.c(),o.m(t,null)):o&&(o.d(1),o=null),(!a||c&2&&l!==(l=`max-w-[900px] w-full py-2 ${s[1]?s[1]:""}`))&&L(t,"class",l)},i(s){a||(nt(h,s),a=!0)},o(s){it(h,s),a=!1},d(s){s&&y(t),h&&h.d(s),o&&o.d(),n[7](null)}}}const rt=100;function ft(n,t,i){let l,a,r;w(n,ht,e=>i(4,l=e)),w(n,b,e=>i(8,a=e)),w(n,S,e=>i(9,r=e));let{$$slots:h={},$$scope:o}=t,{html:s=null}=t,{className:c=null}=t,{tocDataExists:p=!1}=t,u=null;const B=e=>{let m=null,E=null,C=0,I=0,M=0,D=0,N=0,k=0;e.some((H,T)=>{const f=H.getBoundingClientRect().top,g=e[T+1],d=(g==null?void 0:g.getBoundingClientRect().top)??(u==null?void 0:u.getBoundingClientRect().bottom),G=f<0&&(!g||0<d);m===null&&G&&(I=T,m=H,C=f,N=d-f);const J=f<window.innerHeight&&(!g||window.innerHeight<d);if(E===null&&J)return D=T,E=H,M=f,k=d-f,!0});const F=(0-C)/N,j=(window.innerHeight-M)/k,W=l*(F+I),z=l*(j+D);_(S,r={top:Math.floor(W),bottom:Math.floor(z)},r)};X(()=>{if(!p||!u||!u)return;_(b,a=!0,a),_(S,r=null,r);const e=[...u.querySelectorAll("h1,h2,h3,h4")],m=ct(()=>B(e),rt);return document.addEventListener("scroll",m),()=>{_(b,a=!1,a),document.removeEventListener("scroll",m)}});function R(e){Y[e?"unshift":"push"](()=>{u=e,i(2,u)})}return n.$$set=e=>{"html"in e&&i(0,s=e.html),"className"in e&&i(1,c=e.className),"tocDataExists"in e&&i(3,p=e.tocDataExists),"$$scope"in e&&i(5,o=e.$$scope)},n.$$.update=()=>{if(n.$$.dirty&20&&l&&u){const e=[...u.querySelectorAll("h1,h2,h3,h4")];B(e)}},[s,c,u,p,l,o,h,R]}class _t extends Z{constructor(t){super(),v(this,t,ft,ut,K,{html:0,className:1,tocDataExists:3})}}export{_t as M};