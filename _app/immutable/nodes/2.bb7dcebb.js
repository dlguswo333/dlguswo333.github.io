import{s as j}from"../chunks/scheduler.db0ac06a.js";import{S as D,i as E,g as d,r as u,s as $,h as x,j as _,u as g,c as h,f as c,k as I,a as S,v,y as p,d as w,t as P,w as y}from"../chunks/index.2bbf3562.js";import{P as V}from"../chunks/Profile.b67a4fa5.js";import{P as k}from"../chunks/PostList.be0496c0.js";function q(r){let t,n,o,s,l,i,m;return n=new V({}),s=new k({props:{posts:r[0].posts,curIndex:r[0].curIndex,maxIndex:r[0].maxIndex}}),{c(){t=d("div"),u(n.$$.fragment),o=$(),u(s.$$.fragment),l=$(),i=d("div"),this.h()},l(e){t=x(e,"DIV",{class:!0});var a=_(t);g(n.$$.fragment,a),o=h(a),g(s.$$.fragment,a),l=h(a),i=x(a,"DIV",{class:!0}),_(i).forEach(c),a.forEach(c),this.h()},h(){I(i,"class","max-w-[300px]"),I(t,"class","flex flex-row flex-grow justify-center lg:pr-[300px]")},m(e,a){S(e,t,a),v(n,t,null),p(t,o),v(s,t,null),p(t,l),p(t,i),m=!0},p(e,[a]){const f={};a&1&&(f.posts=e[0].posts),a&1&&(f.curIndex=e[0].curIndex),a&1&&(f.maxIndex=e[0].maxIndex),s.$set(f)},i(e){m||(w(n.$$.fragment,e),w(s.$$.fragment,e),m=!0)},o(e){P(n.$$.fragment,e),P(s.$$.fragment,e),m=!1},d(e){e&&c(t),y(n),y(s)}}}function C(r,t,n){let{data:o}=t;return r.$$set=s=>{"data"in s&&n(0,o=s.data)},[o]}class B extends D{constructor(t){super(),E(this,t,C,q,j,{data:0})}}export{B as component};
