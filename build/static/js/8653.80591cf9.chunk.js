"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[8653],{98653:function(e,s,r){r.r(s);var t=r(29439),n=r(78983),c=r(72791),l=r(80184);s.default=function(){var e=JSON.parse(localStorage.getItem("user-info")),s={color:"white",backgroundColor:"#0070FF ",padding:"15px",fontFamily:"Arial",textAlign:"center",alignSelf:"flex-end"},r={backgroundColor:"white "},i=(0,c.useState)([]),a=(0,t.Z)(i,2),o=a[0],d=a[1],u=[];return(0,c.useEffect)((function(){fetch("http://10.3.3.80/api/get_assign_projects").then((function(e){return e.json()})).then((function(s){1===e.Users.role?u=s.Project_Assigns:3===e.Users.role?u=s.Project_Assigns.filter((function(s){return s.company_id===e.Users.company_id})):5!==e.Users.role&&6!==e.Users.role&&7!==e.Users.role||(u=s.Project_Assigns.filter((function(s){return s.assign_projects_user_id===e.Users.user_id}))),d(u)})).catch((function(e){return console.log(e)}))}),[]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{className:"row",children:(0,l.jsx)("div",{className:"col-md 6",children:(0,l.jsx)("h3",{children:"Assigned Project"})})}),(0,l.jsx)("br",{}),(0,l.jsxs)(n.Sx,{align:"middle",className:"mb-0 border",hover:!0,responsive:!0,style:{marginTop:"20px"},children:[(0,l.jsxs)(n.V,{color:"light",children:[(0,l.jsxs)(n.T6,{children:[(0,l.jsx)(n.is,{className:"text-center",style:s,children:"Sr/No"}),(0,l.jsx)(n.is,{className:"text-center",style:s,children:"Project Name"}),1===e.Users.role||3===e.Users.role?(0,l.jsx)(n.is,{className:"text-center",style:s,children:"Users"}):null,(0,l.jsx)(n.is,{className:"text-center",style:s,children:"Stream Name"})]}),o.map((function(s,t){return(0,l.jsxs)(n.T6,{children:[(0,l.jsx)(n.is,{className:"text-center",style:r,children:t+1}),(0,l.jsx)(n.is,{className:"text-center",style:r,children:s.project_name}),1===e.Users.role|3===e.Users.role?(0,l.jsx)(n.is,{className:"text-center",style:r,children:s.name}):null,(0,l.jsx)(n.is,{className:"text-center",style:r,children:s.stream_name})]},s.id)}))]}),(0,l.jsx)(n.NR,{})]})]})}}}]);
//# sourceMappingURL=8653.80591cf9.chunk.js.map