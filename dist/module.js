"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function prepPage(e,t,n){const r={};return{create(e={}){const t=new Set(["meta","date","path","permalink","anchors","attributes","body"]);e.exclude&&e.exclude.split(",").forEach(e=>{t.has(e)&&t.delete(e)});let n={};return t.forEach(e=>{"attributes"===e?n=_extends$2({},this[e],n):n[e]=this[e]}),n},get meta(){const t=Object.assign({},e);return delete t.filePath,t},get path(){const{permalink:permalink}=this;if(!t.page)return permalink;if(n||!r.path){const e=t.page.match(/([^_][a-zA-z]*?)\/[^a-z_]*/);e&&"index"!==e[1]?r.path=path.join(e[1],permalink).replace(/\\|\/\//,"/"):r.path=permalink.replace(/\\|\/\//,"/")}return r.path},get permalink(){if(n||!r.permalink){const{date:date}=this,{section:section,fileName:fileName}=e,n=getSlug(fileName),{year:year,month:month,day:day}=splitDate(date),s={section:section,slug:n,date:date,year:year,month:month,day:day},o=permalinkCompiler(t.permalink),a=path.join("/",o(s,{pretty:!0}).replace(/%2F/gi,"/"));r.permalink=a.replace(/\\|\\\\/g,"/")}return r.permalink},get anchors(){if(n||!r.anchors)if(e.fileName.search(/\.md$/)>-1){const{_rawData:_rawData}=this,e=t.anchorsLevel,n=new RegExp(["(`{3}[\\s\\S]*?`{3}|`{1}[^`].*?`{1}[^`]*?)",`(#{${e+1},})`,`(?:^|\\s)#{${e}}[^#](.*)`].join("|"),"g");let s;const o=[];for(;s=n.exec(_rawData.body);){const[e,t,n,r]=s;if(!t&&!n&&r){const e=`#${paramCase(r)}`;o.push([e,r])}}r.anchors=o}else r.anchors=[];return r.anchors},get attributes(){return this._rawData.attributes},get body(){if(n||!r.body){const{_rawData:_rawData}=this,{parsers:parsers}=t,{dirName:dirName,section:section,fileName:fileName}=e;if(fileName.search(/\.comp\.md$/)>-1){let e="."+path.join(dirName,section,fileName);e=e.replace(/\\/,"/"),r.body={relativePath:e}}else fileName.search(/\.md$/)>-1?r.body=parsers.mdParser(parsers.md,t).render(_rawData.body):fileName.search(/\.(yaml|yml)$/)>-1&&(r.body=parsers.yamlParser().render(_rawData.body))}return r.body},get date(){if(n||!r.date){const{filePath:filePath,fileName:fileName,section:section}=e;if(t.isPost){const e=fileName.match(/!?(\d{4}-\d{2}-\d{2})/);if(!e)throw Error(`Post in "${section}" does not have a date!`);r.date=e[0]}else{const e=fs.statSync(filePath);r.date=dateFns.format(e.ctime,"YYYY-MM-DD")}}return r.date},get _rawData(){if(n||!r.data){const t=fs.readFileSync(e.filePath).toString();if(e.fileName.search(/\.md$/)>-1){const{attributes:attributes,body:body}=fm(t);r.data={attributes:attributes,body:body}}else e.fileName.search(/\.(yaml|yml)$/)>-1&&(r.data={attributes:{},body:t})}return r.data}}}function createDatabase(e,t,n,r){const s=path.join(e,t),o=globAndApply(s,new Map,({index:index,fileName:fileName,section:section},s)=>{const o=path.join(e,t,section,fileName);const a={index:index,fileName:fileName,section:section,dirName:t,filePath:o};const i=prepPage(a,n,r);s.set(i.permalink,i)}),a=[...o.values()];return{exists(e){return o.has(e)},find(e,t){return o.get(e).create(t)},findOnly(e,t){"string"==typeof e&&(e=e.split(","));const[n,r]=e;let s=max(0,parseInt(n));const o=void 0!==r?min(parseInt(r),a.length-1):null;if(!o)return a[s].create(t);const i=[];if(o)for(;s<=o;)i.push(a[s]),s++;return i.map(e=>e.create(t))},findBetween(e,t){const{findOnly:findOnly}=this,[n,r,s]=e.split(",");if(!o.has(n))return[];const i=o.get(n).create(t),{index:index}=i.meta,c=a.length-1,u=parseInt(r||0),l=void 0!==s?parseInt(s):null;if(0===u&&0===l)return[i];let p;p=0===u?[]:[max(0,index-u),max(min(index-1,c),0)];let d;return d=0===l||!l&&0===u?[]:[min(index+1,c),min(index+(l||u),c)],[i,findOnly(p,t),findOnly(d,t)]},findAll(e){return a.map(t=>t.create(e))}}}function _objectWithoutProperties(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function ContentModule(e){const t=nuxtentConfig(this.options.rootDir)||this.options.nuxtent||{},n=mergeContentOptions(t.content,{page:null,permalink:":slug",anchorsLevel:1,isPost:!0,generate:[]}),r=path.join(this.options.srcDir,COMPONENTS_DIR),s=path.join(this.options.srcDir,CONTENT_DIR),o="~/"+CONTENT_DIR,a=process.env.PORT||process.env.npm_package_config_nuxt_port||3e3,i=this.nuxt.options.dev,c=[".vue",".js"],u={md:Object.assign({},{highlight:null,use:[]},t.parsers&&t.parsers.md?t.parsers.md:{}),mdParser:mdParser,yamlParser:yamlParser},l={contentDir:s,content:n,parsers:u,isDev:i};this.addPlugin({src:path.resolve(__dirname,"plugins/requestContent.js")}),this.addServerMiddleware({path:API_SERVER_PREFIX,handler:createRouter(getAPIOptions(t.api,!1).baseURL,API_SERVER_PREFIX,l)}),this.nuxt.hook("build:before",e=>{console.log("starting build nuxtent");const n=e.isStatic;const r=getAPIOptions(t.api,n);n&&this.nuxt.hook("build:done",e=>{if(n){console.log("opening server connection");const e=express__default();e.use(API_SERVER_PREFIX,createRouter(r.baseURL,API_SERVER_PREFIX,l));const t=e.listen(a);this.nuxt.hook("generate:done",()=>{console.log("closing server connection");t.close()})}});this.requireModule(["@nuxtjs/axios",_extends({},r,{baseURL:r.baseURL+API_SERVER_PREFIX,browserBaseURL:r.browserBaseURL+(n?API_BROWSER_PREFIX:API_SERVER_PREFIX)})]);buildContent(this,BUILD_DIR,n,l)}),this.extendBuild(e=>{e.module.rules.push({test:/\.comp\.md$/,use:["vue-loader",{loader:path.resolve(__dirname,"loader"),options:{componentsDir:r,extensions:c,content:n,parsers:u}}]})}),this.addPlugin({src:path.resolve(__dirname,"plugins/markdownComponents.template.js"),options:{contentDirWebpackAlias:o}})}Object.defineProperty(exports,"__esModule",{value:!0});var path=require("path"),express=require("express"),express__default=_interopDefault(express),querystring=require("querystring"),chalk=_interopDefault(require("chalk")),fs=require("fs"),fm=_interopDefault(require("front-matter")),dateFns=_interopDefault(require("date-fns")),paramCase=_interopDefault(require("param-case")),pathToRegexp=_interopDefault(require("path-to-regexp")),yamlit=_interopDefault(require("js-yaml")),markdownit=_interopDefault(require("markdown-it")),markdownAnchors=_interopDefault(require("markdown-it-anchor")),name="nuxtent",version="1.2.2",description="Seamlessly use content files in your Nuxt.js sites.",main="index.js",contributors=["Alid Castano (@alidcastano)","Mehdi Lahlou (@medfreeman)"],repository={type:"git",url:"git+https://github.com/nuxt-community/nuxtent-module.git"},keywords=["Nuxt.js","Vue.js","Content","Blog","Posts","Collections","Navigation","Markdown","Static"],license="MIT",scripts={"#<git hooks>":"handled by husky",precommit:"lint-staged","#</git hooks>":"handled by husky",lint:'eslint --fix "**/*.js"',pretest:"npm run lint",e2e:"cross-env NODE_ENV=test jest --runInBand --forceExit",test:"npm run e2e",build:"cross-env NODE_ENV=production rollup -c rollup.config.js",watch:"npm run build -- -w",prepare:"npm run build",release:"standard-version && git push --follow-tags && npm publish"},peerDependencies={"@nuxtjs/axios":"^4.5.2"},dependencies={chalk:"^2.3.0","date-fns":"^1.28.5","front-matter":"^2.3.0","js-yaml":"^3.10.0","loader-utils":"^1.1.0","markdown-it":"^8.4.0","markdown-it-anchor":"^4.0.0","param-case":"^2.1.1","path-to-regexp":"^2.0.0",uppercamelcase:"^3.0.0","url-join":"^4.0.0"},devDependencies={"@nuxtjs/axios":"^4.5.2","babel-cli":"^6.26.0","babel-eslint":"^8.2.1","babel-plugin-external-helpers":"^6.22.0","babel-plugin-transform-async-to-generator":"^6.24.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-plugin-transform-regenerator":"^6.26.0","babel-plugin-transform-runtime":"^6.23.0","babel-preset-env":"^1.6.1","babel-preset-stage-2":"^6.24.1",chai:"^4.1.2",codecov:"^3.0.0","cross-env":"^5.1.3",eslint:"^4.15.0","eslint-config-i-am-meticulous":"^7.0.1","eslint-config-prettier":"^2.9.0","eslint-config-prettier-standard":"^1.0.1","eslint-config-standard":"^10.2.1","eslint-plugin-babel":"^4.1.2","eslint-plugin-jest":"^21.6.1","eslint-plugin-node":"^5.1.1","eslint-plugin-prettier":"^2.4.0","eslint-plugin-promise":"^3.5.0","eslint-plugin-standard":"^3.0.1",express:"^4.15.5","git-exec-and-restage":"^1.0.1",husky:"^0.14.3",jest:"^22.0.6",jsdom:"^11.5.1","lint-staged":"^6.0.0",mocha:"^4.1.0",nuxt:"latest","prettier-standard":"^8.0.0","request-promise-native":"^1.0.5",rollup:"^0.53.4","rollup-plugin-babel":"^3.0.3","rollup-plugin-commonjs":"^8.2.6","rollup-plugin-copy":"^0.2.3","rollup-plugin-filesize":"^1.5.0","rollup-plugin-json":"^2.3.0","rollup-plugin-node-resolve":"^3.0.2","rollup-plugin-uglify-es":"0.0.1","rollup-watch":"^4.3.1","serve-static":"^1.12.6",sinon:"^4.1.4","sinon-chai":"^2.13.0","standard-version":"^4.3.0"},jest={testEnvironment:"node",testMatch:["**/?(*.)test.js"],coverageDirectory:"./coverage/",mapCoverage:!0,collectCoverage:!0},bugs={url:"https://github.com/nuxt-community/nuxtent-module/issues"},homepage="https://github.com/nuxt-community/nuxtent-module#readme",directories={doc:"docs",example:"examples",lib:"lib",test:"test"},author="Alid Castano",_package={name:name,version:version,description:description,main:main,contributors:contributors,repository:repository,keywords:keywords,license:license,scripts:scripts,peerDependencies:peerDependencies,dependencies:dependencies,devDependencies:devDependencies,jest:jest,bugs:bugs,homepage:homepage,directories:directories,author:author,"lint-staged":{"*.js":["git-exec-and-restage eslint --fix --","git-exec-and-restage prettier-standard"]}},_extends$2=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};const permalinkCompiler=pathToRegexp.compile,getSlug=e=>{const t=e.replace(/(\.comp)?(\.[0-9a-z]+$)/,"").replace(/!?(\d{4}-\d{2}-\d{2}-)/,"");return paramCase(t)},splitDate=e=>{const[t,n,r]=e.split("-");return{year:t,month:n,day:r}},{max:max,min:min}=Math,globAndApply=(e,t,n,r="/")=>{const s=fs.readdirSync(e).reverse();s.forEach((s,o)=>{const a=path.join(e,s);if(fs.statSync(a).isFile()){const e={index:o,fileName:s,section:r};n(e,t)}else globAndApply(a,t,n,path.join(r,s))});return t};var _extends$1=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};const logRequest=(e,t)=>{console.log(`${chalk.blue(e)} ${chalk.green("GET")} ${t}`)},response=e=>({json(t){e.setHeader("Content-Type","application/json"),e.end(JSON.stringify(t),"utf-8"),console.log("\tResponse sent successfully.")},error(t){e.statusCode=500,e.statusMessage="Internal Server Error",e.end(t.stack||String(t)),console.log("\tFailed to send response.",t)},notFound(){e.statusCode=404,e.statusMessage="Not Found",e.end(),console.log("\tPage not found.")}}),curryResponseHandler=(e,t,n,r,s,o)=>{const a=createDatabase(r,n,s,o);return function(n,r){const s=response(r);let o=n.params[0];o=o.replace(/\\|\/\//g,"/");const[i,c]=n.url.match(/\?(.*)/)||[],u=querystring.parse(c),{only:only,between:between}=u,l=_objectWithoutProperties(u,["only","between"]);logRequest(t,e+o),"/"===o?between?s.json(a.findBetween(between,l)):only?s.json(a.findOnly(only,l)):s.json(a.findAll(l)):a.exists(o)?s.json(a.find(o,l)):s.notFound()}},createRouter=(e,t,n)=>{const r=express.Router();const{contentDir:contentDir,content:content,parsers:parsers,isDev:isDev}=n;content["/"]||r.use("/",(new express.Router).get("/",(e,t)=>{response(t).json({"content-endpoints":Object.keys(content)})}));Object.keys(content).forEach(n=>{const s=_extends$1({},content[n],{parsers:parsers});const o=curryResponseHandler(e,t,n,contentDir,s,isDev);r.use(n,(new express.Router).get("*",o))});return r};var _extends$3=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};const buildPath=(e,t,n)=>{const r=e.replace(/(?!^\/)\//g,".");return path.join(n,t,r)+".json"},routeName=e=>{return e.replace(/^\//,"").replace("/","-").replace("_","")},asset=e=>{const t=JSON.stringify(e,null,"production"===process.env.NODE_ENV?0:2);return{source:()=>t,size:()=>t.length}},interceptRoutes=(e,t)=>{e.extendRoutes(e=>{e.forEach(e=>{t.has(e.name)?e.path="/"+t.get(e.name):e.children&&e.children.forEach(e=>{if(t.has(e.name)){const n=e.path.match(/\?$/);e.path=n?t.get(e.name)+"?":t.get(e.name)}})})})},addRoutes=(e,t)=>{e.generate||(e.generate={});e.generate.routes||(e.generate.routes=[]);const{routes:routes}=e.generate;if(!Array.isArray(routes))throw new Error(`"generate.routes" must be an array`);e.generate.routes=routes.concat(t)},addAssets=(e,t)=>{e.build.plugins.push({apply(e){e.plugin("emit",(e,n)=>{t.forEach((t,n)=>{e.assets[n]=asset(t)});n()})}})},buildContent=(e,t,n,r)=>{const{contentDir:contentDir,content:content,parsers:parsers,isDev:isDev}=r;const s=[];const o=new Map;const a=new Map;Object.keys(content).forEach(e=>{const{page:page,generate:generate,permalink:permalink}=content[e];let r;page&&(r=routeName(page),o.set(r,permalink.replace(/^\//,"")));if(generate&&n){const n=_extends$3({},content[e],{parsers:parsers}),r=createDatabase(contentDir,e,n,isDev);generate.forEach(n=>{const o={};if("string"==typeof n)o.method=n;else if(Array.isArray(n)){const[e,t]=n;o.method=e,o.query=t.query?t.query:{},o.args=t.args?t.args:[]}switch(o.method){case"get":if(!page)throw new Error("You must specify a page path");r.findAll(o.query).forEach(n=>{s.push(n.permalink);a.set(buildPath(n.permalink,e,t),n)});break;case"getAll":a.set(buildPath("_all",e,t),r.findAll(o.query));break;case"getOnly":a.set(buildPath("_only",e,t),r.findOnly(o.args,o.query));break;default:throw new Error(`The ${o.method} is not supported for static builds.`)}})}});interceptRoutes(e,o);addRoutes(e.options,s);addAssets(e.options,a)},mdParser=(e,{anchorsLevel:anchorsLevel})=>{const t={preset:"default",html:!0,typographer:!0,linkify:!0};void 0!==e.extend&&e.extend(t);const n=markdownit(t);const r=[[markdownAnchors,{level:[anchorsLevel]}]].concat(e.plugins||[]);r.forEach(e=>{Array.isArray(e)?n.use.apply(n,e):n.use(e)});void 0!==e.customize&&e.customize(n);return n},yamlParser=()=>({render:yamlit.safeLoad});var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};const nuxtentConfig=e=>{const t=path.join(e,"nuxtent.config.js");try{return require(t)}catch(e){if("MODULE_NOT_FOUND"===e.code)return!1;throw new Error(`[Invalid Nuxtent configuration] ${e}`)}},mergeContentOptions=(e,t)=>{const n={};Array.isArray(e)?e.forEach(r=>{const s=Array.isArray(r);const o=s?r[0]:r;const a=s?r[1]:{};if("/"===o&&e.length>1)throw new Error("Top level files not allowed with nested registered directories");n[path.join("/",o)]=_extends({},t,a)}):n["/"]=_extends({},t,e);return n},getAPIOptions=(e={},t)=>{const n="function"==typeof e?e(t):e;const{baseURL:baseURL="",browserBaseURL:browserBaseURL,otherAPIOptions:otherAPIOptions={}}=n;return _extends({baseURL:baseURL,browserBaseURL:browserBaseURL||baseURL},otherAPIOptions)},CONTENT_DIR="content",COMPONENTS_DIR="components",BUILD_DIR="content",API_SERVER_PREFIX="/content-api",API_BROWSER_PREFIX="/_nuxt/content";exports.default=ContentModule,exports.meta=_package;
