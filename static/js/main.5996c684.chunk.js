(this["webpackJsonpsnake-eyes"]=this["webpackJsonpsnake-eyes"]||[]).push([[0],{25:function(e,t,a){e.exports=a.p+"static/media/blop.627c0e8b.mp3"},26:function(e,t,a){e.exports=a.p+"static/media/gong.dd145efd.mp3"},27:function(e,t,a){e.exports=a.p+"static/media/aww.2c3d60cd.mp3"},28:function(e,t,a){e.exports=a.p+"static/media/cheer.c597f127.mp3"},29:function(e,t,a){e.exports=a.p+"static/media/ting.b0da548d.mp3"},31:function(e,t,a){e.exports=a(51)},36:function(e,t,a){},37:function(e,t,a){},43:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){},46:function(e,t,a){},47:function(e,t,a){},48:function(e,t,a){},49:function(e,t,a){},50:function(e,t){function a(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}a.keys=function(){return[]},a.resolve=a,e.exports=a,a.id=50},51:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(22),r=a.n(i),o=(a(36),a(5)),c=a(6),p=a(2),l=a(8),u=a(7),d=a(14),h=a(11),m=(a(37),function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return s.a.createElement("div",null,this.props.id&&s.a.createElement("div",{className:"game"},s.a.createElement("h2",null,"Hot Potato"),s.a.createElement("p",null,"Describe and guess words as quickly as possible for more points... but don't let the buzzer end on you \ud83d\ude40"),s.a.createElement(d.b,{to:"room/"+this.props.id},"Play")))}}]),a}(s.a.Component)),v=a(19),b=a(10),f=a(12);a(43);var g=function(e){var t=Object.entries(e.participants).map((function(t){return s.a.createElement("div",{key:t[0],className:e.turn.pId===t[0]?"active participant":"participant"},s.a.createElement("div",{className:"propic"},s.a.createElement("img",{src:"https://api.adorable.io/avatars/75/"+t[0],alt:t[1].name+"'s Avatar"})),s.a.createElement("div",{className:"name"},t[1].name," [",t[1].score,"]"))}));return s.a.createElement("div",{className:"participants"},t)},y=(a(44),function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={name:""},n.handleChange=n.handleChange.bind(Object(p.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(p.a)(n)),n}return Object(c.a)(a,[{key:"handleChange",value:function(e){this.setState({name:e.target.value.trim()})}},{key:"handleSubmit",value:function(e){""!==this.state.name&&this.props.updateName(this.state.name),e.preventDefault()}},{key:"render",value:function(){return s.a.createElement("div",{className:"profile"},s.a.createElement("img",{src:"https://api.adorable.io/avatars/75/"+this.props.id,alt:"Your Avatar"}),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("label",null,"Nickname",s.a.createElement("input",{type:"text",placeholder:"Dr. Sesame",value:this.state.name,onChange:this.handleChange})),s.a.createElement("input",{type:"submit",value:"Join",disabled:""===this.state.name})))}}]),a}(s.a.Component));a(45);var k=function(e){return e.round.playing&&e.turn.pId===e.player?s.a.createElement("div",{className:"card"},s.a.createElement("div",{className:"word"},e.turn.word),s.a.createElement("div",{className:"instructions"},"Give clues and get someone to guess your word! No rhyming, translating, or spelling, and don't let the timer end on you!")):e.round.playing?s.a.createElement("div",{className:"card flipped"},s.a.createElement("img",{src:"https://api.adorable.io/avatars/75/"+e.turn.pId,alt:e.turn.pId+"'s Avatar"}),s.a.createElement("div",{className:"instructions"},"Be the first to guess the word to earn points!")):s.a.createElement("div",null)},E=(a(46),a(25)),O=a.n(E),j=a(26),w=a.n(j),C=a(27),N=a.n(C),S=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={remaining:n.getRemainingTime(e.start)},n.timer=n.timer.bind(Object(p.a)(n)),n.SCARY=15,n}return Object(c.a)(a,[{key:"getRemainingTime",value:function(){return Math.floor((this.props.start+1e3*this.props.duration-(new Date).getTime())/1e3)}},{key:"componentDidMount",value:function(){this.blop=new Audio(O.a),this.blop.loop=!1,this.props.start&&(this.timerInterval=setInterval(this.timer,1e3))}},{key:"componentDidUpdate",value:function(e){this.props.start!==e.start&&(this.timerInterval=setInterval(this.timer,1e3))}},{key:"timer",value:function(){var e=this,t=this.getRemainingTime(this.props.start);if(this.setState({remaining:t}),t>40&&t%2===0)this.blop.play();else if(t<=40&&t>this.SCARY)this.blop.play();else if(t<=this.SCARY&&t>0)this.blop.play(),setTimeout((function(){e.blop.play()}),500);else if(0===t){if(this.props.isPlayersTurn)new Audio(N.a).play();new Audio(w.a).play()}else t<=0&&clearInterval(this.timerInterval)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timerInterval)}},{key:"render",value:function(){return this.state.remaining?s.a.createElement("div",null,s.a.createElement("div",{className:this.state.remaining<=this.SCARY?"timer scary":"timer"},this.state.remaining)):s.a.createElement("div",null)}}]),a}(n.Component);a(47);var I=function(e){var t="",a=e.chat.map((function(a,n){var i;return a.sender!==t&&(i=s.a.createElement("div",{className:"sender"},e.participants[a.sender].name),t=a.sender),s.a.createElement("div",{key:n},i,s.a.createElement("div",{className:"message"},a.message))}));return s.a.createElement("div",{className:"chat"},a)},R=(a(48),["taxi cab","standing ovation","alarm clock","tool","banana peel","flagpole","money","wallet","ballpoint pen","sunburn","wedding ring","spy","baby-sitter","aunt","acne","bib","puzzle piece","pawn","astronaut","tennis shoes","blue jeans","twig","outer space","banister","batteries","doghouse","campsite","plumber","bedbug","throne","tiptoe","log","mute","pogo stick","stoplight","ceiling fan","bedspread","bite","stove","windmill","nightmare","stripe","spring","wristwatch","eat","matchstick","gumball","bobsled","bonnet","flock","sprinkler","living room","laugh","snuggle","sneeze","bud","elf","headache","slam dunk","Internet","saddle","ironing board","bathroom scale","kiss","shopping cart","shipwreck","funny","glide","lamp","candlestick","grandfather","rocket","home movies","seesaw","rollerblades","smog","grill","goblin","coach","claw","cloud","shelf","recycle","glue stick","Christmas carolers","front porch","earache","robot","foil","rib","robe","crumb","paperback","hurdle","rattle","fetch","date","iPod","dance","cello","flute","dock","prize","dollar","puppet","brass","firefighter","huddle","easel","pigpen","bunk bed","bowtie","fiddle","dentist","baseboards","letter opener","photographer","magic","Old Spice","monster"]);var T=function(){return R[Math.floor(Math.random()*R.length)]},x=a(28),A=a.n(x),D=a(29),M=a.n(D),H=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={isHost:n.props.id===n.props.match.params.id,connections:{},round:{},turn:{},participants:n.props.id?Object(f.a)({},n.props.id,{name:n.props.player,score:0}):{},chat:[]},n.startRound=n.startRound.bind(Object(p.a)(n)),n.endRound=n.endRound.bind(Object(p.a)(n)),n.receive=n.receive.bind(Object(p.a)(n)),n.sendChatMessage=n.sendChatMessage.bind(Object(p.a)(n)),n.nextTurn=n.nextTurn.bind(Object(p.a)(n)),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.state.isHost&&this.props.peer.on("connection",(function(t){e.setupConnection(t)}))}},{key:"componentDidUpdate",value:function(e){if(this.props.id!==e.id||this.props.player!==e.player)if(!this.state.isHost&&this.props.id&&this.props.player){var t=this.props.peer.connect(this.props.match.params.id);this.setupConnection(t)}else this.state.isHost&&this.props.player&&this.receive({type:"name",name:this.props.player},this.props.id)}},{key:"setupConnection",value:function(e){var t=this;e.on("open",(function(){t.state.isHost?t.setState((function(t,a){return{connections:Object(b.a)({},t.connections,Object(f.a)({},e.peer,e)),participants:Object(b.a)({},t.participants,Object(f.a)({},e.peer,{name:e.peer,score:0}))}}),(function(){t.send({type:"sync",prop:"participants",data:t.state.participants})})):(t.setState((function(t,a){return{connections:Object(b.a)({},t.connections,Object(f.a)({},e.peer,e))}})),t.send({type:"name",name:t.props.player}))})),e.on("error",(function(e){if(console.error(e),t.props.id&&!t.state.isHost){var a=t.props.peer.connect(t.props.match.params.id);t.setupConnection(a)}})),e.on("close",(function(){t.state.isHost&&t.setState((function(t,a){var n=Object(b.a)({},t.connections),s=Object(b.a)({},t.participants);return delete n[e.peer],delete s[e.peer],{connections:n,participants:s}}),(function(){t.send({type:"sync",prop:"participants",data:t.state.participants})}))})),e.on("data",(function(a){t.receive(a,e.peer)}))}},{key:"send",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.state.connections;for(var a in t)t[a].send(e)}},{key:"receive",value:function(e,t){switch(e.type){case"log":console.log(e.message);break;case"chat":this.addToChat(e.message,t);break;case"sync":this.setState(Object(f.a)({},e.prop,e.data));break;case"sound":new Audio(M.a).play();break;case"name":var a=Object(b.a)({},this.state.participants);a[t].name=e.name,this.sendAndReceive({type:"sync",prop:"participants",data:a});break;default:console.log("Received ",e)}}},{key:"sendAndReceive",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.state.connections;this.send(e,t),this.receive(e,this.props.id)}},{key:"nextTurn",value:function(){var e=T(),t=Object.keys(this.state.participants),a=0;void 0!==this.state.turn.pIndex&&(a=this.state.turn.pIndex+1<t.length?this.state.turn.pIndex+1:0);var n={pId:t[a],pIndex:a,word:e,start:(new Date).getTime()};this.send({type:"sync",prop:"turn",data:n}),this.setState({turn:n})}},{key:"startRound",value:function(){var e={playing:!0,start:(new Date).getTime()};setTimeout(this.endRound,6e4),this.nextTurn(),this.send({type:"sync",prop:"round",data:e}),this.setState({round:e})}},{key:"endRound",value:function(){var e={playing:!1};this.send({type:"sync",prop:"round",data:e}),this.setState({round:e});var t=Object(b.a)({},this.state.participants),a=t[this.state.turn.pId].score;t[this.state.turn.pId].score-=a>5?5:a,this.setState({participants:t}),this.send({type:"sync",prop:"participants",data:t})}},{key:"addToChat",value:function(e,t){if(this.state.isHost){if(this.state.round.playing&&e&&e.toLowerCase()===this.state.turn.word.toLowerCase()&&this.state.turn.pId!==t){this.sendAndReceive({type:"sound",name:"ting"});var a=Object(b.a)({},this.state.participants),n=10-Math.floor(((new Date).getTime()-this.state.turn.start)/1e3);a[this.state.turn.pId].score+=n>0?n:1,a[t].score+=n>0?n:1,this.sendAndReceive({type:"sync",prop:"participants",data:a}),this.nextTurn()}this.send({type:"chat",message:{message:e,sender:t}}),this.setState((function(a,n){return{chat:[].concat(Object(v.a)(a.chat),[{message:e,sender:t}])}}))}else this.setState((function(t,a){return{chat:[].concat(Object(v.a)(t.chat),[e])}}))}},{key:"sendChatMessage",value:function(e){e.preventDefault();var t=e.target.elements.message.value.trim();t&&(this.state.isHost?this.addToChat(t,this.props.id):this.send({type:"chat",message:t}),this.state.round.playing&&t&&t.toLowerCase()===this.state.turn.word.toLowerCase()&&this.state.turn.pId!==this.props.id&&new Audio(A.a).play());e.target.elements.message.value=""}},{key:"render",value:function(){return this.props.player?this.state.isHost||this.state.connections[this.props.match.params.id]?s.a.createElement("div",{className:"container"},s.a.createElement(I,{chat:this.state.chat,participants:this.state.participants}),s.a.createElement("main",null,s.a.createElement("h1",null,"Hot Potato"),Object.keys(this.state.participants).length<2&&s.a.createElement("p",null,"Invite friends to play using the URL"),s.a.createElement(S,{start:this.state.round.start,duration:60,isPlayersTurn:this.props.id===this.state.turn.pId}),s.a.createElement(k,{round:this.state.round,player:this.props.id,turn:this.state.turn}),s.a.createElement(g,{participants:this.state.participants,turn:this.state.turn,player:this.props.id}),this.state.isHost&&!this.state.round.playing&&Object.keys(this.state.participants).length>1&&s.a.createElement("button",{type:"button",onClick:this.startRound},"Start")),s.a.createElement("form",{onSubmit:this.sendChatMessage,autoComplete:"off",className:"chatbar"},s.a.createElement("input",{type:"text",id:"message",name:"message",placeholder:this.state.round.playing?"Enter Guess":"Enter Message"}),s.a.createElement("input",{type:"submit",value:"Send"}))):s.a.createElement("div",{className:"loader"}):s.a.createElement(y,{id:this.props.id,updateName:this.props.updateName})}}]),a}(s.a.Component),U=Object(h.f)(H),z=(a(49),a(30)),L=a.n(z),P=function(e){Object(l.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={id:void 0,name:void 0},n.updateName=n.updateName.bind(Object(p.a)(n)),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this,t=new L.a;t.on("open",(function(a){console.log("My peer ID is: "+a),e.setState({id:a,peer:t})}))}},{key:"componentWillUnmount",value:function(){this.state.peer.disconnect()}},{key:"updateName",value:function(e){this.setState({name:e})}},{key:"render",value:function(){return s.a.createElement(d.a,null,s.a.createElement(h.c,null,s.a.createElement(h.a,{path:"/room/:id"},s.a.createElement(U,{id:this.state.id,peer:this.state.peer,player:this.state.name,updateName:this.updateName})),s.a.createElement(h.a,{path:"/"},s.a.createElement(m,{id:this.state.id}))))}}]),a}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[31,1,2]]]);
//# sourceMappingURL=main.5996c684.chunk.js.map