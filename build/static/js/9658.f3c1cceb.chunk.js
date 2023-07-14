"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[9658],{19658:function(e,o,t){t.d(o,{Z:function(){return R}});var a=t(4942),n=t(63366),r=t(87462),i=t(72791),l=t(28182),s=t(94419),c=t(12065),v=t(66934),d=t(31402),u=t(14036),p=t(35527),f=t(75878),m=t(21217);function h(e){return(0,m.Z)("MuiAlert",e)}var g=(0,f.Z)("MuiAlert",["root","action","icon","message","filled","filledSuccess","filledInfo","filledWarning","filledError","outlined","outlinedSuccess","outlinedInfo","outlinedWarning","outlinedError","standard","standardSuccess","standardInfo","standardWarning","standardError"]),Z=t(13400),x=t(74223),C=t(80184),M=(0,x.Z)((0,C.jsx)("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),A=(0,x.Z)((0,C.jsx)("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),S=(0,x.Z)((0,C.jsx)("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),w=(0,x.Z)((0,C.jsx)("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),b=(0,x.Z)((0,C.jsx)("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close"),j=["action","children","className","closeText","color","components","componentsProps","icon","iconMapping","onClose","role","severity","slotProps","slots","variant"],y=(0,v.ZP)(p.Z,{name:"MuiAlert",slot:"Root",overridesResolver:function(e,o){var t=e.ownerState;return[o.root,o[t.variant],o["".concat(t.variant).concat((0,u.Z)(t.color||t.severity))]]}})((function(e){var o=e.theme,t=e.ownerState,n="light"===o.palette.mode?c._j:c.$n,i="light"===o.palette.mode?c.$n:c._j,l=t.color||t.severity;return(0,r.Z)({},o.typography.body2,{backgroundColor:"transparent",display:"flex",padding:"6px 16px"},l&&"standard"===t.variant&&(0,a.Z)({color:o.vars?o.vars.palette.Alert["".concat(l,"Color")]:n(o.palette[l].light,.6),backgroundColor:o.vars?o.vars.palette.Alert["".concat(l,"StandardBg")]:i(o.palette[l].light,.9)},"& .".concat(g.icon),o.vars?{color:o.vars.palette.Alert["".concat(l,"IconColor")]}:{color:o.palette[l].main}),l&&"outlined"===t.variant&&(0,a.Z)({color:o.vars?o.vars.palette.Alert["".concat(l,"Color")]:n(o.palette[l].light,.6),border:"1px solid ".concat((o.vars||o).palette[l].light)},"& .".concat(g.icon),o.vars?{color:o.vars.palette.Alert["".concat(l,"IconColor")]}:{color:o.palette[l].main}),l&&"filled"===t.variant&&(0,r.Z)({fontWeight:o.typography.fontWeightMedium},o.vars?{color:o.vars.palette.Alert["".concat(l,"FilledColor")],backgroundColor:o.vars.palette.Alert["".concat(l,"FilledBg")]}:{backgroundColor:"dark"===o.palette.mode?o.palette[l].dark:o.palette[l].main,color:o.palette.getContrastText(o.palette[l].main)}))})),k=(0,v.ZP)("div",{name:"MuiAlert",slot:"Icon",overridesResolver:function(e,o){return o.icon}})({marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9}),z=(0,v.ZP)("div",{name:"MuiAlert",slot:"Message",overridesResolver:function(e,o){return o.message}})({padding:"8px 0",minWidth:0,overflow:"auto"}),I=(0,v.ZP)("div",{name:"MuiAlert",slot:"Action",overridesResolver:function(e,o){return o.action}})({display:"flex",alignItems:"flex-start",padding:"4px 0 0 16px",marginLeft:"auto",marginRight:-8}),P={success:(0,C.jsx)(M,{fontSize:"inherit"}),warning:(0,C.jsx)(A,{fontSize:"inherit"}),error:(0,C.jsx)(S,{fontSize:"inherit"}),info:(0,C.jsx)(w,{fontSize:"inherit"})},R=i.forwardRef((function(e,o){var t,a,i,c,v,p,f=(0,d.Z)({props:e,name:"MuiAlert"}),m=f.action,g=f.children,x=f.className,M=f.closeText,A=void 0===M?"Close":M,S=f.color,w=f.components,R=void 0===w?{}:w,_=f.componentsProps,L=void 0===_?{}:_,N=f.icon,q=f.iconMapping,B=void 0===q?P:q,W=f.onClose,F=f.role,H=void 0===F?"alert":F,E=f.severity,O=void 0===E?"success":E,T=f.slotProps,V=void 0===T?{}:T,$=f.slots,D=void 0===$?{}:$,G=f.variant,J=void 0===G?"standard":G,K=(0,n.Z)(f,j),Q=(0,r.Z)({},f,{color:S,severity:O,variant:J}),U=function(e){var o=e.variant,t=e.color,a=e.severity,n=e.classes,r={root:["root","".concat(o).concat((0,u.Z)(t||a)),"".concat(o)],icon:["icon"],message:["message"],action:["action"]};return(0,s.Z)(r,h,n)}(Q),X=null!=(t=null!=(a=D.closeButton)?a:R.CloseButton)?t:Z.Z,Y=null!=(i=null!=(c=D.closeIcon)?c:R.CloseIcon)?i:b,ee=null!=(v=V.closeButton)?v:L.closeButton,oe=null!=(p=V.closeIcon)?p:L.closeIcon;return(0,C.jsxs)(y,(0,r.Z)({role:H,elevation:0,ownerState:Q,className:(0,l.Z)(U.root,x),ref:o},K,{children:[!1!==N?(0,C.jsx)(k,{ownerState:Q,className:U.icon,children:N||B[O]||P[O]}):null,(0,C.jsx)(z,{ownerState:Q,className:U.message,children:g}),null!=m?(0,C.jsx)(I,{ownerState:Q,className:U.action,children:m}):null,null==m&&W?(0,C.jsx)(I,{ownerState:Q,className:U.action,children:(0,C.jsx)(X,(0,r.Z)({size:"small","aria-label":A,title:A,color:"inherit",onClick:W},ee,{children:(0,C.jsx)(Y,(0,r.Z)({fontSize:"small"},oe))}))}):null]}))}))},35527:function(e,o,t){t.d(o,{Z:function(){return Z}});var a=t(63366),n=t(87462),r=t(72791),i=t(28182),l=t(94419),s=t(12065),c=t(66934),v=function(e){return((e<1?5.11916*Math.pow(e,2):4.5*Math.log(e+1)+2)/100).toFixed(2)},d=t(31402),u=t(75878),p=t(21217);function f(e){return(0,p.Z)("MuiPaper",e)}(0,u.Z)("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);var m=t(80184),h=["className","component","elevation","square","variant"],g=(0,c.ZP)("div",{name:"MuiPaper",slot:"Root",overridesResolver:function(e,o){var t=e.ownerState;return[o.root,o[t.variant],!t.square&&o.rounded,"elevation"===t.variant&&o["elevation".concat(t.elevation)]]}})((function(e){var o,t=e.theme,a=e.ownerState;return(0,n.Z)({backgroundColor:(t.vars||t).palette.background.paper,color:(t.vars||t).palette.text.primary,transition:t.transitions.create("box-shadow")},!a.square&&{borderRadius:t.shape.borderRadius},"outlined"===a.variant&&{border:"1px solid ".concat((t.vars||t).palette.divider)},"elevation"===a.variant&&(0,n.Z)({boxShadow:(t.vars||t).shadows[a.elevation]},!t.vars&&"dark"===t.palette.mode&&{backgroundImage:"linear-gradient(".concat((0,s.Fq)("#fff",v(a.elevation)),", ").concat((0,s.Fq)("#fff",v(a.elevation)),")")},t.vars&&{backgroundImage:null==(o=t.vars.overlays)?void 0:o[a.elevation]}))})),Z=r.forwardRef((function(e,o){var t=(0,d.Z)({props:e,name:"MuiPaper"}),r=t.className,s=t.component,c=void 0===s?"div":s,v=t.elevation,u=void 0===v?1:v,p=t.square,Z=void 0!==p&&p,x=t.variant,C=void 0===x?"elevation":x,M=(0,a.Z)(t,h),A=(0,n.Z)({},t,{component:c,elevation:u,square:Z,variant:C}),S=function(e){var o=e.square,t=e.elevation,a=e.variant,n=e.classes,r={root:["root",a,!o&&"rounded","elevation"===a&&"elevation".concat(t)]};return(0,l.Z)(r,f,n)}(A);return(0,m.jsx)(g,(0,n.Z)({as:c,ownerState:A,className:(0,i.Z)(S.root,r),ref:o},M))}))}}]);
//# sourceMappingURL=9658.f3c1cceb.chunk.js.map