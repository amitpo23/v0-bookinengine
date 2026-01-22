module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},442315,(e,t,r)=>{"use strict";t.exports=e.r(918622)},347540,(e,t,r)=>{"use strict";t.exports=e.r(442315).vendored["react-rsc"].React},484199,(e,t,r)=>{"use strict";var n=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,s=Object.prototype.hasOwnProperty,i={},l={VercelOidcTokenError:()=>d};for(var u in l)n(i,u,{get:l[u],enumerable:!0});t.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let r of o(t))s.call(e,r)||void 0===r||n(e,r,{get:()=>t[r],enumerable:!(i=a(t,r))||i.enumerable});return e})(n({},"__esModule",{value:!0}),i);class d extends Error{constructor(e,t){super(e),this.name="VercelOidcTokenError",this.cause=t}toString(){return this.cause?`${this.name}: ${this.message}: ${this.cause}`:`${this.name}: ${this.message}`}}},657583,e=>{"use strict";var t=e.i(747909),r=e.i(174017),n=e.i(996250),a=e.i(759756),o=e.i(561916),s=e.i(114444),i=e.i(837092),l=e.i(869741),u=e.i(316795),d=e.i(487718),c=e.i(995169),p=e.i(47587),h=e.i(666012),v=e.i(570101),g=e.i(626937),f=e.i(10372),m=e.i(193695);e.i(52474);var R=e.i(257297),x=e.i(712075);let w=`You are a senior conversation and revenue optimization reviewer for a hotel booking AI agent.

I will give you a full transcript of a conversation between:
- AI Agent (the bot)
- Guest (the end-customer)

Your job:
1. Diagnose the conversation quality:
   - Did the agent ask all critical questions (dates, occupancy, budget, preferences)?
   - Did it over-ask or under-ask questions?
   - Did it propose good options (balanced between price, quality, flexibility)?
   - Did it handle objections and doubts clearly?
   - Did it correctly use the information given by the guest?

2. Identify PROBLEMS:
   - Missing clarifying questions.
   - Wrong assumptions or hallucinations.
   - Confusing explanations or too-long messages.
   - Missed opportunities to:
     - Offer a better option.
     - Offer higher-value upsell (better room/board) without being pushy.
     - Propose alternative dates or areas when prices are high.

3. Suggest IMPROVED RESPONSES:
   - For the 3–5 most important points in the conversation, rewrite what the agent *should* have answered.
   - Keep the style aligned with the brand: professional, concise, warm.

4. Propose PROMPT & RULE CHANGES:
   - One section for new rules (in bullet points).
   - One section for modifications of existing behavior.
   - These should be copy-pasteable into the system prompt.

5. Optional: Revenue/Conversion Insights:
   - Was the flow optimized for conversion?
   - Where might the guest drop off?
   - One or two concrete suggestions to improve conversion and guest satisfaction.

Return the result in this structure (in Hebrew):

## סיכום (3-5 נקודות עיקריות)

## בעיות שנמצאו

## תשובות משופרות (לפני/אחרי)

## עדכונים ל-Prompt / כללים

## הצעות להמרה והכנסות
`;async function y(e){try{let{conversation:t}=await e.json();if(!t||0===t.trim().length)return Response.json({error:"No conversation provided"},{status:400});let{text:r}=await (0,x.generateText)({model:"anthropic/claude-sonnet-4-20250514",system:w,prompt:`נתח את השיחה הבאה:

${t}`,temperature:.3});return Response.json({success:!0,analysis:r})}catch(e){return console.error("[v0] Analyze conversation error:",e),Response.json({error:"Failed to analyze conversation",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}e.s(["POST",()=>y],486626);var b=e.i(486626);let E=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/ai/analyze-conversation/route",pathname:"/api/ai/analyze-conversation",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/ai/analyze-conversation/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:O,workUnitAsyncStorage:C,serverHooks:P}=E;function A(){return(0,n.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:C})}async function T(e,t,n){E.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let x="/api/ai/analyze-conversation/route";x=x.replace(/\/index$/,"")||"/";let w=await E.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:y,params:b,nextConfig:O,parsedUrl:C,isDraftMode:P,prerenderManifest:A,routerServerContext:T,isOnDemandRevalidate:j,revalidateOnlyGenerated:k,resolvedPathname:S,clientReferenceManifest:_,serverActionsManifest:N}=w,q=(0,l.normalizeAppPath)(x),M=!!(A.dynamicRoutes[q]||A.routes[S]),D=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,C,!1):t.end("This page could not be found"),null);if(M&&!P){let e=!!A.routes[S],t=A.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(O.experimental.adapterPath)return await D();throw new m.NoFallbackError}}let I=null;!M||E.isDev||P||(I="/index"===(I=S)?"/":I);let H=!0===E.isDev||!M,U=M&&!H;N&&_&&(0,s.setReferenceManifestsSingleton)({page:x,clientReferenceManifest:_,serverActionsManifest:N,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:N})});let $=e.method||"GET",F=(0,o.getTracer)(),z=F.getActiveScopeSpan(),K={params:b,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:O.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>E.onRequestError(e,t,n,T)},sharedContext:{buildId:y}},L=new u.NodeNextRequest(e),B=new u.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(L,(0,d.signalFromNodeResponse)(t));try{let s=async e=>E.handle(V,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${$} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${$} ${x}`)}),i=!!(0,a.getRequestMeta)(e,"minimalMode"),l=async a=>{var o,l;let u=async({previousCacheEntry:r})=>{try{if(!i&&j&&k&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(a);e.fetchMetrics=K.renderOpts.fetchMetrics;let l=K.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let u=K.renderOpts.collectedTags;if(!M)return await (0,h.sendResponse)(L,B,o,K.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,v.toNodeOutgoingHttpHeaders)(o.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:j})},T),t}},d=await E.handleResponse({req:e,nextConfig:O,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:j,revalidateOnlyGenerated:k,responseGenerator:u,waitUntil:n.waitUntil,isMinimalMode:i});if(!M)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",j?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),P&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,v.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&M||c.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,g.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(L,B,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};z?await l(z):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${$} ${x}`,kind:o.SpanKind.SERVER,attributes:{"http.method":$,"http.target":e.url}},l))}catch(t){if(t instanceof m.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:j})}),M)throw t;return await (0,h.sendResponse)(L,B,new Response(null,{status:500})),null}}e.s(["handler",()=>T,"patchFetch",()=>A,"routeModule",()=>E,"serverHooks",()=>P,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>C],657583)},967030,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0983279f._.js"].map(t=>e.l(t))).then(()=>t(783697)))},683671,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0ea05e0c._.js"].map(t=>e.l(t))).then(()=>t(390391)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bccc1156._.js.map