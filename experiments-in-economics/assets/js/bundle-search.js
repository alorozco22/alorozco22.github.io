





















































































































































































  

  




































/**
 * elasticlunr - http://weixsong.github.io
 * Lightweight full-text search engine in Javascript for browser search and offline search. - 0.9.5
 *
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 * MIT Licensed
 * @license
 */
!function(){function e(e){if(null===e||"object"!=typeof e)return e;var t=e.constructor();for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}var t=function(e){var n=new t.Index;return n.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),e&&e.call(n,n),n};t.version="0.9.5",lunr=t,t.utils={},t.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),t.utils.toString=function(e){return void 0===e||null===e?"":e.toString()},t.EventEmitter=function(){this.events={}},t.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},t.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);-1!==n&&(this.events[e].splice(n,1),0==this.events[e].length&&delete this.events[e])}},t.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)},this)}},t.EventEmitter.prototype.hasHandler=function(e){return e in this.events},t.tokenizer=function(e){if(!arguments.length||null===e||void 0===e)return[];if(Array.isArray(e)){var n=e.filter(function(e){return null===e||void 0===e?!1:!0});n=n.map(function(e){return t.utils.toString(e).toLowerCase()});var i=[];return n.forEach(function(e){var n=e.split(t.tokenizer.seperator);i=i.concat(n)},this),i}return e.toString().trim().toLowerCase().split(t.tokenizer.seperator)},t.tokenizer.defaultSeperator=/[\s\-]+/,t.tokenizer.seperator=t.tokenizer.defaultSeperator,t.tokenizer.setSeperator=function(e){null!==e&&void 0!==e&&"object"==typeof e&&(t.tokenizer.seperator=e)},t.tokenizer.resetSeperator=function(){t.tokenizer.seperator=t.tokenizer.defaultSeperator},t.tokenizer.getSeperator=function(){return t.tokenizer.seperator},t.Pipeline=function(){this._queue=[]},t.Pipeline.registeredFunctions={},t.Pipeline.registerFunction=function(e,n){n in t.Pipeline.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+n),e.label=n,t.Pipeline.registeredFunctions[n]=e},t.Pipeline.getRegisteredFunction=function(e){return e in t.Pipeline.registeredFunctions!=!0?null:t.Pipeline.registeredFunctions[e]},t.Pipeline.warnIfFunctionNotRegistered=function(e){var n=e.label&&e.label in this.registeredFunctions;n||t.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},t.Pipeline.load=function(e){var n=new t.Pipeline;return e.forEach(function(e){var i=t.Pipeline.getRegisteredFunction(e);if(!i)throw new Error("Cannot load un-registered function: "+e);n.add(i)}),n},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){t.Pipeline.warnIfFunctionNotRegistered(e),this._queue.push(e)},this)},t.Pipeline.prototype.after=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i+1,0,n)},t.Pipeline.prototype.before=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i,0,n)},t.Pipeline.prototype.remove=function(e){var t=this._queue.indexOf(e);-1!==t&&this._queue.splice(t,1)},t.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,i=this._queue.length,o=0;n>o;o++){for(var r=e[o],s=0;i>s&&(r=this._queue[s](r,o,e),void 0!==r&&null!==r);s++);void 0!==r&&null!==r&&t.push(r)}return t},t.Pipeline.prototype.reset=function(){this._queue=[]},t.Pipeline.prototype.get=function(){return this._queue},t.Pipeline.prototype.toJSON=function(){return this._queue.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})},t.Index=function(){this._fields=[],this._ref="id",this.pipeline=new t.Pipeline,this.documentStore=new t.DocumentStore,this.index={},this.eventEmitter=new t.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},t.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},t.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},t.Index.load=function(e){e.version!==t.version&&t.utils.warn("version mismatch: current "+t.version+" importing "+e.version);var n=new this;n._fields=e.fields,n._ref=e.ref,n.documentStore=t.DocumentStore.load(e.documentStore),n.pipeline=t.Pipeline.load(e.pipeline),n.index={};for(var i in e.index)n.index[i]=t.InvertedIndex.load(e.index[i]);return n},t.Index.prototype.addField=function(e){return this._fields.push(e),this.index[e]=new t.InvertedIndex,this},t.Index.prototype.setRef=function(e){return this._ref=e,this},t.Index.prototype.saveDocument=function(e){return this.documentStore=new t.DocumentStore(e),this},t.Index.prototype.addDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.addDoc(i,e),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));this.documentStore.addFieldLength(i,n,o.length);var r={};o.forEach(function(e){e in r?r[e]+=1:r[e]=1},this);for(var s in r){var u=r[s];u=Math.sqrt(u),this.index[n].addToken(s,{ref:i,tf:u})}},this),n&&this.eventEmitter.emit("add",e,this)}},t.Index.prototype.removeDocByRef=function(e){if(e&&this.documentStore.isDocStored()!==!1&&this.documentStore.hasDoc(e)){var t=this.documentStore.getDoc(e);this.removeDoc(t,!1)}},t.Index.prototype.removeDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.hasDoc(i)&&(this.documentStore.removeDoc(i),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));o.forEach(function(e){this.index[n].removeToken(e,i)},this)},this),n&&this.eventEmitter.emit("remove",e,this))}},t.Index.prototype.updateDoc=function(e,t){var t=void 0===t?!0:t;this.removeDocByRef(e[this._ref],!1),this.addDoc(e,!1),t&&this.eventEmitter.emit("update",e,this)},t.Index.prototype.idf=function(e,t){var n="@"+t+"/"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,n))return this._idfCache[n];var i=this.index[t].getDocFreq(e),o=1+Math.log(this.documentStore.length/(i+1));return this._idfCache[n]=o,o},t.Index.prototype.getFields=function(){return this._fields.slice()},t.Index.prototype.search=function(e,n){if(!e)return[];var i=null;null!=n&&(i=JSON.stringify(n));var o=new t.Configuration(i,this.getFields()).get(),r=this.pipeline.run(t.tokenizer(e)),s={};for(var u in o){var a=this.fieldSearch(r,u,o),l=o[u].boost;for(var d in a)a[d]=a[d]*l;for(var d in a)d in s?s[d]+=a[d]:s[d]=a[d]}var c=[];for(var d in s)c.push({ref:d,score:s[d]});return c.sort(function(e,t){return t.score-e.score}),c},t.Index.prototype.fieldSearch=function(e,t,n){var i=n[t].bool,o=n[t].expand,r=n[t].boost,s=null,u={};return 0!==r?(e.forEach(function(e){var n=[e];1==o&&(n=this.index[t].expandToken(e));var r={};n.forEach(function(n){var o=this.index[t].getDocs(n),a=this.idf(n,t);if(s&&"AND"==i){var l={};for(var d in s)d in o&&(l[d]=o[d]);o=l}n==e&&this.fieldSearchStats(u,n,o);for(var d in o){var c=this.index[t].getTermFrequency(n,d),f=this.documentStore.getFieldLength(d,t),h=1;0!=f&&(h=1/Math.sqrt(f));var p=1;n!=e&&(p=.15*(1-(n.length-e.length)/n.length));var v=c*a*h*p;d in r?r[d]+=v:r[d]=v}},this),s=this.mergeScores(s,r,i)},this),s=this.coordNorm(s,u,e.length)):void 0},t.Index.prototype.mergeScores=function(e,t,n){if(!e)return t;if("AND"==n){var i={};for(var o in t)o in e&&(i[o]=e[o]+t[o]);return i}for(var o in t)o in e?e[o]+=t[o]:e[o]=t[o];return e},t.Index.prototype.fieldSearchStats=function(e,t,n){for(var i in n)i in e?e[i].push(t):e[i]=[t]},t.Index.prototype.coordNorm=function(e,t,n){for(var i in e)if(i in t){var o=t[i].length;e[i]=e[i]*o/n}return e},t.Index.prototype.toJSON=function(){var e={};return this._fields.forEach(function(t){e[t]=this.index[t].toJSON()},this),{version:t.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),index:e,pipeline:this.pipeline.toJSON()}},t.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},t.DocumentStore=function(e){this._save=null===e||void 0===e?!0:e,this.docs={},this.docInfo={},this.length=0},t.DocumentStore.load=function(e){var t=new this;return t.length=e.length,t.docs=e.docs,t.docInfo=e.docInfo,t._save=e.save,t},t.DocumentStore.prototype.isDocStored=function(){return this._save},t.DocumentStore.prototype.addDoc=function(t,n){this.hasDoc(t)||this.length++,this.docs[t]=this._save===!0?e(n):null},t.DocumentStore.prototype.getDoc=function(e){return this.hasDoc(e)===!1?null:this.docs[e]},t.DocumentStore.prototype.hasDoc=function(e){return e in this.docs},t.DocumentStore.prototype.removeDoc=function(e){this.hasDoc(e)&&(delete this.docs[e],delete this.docInfo[e],this.length--)},t.DocumentStore.prototype.addFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&(this.docInfo[e]||(this.docInfo[e]={}),this.docInfo[e][t]=n)},t.DocumentStore.prototype.updateFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&this.addFieldLength(e,t,n)},t.DocumentStore.prototype.getFieldLength=function(e,t){return null===e||void 0===e?0:e in this.docs&&t in this.docInfo[e]?this.docInfo[e][t]:0},t.DocumentStore.prototype.toJSON=function(){return{docs:this.docs,docInfo:this.docInfo,length:this.length,save:this._save}},t.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",i="[aeiouy]",o=n+"[^aeiouy]*",r=i+"[aeiou]*",s="^("+o+")?"+r+o,u="^("+o+")?"+r+o+"("+r+")?$",a="^("+o+")?"+r+o+r+o,l="^("+o+")?"+i,d=new RegExp(s),c=new RegExp(a),f=new RegExp(u),h=new RegExp(l),p=/^(.+?)(ss|i)es$/,v=/^(.+?)([^s])s$/,g=/^(.+?)eed$/,m=/^(.+?)(ed|ing)$/,y=/.$/,S=/(at|bl|iz)$/,x=new RegExp("([^aeiouylsz])\\1$"),w=new RegExp("^"+o+i+"[^aeiouwxy]$"),I=/^(.+?[^aeiou])y$/,b=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,D=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,F=/^(.+?)(s|t)(ion)$/,_=/^(.+?)e$/,P=/ll$/,k=new RegExp("^"+o+i+"[^aeiouwxy]$"),z=function(n){var i,o,r,s,u,a,l;if(n.length<3)return n;if(r=n.substr(0,1),"y"==r&&(n=r.toUpperCase()+n.substr(1)),s=p,u=v,s.test(n)?n=n.replace(s,"$1$2"):u.test(n)&&(n=n.replace(u,"$1$2")),s=g,u=m,s.test(n)){var z=s.exec(n);s=d,s.test(z[1])&&(s=y,n=n.replace(s,""))}else if(u.test(n)){var z=u.exec(n);i=z[1],u=h,u.test(i)&&(n=i,u=S,a=x,l=w,u.test(n)?n+="e":a.test(n)?(s=y,n=n.replace(s,"")):l.test(n)&&(n+="e"))}if(s=I,s.test(n)){var z=s.exec(n);i=z[1],n=i+"i"}if(s=b,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=d,s.test(i)&&(n=i+e[o])}if(s=E,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=d,s.test(i)&&(n=i+t[o])}if(s=D,u=F,s.test(n)){var z=s.exec(n);i=z[1],s=c,s.test(i)&&(n=i)}else if(u.test(n)){var z=u.exec(n);i=z[1]+z[2],u=c,u.test(i)&&(n=i)}if(s=_,s.test(n)){var z=s.exec(n);i=z[1],s=c,u=f,a=k,(s.test(i)||u.test(i)&&!a.test(i))&&(n=i)}return s=P,u=c,s.test(n)&&u.test(n)&&(s=y,n=n.replace(s,"")),"y"==r&&(n=r.toLowerCase()+n.substr(1)),n};return z}(),t.Pipeline.registerFunction(t.stemmer,"stemmer"),t.stopWordFilter=function(e){return e&&t.stopWordFilter.stopWords[e]!==!0?e:void 0},t.clearStopWords=function(){t.stopWordFilter.stopWords={}},t.addStopWords=function(e){null!=e&&Array.isArray(e)!==!1&&e.forEach(function(e){t.stopWordFilter.stopWords[e]=!0},this)},t.resetStopWords=function(){t.stopWordFilter.stopWords=t.defaultStopWords},t.defaultStopWords={"":!0,a:!0,able:!0,about:!0,across:!0,after:!0,all:!0,almost:!0,also:!0,am:!0,among:!0,an:!0,and:!0,any:!0,are:!0,as:!0,at:!0,be:!0,because:!0,been:!0,but:!0,by:!0,can:!0,cannot:!0,could:!0,dear:!0,did:!0,"do":!0,does:!0,either:!0,"else":!0,ever:!0,every:!0,"for":!0,from:!0,get:!0,got:!0,had:!0,has:!0,have:!0,he:!0,her:!0,hers:!0,him:!0,his:!0,how:!0,however:!0,i:!0,"if":!0,"in":!0,into:!0,is:!0,it:!0,its:!0,just:!0,least:!0,let:!0,like:!0,likely:!0,may:!0,me:!0,might:!0,most:!0,must:!0,my:!0,neither:!0,no:!0,nor:!0,not:!0,of:!0,off:!0,often:!0,on:!0,only:!0,or:!0,other:!0,our:!0,own:!0,rather:!0,said:!0,say:!0,says:!0,she:!0,should:!0,since:!0,so:!0,some:!0,than:!0,that:!0,the:!0,their:!0,them:!0,then:!0,there:!0,these:!0,they:!0,"this":!0,tis:!0,to:!0,too:!0,twas:!0,us:!0,wants:!0,was:!0,we:!0,were:!0,what:!0,when:!0,where:!0,which:!0,"while":!0,who:!0,whom:!0,why:!0,will:!0,"with":!0,would:!0,yet:!0,you:!0,your:!0},t.stopWordFilter.stopWords=t.defaultStopWords,t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter"),t.trimmer=function(e){if(null===e||void 0===e)throw new Error("token should not be undefined");return e.replace(/^\W+/,"").replace(/\W+$/,"")},t.Pipeline.registerFunction(t.trimmer,"trimmer"),t.InvertedIndex=function(){this.root={docs:{},df:0}},t.InvertedIndex.load=function(e){var t=new this;return t.root=e.root,t},t.InvertedIndex.prototype.addToken=function(e,t,n){for(var n=n||this.root,i=0;i<=e.length-1;){var o=e[i];o in n||(n[o]={docs:{},df:0}),i+=1,n=n[o]}var r=t.ref;n.docs[r]?n.docs[r]={tf:t.tf}:(n.docs[r]={tf:t.tf},n.df+=1)},t.InvertedIndex.prototype.hasToken=function(e){if(!e)return!1;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},t.InvertedIndex.prototype.getNode=function(e){if(!e)return null;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return null;t=t[e[n]]}return t},t.InvertedIndex.prototype.getDocs=function(e){var t=this.getNode(e);return null==t?{}:t.docs},t.InvertedIndex.prototype.getTermFrequency=function(e,t){var n=this.getNode(e);return null==n?0:t in n.docs?n.docs[t].tf:0},t.InvertedIndex.prototype.getDocFreq=function(e){var t=this.getNode(e);return null==t?0:t.df},t.InvertedIndex.prototype.removeToken=function(e,t){if(e){var n=this.getNode(e);null!=n&&t in n.docs&&(delete n.docs[t],n.df-=1)}},t.InvertedIndex.prototype.expandToken=function(e,t,n){if(null==e||""==e)return[];var t=t||[];if(void 0==n&&(n=this.getNode(e),null==n))return t;n.df>0&&t.push(e);for(var i in n)"docs"!==i&&"df"!==i&&this.expandToken(e+i,t,n[i]);return t},t.InvertedIndex.prototype.toJSON=function(){return{root:this.root}},t.Configuration=function(e,n){var e=e||"";if(void 0==n||null==n)throw new Error("fields should not be null");this.config={};var i;try{i=JSON.parse(e),this.buildUserConfig(i,n)}catch(o){t.utils.warn("user configuration parse failed, will use default configuration"),this.buildDefaultConfig(n)}},t.Configuration.prototype.buildDefaultConfig=function(e){this.reset(),e.forEach(function(e){this.config[e]={boost:1,bool:"OR",expand:!1}},this)},t.Configuration.prototype.buildUserConfig=function(e,n){var i="OR",o=!1;if(this.reset(),"bool"in e&&(i=e.bool||i),"expand"in e&&(o=e.expand||o),"fields"in e)for(var r in e.fields)if(n.indexOf(r)>-1){var s=e.fields[r],u=o;void 0!=s.expand&&(u=s.expand),this.config[r]={boost:s.boost||0===s.boost?s.boost:1,bool:s.bool||i,expand:u}}else t.utils.warn("field name in user configuration not found in index instance fields");else this.addAllFields2UserConfig(i,o,n)},t.Configuration.prototype.addAllFields2UserConfig=function(e,t,n){n.forEach(function(n){this.config[n]={boost:1,bool:e,expand:t}},this)},t.Configuration.prototype.get=function(){return this.config},t.Configuration.prototype.reset=function(){this.config={}},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){var e,t;for(e=0;e<arguments.length;e++)t=arguments[e],~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t);this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;){if(r===e)return o;e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o]}return r===e?o:-1},lunr.SortedSet.prototype.locationFor=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;)e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o];return r>e?o:e>r?o+1:void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,i=0,o=this.length,r=e.length,s=this.elements,u=e.elements;;){if(n>o-1||i>r-1)break;s[n]!==u[i]?s[n]<u[i]?n++:s[n]>u[i]&&i++:(t.add(s[n]),n++,i++)}return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,i;this.length>=e.length?(t=this,n=e):(t=e,n=this),i=t.clone();for(var o=0,r=n.toArray();o<r.length;o++)i.add(r[o]);return i},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.elasticlunr=t()}(this,function(){return t})}();

// get electric-book metadata







// set up elasticlunr
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
});



// add the docs to the index, if there are docs


// add the pages to the index

  

  

  

  

  

  

  
  index.addDoc({
    id: 0,
    title: "A note to instructors",
    content: "Note to instructors\n\nOur purpose\nPersonal experience is a powerful teaching tool. Experiments in Economics is designed to provide teachers a complete set of materials to reduce the necessary effort while maximizing the reached advantages of class experiments. However, while running experiments in class is an innovative technique, it is already a very popularized practice. Next, we show some of the strategies you may have in mind to use this book. Then, we provide a brief mention to some of the external platforms you may explore for more information on class experiments.\n\nThe content\nFirst, Experiments in Economics is not just a manual with a list of ready protocols. We believe experiments should be related to the theory, questions and conclusions economics has to offer. Additionally, we understand experiments require time and careful logistic planning. Therefore, each experiment is related to the relevant units in The Economy. We recommend you see each unit in this book as a direct companion to the correspondent units in The Economy. On the other hand, each experiment comes with a group of materials. According to the case, a unit may contain some or all the next:\n\n  A ready-to-use protocol: with an outline of the instructions you should give to your students.\n  Excel preconfigured formats: with downloadable tables ready to register your data and perform automatic analysis.\n  Predesigned printable tables: with clear information your students need to participate in the activities, and physical formats to register actions.\n  Video tutorials: with introductory tours to external platforms.\n  Informative diagrams: with complementary information to communicate instructions to your students.\n\n\nWe present a base version of each experiment. Nevertheless, feel free to use the tools you consider more useful; and, modify any part of the design you prefer according to your pedagogical needs.\n\nHow to use Experiments in Economics\n\nThere are at least three ways you can articulate to use the present materials. First, a course about a theoretical introduction to economics is a perfect environment to first expose students to the living decision making process through experiments. For example, you may select some units to use during a microeconomics, macroeconomics, or games theory course. In this case, we recommend you use this material simultaneously with The Economy. Briefly, you may create a dialog between theory and personal experiences.\n\nSecond, some of these experiments are suitable for an experimental methodology course. According to the concepts you want to illustrate, you may need to modify some of the contents. For example, to give your students an idea behind the treatments design, you may want to make small edits to the protocol behind a dictator game and assign them randomly to groups in your class. However, the general idea behind the classic experiment can still be understood through our materials.\n\nOn a third place, you may want to illustrate specific concepts that are not present explicitly in this book. You may select some of a unit’s content as a base model to modify materials, instead of working them out from scratch. For instance, you may take the templates for a double auction experiment and change the kind of shock the market experiences: a supply reduction, instead of a tax. Then, the book works as a complement to any related class project.\n\nFinally, Experiments in Economics is not a book to be completely used at a single course, neither is it a sequential text. The materials presented in here are thought to be a guide or manual with multiple purposes. Feel free to use it as you better consider.\n\nAn open window\n\nAs mentioned before, there is an extensive variety of other free resources you may consult as a reference to experimental economics. Next, we mention some of them. We strongly encourage you to explore them and find the tools that better fit your pedagogical interests.\n\nClassEx\n\nA widely used online tool developed by the University of Passau. Students may login from their smartphones. Games are designed to study many fields: from political science to economic strategic interaction.\n\nMarietta College\n\nAn outstanding compilation by Greg Delemeester and Jurgen Brauer of more than 170 well documented non-computerized experiments. The platform was developed by the Marietta College. You will find a clean reference with the associated concepts and procedure for each game.\n\nMobLab\n\nAn elegant graphical online tool. You will find an efficient mobile-first platform with microeconomics, games theory, macroeconomics experiments (among others). Students will see clear graphical interfaces in each game. Developed by founders from Caltech. Its services come subject to a price.\n\nVeconLab\n\nMany experiments require a difficult logistic organization. Computer programs are a brilliant tool to implement experiments in class and outside the classroom as pedagogical tools. The University of Virginia provides a fully online implemented tool with more than 60 experiments to use in teaching or research.\n",
  });
  
  

  
  index.addDoc({
    id: 1,
    title: "Producing Testing Economics",
    content: "\nProducing Experiments in Economics\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nExperiments in Economics is written by .\n\nContributors\n\n\n  \n    \n      Juan Camilo Cárdenas\n      Universidad de los Andes\n    \n    \n      …\n      …\n    \n  \n\n\nEditorial, design, and software-development\n\nThis ebook edition is powered by the Electric Book Workflow and mantained by the Universidad de los Andes CORE Team: Alfredo Eleazar Orozco Quesada.\n\n",
  });
  
  

  
  index.addDoc({
    id: 2,
    title: "Units to experiments",
    content: "Units to experiments\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects. It will contain an alternative table of contents relating The Economy units to relevant experiments.\n",
  });
  
  

  
  index.addDoc({
    id: 3,
    title: "Experiment 1: Paper airplanes factory",
    content: "\nExperiment 1 Paper airplanes factory\n\nLearning objectives\n\nIn this project your students will get familiar with some concepts related to chapters 2 (Technology, population and growth), and 3 (Scarcity, Work, and Choice) including:\n\n\n  Key concepts\n\n  \n    Production function\n    Marginal product\n    Diminishing marginal productivity\n    Production inputs\n    Ceteris paribus assumption\n  \n\n\nIntroduction\n\nWhat will happen to a firm that doubles its number of workers in comparison to a static one? The answer may be quite surprising.\n\nThe relationship between production inputs and outputs is described by the firm’s production function (unit 2.7). According to Malthus model, increasing production inputs results in a bigger amount of product. General evidence is consistent with this. It’s key to remember that this relationship assumes everything remains unchanged except the variation in the input levels (Unit 3.1). However, theory suggests that a marginal increase of the input will provide a smaller increase in the output level; thus, increasing an input will reduce its the average product.\n\nThis experiment presents the case of a paper airplanes industry. The class will be divided into firms. Each student will be assigned a group (firm). The production inputs will be labor (number of people at the firm), capital (paper and markers) and land (space at the table). However, it’s key that only one of these factors varies across groups: labor. The other endowments must remain fixed. Theory predicts that firms with bigger amount of labor (workers) will have an inferior average product of labor.\n\n\n  Get started\n\n\n",
  });
  
  

  
  index.addDoc({
    id: 4,
    title: " book text 01-02.html",
    content: "Experiment 1: Running the experiment\n\nProtocol\n\nYou should give your students the next instructions:\n\n  Each of you is going to be a worker at a paper airplanes factory.\n  Some firms will have 1 employee. Others will have more.\n  Each of the firms will have a fixed space endowment on the table. It’s important that you use exclusively the assigned space.\n  There will be groups of 1, 2, 3, 4, 5 and 10 students.\n  All of you should produce this paper airplane with the mark XYZ Airlines on it.\n\n\nNext, you should describe the instructions to build a simple paper airplane as shown in Figure 1.1.\n\nFigure 1.1. Paper airplane folding instructions\n\n\nThen, you may proceed:\n\n  You can use as much recycled paper as you need. You will have 3 minutes to fold as many papers as possible. Remember you can only use one marker.\n  Once the time is over, I will give the announce; and, you should stop folding to report how many airplanes did your firm build.\n\n\nNext, you shall create groups with your students, depending on the number of people you have in total. Preferably, make groups of 1, 2, 3, 4, 5 and 10 individuals. If you have more students, repeat some of this groups in a balanced way.\n\nOnce the students are ready with the materials and assigned spaces, you should give the order and start a stopwatch. Give the “stop” order when the time is over. You may use the suggested table to register the results. Be careful that the students use the assigned materials and space.\n\nClass discussion\n\nOnce you finish the experiment, you may present a scatter plot with a predicted tendency similar to Figure 1.2.\n\nFigure 1.2. Paper airplanes production function\n\n\nYou may present a linear tendency first and then a logarithmic one to discuss the difference between both cases: constant vs diminishing labor productivity. You may recognize the theoretical prediction in the plot. The slope of the tangent line to the production function should decrease as the number of workers increases. You may boost the discussion with some of these questions:\n\n\n  Why do additional workers contribute less than the first worker to the total product?\n  Could it be possible to keep a constant labor productivity out of this classroom (without moving anything else)? Would it be possible to double the production by doubling the number of workers? Why?\n  What do you think would have happened if some firms had an additional table of space? Could they double their production by doubling the number of workers?\n\n\n\n  Materials and resources\n\n\n",
  });
  
  

  
  index.addDoc({
    id: 5,
    title: " book text 01-03.html",
    content: "Experiment 1: Materials and resources\n\nFor this activity you need:\n\n  Markers, one per group.\n  Many sheets of recycled paper.\n  Optional: a picture of the paper airplane instructive diagram. You may use a video beam to project it; or, you may explain the instructions by yourself while doing an example airplane.\n\n\nTemplates and documents\n\nYou may use Excel Format 1.1. to record your students results. This document contains a table where you should enter your classroom production results. Given the data, the format automatically estimates the regression coefficients. Additionally, you get an immediate plot of the estimated production function of your individual classroom. You can use this material to process the data and start a discussion in less than two minutes after the experiment.\n\nFormat 1.1. Paper airplanes production function\n\n\n\nExternal resources\n\nThis experiment has no external resources recquirements. However, you may consult Bergstrom and Miller (1999) whenever you need additional information.\n",
  });
  
  

  
  index.addDoc({
    id: 6,
    title: "Experiment 2: ",
    content: "\nExperiment 2 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 7,
    title: " book text 02-02.html",
    content: "Experiment 2: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 8,
    title: " book text 02-03.html",
    content: "Experiment 2: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 9,
    title: "Experiment 3: ",
    content: "\nExperiment 3 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 10,
    title: " book text 03-02.html",
    content: "Experiment 3: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 11,
    title: " book text 03-03.html",
    content: "Experiment 3: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 12,
    title: "Experiment 4: ",
    content: "\nExperiment 4 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 13,
    title: " book text 04-02.html",
    content: "Experiment 4: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 14,
    title: " book text 04-03.html",
    content: "Experiment 4: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 15,
    title: "Experiment 5: ",
    content: "\nExperiment 5 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 16,
    title: " book text 05-02.html",
    content: "Experiment 5: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 17,
    title: " book text 05-03.html",
    content: "Experiment 5: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 18,
    title: "Experiment 6: ",
    content: "\nExperiment 6 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 19,
    title: " book text 06-02.html",
    content: "Experiment 6: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 20,
    title: " book text 06-03.html",
    content: "Experiment 6: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 21,
    title: "Experiment 7: ",
    content: "\nExperiment 7 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 22,
    title: " book text 07-02.html",
    content: "Experiment 7: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 23,
    title: " book text 07-03.html",
    content: "Experiment 7: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 24,
    title: "Experiment 8: ",
    content: "\nExperiment 8 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 25,
    title: " book text 08-02.html",
    content: "Experiment 8: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 26,
    title: " book text 08-03.html",
    content: "Experiment 8: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 27,
    title: "Experiment 9: ",
    content: "\nExperiment 9 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 28,
    title: " book text 09-02.html",
    content: "Experiment 9: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 29,
    title: " book text 09-03.html",
    content: "Experiment 9: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 30,
    title: "Experiment 10: ",
    content: "\nExperiment 10 Paper airplanes factory\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nLearning objectives\n\n\n  Key concepts\n\n  \n    Concepts needed for this project: mean, median, and decile.\n    Concepts introduced in this project: variance, frequency table, correlation and correlation coefficient, causation, and spurious correlation.\n  \n\n\nIntroduction\n",
  });
  
  

  
  index.addDoc({
    id: 31,
    title: " book text 10-02.html",
    content: "Experiment 10: Running the experiment\n\nProtocol\n\nThis will contain the experiment protocol.\n\nClass discussion\n\nThis will have a suggested format to present the results and boost the discussion.\n",
  });
  
  

  
  index.addDoc({
    id: 32,
    title: " book text 10-03.html",
    content: "Experiment 10: Materials and resources\n\nThis section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\nTemplates and documents\n\nTemplates here.\n\nExternal resources\n\nExternal resources here.\n",
  });
  
  

  
  index.addDoc({
    id: 33,
    title: "Glossary",
    content: "Glossary\n\n\nbox and whisker plotA graphic display of the range and quartiles of a distribution, where the first and third quartile form the ‘box’ and the maximum and minimum values form the ‘whiskers’.causationA direction from cause to effect, establishing that a change in one variable produces a change in another. While a correlation gives an indication of whether two variables move together (either in the same or opposite directions), causation means that there is a mechanism that explains this association. Example: We know that higher levels of CO2 in the atmosphere lead to a greenhouse effect, which warms the Earth’s surface. Therefore we can say that higher CO2 levels are the cause of higher surface temperatures.conditional meanAn average of a variable, taken over a subgroup of observations that satisfy certain conditions, rather than all observations.confidence intervalA range of values that is centred around the sample value, and is defined so that there is a specified probability (usually 95%) that it contains the ‘true value’ of interest.contingent valuationA survey-based technique used to assess the value of non-market resources. Also known as: stated-preference model.correlation coefficientnumerical measure of how closely associated two variables are and whether they tend to take similar or dissimilar values, ranging from a value of 1, indicating that the variables take similar values (positively correlated), to −1, indicating that the variables take dissimilar variables (negative or inverse correlation). A value of 1 or −1 indicates that knowing the value of one of the variables would allow you to perfectly predict the value of the other. A value of 0 indicates that knowing one of the variables provides no information about the value of the other.correlationA measure of how closely related two variables are. Two variables are correlated if knowing the value of one variable provides information on the likely value of the other, for example high values of one variable being commonly observed along with high values of the other variable. Correlation can be positive or negative. It is negative when high values of one variable are observed with low values of the other. Correlation does not mean that there is a causal relationship between the variables. Example: When the weather is hotter, purchases of ice cream are higher. Temperature and ice cream sales are positively correlated. On the other hand, if purchases of hot beverages decrease when the weather is hotter, we say that temperature and hot beverage sales are negatively correlated.Cronbach’s alphaA measure used to assess the extent to which a set of items is a reliable or consistent measure of a concept. This measure ranges from 0–1, with 0 meaning that all of the items are independent of one another, and 1 meaning that all of the items are perfectly correlated with each other.cross-sectional dataData that is collected from participants at one point in time or within a relatively short time frame. In contrast, time series data refers to data collected by following an individual (or firm, country, etc.) over a course of time. Example: Data on degree courses taken by all the students in a particular university in 2016 is considered cross-sectional data. In contrast, data on degree courses taken by all students in a particular university from 1990 to 2016 is considered time series data.differences-in-differencesA method that applies an experimental research design to outcomes observed in a natural experiment. It involves comparing the difference in the average outcomes of two groups, a treatment and control group, both before and after the treatment took place.dummy variable (indicator variable)A variable that takes the value 1 if a certain condition is met, and 0 otherwise.endogenousProduced by the workings of a model rather than coming from outside the model. See also: exogenousexogenousComing from outside the model rather than being produced by the workings of the model itself. See also: endogenous.frequency tableA record of how many observations in a dataset have a particular value, range of values, or belong to a particular category.geometric meanA summary measure calculated by multiplying N numbers together and then taking the Nth root of this product. The geometric mean is useful when the items being averaged have different scoring indices or scales, because it is not sensitive to these differences, unlike the arithmetic mean. For example, if education ranged from 0 to 20 years and life expectancy ranged from 0 to 85 years, life expectancy would have a bigger influence on the HDI than education if we used the arithmetic mean rather than the geometric mean. Conversely, the geometric mean treats each criteria equally. Example: Suppose we use life expectancy and mean years of schooling to construct an index of wellbeing. Country A has life expectancy of 40 years and a mean of 6 years of schooling. If we used the arithmetic mean to make an index, we would get (40 + 6)/2 = 23. If we used the geometric mean, we would get (40 × 6)1/2 = 15.5.  Now suppose life expectancy doubled to 80 years. The arithmetic mean would be (80 + 6)/2 = 43, and the geometric mean would be (80 × 6)1/2 = 21.9. If, instead, mean years of schooling doubled to 12 years, the arithmetic mean would be (40 + 12)/2 = 26, and the geometric mean would be (40 × 12)1/2 = 21.9. This example shows that the arithmetic mean can be ‘unfair’ because proportional changes in one variable (life expectancy) have a larger influence over the index than changes in the other variable (years of schooling). The geometric mean gives each variable the same influence over the value of the index, so doubling the value of one variable would have the same effect on the index as doubling the value of another variable.Gini coefficientA measure of inequality of any quantity such as income or wealth, varying from a value of zero (if there is no inequality) to one (if a single individual receives all of it).indexAn index is formed by aggregating the values of multiple items into a single value, and is used as a summary measure of an item of interest. Example: The HDI is a summary measure of wellbeing, and is calculated by aggregating the values for life expectancy, expected years of schooling, mean years of schooling, and gross national income per capita.inflationAn increase in the general price level in the economy. Usually measured over a year. See also: deflation, disinflation.leverage ratio (for banks or households)The value of assets divided by the equity stake (capital contributed by owners and shareholders) in those assets.leverage ratio (for non-bank companies)The value of total liabilities divided by total assets.Likert scaleA numerical scale (usually ranging from 1–5 or 1–7) used to measure attitudes or opinions, with each number representing the individual’s level of agreement or disagreement with a particular statement.Lorenz curveA graphical representation of inequality of some quantity such as wealth or income. Individuals are arranged in ascending order by how much of this quantity they have, and the cumulative share of the total is then plotted against the cumulative share of the population. For complete equality of income, for example, it would be a straight line with a slope of one. The extent to which the curve falls below this perfect equality line is a measure of inequality. See also: Gini coefficient.natural experimentAn empirical study exploiting naturally occurring statistical controls in which researchers do not have the ability to assign participants to treatment and control groups, as is the case in conventional experiments. Instead, differences in law, policy, weather, or other events can offer the opportunity to analyse populations as if they had been part of an experiment. The validity of such studies depends on the premise that the assignment of subjects to the naturally occurring treatment and control groups can be plausibly argued to be random.p-valueThe probability of observing the data collected, assuming that the two groups have the same mean. The p-value ranges from 0 to 1, where lower values indicate a higher probability that the underlying assumption (same means) is false. The lower the probability (the lower the p-value), the less likely it is to observe the given data, and therefore the more likely it is that the assumption is false (the means of both distributions is not the same).principal–agent relationshipThis is an asymmetrical relationship in which one party (the principal) benefits from some action or attribute of the other party (the agent) about which the principal’s information is not sufficient to enforce in a complete contract. See also: incomplete contract. Also known as: principal–agent problem.rangeThe interval formed by the smallest (minimum) and the largest (maximum) value of a particular variable. The range shows the two most extreme values in the distribution, and can be used to check whether there are any outliers in the data. (Outliers are a few observations in the data that are very different from the rest of the observations.)selection biasAn issue that occurs when the sample or data observed is not representative of the population of interest. For example, individuals with certain characteristics may be more likely to be part of the sample observed (such as students being more likely than CEOs to participate in computer lab experiments).significance levelA cut-off probability that determines whether a p-value is considered statistically significant. If a p-value is smaller than the significance level, it is considered unlikely that the differences observed are due to chance, given the assumptions made about the variables (for example, having the same mean). Common significance levels are 1% (p-value of 0.01), 5% (p-value of 0.05), and 10% (p-value of 0.1). See also: statistically significant, p-value.simultaneityWhen the right-hand and left-hand variables in a model equation affect each other at the same time, so that the direction of causality runs both ways. For example, in supply and demand models, the market price affects the quantity supplied and demanded, but quantity supplied and demanded can in turn affect the market price.spurious correlationA strong linear association between two variables that does not result from any direct relationship, but instead may be due to coincidence or to another unseen factor.standard deviationA measure of dispersion in a frequency distribution, equal to the square root of the variance. The standard deviation has a similar interpretation to the variance. A larger standard deviation means that the data is more spread out. Example: The set of numbers 1, 1, 1 has a standard deviation of zero (no variation or spread), while the set of numbers 1, 1, 999 has a standard deviation of 46.7 (large spread).statistically significantWhen a relationship between two or more variables is unlikely to be due to chance, given the assumptions made about the variables (for example, having the same mean). Statistical significance does not tell us whether there is a causal link between the variables.time series dataA time series is a set of time-ordered observations of a variable taken at successive, in most cases regular, periods or points of time. Example: The population of a particular country in the years 1990, 1991, 1992, … , 2015 is time series data.varianceA measure of dispersion in a frequency distribution, equal to the mean of the squares of the deviations from the arithmetic mean of the distribution. The variance is used to indicate how ‘spread out’ the data is. A higher variance means that the data is more spread out. Example: The set of numbers 1, 1, 1 has zero variance (no variation), while the set of numbers 1, 1, 999 has a high variance of 2178 (large spread).weighted averageA type of average that assigns greater importance (weight) to some components than to others, in contrast with a simple average, which weights each component equally. Components with a larger weight can have a larger influence on the average.\n\n",
  });
  
  

  
  index.addDoc({
    id: 34,
    title: "Bibliography",
    content: "Bibliography\n\nThis section is under development and will be ready in the next release of Experiments in Economics: Laboratory Projects\n\nPreface\n\n\n                                                                Gino, F., Argote, L., Miron-Spektor, E., &amp; Todorova, G. (2010). First, get your feet wet: The effects of learning from direct and indirect experience on team creativity. Organizational Behavior and Human Decision Processes,111(2), 102-115. doi:10.1016/j.obhdp.2009.11.002            \n\n\nExperiment 1\n\n\n                                                                Bergstrom, T. and Miller, J. H. (1999) Experiment 10: Measuring Productivity. In Experiments with Economic Principles: Microeconomics. McGraw-Hill Companies Inc. (2nd Ed.)            \n\n\nExperiment 2\n\n\n        \n\n\nExperiment 3\n\n\n        \n\n\nExperiment 4\n\n\n        \n\n\nExperiment 5\n\n\n        \n\n\nExperiment 6\n\n\n        \n\n\nExperiment 7\n\n\n        \n\n\nExperiment 8\n\n\n        \n\n\nExperiment 9\n\n\n        \n\n\nExperiment 10\n\n\n        \n\n",
  });
  
  

  
  index.addDoc({
    id: 35,
    title: "Copyright acknowledgements",
    content: "Copyright acknowledgements\n\nCover: Market street Near Yau Ma Tei: Connie / Flikr.com\n\nWe would like to acknowledge everybody who granted us permission to reproduce images, figures and quotations throughout this text. Every effort was made to trace copyright holders, but we will make arrangements to clear permission for material reproduced in this book with any copyright holders whom it has not been possible to contact.\n\n",
  });
  
  

  

  

  
  index.addDoc({
    id: 36,
    title: " book text ",
    content: "{% include redirect target=\"0-3-contents.html\" %}\n",
  });
  
  

  
  index.addDoc({
    id: 37,
    title: " book ",
    content: "{% include redirect target=\"text/0-3-contents.html\" %}\n",
  });
  
  

  
  index.addDoc({
    id: 38,
    title: "Home",
    content: "Eileen Tipoe and the ESPP empirical projects working group Doing economics:Empirical projects\n    {% include beta-button %}\n\n\n[Read now](book/text/0-3-contents.html)\n{:.button}\n",
  });
  
  

  

  


// add data to a store, since elasticlunr only returns (0-based indexed) `ref`
var store = [
  
  
    
  
    
  
    
  
    
  
    
  
    
  
    {
      'title': "A note to instructors",
      'excerpt': "Personal experience is a powerful teaching tool. Experiments in Economics is designed to provide teachers a complete set of materials&hellip;",
      'url': "book/text/0-5-note-to-instructors.html"
    },
    
  
    {
      'title': "Producing Testing Economics",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects\n\n",
      'url': "book/text/0-6-contributors.html"
    },
    
  
    {
      'title': "Units to experiments",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects. It will&hellip;",
      'url': "book/text/0-7-units-to-experiments.html"
    },
    
  
    {
      'title': "Experiment 1: Paper airplanes factory",
      'excerpt': "In this project your students will get familiar with some concepts related to chapters 2 (Technology, population and growth),&hellip;",
      'url': "book/text/01-01.html"
    },
    
  
    {
      'title': " book text 01-02.html",
      'excerpt': "You should give your students the next instructions:  Each of you is going to be a worker at a&hellip;",
      'url': "book/text/01-02.html"
    },
    
  
    {
      'title': " book text 01-03.html",
      'excerpt': "For this activity you need:  Markers, one per group. Many sheets of recycled paper. Optional: a picture of the&hellip;",
      'url': "book/text/01-03.html"
    },
    
  
    {
      'title': "Experiment 2: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/02-01.html"
    },
    
  
    {
      'title': " book text 02-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/02-02.html"
    },
    
  
    {
      'title': " book text 02-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/02-03.html"
    },
    
  
    {
      'title': "Experiment 3: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/03-01.html"
    },
    
  
    {
      'title': " book text 03-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/03-02.html"
    },
    
  
    {
      'title': " book text 03-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/03-03.html"
    },
    
  
    {
      'title': "Experiment 4: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/04-01.html"
    },
    
  
    {
      'title': " book text 04-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/04-02.html"
    },
    
  
    {
      'title': " book text 04-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/04-03.html"
    },
    
  
    {
      'title': "Experiment 5: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/05-01.html"
    },
    
  
    {
      'title': " book text 05-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/05-02.html"
    },
    
  
    {
      'title': " book text 05-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/05-03.html"
    },
    
  
    {
      'title': "Experiment 6: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/06-01.html"
    },
    
  
    {
      'title': " book text 06-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/06-02.html"
    },
    
  
    {
      'title': " book text 06-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/06-03.html"
    },
    
  
    {
      'title': "Experiment 7: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/07-01.html"
    },
    
  
    {
      'title': " book text 07-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/07-02.html"
    },
    
  
    {
      'title': " book text 07-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/07-03.html"
    },
    
  
    {
      'title': "Experiment 8: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/08-01.html"
    },
    
  
    {
      'title': " book text 08-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/08-02.html"
    },
    
  
    {
      'title': " book text 08-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/08-03.html"
    },
    
  
    {
      'title': "Experiment 9: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/09-01.html"
    },
    
  
    {
      'title': " book text 09-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/09-02.html"
    },
    
  
    {
      'title': " book text 09-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/09-03.html"
    },
    
  
    {
      'title': "Experiment 10: ",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Learning&hellip;",
      'url': "book/text/10-01.html"
    },
    
  
    {
      'title': " book text 10-02.html",
      'excerpt': "This will contain the experiment protocol.\n\nClass discussion\n\n",
      'url': "book/text/10-02.html"
    },
    
  
    {
      'title': " book text 10-03.html",
      'excerpt': "This section is under development and will be in the next release of Experiments in Economics: Laboratory Projects Templates&hellip;",
      'url': "book/text/10-03.html"
    },
    
  
    {
      'title': "Glossary",
      'excerpt': "",
      'url': "book/text/50-01-glossary.html"
    },
    
  
    {
      'title': "Bibliography",
      'excerpt': "This section is under development and will be ready in the next release of Experiments in Economics: Laboratory Projects <h2&hellip;",
      'url': "book/text/50-02-bibliography.html"
    },
    
  
    {
      'title': "Copyright acknowledgements",
      'excerpt': "Cover: Market street Near Yau Ma Tei: Connie / Flikr.com We would like to acknowledge everybody who granted&hellip;",
      'url': "book/text/50-03-copyright-acknowledgements.html"
    },
    
  
    
  
    
  
    {
      'title': " book text ",
      'excerpt': "",
      'url': "book/text/"
    },
    
  
    {
      'title': " book ",
      'excerpt': "",
      'url': "book/"
    },
    
  
    {
      'title': "Home",
      'excerpt': "",
      'url': ""
    },
    
  
    
  
    
  
];

function ebDisplaySearchResults(e,r){var a="";if(e.length){if(a+='<div class="search-results" id="search-results">',a+="<h2>"+locales[pageLanguage].search["search-results"]+"</h2>",1==e.length)var s=locales[pageLanguage].search["results-for-singular"];else var s=locales[pageLanguage].search["results-for-plural"];a+="<p>"+e.length+" "+s,a+=' "<mark>'+searchTerm+'</mark>".</p>',a+="<ul>";for(var l=0;l<e.length;l++){var c=r[e[l].ref];a+="<li>",a+="<h3>",a+='<a href="'+c.url+"?query=",a+=searchTerm+'">'+c.title+" </a>",a+="</h3>",a+="<p>"+c.excerpt+"</p>",a+="</li>"}a+="</ul>",a+="</div>"}else{var s=locales[pageLanguage].search["results-for-none"];a+="<p>"+s+' "'+searchTerm+'".</p>'}document.getElementById("search-results").innerHTML=a}if(searchTerm){var searchResultsContainer=document.getElementById("search-results");searchResultsContainer&&(searchResultsContainer.innerHTML="<p>"+locales[pageLanguage].search["placeholder-searching"]+"</p>");var results=index.search(searchTerm,{bool:"AND"});ebDisplaySearchResults(results,store)}


