const tree = {
START:{
type:"start",
text:"Good evening. Let's reflect on your day.",
next:"Q1"
},

Q1:{
type:"question",
text:"How would you describe today overall?",
options:[
"Tough",
"Productive",
"Mixed",
"Frustrating"
],
next:["A1_LOW","A1_HIGH","A1_HIGH","A1_LOW"]
},

A1_HIGH:{
type:"question",
axis:"axis1",
text:"When something went well today, what caused it?",
options:[
"I prepared well",
"I adapted quickly",
"Team support",
"Luck"
],
signals:["internal","internal","external","external"],
next:["R1","R1","R1","R1"]
},

A1_LOW:{
type:"question",
axis:"axis1",
text:"When things got difficult, what was your instinct?",
options:[
"Focus on what I control",
"Wait for others",
"Feel stuck",
"Keep trying anyway"
],
signals:["internal","external","external","internal"],
next:["R1","R1","R1","R1"]
},

R1:{
type:"reflection",
text:"Noticing where your response mattered builds agency. Even hard days contain choices.",
next:"Q2"
},

Q2:{
type:"question",
text:"Which moment best describes today?",
options:[
"I helped someone",
"I felt overlooked",
"I did extra work",
"Others disappointed me"
],
next:["A2_POS","A2_NEG","A2_POS","A2_NEG"]
},

A2_POS:{
type:"question",
axis:"axis2",
text:"Why did you help or contribute?",
options:[
"It needed doing",
"I care about team success",
"I wanted appreciation",
"It felt right"
],
signals:["contribution","contribution","entitlement","contribution"],
next:["R2","R2","R2","R2"]
},

A2_NEG:{
type:"question",
axis:"axis2",
text:"What bothered you most?",
options:[
"No recognition",
"Unfair workload",
"Lack of progress",
"I wanted support"
],
signals:["entitlement","entitlement","contribution","contribution"],
next:["R2","R2","R2","R2"]
},

R2:{
type:"reflection",
text:"Contribution creates momentum. Recognition matters, but value given often matters more long term.",
next:"Q3"
},

Q3:{
type:"question",
text:"When you think of today's biggest challenge, who comes to mind?",
options:[
"Only me",
"My team",
"A colleague struggling",
"Our customer / user"
],
next:["A3_LOW","A3_MID","A3_MID","A3_HIGH"]
},

A3_LOW:{
type:"question",
axis:"axis3",
text:"What felt hardest?",
options:[
"My stress",
"My workload",
"My missed goals"
],
signals:["self","self","self"],
next:["R3","R3","R3"]
},

A3_MID:{
type:"question",
axis:"axis3",
text:"How were others affected?",
options:[
"We all felt pressure",
"We coordinated okay",
"Shared challenge"
],
signals:["other","other","self"],
next:["R3","R3","R3"]
},

A3_HIGH:{
type:"question",
axis:"axis3",
text:"What mattered most there?",
options:[
"Helping others succeed",
"Serving users well",
"I also needed balance"
],
signals:["other","other","self"],
next:["R3","R3","R3"]
},

R3:{
type:"reflection",
text:"Meaning often grows when attention expands beyond self alone.",
next:"SUMMARY"
},

SUMMARY:{
type:"summary"
}
};

let current = "START";

let state = {
axis1:{internal:0,external:0},
axis2:{contribution:0,entitlement:0},
axis3:{self:0,other:0}
};

const content = document.getElementById("content");
const options = document.getElementById("options");
const progress = document.getElementById("progress");
const continueBtn = document.getElementById("continueBtn");

function dominant(obj){
return Object.keys(obj).reduce((a,b)=>obj[a]>obj[b]?a:b);
}

function render(){

options.innerHTML="";
continueBtn.style.display="none";

const node = tree[current];

// NEW: screen type theme classes
document.body.classList.remove(
"startPage",
"questionPage",
"reflectionPage",
"summaryPage"
);

document.body.classList.add(node.type + "Page");

progress.innerText = "Current Node: " + current;

if(node.type==="start"){
content.innerText=node.text;
continueBtn.style.display="inline-block";
continueBtn.onclick=()=>{current=node.next;render();}
return;
}

if(node.type==="question"){
content.innerText=node.text;

node.options.forEach((opt,i)=>{
let btn=document.createElement("button");
btn.className="option";
btn.innerText=opt;

btn.onclick=()=>{

if(node.axis==="axis1"){
state.axis1[node.signals[i]]++;
}

if(node.axis==="axis2"){
state.axis2[node.signals[i]]++;
}

if(node.axis==="axis3"){
state.axis3[node.signals[i]]++;
}

current=node.next[i];
render();
};

options.appendChild(btn);
});
return;
}

if(node.type==="reflection"){
content.innerText=node.text;
continueBtn.style.display="inline-block";
continueBtn.onclick=()=>{current=node.next;render();}
return;
}

if(node.type==="summary"){

let a1=dominant(state.axis1);
let a2=dominant(state.axis2);
let a3=dominant(state.axis3);

content.innerHTML=`
<div class="summary">
<h2>Today's Reflection Summary</h2>
<p><b>Agency:</b> ${a1}</p>
<p><b>Orientation:</b> ${a2}</p>
<p><b>Radius:</b> ${a3}</p>
<p>
You showed patterns of <b>${a1}</b> control, leaned toward <b>${a2}</b>,
and focused mostly on <b>${a3==="self"?"self needs":"wider impact"}</b>.
Tomorrow, choose one action early that reflects your best self.
</p>
</div>
`;

return;
}

}

render();

const toggleBtn = document.getElementById("themeToggle");

toggleBtn.onclick = () => {
document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){
toggleBtn.innerText = "☀ Light Mode";
}else{
toggleBtn.innerText = "🌙 Dark Mode";
}
};