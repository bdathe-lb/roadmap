/* ================= pixel sprite engine ================= */
function runs(rows,pal){
  var o='';
  rows.forEach(function(row,y){
    var x=0;
    while(x<row.length){
      var c=row[x];
      if(c==='.'){x++;continue}
      var n=1; while(x+n<row.length&&row[x+n]===c)n++;
      o+='<rect x="'+x+'" y="'+y+'" width="'+n+'" height="1" fill="'+(pal[c]||'#fff')+'"/>';
      x+=n;
    }
  });
  return o;
}
function sprite(s,px){
  var w=s.r[0].length,h=s.r.length;
  return '<svg viewBox="0 0 '+w+' '+h+'" width="'+w*px+'" height="'+h*px+'" shape-rendering="crispEdges" aria-hidden="true">'+runs(s.r,s.p)+'</svg>';
}
function place(s,x,y,k,op){
  return '<g transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+k.toFixed(2)+')"'+(op?' opacity="'+op+'"':'')+'>'+runs(s.r,s.p)+'</g>';
}
var G='#4a9663',GD='#2f6b45',ST='#6d7fa6',SD='#3f4f74',W='#e6e0cd',GO='#e8b846',
    BR='#8a5a32',SK='#58b4d8',RD='#d4574c',DK='#141d33',GN='#5fd08a',PU='#9b7fd4';
var S={
 gear:{p:{X:ST,Y:GO},r:['.X.XX.X.','XXXXXXXX','.XX..XX.','XX.XX.XX','XX.XX.XX','.XX..XX.','XXXXXXXX','.X.XX.X.']},
 algo:{p:{X:ST,Y:GO},r:['.X....X.','X..YY..X','X.YY...X','X...YY.X','X..YY..X','X.YY...X','X......X','.X....X.']},
 term:{p:{X:ST,B:DK,G:GN},r:['XXXXXXXX','XBBBBBBX','XB.G...X','XB..G..X','XB.G...X','XB.GGG.X','XBBBBBBX','XXXXXXXX']},
 ant:{p:{X:ST,S:SK},r:['...SS...','..S..S..','.S.XX.S.','S..XX..S','...XX...','..XXXX..','.XXXXXX.','XXXXXXXX']},
 srv:{p:{L:SD,G:GN},r:['LLLLLLLL','LG....GL','LLLLLLLL','LG....GL','LLLLLLLL','LG....GL','LLLLLLLL','.L....L.']},
 chest:{p:{X:BR,Y:GO,L:DK},r:['.XXXXXX.','XYYYYYYX','XXXXXXXX','XY.LL.YX','XXXXXXXX','XYYYYYYX','XYYYYYYX','XXXXXXXX']},
 scroll:{p:{X:BR,Y:W,L:SD},r:['.XXXXXX.','XYYYYYYX','XYLLLLYX','XYYYYYYX','XYLLLLYX','XYYYYYYX','XYLLLLYX','.XXXXXX.']},
 sword:{p:{X:ST,H:BR,Y:GO},r:['....XX..','...XXX..','..XXXX..','.XXXX...','YXXXY...','.YHY....','..H.....','.H......']},
 tent:{p:{X:BR,D:DK,Y:GO},r:['...YY...','..XXXX..','.XXXXXX.','XXX..XXX','XX.DD.XX','XX.DD.XX','XXXXXXXX','........']},
 castle:{p:{L:ST,X:SD,R:RD,D:DK},r:['R.L..L.R','LXLXXLXL','LLLLLLLL','L.LLLL.L','LLLLLLLL','LL.DD.LL','LL.DD.LL','LLLLLLLL']},
 crown:{p:{Y:GO,G:GN,D:'#a8821f'},r:['G..G..G.','YY.YY.YY','YYYYYYYY','YYGYYGYY','YYYYYYYY','DDDDDDDD','.DDDDDD.','........']},
 gem:{p:{X:SK,W:W},r:['...WW...','..XWWX..','.XXXXXX.','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...','........']},
 flask:{p:{X:ST,P:PU,W:W},r:['..XXXX..','...XX...','...XX...','..XXXX..','.XX..XX.','XX.PP.XX','XXPPPPXX','.XXXXXX.']},
 bolt:{p:{X:GO},r:['...XXX..','..XXX...','.XXX....','XXXXXX..','...XXX..','..XXX...','.XXX....','XX......']},
 qm:{p:{X:ST},r:['.XXXXX..','XX...XX.','.....XX.','....XX..','...XX...','...XX...','........','...XX...']},
 pin:{p:{X:'#54607d',W:W,D:'#333c54'},r:['..XXXXX..','.XXXXXXX.','XXXWWWXXX','XXWWWWWXX','XXXWWWXXX','.XXXXXXX.','.XXXXXXX.','..XXXXX..','..XDDX...','...DD....','...DD....','....D....']},
 house:{p:{R:'#7a4038',W:'#b3a084',Y:'#e8b846',D:'#33261c'},r:['..RRRR..','.RRRRRR.','RRRRRRRR','.WWWWWW.','.WYWWYW.','.WWDDWW.','.WWDDWW.','.WWWWWW.']},
 dead:{p:{T:'#5c5040'},r:['.T...T.','..T.T..','.TTTTT.','...T...','..TTT..','...T...','...T...','..TTT..']},
 bush:{p:{G:'#1f4a33',g:'#2b6042'},r:['..gg...','.gGGGg.','gGGGGGg','.ggggg.']},
 reed:{p:{R:'#5a7a52'},r:['.R.R.','R.R.R','.R.R.','.R.R.','.R.R.','.R.R.']},
 bridge:{p:{P:'#7a5a38',R:'#4e3722'},r:['RRRRRRRRRRRR','PP.PP.PP.PPP','PPPPPPPPPPPP','PP.PP.PP.PPP','RRRRRRRRRRRR']},
 tree:{p:{G:'#3a7a4e',g:'#27593a',T:'#5e4126'},r:['...G...','..GGG..','.GgGgG.','GGGgGGG','.GgGgG.','..GTG..','...T...','..TTT..']},
 pine:{p:{G:'#27593a',g:'#3a7a4e',T:'#5e4126'},r:['...g...','..ggg..','.gGGGg.','...g...','..ggg..','.gGGGg.','...T...','..TTT..']},
 mtn:{p:{S:'#39466b',L:'#4f5d82',W:'#c9d2e4'},r:['.....W.....','....WWW....','...WLWLW...','..LLLLLLL..','.LLLSSSLL..','LLSSSSSSSL.','LSSSSSSSSSL','SSSSSSSSSSS']},
 tuft:{p:{G:'#2b6042'},r:['.G.G.','GGGGG']},
 rock:{p:{S:'#394663',L:'#4d5a7c'},r:['.LL.','LSSL','SSSS']}
};

/* ================= quest data ================= */
var PINS=[
 {id:'p1',n:'2026-9',x:100,y:640,
  t:'出发点',
  g:'路线起点：C++ 语法与 STL 具备基础，但无工程项目经验，Linux 系统编程与算法训练均从零开始',
  c:'—',k:[]},
 {id:'p2',n:'2027-3',x:935,y:195,
  t:'投递季',
  g:'投递季的准入状态：主线 LV.01–05 全部通关，两个可讲清实现细节的项目成型，简历定稿，算法训练累计满半年，AI 支线推进至强化学习',
  c:'两个项目完成交付，简历定稿，进入批量投递阶段',k:[]},
 {id:'p3',n:'2027-6',x:1245,y:495,
  t:'实习季',
  g:'暑期实习的起点：已取得实习 offer 并入职；若未落实，则转为持续投递并加深既有项目的技术深度',
  c:'已取得实习 offer 并完成入职',k:[]},
 {id:'p4',n:'2027-9',x:1445,y:495,
  t:'秋招正式批',
  g:'秋招正式批的入场状态：一段完整实习经历、两个成型项目、一年的算法积累，此阶段不再引入新的学习内容',
  c:'进入秋招 offer 阶段',k:[]}
];
var MAIN=[
 {id:'m1',ic:'gear',n:'并发编程',lv:'LV.01',x:250,y:605,
  t:'2026-09-11 → 2026-10-15（5 周）',
  g:'掌握 C++ 并发编程的核心机制——线程生命周期、互斥与条件变量、异步任务模型，以及内存模型下各档 memory_order 的可见性语义，并具备独立实现线程池、阻塞队列等线程安全组件的能力',
  c:'线程池与阻塞队列实现完成，通过 TSan 检测且无数据竞争报告',
  k:['Sanitizer（TSan / ASan）','Git','CMake','GDB 多线程调试']},
 {id:'m2',ic:'term',n:'系统编程',lv:'LV.02',x:400,y:560,
  t:'2026-10-16 → 2026-11-19（5 周）',
  g:'建立 Linux 系统编程的底层认知：文件描述符、进程与信号、socket 通信与 IO 多路复用；掌握 epoll 在 LT 与 ET 两种模式下的行为差异，具备从零实现非阻塞网络服务的能力',
  c:'独立实现基于 epoll ET 的非阻塞 echo server，并通过抓包验证收发过程',
  k:['tcpdump / Wireshark 抓包','strace / lsof / ss / top','man page 检索']},
 {id:'m3',ic:'ant',n:'网络库 muduo',lv:'LV.03',x:550,y:500,
  t:'2026-11-20 → 2026-12-17（4 周）',
  g:'理解 Reactor 模式与 one loop per thread 并发模型，读通 muduo 的事件循环、连接管理与缓冲区设计，并能重写出一个结构完整的精简版网络库',
  c:'精简版网络库支持 echo 与定时器，核心类具备单元测试覆盖',
  k:['Google Test 单元测试','perf 火焰图']},
 {id:'m4',ic:'srv',n:'项目1: HTTP服务器',lv:'LV.04',x:700,y:420,
  t:'2026-12-18 → 2027-01-28（6 周）',
  g:'在自研网络库之上完成一个多线程 HTTP/1.1 服务器，具备请求解析、静态资源服务、长连接与超时管理能力；建立以压测数据和性能剖析驱动优化的工程方法',
  c:'README 记录 QPS 测试结果与一轮优化前后的性能对比',
  k:['wrk / ab 压测','Docker','perf 火焰图']},
 {id:'m5',ic:'chest',n:'项目2: KV-Cache',lv:'LV.05',x:830,y:310,
  t:'2027-01-29 → 2027-02-25（4 周）',
  g:'完成一个并发安全的键值缓存服务，覆盖分片锁、LRU 淘汰、TTL 过期、协议解析与持久化恢复；形成可量化、可复现、且每项设计取舍均有论证的项目交付',
  c:'CI 全部通过，benchmark 数据完整，各项设计取舍均有书面论证',
  k:['GitHub Actions CI','benchmark','压测对比']},
 {id:'m6',ic:'scroll',n:'投递简历',lv:'LV.06',x:1075,y:268,
  t:'2027-02-26 → 2027-03（2 周冲刺后开始投递）',
  g:'完成简历定稿与八股知识体系的系统梳理，使 C++、操作系统、网络与数据库的高频问题能够由自身项目经验支撑作答，并进入批量投递状态',
  c:'简历定稿，进入批量投递阶段',
  k:['项目追问自查表','模拟面试','投递进度表']},
 {id:'m7',ic:'sword',n:'实习面试',lv:'LV.07',x:1180,y:380,
  t:'2027-03 → 2027-06',
  g:'在真实面试中完成能力校准，以每场复盘驱动针对性补漏，通过持续投递与面试取得暑期实习 offer',
  c:'2027 年 6 月前取得暑期实习 offer',
  k:['面试复盘表','限时手撕代码']},
 {id:'m8',ic:'tent',n:'暑期实习',lv:'LV.08',x:1345,y:420,
  t:'2027-06 → 2027-09',
  g:'在真实工程环境中产出可写入简历的交付物，熟悉团队协作规范与线上问题排查流程，争取转正资格',
  c:'取得转正 offer，或形成一段有明确产出的实习经历',
  k:['Code Review 与代码规范','线上问题排查']},
 {id:'m9',ic:'castle',n:'秋招',lv:'BOSS',x:1495,y:385,boss:1,
  t:'2027-09',
  g:'以两个项目、一段实习与一年算法积累为基础参加秋招正式批，完成从投递到 offer 的全流程',
  c:'取得可供选择的 offer',
  k:[]},
 {id:'m10',ic:'crown',n:'OFFER',lv:'GOAL',x:1530,y:250,goal:1,
  t:'2027 年秋',
  g:'路线终点：取得 C++ 后端方向的正式 offer',
  c:'—',k:[]}
];
var AI=[
 {id:'s1',ic:'gem',n:'ML',lv:'S-A',x:300,y:700,
  t:'2026-10 → 2026-12（周末为主）',
  g:'掌握经典机器学习算法的原理与推导，理解偏差方差权衡与过拟合的成因及应对手段，具备使用 scikit-learn 完成完整建模流程的能力',
  c:'掌握偏差方差权衡的成因，并能给出过拟合的应对方案',
  k:['NumPy / Pandas','scikit-learn','Jupyter']},
 {id:'s2',ic:'flask',n:'DL',lv:'S-B',x:600,y:730,
  t:'2026-12 → 2027-03（周末为主）',
  g:'掌握 PyTorch 的张量运算与自动求导机制，理解主流网络结构的设计动机，具备独立完成一次从数据准备到模型评估的完整训练的能力',
  c:'独立完成一次完整训练流程，结果可复现',
  k:['PyTorch','CUDA 环境配置','TensorBoard']},
 {id:'s3',ic:'bolt',n:'RL',lv:'S-C',x:880,y:555,
  t:'2027-03 → 2027-06（周末为主）',
  g:'掌握强化学习的基本框架与主流算法，理解价值方法与策略方法的差异，具备在标准环境中独立完成一次完整训练并解读实验曲线的能力',
  c:'独立完成一次完整的强化学习训练',
  k:['Gymnasium','实验记录与调参']}
];
var INFRA=[
 {id:'s4',ic:'qm',n:'AI-Infra',lv:'S-D',x:1345,y:700,
  t:'2027-06 → 2027-09（学有余力时推进）',
  g:'待扩展方向，聚焦 CUDA 编程、算子优化与推理框架；该方向实习门槛高于通用 C++ 后端，路径规划为先以后端岗位入职、再向 Infra 转型',
  c:'—',
  k:['CUDA','算子优化','推理框架']}
];
var ALGO={id:'a1',ic:'algo',n:'算法',lv:'MAIN',x:290,y:230,algo:1,
  t:'2026-09-11 → 2027-09（每天 1.5–2h）',
  g:'贯穿全程的常驻训练，不占用关卡周期；前期建立基础题型与高频题的解题模式，2027-01 起以周赛和模拟笔试训练限时手感',
  c:'常驻训练线，不设通关条件，以训练的连续性为唯一考核标准',
  k:['LeetCode Hot 100 → 高频题','周赛 / 模拟笔试','限时手撕（45 分钟内）']};

function chainOf(l){return l.id[0]==='m'?MAIN:(l.id==='s4'?INFRA:AI)}
var NODES=MAIN.concat(AI,INFRA,[ALGO]);
var byId={}; NODES.concat(PINS).forEach(function(l){byId[l.id]=l});

var R_MAIN=[PINS[0]].concat(MAIN.slice(0,5),[PINS[1]],MAIN.slice(5,7),[PINS[2]],[MAIN[7]],[PINS[3]],MAIN.slice(8));
var R_AI=[PINS[0],AI[0],AI[1],AI[2],{x:962,y:375},PINS[1]];
var R_INFRA=[PINS[2],INFRA[0],PINS[3]];
var R_ALGO=[PINS[0],{x:150,y:420},ALGO,{x:620,y:110},{x:1000,y:95},{x:1310,y:140},MAIN[9]];

/* ================= terrain ================= */
var svg=document.getElementById('terrain');
function pxEllipse(cx,cy,rx,ry,gs,fill){
  var o='';
  for(var y=-ry;y<=ry;y+=gs){
    var w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry)))/gs)*gs;
    if(w<=0)continue;
    o+='<rect x="'+(Math.round((cx-w)/gs)*gs)+'" y="'+(Math.round((cy+y)/gs)*gs)+'" width="'+(w*2)+'" height="'+gs+'" fill="'+fill+'"/>';
  }
  return o;
}
function pixelRiver(d,size,step,bands){
  var hid=document.getElementById('hidden');
  var p=document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d',d); hid.appendChild(p);
  var L=p.getTotalLength(),out='';
  bands.forEach(function(bd){
    var seen={};
    for(var l=0;l<=L;l+=step){
      var q=p.getPointAtLength(l);
      var bx=Math.round((q.x-bd.w/2)/size)*size, by=Math.round(q.y/size)*size, k=bx+'|'+by;
      if(seen[k])continue; seen[k]=1;
      out+='<rect x="'+bx+'" y="'+by+'" width="'+bd.w+'" height="'+size+'" fill="'+bd.f+'"/>';
    }
  });
  hid.removeChild(p);
  return out;
}
(function terrain(){
  /* ---- 地面：明度分五档，主路所在的河谷最亮，林地最暗 ---- */
  var g='';
  g+='<rect x="0" y="0" width="1600" height="860" fill="#12241f"/>';
  g+='<path d="M700,0 L1600,0 L1600,340 Q1370,396 1130,332 Q890,266 700,0 Z" fill="#263048"/>';
  g+='<path d="M880,0 L1600,0 L1600,232 Q1350,284 1145,218 Q995,168 880,0 Z" fill="#333f5e"/>';
  g+='<path d="M0,566 Q320,492 640,408 Q900,332 1030,254 L1152,322 Q905,444 665,522 Q345,620 0,688 Z" fill="#2f6b4f"/>';
  g+='<path d="M300,244 Q590,214 826,278 Q844,446 620,496 Q392,524 302,448 Z" fill="#0f2a20"/>';
  g+='<path d="M0,738 Q380,684 760,752 Q1050,802 1190,766 L1190,860 L0,860 Z" fill="#16302a"/>';
  g+=pxEllipse(1078,662,112,58,10,'#1a4a66');
  g+=pxEllipse(1078,662,84,38,10,'#24698c');
  g+='<rect x="1032" y="632" width="58" height="26" fill="#1c4030"/>';

  document.getElementById('terrain').innerHTML =
    g+'<g id="river"></g><g id="deco"></g><g id="roads"></g><g id="hidden" fill="none" stroke="none"></g>';

  /* ---- 河：从北部山地南下，汇入南部湿地 ---- */
  document.getElementById('river').innerHTML = pixelRiver(
    'M600,140 C560,224 500,262 490,342 C480,422 470,472 468,542 C466,602 458,632 450,662',
    8, 7, [{w:34,f:'#1a4a66'},{w:18,f:'#24698c'}]);

  /* ---- 地标：每区一套植被，少而大 ---- */
  var d='';
  /* 西南 · 起点村落 */
  [[44,706,4.5],[100,734,4.5],[156,708,4.5]].forEach(function(h){d+=place(S.house,h[0],h[1],h[2])});
  /* 西部密林 · 大树 + 枯木 + 灌木 */
  [[338,298,6],[408,252,5],[598,258,6.5],[690,296,5.5],[742,232,5],[598,394,5]
  ].forEach(function(t,i){d+=place(i%2?S.pine:S.tree,t[0],t[1],t[2])});
  [[350,404,4],[520,426,4.5]].forEach(function(t){d+=place(S.dead,t[0],t[1],t[2],.9)});
  [[406,450,5],[660,328,4.5],[300,352,4.5]].forEach(function(t){d+=place(S.bush,t[0],t[1],t[2])});
  /* 中部 · 主路过河的桥 */
  d+=place(S.bridge,444,514,4);
  /* 东北 · 雪山 */
  d+=place(S.mtn,1176,116,9);
  d+=place(S.mtn,1296,76,12);
  d+=place(S.mtn,1436,138,8);
  /* 东南 · 湖：小岛 + 芦苇 */
  d+=place(S.tree,1046,616,3.6);
  [[952,630,3.5],[1198,634,3.5],[1004,724,3.5],[1148,718,3.5]
  ].forEach(function(r){d+=place(S.reed,r[0],r[1],r[2],.85)});

  document.getElementById('deco').innerHTML=d;
})();

/* ================= pixel roads ================= */
function curve(pts,tension){
  var d='M'+pts[0].x+','+pts[0].y;
  for(var i=0;i<pts.length-1;i++){
    var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||pts[i+1];
    var f=tension/6;
    d+=' C'+(p1.x+(p2.x-p0.x)*f)+','+(p1.y+(p2.y-p0.y)*f)+' '+
            (p2.x-(p3.x-p1.x)*f)+','+(p2.y-(p3.y-p1.y)*f)+' '+p2.x+','+p2.y;
  }
  return d;
}
var roads=document.getElementById('roads'),hidden=document.getElementById('hidden');
function buildRoad(pts,opt){
  var p=document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d',curve(pts,opt.t||1));
  hidden.appendChild(p);
  var L=p.getTotalLength(),samples=[];
  for(var l=0;l<=L;l+=3){var q=p.getPointAtLength(l);samples.push({l:l,x:q.x,y:q.y})}
  var marks=pts.map(function(n){
    var best=0,bd=1e9;
    samples.forEach(function(s,i){var dx=s.x-n.x,dy=s.y-n.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=i}});
    return {l:samples[best].l,id:n.id};
  });
  var gs=opt.size,seen={},out='';
  for(var l2=0;l2<=L;l2+=opt.step){
    var q2=p.getPointAtLength(l2);
    var bx=Math.round(q2.x/gs)*gs,by=Math.round(q2.y/gs)*gs,key=bx+'|'+by;
    if(seen[key])continue; seen[key]=1;
    var gate='';
    for(var m=0;m<marks.length;m++){if(marks[m].l>=l2-0.001){gate=marks[m].id||'';break}}
    out+='<rect class="blk" data-gate="'+gate+'" data-kind="'+opt.kind+'" x="'+bx+'" y="'+by+'" width="'+gs+'" height="'+gs+'"/>';
  }
  roads.insertAdjacentHTML('beforeend',out);
}
buildRoad(R_MAIN,{size:10,step:10,kind:'main',t:1});
buildRoad(R_ALGO,{size:7,step:26,kind:'algo',t:.9});
buildRoad(R_AI,{size:8,step:20,kind:'ai',t:1});
buildRoad(R_INFRA,{size:8,step:20,kind:'ai',t:1});

/* ================= state ================= */
var KEY='cppquest.v3',ST={},dbns=null;
function lLoad(){try{var s=localStorage.getItem(KEY);if(s){var o=JSON.parse(s)||{};ST=o.st||{}}}catch(e){}}
function lSave(){try{localStorage.setItem(KEY,JSON.stringify({st:ST}))}catch(e){}}
function cleared(id){return ST[id]==='done'||ST[id]==='skip'}
function prevOf(l){
  if(l.id==='s4')return MAIN[7];
  var c=chainOf(l),i=c.indexOf(l);
  return i>0?c[i-1]:null;
}
function unlocked(l){if(l.algo)return true;var p=prevOf(l);return p?cleared(p.id):true}
function current(list){for(var i=0;i<list.length;i++){if(!cleared(list[i].id))return list[i]}return null}
function pinPassed(p){
  if(p.id==='p1')return true;
  if(p.id==='p2')return cleared('m5');
  if(p.id==='p3')return cleared('m7');
  if(p.id==='p4')return cleared('m8');
  return false;
}

/* ================= render nodes ================= */
var map=document.getElementById('map');
function mkNode(l,kind){
  var b=document.createElement('button');
  b.className='node';b.id='n-'+l.id;
  b.style.left=(l.x/1600*100)+'%';b.style.top=(l.y/860*100)+'%';
  if(kind==='pin'){
    b.innerHTML='<span class="plate">'+sprite(S.pin,4)+'</span><span class="name">'+l.n+'</span>';
  }else{
    b.innerHTML='<span class="plate">'+sprite(S[l.ic],l.boss||l.goal?6:5)+'<span class="mark"></span></span>'+
                '<span class="name">'+l.n+'</span>';
  }
  b.addEventListener('click',function(){openCard(l,kind)});
  map.appendChild(b);
}
NODES.forEach(function(l){mkNode(l,'quest')});
PINS.forEach(function(p){mkNode(p,'pin')});

var COL={main:{on:'#e8b846',off:'#33405f'},algo:{on:'#9a8746',off:'#2e3a56'},ai:{on:'#4e9fc4',off:'#2f4a60'}};
function paint(){
  var curM=current(MAIN),curA=current(AI);
  NODES.forEach(function(l){
    var b=document.getElementById('n-'+l.id),u=unlocked(l),st=ST[l.id];
    var cls='node';
    if(l.boss)cls+=' boss'; if(l.goal)cls+=' goal'; if(l.algo)cls+=' algo';
    if(st==='done')cls+=' done';
    else if(st==='skip')cls+=' skip';
    else if(!u)cls+=' locked';
    else if(st==='learning'||l===curM||l===curA)cls+=' now';
    b.className=cls;
    b.setAttribute('aria-label',l.lv+' '+l.n+'（'+(l.algo?'常驻':st==='done'?'已完成':st==='skip'?'已跳过':st==='learning'?'学习中':u?'可开始':'未解锁')+'）');
    var mk=b.querySelector('.mark');
    if(mk)mk.innerHTML=st==='done'?'<span>🚩</span>':st==='skip'?'<span>↷</span>':(l.algo||u?'':'<span>🔒</span>');
  });
  PINS.forEach(function(p){
    document.getElementById('n-'+p.id).className='node pin'+(pinPassed(p)?' passed':'');
  });
  document.querySelectorAll('.blk').forEach(function(r){
    var gate=r.dataset.gate,kind=r.dataset.kind,on;
    if(kind==='algo'||!gate)on=true;
    else if(gate[0]==='p')on=pinPassed(byId[gate]);
    else on=cleared(gate)||unlocked(byId[gate]);
    r.setAttribute('fill',on?COL[kind].on:COL[kind].off);
    r.setAttribute('opacity',on?(kind==='algo'?'.8':'1'):'.55');
  });
  var n=NODES.filter(function(l){return !l.algo&&ST[l.id]==='done'}).length;
  document.getElementById('expn').textContent=n;
  document.getElementById('expbar').style.width=(n/14*100)+'%';
  document.getElementById('stagenow').innerHTML=curM?('<i>当前</i>'+curM.lv+'　'+curM.n):'<i>当前</i>主线全部通关';
}

/* ================= card ================= */
var dlg=document.getElementById('dlg'),boxc=document.getElementById('boxc'),cur=null,curKind=null;
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function openCard(l,kind){cur=l;curKind=kind;render();dlg.showModal()}
function render(){
  var l=cur,isPin=curKind==='pin',u=isPin||unlocked(l),st=ST[l.id],p=isPin?null:prevOf(l);
  var lock=!isPin&&!l.algo&&!u;

  var bar='';
  if(!isPin&&!l.algo){
    bar=[['learning','📖','学习中'],['done','✓','完成'],['skip','✕','跳过']].map(function(b){
      return '<button class="sbtn '+b[0]+(st===b[0]?' on':'')+'" data-s="'+b[0]+'"'+(lock&&b[0]!=='skip'?' disabled':'')+'>'+b[1]+' '+b[2]+'</button>';
    }).join('');
  }else if(l.algo){bar='<span class="sbtn on learning">📖 常驻线（不设通关）</span>'}
  else{bar='<span class="sbtn'+(pinPassed(l)?' on done':'')+'">'+(pinPassed(l)?'✓ 已抵达':'○ 未抵达')+'</span>'}

  var pre='';
  if(p){
    pre='<div><div class="rowlab"><span>PREREQUISITE</span></div>'+
        '<button class="pre" id="gopre"><span class="pn">'+p.lv+'　'+esc(p.n)+'</span>'+
        '<span class="ps">'+(ST[p.id]==='done'?'已完成 ✓':ST[p.id]==='skip'?'已跳过':'未完成，本关锁定')+'</span></button></div>';
  }
  boxc.innerHTML=
    '<div class="topbar"><span class="lv">'+(isPin?'CHECKPOINT':l.lv)+'</span>'+bar+
    '<button class="sbtn x" id="cl" aria-label="关闭">✕</button></div>'+
    '<div class="scroll">'+
      '<div class="titlerow"><span class="ico">'+sprite(isPin?S.pin:S[l.ic],6)+'</span>'+
      '<span><h2>'+esc(l.n)+'</h2><span class="when">'+esc(l.t)+'</span></span></div>'+
      '<p class="goal">'+esc(l.g)+'</p>'+ pre +
      (l.c!=='—'?'<div><div class="rowlab"><span>CLEAR CONDITION</span></div><div class="check">'+esc(l.c)+'</div></div>':'')+
      (l.k.length?'<div><div class="rowlab"><span>EXTRA DROPS</span></div><div class="tags">'+l.k.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div></div>':'')+
    '</div>';

  boxc.querySelector('#cl').onclick=function(){dlg.close()};
  var gp=boxc.querySelector('#gopre');
  if(gp)gp.onclick=function(){cur=p;curKind='quest';render();var sc=boxc.querySelector('.scroll');if(sc)sc.scrollTop=0};
  boxc.querySelectorAll('.sbtn[data-s]').forEach(function(b){
    b.onclick=function(){
      var v=b.dataset.s;
      if(ST[l.id]===v)delete ST[l.id];else ST[l.id]=v;
      lSave();paint();push();render();
    };
  });
}
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
document.getElementById('reset').onclick=function(){
  if(!confirm('清空所有关卡状态？'))return;
  ST={};lSave();paint();push();
};

/* ================= countdown ================= */
(function(){
  var d=function(t){return Math.max(0,Math.ceil((new Date(t)-new Date())/864e5))};
  document.getElementById('d1').textContent=d('2027-03-01T00:00:00');
  document.getElementById('d2').textContent=d('2027-09-01T00:00:00');
})();

/* ================= sync =================
   三种后端，按可用性自动降级：
     db     claude.ai artifact 的云端库
     http   自建服务器 /api/progress（跨设备，数据在自己手里）
     local  都不可用时只写 localStorage
*/
var syncEl=document.getElementById('sync');
var API='/api/progress', TKEY='cppquest.token', mode='local', timer=null;

function getTok(){try{return localStorage.getItem(TKEY)||''}catch(e){return ''}}
function setTok(v){try{v?localStorage.setItem(TKEY,v):localStorage.removeItem(TKEY)}catch(e){}}
function status(t,bad){syncEl.textContent=t;syncEl.className='sync'+(bad?' bad':'')}

function askTok(force){
  var cur=getTok();
  var v=window.prompt(force?'写入口令不正确，请重新输入：':'首次写入需要口令，只需设置一次：',cur||'');
  if(v===null)return '';
  v=v.trim(); setTok(v); return v;
}

function sendHTTP(){
  var t=getTok()||askTok(false);
  if(!t){status('仅本地保存',true);return}
  status('同步中');
  fetch(API,{method:'PUT',headers:{'Content-Type':'application/json','X-Token':t},
             body:JSON.stringify({st:ST})})
    .then(function(r){
      if(r.status===401){setTok('');status('口令不对，点此重设',true);return}
      if(!r.ok)throw new Error(r.status);
      status('已同步');
    })
    .catch(function(){status('同步失败，仅本地保存',true)});
}

function push(){
  if(mode==='db'){if(dbns)dbns.doc('progress/main').set({st:ST,at:Date.now()}).catch(function(){});return}
  if(mode!=='http')return;
  clearTimeout(timer); timer=setTimeout(sendHTTP,400);   // 连点合并成一次请求
}

syncEl.style.cursor='pointer';
syncEl.title='点击设置写入口令';
syncEl.onclick=function(){if(mode==='http'&&askTok(true))sendHTTP()};

lLoad();paint();

(async function(){
  /* 1) claude.ai artifact */
  try{
    if(window.claude&&window.claude.use){
      var ns=await window.claude.use('db');
      if(ns){
        dbns=ns; mode='db';
        var doc=ns.doc('progress/main'),snap=await doc.get();
        if(snap&&(snap.st||snap.done)){
          if(snap.st)ST=snap.st;
          else Object.keys(snap.done).forEach(function(k){ST[k]='done'});
          lSave(); paint(); if(!snap.st)push();
        }else if(Object.keys(ST).length)push();
        doc.onSnapshot(function(v){if(v&&v.st){ST=v.st;lSave();paint();if(dlg.open)render()}});
        status('已同步');
        return;
      }
    }
  }catch(e){}

  /* 2) 自建服务器 */
  try{
    var r=await fetch(API,{cache:'no-store'});
    if(!r.ok)throw new Error(r.status);
    var v=await r.json();
    mode='http';
    if(v&&v.st&&Object.keys(v.st).length){
      ST=v.st; lSave(); paint(); if(dlg.open)render();
    }else if(Object.keys(ST).length){push()}
    status(getTok()?'已同步':'点此设置口令');
    return;
  }catch(e){}

  /* 3) 兜底 */
  status('仅本地保存');
})();
