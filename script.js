//#PURE-START
const ROWS=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
const UNITS=ROWS.join("").split("");
const LABEL=u=>u;
const norm=s=>String(s).toUpperCase().replace(/[\u2018\u2019\u02BB\u02BC\u0060\u00B4']/g,"'").replace(/\s+/g," ").trim();
function tokenize(a){return Array.from(norm(a));}
const W={50:35/3,100:25/3,300:5,500:5,0:5,B:1.25,L:1.25,E1:1.25,E2:1.25};
const ORDER=[50,"B",100,300,"L",50,500,0,100,"E1",50,"B",300,100,"L",500,"B",300,"E2","L"];
const INFO={
 50:{t:"50",f:"50 POINTS",r:"COMMON",c:"#c9ced6",x:"#14213d",g:"#e3e7ee"},
 100:{t:"100",f:"100 POINTS",r:"UNCOMMON",c:"#5bc8ff",x:"#06223a",g:"#7fd8ff"},
 300:{t:"300",f:"300 POINTS",r:"RARE",c:"#2358e0",x:"#fff",g:"#5b8cff"},
 500:{t:"500",f:"500 POINTS",r:"LEGENDARY",c:"url(#gold)",x:"#1a1400",g:"#f5d142"},
 0:{t:"0",f:"0 POINTS",r:"ZERO",c:"#c9ced6",x:"#14213d",g:"#e3e7ee"},
 B:{t:"BANKRUPT",f:"BANKRUPT",r:"ARCANE",c:"#050505",x:"#fff",g:"#ffffff"},
 L:{t:"+1 LETTER",f:"+1 LETTER",r:"ARCANE",c:"#d6202f",x:"#fff",g:"#ff4b5c"},
 E1:{t:"+1 CHANCE",f:"+1 EXTRA CHANCE",r:"ARCANE",c:"#d6202f",x:"#fff",g:"#ff4b5c"},
 E2:{t:"+2 CHANCES",f:"+2 EXTRA CHANCES",r:"ARCANE",c:"#d6202f",x:"#fff",g:"#ff4b5c"}};
function buildSectors(){const span=360/ORDER.length;return ORDER.map((k,i)=>({key:k,p:W[k],a0:i*span,a1:(i+1)*span}));}
function pickSector(sec,r){let acc=0;for(const s of sec){acc+=s.p;if(r*100<acc)return s;}return sec[sec.length-1];}
//#PURE-END

(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const T=CONFIG.teamNames,Q=QUESTIONS,SEC=buildSectors();
const wheel=$("wheel"),spinBtn=$("spinBtn"),wordBtn=$("wordBtn"),nextBtn=$("nextBtn"),kb=$("keyboard"),wordEl=$("word"),statusEl=$("status");
let S={qi:0,overall:[0,0,0],round:[0,0,0],active:0,opps:3,revealed:new Set(),tokens:[],phase:"spin",pending:null,last:null,lit:false};
let rot=0;

/* ---------- wheel drawing ---------- */
function pt(r,deg){const a=deg*Math.PI/180;return[(r*Math.sin(a)).toFixed(2),(-r*Math.cos(a)).toFixed(2)];}
function drawWheel(){
 const R=190;let h='<defs><linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="-190" y1="-190" x2="190" y2="190"><stop offset="0" stop-color="#fff6c7"/><stop offset=".3" stop-color="#f5d142"/><stop offset=".55" stop-color="#b8901a"/><stop offset=".78" stop-color="#ffe98a"/><stop offset="1" stop-color="#d9b52c"/></linearGradient></defs>';
 SEC.forEach(s=>{const i=INFO[s.key],[x0,y0]=pt(R,s.a0),[x1,y1]=pt(R,s.a1),big=(s.a1-s.a0)>180?1:0,mid=(s.a0+s.a1)/2;
  const arc=(s.a1-s.a0)*Math.PI/180*R*.72,fs=Math.max(9,Math.min(20,arc*.8));
  const dark=i.x;
  h+=`<path d="M0,0L${x0},${y0}A${R},${R} 0 ${big} 1 ${x1},${y1}Z" fill="${i.c}" stroke="#0a0f24" stroke-width="1.5"/>`;
  h+=`<g transform="rotate(${mid.toFixed(2)})"><text transform="translate(0,${-(R-12)}) rotate(90)" font-size="${fs.toFixed(1)}" font-weight="800" fill="${dark}" dominant-baseline="central" font-family="Segoe UI,Arial,sans-serif">${i.t}</text></g>`;});
 h+=`<circle r="${R}" fill="none" stroke="url(#gold)" stroke-width="7"/><circle r="26" fill="#0a0f24" stroke="url(#gold)" stroke-width="5"/>`;
 wheel.innerHTML=h;
}
function spin(){
 if(S.phase!=="spin")return;S.phase="spinning";ui();
 const s=pickSector(SEC,Math.random()),th=s.a0+(s.a1-s.a0)*(.15+Math.random()*.7);
 rot+=360*6+(((-th-rot)%360)+360)%360;
 wheel.style.transition="transform 5s cubic-bezier(.12,.6,.1,1)";wheel.style.transform=`rotate(${rot}deg)`;
 say("Spinning…");setTimeout(()=>onResult(s),5250);
}
function onResult(s){
 const k=s.key,inf=INFO[k],n=T[S.active];
 $("result").innerHTML=`<div class="res" style="--rc:${inf.g}"><b>${inf.f}</b><small>${inf.r}</small></div>`;
 if(typeof k==="number"){S.pending=k;S.phase="guess";say(`${n}: ${inf.f}. Choose a letter!`);ui();}
 else if(k==="B"){S.opps--;if(S.opps>0)S.opps--;say(`BANKRUPT! ${n} loses this spin and one more opportunity.`);settle();}
 else if(k==="L"){S.opps--;S.phase="free";say(`${n}: tap any empty box in the word to reveal that letter for free.`);ui();}
 else{const add=k==="E1"?1:2;S.opps+=add-1;say(`${n} gets +${add} extra ${add===1?"chance":"chances"}!`);settle();}
}

/* ---------- round flow ---------- */
function startRound(){
 const q=Q[S.qi];S.tokens=tokenize(q.answer);S.revealed=new Set();S.round=[0,0,0];S.active=0;S.opps=3;S.phase="spin";S.pending=null;S.last=null;S.lit=false;
 $("question").textContent=q.question;$("result").innerHTML="";nextBtn.hidden=true;wordBtn.hidden=false;
 buildKeys();say(`${T[0]} starts. Spin the wheel!`);ui();
}
function allRevealed(){return S.tokens.every(u=>u===" "||!UNITS.includes(u)||S.revealed.has(u));}
function settle(){
 if(allRevealed())return endRound(S.active,false);
 if(S.opps<=0)return nextTurn();
 S.phase="spin";ui();
}
function nextTurn(){
  S.active=(S.active+1)%3;S.opps=3;S.phase="spin";S.pending=null;say(`Turn passes to ${T[S.active]}.`);ui();
}
function endRound(solver,viaWord){
 S.phase="ended";S.lit=true;
 const gain=S.round.slice();for(let i=0;i<3;i++){S.overall[i]+=S.round[i];}S.round=[0,0,0];
 const last=S.qi>=Q.length-1;
 say(solver>=0?`${T[solver]} solved it! Round scores added to Overall.`:`Nobody solved it. Earned points are kept.`);
 nextBtn.textContent=last?"SHOW FINAL RESULTS 🏆":"NEXT ROUND ▶";nextBtn.hidden=false;wordBtn.hidden=true;ui();
}
nextBtn.onclick=()=>{if(S.qi>=Q.length-1)showPodium();else{S.qi++;startRound();}};

/* ---------- letters ---------- */
function buildKeys(){
 kb.innerHTML=ROWS.map(r=>`<div class="kr">${r.split("").map(u=>`<button class="key" data-u="${u}" aria-label="${u}"><svg viewBox="0 0 60 70"><path class="tooth" d="M10 8C18 2 24 8 30 8S42 2 50 8C58 14 56 28 52 38C50 48 50 64 44 66C38 68 36 52 30 52C24 52 22 68 16 66C10 64 10 48 8 38C4 28 2 14 10 8Z"/></svg><span>${u}</span></button>`).join("")}</div>`).join("");
 kb.onclick=e=>{const b=e.target.closest(".key");if(b)pick(b.dataset.u);};
}
function reveal(u){S.revealed.add(u);S.last=u;}
function pick(u){
 if(S.revealed.has(u))return;
 if(S.phase==="guess")guess(u);
}
function guess(u){
 const hit=S.tokens.includes(u),pts=S.pending,n=T[S.active];S.phase="busy";S.opps--;S.pending=null;
 if(hit){reveal(u);S.round[S.active]+=pts;say(`✔ ${LABEL(u)} is in the word! ${n} earns ${pts} points.`);}
 else{const k=kb.querySelector(`[data-u="${u}"]`);k.classList.add("bad");setTimeout(()=>k.classList.remove("bad"),450);say(`✘ ${LABEL(u)} is not in the word.`);}
 settle();
}
function freeLetter(u){
 if(S.phase!=="free"||S.revealed.has(u)||!S.tokens.includes(u))return;
 S.phase="busy";reveal(u);say(`Free letter ${LABEL(u)} revealed everywhere it appears!`);settle();
}
wordEl.onclick=e=>{const b=e.target.closest(".box[data-u]");if(b&&S.phase==="free")freeLetter(b.dataset.u);};

/* ---------- dialogs and full-word guess ---------- */
function dlg(text,opt,cb){
 $("mText").textContent=text;const inp=$("mInput");inp.hidden=!opt.input;inp.value="";$("mYes").textContent=opt.yes||"YES";$("modal").hidden=false;if(opt.input)inp.focus();
 const yes=()=>{if(opt.input&&!inp.value.trim())return;$("modal").hidden=true;cb(inp.value);};
 $("mYes").onclick=yes;$("mNo").onclick=()=>{$("modal").hidden=true;};inp.onkeydown=e=>{if(e.key==="Enter")yes();};
}
wordBtn.onclick=()=>{
 if(S.phase!=="spin")return;
 dlg("Are you sure you want to guess the complete word for +1000 points?",{},()=>{
  dlg("Type the complete answer:",{input:true,yes:"SUBMIT"},v=>{
   if(S.phase!=="spin")return;
   if(norm(v)===norm(Q[S.qi].answer)){S.round[S.active]+=1000;say(`🎉 ${T[S.active]} guessed the whole word! +1000 points.`);endRound(S.active,true);}
   else{S.opps--;say(`✘ Wrong word. ${T[S.active]} loses one opportunity.`);settle();}
  });});
};
$("finishBtn").onclick=()=>{if(S.phase==="over")return;dlg("Finish the game and show the final podium? The unfinished round will not be counted.",{},showPodium);};
spinBtn.onclick=spin;

/* ---------- rendering ---------- */
function say(t){statusEl.textContent=t;}
function renderWord(){
 const words=[];let cur=[];
 S.tokens.forEach(u=>{if(u===" "){words.push(cur);cur=[];}else cur.push(u);});words.push(cur);
 const maxLen=Math.max(...words.map(w=>w.length));
 const w=wordEl.clientWidth-30,n=S.tokens.length-(words.length-1)*.3,one=w/(n*1.12);
 const bs=one>=44?Math.min(68,one,innerHeight*.075):Math.max(24,Math.min(68,w/(maxLen*1.12),innerHeight*.058));wordEl.style.setProperty("--bs",bs+"px");
 wordEl.innerHTML=words.map(w=>`<div class="wd">${w.map(u=>{const show=S.revealed.has(u)||S.lit||!UNITS.includes(u);return`<div ${show?"":`data-u="${u}" `}class="box${show&&!S.lit?" on":""}${S.lit?" lit":""}${show&&u===S.last&&!S.lit?" pop":""}">${show?LABEL(u):""}</div>`;}).join("")}</div>`).join('<div class="gap"></div>');
}
function ui(){
 $("title").textContent=CONFIG.gameTitle;document.title=CONFIG.gameTitle;
 $("roundInfo").textContent=`Round ${S.qi+1} / ${Q.length}`;
 const act=S.phase!=="ended"&&S.phase!=="over";
 $("teams").innerHTML=T.map((n,i)=>`<div class="team${act&&i===S.active?" active":""}"><h3>${esc(n)}</h3><div>Overall Score: <b>${S.overall[i]}</b></div><div>Round Score: <b>${S.round[i]}</b></div><div class="opp">${act&&i===S.active?"Opportunities left: "+S.opps:""}</div></div>`).join("");
 spinBtn.disabled=S.phase!=="spin";wordBtn.disabled=S.phase!=="spin";
 const ready=S.phase==="guess";wordEl.classList.toggle("pick",S.phase==="free");kb.classList.toggle("ready",ready);kb.classList.toggle("locked",!ready);
 kb.querySelectorAll(".key").forEach(b=>{const r=S.revealed.has(b.dataset.u)||(S.lit&&S.tokens.includes(b.dataset.u));b.classList.toggle("clean",S.revealed.has(b.dataset.u));b.disabled=S.revealed.has(b.dataset.u);});
 renderWord();
}

/* ---------- podium ---------- */
function showPodium(){
 S.phase="over";$("modal").hidden=true;
 const o=T.map((n,i)=>({n,s:S.overall[i]})).sort((a,b)=>b.s-a.s),rk=[1];
 for(let i=1;i<3;i++)rk[i]=o[i].s===o[i-1].s?rk[i-1]:i+1;
 const card=i=>`<div class="pod r${rk[i]}"><div class="tr">${rk[i]===1?"🏆":""}</div><div class="nm">${esc(o[i].n)}</div><div class="sc">${o[i].s} points</div><div class="blk">${rk[i]}</div></div>`;
 const tie=o[0].s===o[1].s?(o[2].s===o[0].s?"THREE-WAY TIE FOR FIRST PLACE!":"TIE FOR FIRST PLACE!")+" Ask the leader for a live tie-break question.":"";
 $("podium").innerHTML=`<h2>FINAL RESULTS</h2>${tie?`<div id="tie">${tie}</div>`:""}<div class="stage">${card(1)}${card(0)}${card(2)}</div>`;
 $("podium").hidden=false;
}

drawWheel();startRound();
addEventListener("resize",renderWord);
})();
