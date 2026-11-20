import{c as e,i as t,n,o as r,r as i,s as a,t as o}from"./src-Dr8cI8vI.js";var s=e(),c=a(),l=`<!-- Example custom loader for the \`loaderSrc\` option. CSS is scoped under
#custom-loader because an inlined <style> applies to the whole page. -->
<div id="custom-loader">
  <style>
    #custom-loader {
      display: grid;
      grid-template-columns: repeat(2, 10px);
      gap: 4px;
    }
    #custom-loader span {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background: var(--vpss-bg-loader, #0072f5);
      animation: custom-loader-fade 1.2s ease-in-out infinite;
    }
    #custom-loader span:nth-child(2) {
      animation-delay: 0.3s;
    }
    #custom-loader span:nth-child(4) {
      animation-delay: 0.6s;
    }
    #custom-loader span:nth-child(3) {
      animation-delay: 0.9s;
    }

    @keyframes custom-loader-fade {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #custom-loader span {
        animation: none;
      }
    }
  </style>
  <span></span><span></span><span></span><span></span>
</div>
`,u=`#vpss .vpss-bars {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
}

#vpss .vpss-bar {
  width: 4px;
  height: 28px;
  border-radius: 2px;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  animation: vpss-bar 1s ease-in-out infinite;
}

#vpss .vpss-bar:nth-child(2) {
  animation-delay: -0.9s;
}

#vpss .vpss-bar:nth-child(3) {
  animation-delay: -0.8s;
}

#vpss .vpss-bar:nth-child(4) {
  animation-delay: -0.7s;
}

#vpss .vpss-bar:nth-child(5) {
  animation-delay: -0.6s;
}

@keyframes vpss-bar {
  0%,
  40%,
  100% {
    transform: scaleY(0.35);
  }
  20% {
    transform: scaleY(1);
  }
}
`,d=`#vpss .vpss-blocks {
  display: flex;
  align-items: center;
  gap: 3px;
}

#vpss .vpss-block {
  width: 13px;
  height: 13px;
  border-radius: 2px;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  transform: scale(0.3);
  opacity: 0.3;
  animation: vpss-block 1.4s ease-in-out infinite;
}

#vpss .vpss-block:nth-child(2) {
  animation-delay: 0.1s;
}

#vpss .vpss-block:nth-child(3) {
  animation-delay: 0.2s;
}

#vpss .vpss-block:nth-child(4) {
  animation-delay: 0.3s;
}

#vpss .vpss-block:nth-child(5) {
  animation-delay: 0.4s;
}

#vpss .vpss-block:nth-child(6) {
  animation-delay: 0.5s;
}

#vpss .vpss-block:nth-child(7) {
  animation-delay: 0.6s;
}

#vpss .vpss-block:nth-child(8) {
  animation-delay: 0.7s;
}

@keyframes vpss-block {
  0% {
    transform: scale(0.3);
    opacity: 0.3;
  }
  15% {
    transform: scale(1);
    opacity: 1;
  }
  55% {
    transform: scale(1);
    opacity: 0.25;
  }
  80%,
  100% {
    transform: scale(0.3);
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  #vpss .vpss-block {
    transform: none;
    opacity: 1;
  }
}
`,f=`#vpss .vpss-bounce {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 30px;
}

#vpss .vpss-bounce-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  animation: vpss-bounce 0.6s ease-in-out infinite alternate;
}

#vpss .vpss-bounce-dot:nth-child(2) {
  animation-delay: 0.2s;
}

#vpss .vpss-bounce-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes vpss-bounce {
  to {
    transform: translateY(-18px);
  }
}
`,p=`#vpss .vpss-loader {
  display: inline-block;
  position: relative;
  width: 72px;
  height: 10px;
}

#vpss .vpss-loader .vpss-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

#vpss .vpss-loader .vpss-dot:nth-child(1) {
  left: 8px;
  animation: vpss-dot1 0.6s infinite;
}

#vpss .vpss-loader .vpss-dot:nth-child(2) {
  left: 8px;
  animation: vpss-dot2 0.6s infinite;
}

#vpss .vpss-loader .vpss-dot:nth-child(3) {
  left: 32px;
  animation: vpss-dot2 0.6s infinite;
}

#vpss .vpss-loader .vpss-dot:nth-child(4) {
  left: 56px;
  animation: vpss-dot3 0.6s infinite;
}

@keyframes vpss-dot1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes vpss-dot2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

@keyframes vpss-dot3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
`,m=`#vpss .vpss-loader {
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 4px;
  border-radius: 2px;
}

#vpss .vpss-loader .vpss-line {
  position: absolute;
  background: rgba(150, 150, 150, 0.4);
  width: 150%;
  height: 4px;
}

#vpss .vpss-loader .vpss-subline {
  position: absolute;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  height: 4px;
}

#vpss .vpss-loader .vpss-inc {
  animation: vpss-increase 1.5s infinite;
}

#vpss .vpss-loader .vpss-dec {
  animation: vpss-decrease 1.5s 0.5s infinite;
}

@keyframes vpss-increase {
  from {
    left: -5%;
    width: 5%;
  }
  to {
    left: 130%;
    width: 100%;
  }
}

@keyframes vpss-decrease {
  from {
    left: -80%;
    width: 80%;
  }
  to {
    left: 110%;
    width: 10%;
  }
}

@media (prefers-reduced-motion: reduce) {
  #vpss .vpss-loader .vpss-inc {
    left: 0;
    width: 100%;
  }
  #vpss .vpss-loader .vpss-dec {
    display: none;
  }
}
`,h=`#vpss .vpss-orbit {
  width: 36px;
  height: 36px;
  padding: 3px;
  box-sizing: border-box;
}

#vpss .vpss-orbit-track {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(150, 150, 150, 0.35);
  animation: vpss-orbit 1.1s linear infinite;
}

#vpss .vpss-orbit-dot {
  position: absolute;
  top: -6px;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 50%;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
}

@keyframes vpss-orbit {
  to {
    transform: rotate(360deg);
  }
}
`,g=`#vpss .vpss-pulse {
  position: relative;
  width: 32px;
  height: 32px;
}

#vpss .vpss-pulse-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--vpss-bg-loader, /*BG_LOADER*/);
  /* Invisible until animated, so nothing flashes before the first frame */
  transform: scale(0);
  opacity: 0;
  animation: vpss-pulse-grow 1.4s ease-out infinite;
}

/* Negative delay starts the second circle mid-cycle instead of waiting */
#vpss .vpss-pulse-circle:nth-child(2) {
  animation-delay: -0.7s;
}

@keyframes vpss-pulse-grow {
  from {
    transform: scale(0);
    opacity: 0.9;
  }
  to {
    transform: scale(1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  #vpss .vpss-pulse-circle:nth-child(1) {
    transform: scale(0.6);
    opacity: 1;
  }
}
`,_=`#vpss .vpss-shimmer-text {
  display: inline-block;
  max-width: 80vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font:
    500 18px/1.4 system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
  color: var(--vpss-bg-loader, /*BG_LOADER*/);
}

/* Sweep a highlight across dimmed text where supported, solid text otherwise */
@supports (background-clip: text) and
  (color: color-mix(in srgb, red 50%, transparent)) {
  #vpss .vpss-shimmer-text {
    --vpss-shimmer-base: color-mix(
      in srgb,
      var(--vpss-bg-loader, /*BG_LOADER*/) 45%,
      transparent
    );
    color: transparent;
    background: linear-gradient(
      90deg,
      var(--vpss-shimmer-base) 40%,
      var(--vpss-bg-loader, /*BG_LOADER*/) 50%,
      var(--vpss-shimmer-base) 60%
    );
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    animation: vpss-shimmer 1.8s linear infinite;
  }
}

@keyframes vpss-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  #vpss .vpss-shimmer-text {
    background: none;
    color: var(--vpss-bg-loader, /*BG_LOADER*/);
  }
}
`,v=`#vpss .vpss-spinner {
  width: 32px;
  height: 32px;
}

#vpss .vpss-spinner-ring {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(150, 150, 150, 0.35);
  border-top-color: var(--vpss-bg-loader, /*BG_LOADER*/);
  animation: vpss-spin 0.8s linear infinite;
}

@keyframes vpss-spin {
  to {
    transform: rotate(360deg);
  }
}
`,y=`<div class="vpss-loader vpss-bars" aria-hidden="true">
  <div class="vpss-bar"></div>
  <div class="vpss-bar"></div>
  <div class="vpss-bar"></div>
  <div class="vpss-bar"></div>
  <div class="vpss-bar"></div>
</div>
`,b=`<div class="vpss-loader vpss-blocks" aria-hidden="true">
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
  <div class="vpss-block"></div>
</div>
`,x=`<div class="vpss-loader vpss-bounce" aria-hidden="true">
  <div class="vpss-bounce-dot"></div>
  <div class="vpss-bounce-dot"></div>
  <div class="vpss-bounce-dot"></div>
</div>
`,S=`<div class="vpss-loader" aria-hidden="true">
  <div class="vpss-dot"></div>
  <div class="vpss-dot"></div>
  <div class="vpss-dot"></div>
  <div class="vpss-dot"></div>
</div>
`,C=`<div class="vpss-loader" aria-hidden="true">
  <div class="vpss-line"></div>
  <div class="vpss-subline vpss-inc"></div>
  <div class="vpss-subline vpss-dec"></div>
</div>
`,w=`<div class="vpss-loader vpss-orbit" aria-hidden="true">
  <div class="vpss-orbit-track">
    <div class="vpss-orbit-dot"></div>
  </div>
</div>
`,T=`<div class="vpss-loader vpss-pulse" aria-hidden="true">
  <div class="vpss-pulse-circle"></div>
  <div class="vpss-pulse-circle"></div>
</div>
`,E=`<div class="vpss-loader vpss-shimmer" aria-hidden="true">
  <span class="vpss-shimmer-text">__VPSS_LOADER_TEXT__</span>
</div>
`,D=`<div class="vpss-loader vpss-spinner" aria-hidden="true">
  <div class="vpss-spinner-ring"></div>
</div>
`,O=n(),k=Object.assign({"../../src/loaders/bars.css":u,"../../src/loaders/blocks.css":d,"../../src/loaders/bounce.css":f,"../../src/loaders/dots.css":p,"../../src/loaders/line.css":m,"../../src/loaders/orbit.css":h,"../../src/loaders/pulse.css":g,"../../src/loaders/shimmer.css":_,"../../src/loaders/spinner.css":v}),A=Object.assign({"../../src/loaders/bars.html":y,"../../src/loaders/blocks.html":b,"../../src/loaders/bounce.html":x,"../../src/loaders/dots.html":S,"../../src/loaders/line.html":C,"../../src/loaders/orbit.html":w,"../../src/loaders/pulse.html":T,"../../src/loaders/shimmer.html":E,"../../src/loaders/spinner.html":D});function j(e){return(k[`../../src/loaders/${e}.css`]??``).replaceAll(`#vpss`,`[data-loader-preview='${e}']`).replaceAll(`/*BG_LOADER*/`,`#0072f5`)}function M(e){return(A[`../../src/loaders/${e}.html`]??``).replace(`__VPSS_LOADER_TEXT__`,`Loading`)}function N({loader:e}){return(0,O.jsxs)(`div`,{className:`preview`,"data-loader-preview":e,"aria-hidden":`true`,children:[(0,O.jsx)(`style`,{children:j(e)}),(0,O.jsx)(`div`,{dangerouslySetInnerHTML:{__html:M(e)}})]})}var P=`/vite-plugin-splash-screen/`,F={"custom-loader":l};function I(){return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(o,{}),(0,O.jsxs)(`main`,{className:`page`,children:[(0,O.jsxs)(`section`,{className:`hero`,children:[(0,O.jsx)(`h1`,{children:`Splash screens for Vite apps`}),(0,O.jsx)(`p`,{className:`lead`,children:`Show your logo and a loading indicator while your app's JavaScript loads, then fade it out when the app is ready. Works with any framework. Pick an example to see it in action.`}),(0,O.jsx)(`pre`,{className:`install`,children:(0,O.jsx)(`code`,{children:`npm install -D vite-plugin-splash-screen`})})]}),r.map(e=>(0,O.jsxs)(`section`,{className:`group`,children:[(0,O.jsxs)(`header`,{className:`group-header`,children:[(0,O.jsx)(`h2`,{children:e.title}),(0,O.jsx)(`p`,{className:`muted`,children:e.description})]}),(0,O.jsx)(`ul`,{className:`cards`,children:t.filter(t=>t.group===e.id).map(e=>(0,O.jsx)(`li`,{children:(0,O.jsxs)(`a`,{className:`card`,href:P+i(e),children:[e.previewLoader?(0,O.jsx)(N,{loader:e.previewLoader}):F[e.id]?(0,O.jsx)(`div`,{className:`preview`,"aria-hidden":`true`,dangerouslySetInnerHTML:{__html:F[e.id]}}):(0,O.jsx)(`div`,{className:`preview preview-icon`,"aria-hidden":`true`,children:(0,O.jsx)(`img`,{src:`${P}vite.svg`,alt:``,width:40,height:40})}),(0,O.jsxs)(`div`,{className:`card-body`,children:[(0,O.jsx)(`h3`,{children:e.title}),(0,O.jsx)(`p`,{className:`muted`,children:e.description})]}),(0,O.jsxs)(`span`,{className:`card-cta`,children:[`Open example `,(0,O.jsx)(`span`,{"aria-hidden":`true`,children:`→`})]})]})},e.id))})]},e.id))]})]})}(0,c.createRoot)(document.getElementById(`root`)).render((0,O.jsx)(s.StrictMode,{children:(0,O.jsx)(I,{})}));