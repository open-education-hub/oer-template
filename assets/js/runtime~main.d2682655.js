(()=>{"use strict";var e,t,r,o,a,n={},i={};function f(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,f),r.loaded=!0,r.exports}f.m=n,f.c=i,e=[],f.O=(t,r,o,a)=>{if(!r){var n=1/0;for(c=0;c<e.length;c++){r=e[c][0],o=e[c][1],a=e[c][2];for(var i=!0,l=0;l<r.length;l++)(!1&a||n>=a)&&Object.keys(f.O).every((e=>f.O[e](r[l])))?r.splice(l--,1):(i=!1,a<n&&(n=a));if(i){e.splice(c--,1);var b=o();void 0!==b&&(t=b)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[r,o,a]},f.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return f.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,f.t=function(e,o){if(1&o&&(e=this(e)),8&o)return e;if("object"==typeof e&&e){if(4&o&&e.__esModule)return e;if(16&o&&"function"==typeof e.then)return e}var a=Object.create(null);f.r(a);var n={};t=t||[null,r({}),r([]),r(r)];for(var i=2&o&&e;"object"==typeof i&&!~t.indexOf(i);i=r(i))Object.getOwnPropertyNames(i).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,f.d(a,n),a},f.d=(e,t)=>{for(var r in t)f.o(t,r)&&!f.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},f.f={},f.e=e=>Promise.all(Object.keys(f.f).reduce(((t,r)=>(f.f[r](e,t),t)),[])),f.u=e=>"assets/js/"+({30:"944699f7",53:"935f2afb",85:"1f391b9e",106:"68e441b4",299:"3e12c993",406:"75a3ec81",414:"393be207",514:"1be78505",595:"91bb8e05",597:"a4095209",608:"41bb21d5",761:"53d4129f",817:"14eb3368",918:"17896441"}[e]||e)+"."+{30:"028c99f7",53:"ffe9b8a8",85:"65e6b6ac",106:"414594db",299:"2137760a",406:"333216d5",414:"68306125",514:"4e6bd95d",595:"7583b173",597:"e8ffd347",608:"0967fc5c",666:"ccaec395",761:"d09bd9d0",817:"82d8979b",918:"9338b4a9",972:"a617990e"}[e]+".js",f.miniCssF=e=>{},f.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),f.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o={},a="template:",f.l=(e,t,r,n)=>{if(o[e])o[e].push(t);else{var i,l;if(void 0!==r)for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++){var u=b[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==a+r){i=u;break}}i||(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,f.nc&&i.setAttribute("nonce",f.nc),i.setAttribute("data-webpack",a+r),i.src=e),o[e]=[t];var d=(t,r)=>{i.onerror=i.onload=null,clearTimeout(s);var a=o[e];if(delete o[e],i.parentNode&&i.parentNode.removeChild(i),a&&a.forEach((e=>e(r))),t)return t(r)},s=setTimeout(d.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=d.bind(null,i.onerror),i.onload=d.bind(null,i.onload),l&&document.head.appendChild(i)}},f.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},f.p="/oer-template/",f.gca=function(e){return e={17896441:"918","944699f7":"30","935f2afb":"53","1f391b9e":"85","68e441b4":"106","3e12c993":"299","75a3ec81":"406","393be207":"414","1be78505":"514","91bb8e05":"595",a4095209:"597","41bb21d5":"608","53d4129f":"761","14eb3368":"817"}[e]||e,f.p+f.u(e)},(()=>{var e={303:0,532:0};f.f.j=(t,r)=>{var o=f.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else if(/^(303|532)$/.test(t))e[t]=0;else{var a=new Promise(((r,a)=>o=e[t]=[r,a]));r.push(o[2]=a);var n=f.p+f.u(t),i=new Error;f.l(n,(r=>{if(f.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var a=r&&("load"===r.type?"missing":r.type),n=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+a+": "+n+")",i.name="ChunkLoadError",i.type=a,i.request=n,o[1](i)}}),"chunk-"+t,t)}},f.O.j=t=>0===e[t];var t=(t,r)=>{var o,a,n=r[0],i=r[1],l=r[2],b=0;if(n.some((t=>0!==e[t]))){for(o in i)f.o(i,o)&&(f.m[o]=i[o]);if(l)var c=l(f)}for(t&&t(r);b<n.length;b++)a=n[b],f.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return f.O(c)},r=self.webpackChunktemplate=self.webpackChunktemplate||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})()})();