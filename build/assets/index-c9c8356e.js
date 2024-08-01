import{j as e,Q as r,S as f,a5 as k,U as o,ad as g,a4 as P,a1 as B,ar as G,r as l,am as q,as as O,M as Q}from"./index-a00bc156.js";import{b as Y,aP as I,ak as J,al as K,B as L,an as X,aL as Z}from"./index-1819f1e5.js";import{S as ee}from"./Skeleton-4bfb686b.js";const _=/^https:\/\/\S+\.(png|jpe?g|svg)$/;function ae(s){return!!_.test(s)}const te=s=>e.jsxs("svg",{width:"1em",height:"1em",viewBox:"4 3 14 14",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M10 4.7002H6.1C5.21634 4.7002 4.5 5.41654 4.5 6.3002V13.9002C4.5 14.7838 5.21634 15.5002 6.1 15.5002H13.7C14.5837 15.5002 15.3 14.7839 15.3 13.9002V10.5002",stroke:"#909BAA","stroke-linecap":"round"}),e.jsx("path",{d:"M16 4L9 11",stroke:"#909BAA","stroke-width":"1.5","stroke-linecap":"round"})]}),ne=()=>{const{open:s}=g("changeNodeType"),{close:u}=g("editNodeName"),{changeNodeTypeFeatureFlag:c}=P(x=>({changeNodeTypeFeatureFlag:x.changeNodeTypeFeatureFlag})),t=B(),h=t==null?void 0:t.node_type,d=()=>{u(),s()};return e.jsxs(o,{children:[e.jsx(o,{align:"center",direction:"row",justify:"space-between",mb:18,children:e.jsxs(o,{align:"center",direction:"row",children:[e.jsx(oe,{children:"Edit Node"}),e.jsxs(se,{children:[e.jsx(Y,{type:h}),c&&e.jsx(re,{onClick:d,children:e.jsx(te,{})})]})]})}),e.jsxs(o,{mb:18,children:[e.jsx(T,{style:{marginBottom:8},children:"Node Name"}),e.jsx(I,{id:"cy-topic",maxLength:50,name:"name",placeholder:"Node name",rules:{...G}})]}),e.jsxs(o,{mb:36,children:[e.jsx(T,{style:{marginBottom:8},children:"Image Url"}),e.jsx(I,{id:"cy-image_url",maxLength:500,name:"image_url",placeholder:"Image url",rules:{pattern:{message:"Please enter a valid URL",value:_}}})]})]})},oe=r(k)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,T=r(k)`
  color: ${f.GRAY6};
  font-family: 'Barlow';
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`,se=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 5px 0 0 40px;
`,re=r(o)`
  align-items: center;
  cursor: pointer;
`,ie=()=>{var b,C,S;const{close:s}=g("editNodeName"),u=J({mode:"onChange"}),{watch:c,setValue:t,reset:h,getValues:d}=u,[x,N]=l.useState(!1),[j,w]=l.useState(!1),[n,E]=l.useState(),a=B(),{open:F}=g("removeNode");l.useEffect(()=>(n?t("name",n==null?void 0:n.name):a&&(t("name",a.name),t("image_url",(a==null?void 0:a.image_url)??"")),()=>{h()}),[n,t,h,a]),l.useEffect(()=>{(async()=>{if(!(!a||a.type!=="topic")){w(!0);try{const{data:i}=await q({search:a==null?void 0:a.name}),p=i.find(H=>H.name===a.name);E(p)}catch(i){console.log(i)}finally{w(!1)}}})()},[a]);const D=c("imageInputType"),R=c("name"),y=c("image_url");l.useEffect(()=>{t("imageInputType",ae(y))},[y,t]);const M=()=>{s()},m=n||a,A=async()=>{N(!0);const i={["name"]:R.trim(),image_url:y.trim()};try{await O((m==null?void 0:m.ref_id)||"",{node_data:i});const{updateNode:p}=Q.getState();p({...m,...i}),M()}catch(p){console.warn(p)}finally{N(!1)}},U=async()=>{F()},v=(C=(b=d())==null?void 0:b.name)==null?void 0:C.trim(),V=v&&(n==null?void 0:n.name.trim())!==v,z=d().image_url&&(a==null?void 0:a.image_url)!==((S=d())==null?void 0:S.image_url),W=x||j||!!y&&!D||!V&&!z;return e.jsx(le,{children:e.jsxs(K,{...u,children:[j?e.jsx(o,{my:24,children:e.jsx(ee,{})}):e.jsx(ne,{}),e.jsxs(o,{direction:"row",mb:6,children:[e.jsx(ce,{color:"secondary",disabled:j||!m,onClick:U,size:"large",style:{marginRight:20},variant:"contained",children:"Delete"}),e.jsxs(L,{color:"secondary",disabled:W,onClick:A,size:"large",style:{flex:1},variant:"contained",children:["Save Changes",x&&e.jsx(de,{children:e.jsx(X,{color:f.lightGray,size:12})})]})]})]})})},le=r(o)`
  padding: 20px;
`,ce=r(L)`
  && {
    color: ${f.primaryRed};
    background-color: rgba(237, 116, 116, 0.1);

    &:hover,
    &:active,
    &:focus {
      color: ${f.primaryRed};
      background-color: rgba(237, 116, 116, 0.2);
    }
  }
`,de=r.span`
  margin-top: 3px;
`,ue=()=>{const{close:s}=g("editNodeName");return e.jsx(Z,{id:"editNodeName",kind:"large",onClose:s,preventOutsideClose:!0,children:e.jsx(ie,{})})};export{ue as EditNodeNameModal};