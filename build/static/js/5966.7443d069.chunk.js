"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[5966],{95966:function(e,n,t){t.r(n);var r=t(74165),s=t(15861),o=t(29439),l=t(78983),i=t(72791),c=t(87309),a=t(42535),u=t(81640),d=t(15696),f=t(13400),m=t(27247),h=t(41286),p=t(19658),x=t(3746),j=t(20165),v=t(80184),y="http://10.3.3.80";n.default=function(){var e=(0,i.useState)(""),n=(0,o.Z)(e,2),t=n[0],Z=n[1],g=(0,i.useState)(""),b=(0,o.Z)(g,2),U=b[0],N=b[1],C=(0,i.useState)(""),S=(0,o.Z)(C,2),_=S[0],k=S[1],T=(0,i.useState)(""),w=(0,o.Z)(T,2),E=w[0],O=w[1],z=(0,i.useState)(""),F=(0,o.Z)(z,2),M=F[0],P=F[1],V=(0,i.useState)(!1),A=(0,o.Z)(V,2),I=A[0],R=A[1],B=JSON.parse(localStorage.getItem("user-info")),D=B.permissions.map((function(e){return{name:e.name}})),J=D.some((function(e){return"Create_User"===e.name})),L=D.some((function(e){return"Update_User"===e.name})),H=D.some((function(e){return"Delete_User"===e.name})),W={position:"fixed",top:"10%",left:"55%",transform:"translateX(-50%)"},X={backgroundColor:"white "},Y={color:"white",backgroundColor:"#0070FF ",padding:"15px",fontFamily:"Arial",textAlign:"center",alignSelf:"flex-end"},q=(0,i.useState)(!1),G=(0,o.Z)(q,2),K=G[0],Q=G[1],$=(0,i.useState)(!1),ee=(0,o.Z)($,2),ne=ee[0],te=ee[1],re=(0,i.useState)(!1),se=(0,o.Z)(re,2),oe=se[0],le=se[1],ie=function(e){!function(e){fetch("".concat(y,"/api/get_user/").concat(e)).then((function(e){return e.json()})).then((function(e){Je(e.User),Z(e.User[0].name),N(e.User[0].email),O(e.User[0].role)})).catch((function(e){return console.log(e)}))}(e),le(e)},ce=(0,i.useState)(!1),ae=(0,o.Z)(ce,2),ue=ae[0],de=ae[1];(0,i.useEffect)((function(){if(ue){var e=setTimeout((function(){de(!1)}),3e3);return function(){return clearTimeout(e)}}}),[ue]);var fe=(0,i.useState)(!1),me=(0,o.Z)(fe,2),he=me[0],pe=me[1];(0,i.useEffect)((function(){if(he){var e=setTimeout((function(){pe(!1)}),3e3);return function(){return clearTimeout(e)}}}),[he]);var xe=(0,i.useState)(!1),je=(0,o.Z)(xe,2),ve=je[0],ye=je[1];(0,i.useEffect)((function(){if(ve){var e=setTimeout((function(){ye(!1)}),3e3);return function(){return clearTimeout(e)}}}),[ve]);var Ze=(0,i.useState)(!1),ge=(0,o.Z)(Ze,2),be=ge[0],Ue=ge[1];(0,i.useEffect)((function(){if(be){var e=setTimeout((function(){Ue(!1)}),3e3);return function(){return clearTimeout(e)}}}),[be]);var Ne=(0,i.useState)(!1),Ce=(0,o.Z)(Ne,2),Se=Ce[0],_e=Ce[1];(0,i.useEffect)((function(){if(Se){var e=setTimeout((function(){_e(!1)}),3e3);return function(){return clearTimeout(e)}}}),[Se]);var ke=(0,i.useState)(!1),Te=(0,o.Z)(ke,2),we=Te[0],Ee=Te[1];(0,i.useEffect)((function(){if(we){var e=setTimeout((function(){Ee(!1)}),3e3);return function(){return clearTimeout(e)}}}),[we]);var Oe=(0,i.useState)([]),ze=(0,o.Z)(Oe,2),Fe=ze[0],Me=ze[1],Pe=(0,i.useState)([]),Ve=(0,o.Z)(Pe,2),Ae=Ve[0],Ie=Ve[1],Re=(0,i.useState)([]),Be=(0,o.Z)(Re,2),De=Be[0],Je=Be[1],Le=(0,i.useState)([]),He=(0,o.Z)(Le,2),We=He[0],Xe=He[1],Ye=[];(0,i.useEffect)((function(){Ke(),fetch("".concat(y,"/api/getroles")).then((function(e){return e.json()})).then((function(e){var n=e.roles.filter((function(e){return 1!==e.id&&3!==e.id}));Ie(n)})).catch((function(e){return console.log(e)})),fetch("".concat(y,"/api/get_teams")).then((function(e){return e.json()})).then((function(e){1===B.Users.role?Ye=e.Teams:3===B.Users.role&&(Ye=e.Teams.filter((function(e){return e.team_company_id===B.Users.company_id}))),Xe(Ye)})).catch((function(e){return console.log(e)}))}),[]);var qe=function(e){O(e)},Ge=function(e){P(e)};function Ke(){fetch("".concat(y,"/api/get_users")).then((function(e){return e.json()})).then((function(e){1===B.Users.role?Ye=e.Users:3===B.Users.role?Ye=e.Users.filter((function(e){return e.company_id===B.Users.company_id})):5!==B.Users.role&&6!==B.Users.role&&7!==B.Users.role||(Ye=e.Users.filter((function(e){return e.id===B.Users.user_id}))),Me(Ye)})).catch((function(e){return console.log(e)}))}function Qe(){return(Qe=(0,s.Z)((0,r.Z)().mark((function e(){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={name:t,email:U,password:_,role:E,company_id:B.Users.company_id,team_id:M},console.log(n),e.next=4,fetch("".concat(y,"/api/add_user"),{method:"POST",body:JSON.stringify(n),headers:{"Content-Type":"application/json"}}).then((function(e){e.ok?(de(!0),Ke()):pe(!0)})).catch((function(e){console.error(e)}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $e(){return($e=(0,s.Z)((0,r.Z)().mark((function e(n){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(y,"/api/delete_user"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:n})}).then((function(e){e.ok?(ye(!0),Ke()):Ue(!0)})).catch((function(e){console.error(e)}));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function en(){return(en=(0,s.Z)((0,r.Z)().mark((function e(n){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(y,"/api/update_user"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:n,name:t,email:U,role:E,company_id:B.Users.company_id,team_id:M})}).then((function(e){e.ok?(_e(!0),Ke()):Ee(!0)})).catch((function(e){console.error(e)}));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)("div",{className:"row",children:[(0,v.jsx)("div",{className:"col-md 6",children:(0,v.jsx)("h3",{children:"Users"})}),(0,v.jsx)("div",{className:"col-md 6",children:J?(0,v.jsx)(c.ZP,{className:"btn btn-primary",style:{float:"right",padding:"2px",width:"120px",backgroundColor:"white",fontWeight:"bold",color:"#0070ff"},onClick:function(){Q(!0)},children:"Add User"}):null})]}),(0,v.jsx)("br",{}),(0,v.jsxs)(l.Sx,{align:"middle",className:"mb-0 border",hover:!0,responsive:!0,style:{marginTop:"20px"},children:[(0,v.jsxs)(l.V,{color:"light",children:[(0,v.jsxs)(l.T6,{children:[(0,v.jsx)(l.is,{className:"text-center",style:Y,children:"Sr/No"}),(0,v.jsx)(l.is,{className:"text-center",style:Y,children:"User Name"}),(0,v.jsx)(l.is,{className:"text-center",style:Y,children:"Email"}),1===B.Users.role?(0,v.jsx)(l.is,{className:"text-center",style:Y,children:"Role"}):null,L||H?(0,v.jsx)(l.is,{className:"text-center",style:Y,children:"Action"}):null]}),Fe.map((function(e,n){return(0,v.jsxs)(l.T6,{children:[(0,v.jsx)(l.is,{className:"text-center",style:X,children:n+1}),(0,v.jsx)(l.is,{className:"text-center",style:X,children:e.name}),(0,v.jsx)(l.is,{className:"text-center",style:X,children:e.email}),1===B.Users.role?(0,v.jsx)(l.is,{className:"text-center",style:X,children:e.role}):null,L||H?(0,v.jsxs)(l.is,{className:"text-center",style:X,children:[L?(0,v.jsx)(f.Z,{"aria-label":"update",onClick:function(){return ie(e.id)},children:(0,v.jsx)(h.Z,{htmlColor:"#28B463"})}):null,H?(0,v.jsx)(f.Z,{"aria-label":"delete",onClick:function(){return n=e.id,void te(n);var n},children:(0,v.jsx)(m.Z,{htmlColor:"#FF0000"})}):null]}):null]},e.id)}))]}),(0,v.jsxs)(l.NR,{children:[(0,v.jsxs)(a.Z,{title:"Add a User",open:K,okButtonProps:{style:{background:"blue"}},onOk:function(){!function(){Qe.apply(this,arguments)}(),Q(!1),Z(""),N(""),k(""),O(""),P("")},onCancel:function(){Q(!1),Z(""),N(""),k(""),O(""),P("")},maskClosable:!1,children:[(0,v.jsx)("br",{}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Username"}),(0,v.jsx)("input",{type:"text",value:t,onChange:function(e){return Z(e.target.value)},className:"form-control form-control-lg",placeholder:"Enter User Name"})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Email"}),(0,v.jsx)("input",{type:"email",value:U,onChange:function(e){return N(e.target.value)},className:"form-control form-control-lg",placeholder:"Enter Email"})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Password"}),(0,v.jsxs)("div",{className:"position-relative",children:[(0,v.jsx)("input",{type:I?"text":"password",value:_,onChange:function(e){k(e.target.value)},className:"form-control form-control-lg",placeholder:"Enter Password"}),(0,v.jsx)(f.Z,{onClick:function(){R(!I)},edge:"end",className:"visibility-icon",style:{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)"},children:I?(0,v.jsx)(j.Z,{}):(0,v.jsx)(x.Z,{})})]})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Role"}),(0,v.jsx)(u.Z.Item,{children:(0,v.jsx)(d.Z,{placeholder:"Select Role Id",onChange:qe,value:E,children:Ae.map((function(e){return(0,v.jsx)(d.Z.Option,{value:e.id,children:e.name},e.id)}))})})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Team"}),(0,v.jsx)(u.Z.Item,{children:(0,v.jsx)(d.Z,{placeholder:"Select Team",onChange:Ge,value:M,children:We.map((function(e){return(0,v.jsx)(d.Z.Option,{value:e.id,children:e.team_name},e.id)}))})})]})]}),(0,v.jsxs)(a.Z,{title:"Update a User",open:oe,onOk:function(){!function(e){en.apply(this,arguments)}(oe),le(!1),Z(""),N(""),k(""),O(""),P("")},okButtonProps:{style:{background:"blue"}},onCancel:function(){le(!1),Z(""),N(""),k(""),O(""),P("")},maskClosable:!1,children:[(0,v.jsx)("br",{}),De.map((function(e){return(0,v.jsxs)("div",{children:[(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Username"}),(0,v.jsx)("input",{type:"text",defaultValue:e.name,onChange:function(e){return Z(e.target.value)},className:"form-control form-control-lg",placeholder:"Enter User Name"})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Role"}),(0,v.jsx)(u.Z.Item,{children:(0,v.jsx)(d.Z,{placeholder:"Select Role",onChange:qe,defaultValue:e.role,children:Ae.map((function(e){return(0,v.jsx)(d.Z.Option,{value:e.id,children:e.name},e.id)}))})})]}),(0,v.jsxs)("div",{className:"form-outline mb-3",children:[(0,v.jsx)("label",{children:"Team"}),(0,v.jsx)(u.Z.Item,{children:(0,v.jsx)(d.Z,{placeholder:"Select Team",onChange:Ge,defaultValue:e.team_id,children:We.map((function(e){return(0,v.jsx)(d.Z.Option,{value:e.id,children:e.team_name},e.id)}))})})]})]},e.id)}))]}),(0,v.jsx)(a.Z,{title:"Are you sure you want to delete?",open:ne,onOk:function(){!function(e){$e.apply(this,arguments)}(ne),te(!1)},okButtonProps:{style:{background:"blue"}},onCancel:function(){te(!1)},style:{position:"fixed",top:"25%",left:"40%"}}),ue&&(0,v.jsx)(p.Z,{onClose:function(){de(!1)},severity:"success",style:W,children:"User Added Successfully"}),he&&(0,v.jsx)(p.Z,{onClose:function(){pe(!1)},severity:"error",style:W,children:"Failed to Add User"}),ve&&(0,v.jsx)(p.Z,{onClose:function(){ye(!1)},severity:"success",style:W,children:"User Deleted Successfully"}),be&&(0,v.jsx)(p.Z,{onClose:function(){Ue(!1)},severity:"error",style:W,children:"Failed to Delete User"}),Se&&(0,v.jsx)(p.Z,{onClose:function(){_e(!1)},severity:"success",style:W,children:"User Updated Successfully"}),we&&(0,v.jsx)(p.Z,{onClose:function(){Ee(!1)},severity:"error",style:W,children:"Failed to Update User"})]})]})]})}},27247:function(e,n,t){var r=t(64836);n.Z=void 0;var s=r(t(45649)),o=t(80184),l=(0,s.default)((0,o.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}),"Delete");n.Z=l},41286:function(e,n,t){var r=t(64836);n.Z=void 0;var s=r(t(45649)),o=t(80184),l=(0,s.default)((0,o.jsx)("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"}),"Edit");n.Z=l},3746:function(e,n,t){var r=t(64836);n.Z=void 0;var s=r(t(45649)),o=t(80184),l=(0,s.default)((0,o.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"}),"Visibility");n.Z=l},20165:function(e,n,t){var r=t(64836);n.Z=void 0;var s=r(t(45649)),o=t(80184),l=(0,s.default)((0,o.jsx)("path",{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"}),"VisibilityOff");n.Z=l}}]);
//# sourceMappingURL=5966.7443d069.chunk.js.map