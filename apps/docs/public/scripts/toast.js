const t=new class{constructor(){this.subscribers=new Set,this.toasts=[],this.timeouts=new Map,this.subscribe=t=>(this.subscribers.add(t),t(this.toasts),()=>this.subscribers.delete(t)),this.notify=()=>{this.subscribers.forEach(t=>t(this.toasts))},this.addToast=t=>{if(!t.content)throw new Error("Toast content is required");const e={...t,id:t.id??crypto.randomUUID(),duration:t.duration??5e3};if(this.toasts=[...this.toasts,e],this.notify(),e.duration!==1/0){const t=window.setTimeout(()=>{this.removeToast(e.id)},e.duration);this.timeouts.set(e.id,t)}return e.id},this.removeToast=(t,e)=>{const s=this.timeouts.get(t);s&&(clearTimeout(s),this.timeouts.delete(t)),this.toasts=this.toasts.filter(s=>(s.id===t&&(e?.manuallyDismiised?s.onDismiss?.(s):s.onAutoClose?.(s)),s.id!==t)),this.notify()},this.dismissAll=()=>{this.timeouts.forEach(t=>clearTimeout(t)),this.timeouts.clear(),this.toasts=[],this.notify()},this.handleEvent=t=>{console.log(t),console.log(t instanceof CustomEvent),this.addToast(t.detail)}}},e={add:e=>t.addToast(e),remove(e){t.removeToast(e)},dismissAll(){t.dismissAll()},success:e=>t.addToast({...e,type:"success"})};class s extends CustomEvent{constructor(t){super(s.eventName,{detail:t,bubbles:!0,composed:!0,cancelable:!0})}}function i(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}s.eventName="red-toast",window.ToastEvent=s,window.toaster=e,window.ToastEvent||(window.ToastEvent=s),window.toaster||(window.toaster=e),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=globalThis,r=o.ShadowRoot&&(void 0===o.ShadyCSS||o.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;let h=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&a.set(e,t))}return t}toString(){return this.cssText}};const l=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new h(s,t,n)},c=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new h("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:d,defineProperty:p,getOwnPropertyDescriptor:u,getOwnPropertyNames:f,getOwnPropertySymbols:m,getPrototypeOf:$}=Object,g=globalThis,y=g.trustedTypes,b=y?y.emptyScript:"",_=g.reactiveElementPolyfillSupport,v=(t,e)=>t,A={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},w=(t,e)=>!d(t,e),E={attribute:!0,type:String,converter:A,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=E){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&p(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=u(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??E}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=$(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...f(t),...m(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(r)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of e){const e=document.createElement("style"),i=o.litNonce;void 0!==i&&e.setAttribute("nonce",i),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:A).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:A;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??w)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,_?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S=globalThis,C=t=>t,P=S.trustedTypes,T=P?P.createPolicy("lit-html",{createHTML:t=>t}):void 0,O="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+U,N=`<${k}>`,M=document,H=()=>M.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,j=Array.isArray,D="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,I=/>/g,B=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,q=/"/g,V=/^(?:script|style|textarea|title)$/i,J=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),X=new WeakMap,Z=M.createTreeWalker(M,129);function G(t,e){if(!j(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(e):e}const Q=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=L;for(let e=0;e<s;e++){const s=t[e];let a,h,l=-1,c=0;for(;c<s.length&&(n.lastIndex=c,h=n.exec(s),null!==h);)c=n.lastIndex,n===L?"!--"===h[1]?n=z:void 0!==h[1]?n=I:void 0!==h[2]?(V.test(h[2])&&(o=RegExp("</"+h[2],"g")),n=B):void 0!==h[3]&&(n=B):n===B?">"===h[0]?(n=o??L,l=-1):void 0===h[1]?l=-2:(l=n.lastIndex-h[2].length,a=h[1],n=void 0===h[3]?B:'"'===h[3]?q:W):n===q||n===W?n=B:n===z||n===I?n=L:(n=B,o=void 0);const d=n===B&&t[e+1].startsWith("/>")?" ":"";r+=n===L?s+N:l>=0?(i.push(a),s.slice(0,l)+O+s.slice(l)+U+d):s+U+(-2===l?e:d)}return[G(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[h,l]=Q(t,e);if(this.el=Y.createElement(h,s),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Z.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(O)){const e=l[r++],s=i.getAttribute(t).split(U),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?ot:"?"===n[1]?rt:"@"===n[1]?nt:it}),i.removeAttribute(t)}else t.startsWith(U)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(V.test(i.tagName)){const t=i.textContent.split(U),e=t.length-1;if(e>0){i.textContent=P?P.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],H()),Z.nextNode(),a.push({type:2,index:++o});i.append(t[e],H())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(U,t+1));)a.push({type:7,index:o}),t+=U.length-1}o++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function tt(t,e,s=t,i){if(e===F)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=R(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=tt(t,o._$AS(t,e.values),o,i)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);Z.currentNode=i;let o=Z.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new st(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new at(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=Z.nextNode(),r++)}return Z.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class st{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),R(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>j(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new et(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=X.get(t.strings);return void 0===e&&X.set(t.strings,e=new Y(t)),e}k(t){j(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new st(this.O(H()),this.O(H()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=K}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=tt(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=tt(this,i[s+n],e,n),a===F&&(a=this._$AH[n]),r||=!R(a)||a!==this._$AH[n],a===K?t=K:t!==K&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class nt extends it{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??K)===F)return;const s=this._$AH,i=t===K&&s!==K||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==K&&(s===K||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ht=S.litHtmlPolyfillSupport;ht?.(Y,st),(S.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ct=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new st(e.insertBefore(H(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:A,reflect:!1,hasChanged:w},ft=(t=ut,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return(e,s)=>"object"==typeof s?ft(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $t(t){return mt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=2;class yt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class bt extends yt{constructor(t){if(super(t),this.it=K,t.type!==gt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===K||null==t)return this._t=void 0,this.it=t;if(t===F)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}bt.directiveName="unsafeHTML",bt.resultType=1;const _t=(t=>(...e)=>({_$litDirective$:t,values:e}))(bt),vt=l`
  :host {
    /* defaults */
    --offset-top: 20px;
    --offset-bottom: 20px;
    --offset-left: 20px;
    --offset-right: 20px;
    --mobile-offset-top: 16px;
    --mobile-offset-bottom: 16px;
    --mobile-offset-left: 16px;
    --mobile-offset-right: 16px;

    position: fixed;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;
    z-index: 999999999;
    transition: transform 400ms ease;

    display: flex;
    gap: 0.75rem;
  }

  /* positionings */
  :host([data-y-position="top"]) {
    top: var(--offset-top);
    flex-direction: column;
  }

  :host([data-y-position="bottom"]) {
    bottom: var(--offset-bottom);
    flex-direction: column-reverse;
  }

  :host([data-x-position="right"]) {
    right: var(--offset-right);
  }

  :host([data-x-position="left"]) {
    left: var(--offset-left);
  }

  :host([data-x-position="center"]) {
    left: 50%;
    transform: translateX(-50%);
  }

  :host([data-x-position="center"]) {
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 600px) {
    :host {
      width: 100%;
    }

    :host([data-x-position="left"]) {
      left: var(--mobile-offset-left);
    }

    :host([data-x-position="right"]) {
      right: var(--mobile-offset-right);
    }

    :host([data-y-position="bottom"]) {
      bottom: var(--mobile-offset-bottom);
    }

    :host([data-y-position="top"]) {
      top: var(--mobile-offset-top);
    }

    :host([data-x-position="center"]) {
      left: var(--mobile-offset-left);
      right: var(--mobile-offset-right);
      transform: none;
    }
  }
`,At=l`
  /* colors */
  :host([data-red-theme="light"]) {
    --normal-bg: #fff;
    --normal-border: hsl(0, 0%, 93%);
    --normal-text: hsl(0, 0%, 43.5%);

    --success-bg: hsl(143, 85%, 96%);
    --success-border: hsl(145, 92%, 87%);
    --success-text: hsl(140, 100%, 27%);

    --info-bg: hsl(208, 100%, 97%);
    --info-border: hsl(221, 91%, 93%);
    --info-text: hsl(210, 92%, 45%);

    --warning-bg: hsl(49, 100%, 97%);
    --warning-border: hsl(49, 91%, 84%);
    --warning-text: hsl(31, 92%, 45%);

    --error-bg: hsl(359, 100%, 97%);
    --error-border: hsl(359, 100%, 94%);
    --error-text: hsl(360, 100%, 45%);
  }

  :host([data-red-theme="dark"]) {
    --normal-bg: #000;
    --normal-bg-hover: hsl(0, 0%, 12%);
    --normal-border: hsl(0, 0%, 20%);
    --normal-border-hover: hsl(0, 0%, 25%);
    --normal-text: hsl(0, 0%, 99%);

    --success-bg: hsl(150, 100%, 6%);
    --success-border: hsl(147, 100%, 12%);
    --success-text: hsl(150, 86%, 65%);

    --info-bg: hsl(215, 100%, 6%);
    --info-border: hsl(223, 43%, 17%);
    --info-text: hsl(216, 87%, 65%);

    --warning-bg: hsl(64, 100%, 6%);
    --warning-border: hsl(60, 100%, 9%);
    --warning-text: hsl(46, 87%, 65%);

    --error-bg: hsl(358, 76%, 10%);
    --error-border: hsl(357, 89%, 16%);
    --error-text: hsl(358, 100%, 81%);
  }

  [data-red-toast] {
    border-radius: 4px;
    padding: 0.35rem 0.75rem;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-width: 1px;
    border-style: solid;
    /* normal, default */
    background: var(--normal-bg);
    color: var(--normal-text);
    border-color: var(--normal-border);
  }

  [data-red-toast][data-type="success"] {
    background: var(--success-bg);
    border-color: var(--success-border);
    color: var(--success-text);
  }

  [data-red-toast][data-type="info"] {
    background: var(--info-bg);
    border-color: var(--info-border);
    color: var(--info-text);
  }

  [data-red-toast][data-type="warning"] {
    background: var(--warning-bg);
    border-color: var(--warning-border);
    color: var(--warning-text);
  }

  [data-red-toast][data-type="error"] {
    background: var(--error-bg);
    border-color: var(--error-border);
    color: var(--error-text);
  }

	[data-red-toast] [data-title] {
		font-weight: 500;
		line-height: 1.5;
		color: inherit;
		margin: 0;
		padding: 0;
	}

	[data-red-toast] [data-description] {
		font-weight: 400;
		line-height: 1.4;
		color: #3f3f3f;
		font-size: 14px;
		margin: 0;
		padding: 0;
	}

	:host([data-red-theme='dark'] [data-description]) {
		color: hsl(0, 0%, 91%);
	}
`,wt={fromAttribute(t){if(null==t)return null;if(!isNaN(t))return Number(t);if("string"==typeof t&&/^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/.test(t))return t;if("string"==typeof t&&t.trim().startsWith("{")&&t.trim().endsWith("}"))try{const e=t.replace(/(\w+):\s*'([^']+)'/g,'"$1": "$2"').replace(/(\w+):\s*([^,}]+)/g,'"$1": "$2"'),s=JSON.parse(e);if("object"==typeof s&&null!==s)return s}catch(t){console.error("Failed to parse object string:",t)}return null},toAttribute:t=>"object"==typeof t&&null!==t?JSON.stringify(t):String(t)};let Et=class extends ct{constructor(){super(...arguments),this.toasts=[],this.position="bottom-right",this.theme="system",this.offset=null}connectedCallback(){super.connectedCallback(),this.setAttribute("data-red-toaster",""),"system"===this.theme?this._applyColorScheme(window.matchMedia("(prefers-color-scheme: dark)").matches):this._applyColorScheme("dark"===this.theme);const[e,i]=this.position.split("-");this.setAttribute("data-y-position",e),this.setAttribute("data-x-position",i),this._applyOffsets(),this.unsubscribe=t.subscribe(t=>{this.toasts=t}),window.addEventListener(s.eventName,t.handleEvent),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{this._applyColorScheme(t.matches)})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.(),window.removeEventListener(s.eventName,t.handleEvent),window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",t=>{this._applyColorScheme(t.matches)})}render(){return J`
      ${this.toasts.map(t=>J`
            <li
              role="alert"
              data-red-toast
              id="${t.id}"
              data-type="${t.type||K}"
            >
              ${_t(t.content)}
            </li>
          `)}
    `}_applyColorScheme(t){this.setAttribute("data-red-theme",t?"dark":"light")}_applyOffsets(){const t=this.offset;if(null==t)return this.style.setProperty("--offset-top","20px"),this.style.setProperty("--offset-right","20px"),this.style.setProperty("--offset-bottom","20px"),void this.style.setProperty("--offset-left","20px");if("string"==typeof t||"number"==typeof t){const e="number"==typeof t?`${t}px`:t;this.style.setProperty("--offset-top",e),this.style.setProperty("--offset-right",e),this.style.setProperty("--offset-bottom",e),this.style.setProperty("--offset-left",e)}"object"==typeof t&&(this.style.setProperty("--offset-top",t.top||"20px"),this.style.setProperty("--offset-right",t.right||"20px"),this.style.setProperty("--offset-bottom",t.bottom||"20px"),this.style.setProperty("--offset-left",t.left||"20px"))}};Et.styles=[vt,At],i([$t()],Et.prototype,"toasts",void 0),i([$t()],Et.prototype,"unsubscribe",void 0),i([mt({attribute:"position"})],Et.prototype,"position",void 0),i([mt({attribute:"theme"})],Et.prototype,"theme",void 0),i([mt({attribute:"offset",type:Object,converter:wt})],Et.prototype,"offset",void 0),Et=i([pt("toast-root")],Et);let xt=class extends ct{connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickEvent)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickEvent)}render(){return J` <slot></slot>`}findToastParent(t){return t?t.matches('[role="alert"][data-red-toast]')?t:this.findToastParent(t.parentElement):null}handleClickEvent(e){const s=this.findToastParent(e.target);s&&t.removeToast(s.id,{manuallyDismiised:!0})}};xt=i([pt("toast-close")],xt);export{xt as ToastClose,s as ToastEvent,Et as ToastRoot,e as toaster};
