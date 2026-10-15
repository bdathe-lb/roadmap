/* CS-Roadmap · 时间线看板
 *
 * 和旧版（像素地图）保持兼容的三样东西，改动前务必想清楚：
 *   - 关卡 id（m1…m10 / s1…s4 / a1）
 *   - localStorage 键 cppquest.v3 / cppquest.token
 *   - /api/progress 的数据形状 {st:{id:'learning'|'done'|'skip'}}
 * 线上已有的进度靠这三样原样延续。
 */
'use strict';

/* ================= 数据 =================
   start / end 是计划窗口（含首尾两天），用于时间线定位和逾期判断。
   原计划只精确到月的关卡用 when 覆盖展示文案，避免显示出并不存在的精确日期。 */
var TRACKS = {
  main: {name: '主线', c: 'var(--main)', bg: 'var(--main-bg)'},
  algo: {name: '算法', c: 'var(--algo)', bg: 'var(--algo-bg)'},
  ai:   {name: 'AI 支线', c: 'var(--ai)', bg: 'var(--ai-bg)'}
};

var MAIN = [
  {id: 'm1', lv: 'LV.01', n: '并发编程', start: '2026-09-11', end: '2026-10-15',
   g: '掌握 C++ 并发编程的核心机制——线程生命周期、互斥与条件变量、异步任务模型，以及内存模型下各档 memory_order 的可见性语义，并具备独立实现线程池、阻塞队列等线程安全组件的能力',
   c: '线程池与阻塞队列实现完成，通过 TSan 检测且无数据竞争报告',
   k: ['Sanitizer（TSan / ASan）', 'Git', 'CMake', 'GDB 多线程调试']},
  {id: 'm2', lv: 'LV.02', n: '系统编程', start: '2026-10-16', end: '2026-11-19',
   g: '建立 Linux 系统编程的底层认知：文件描述符、进程与信号、socket 通信与 IO 多路复用；掌握 epoll 在 LT 与 ET 两种模式下的行为差异，具备从零实现非阻塞网络服务的能力',
   c: '独立实现基于 epoll ET 的非阻塞 echo server，并通过抓包验证收发过程',
   k: ['tcpdump / Wireshark 抓包', 'strace / lsof / ss / top', 'man page 检索']},
  {id: 'm3', lv: 'LV.03', n: '网络库 muduo', start: '2026-11-20', end: '2026-12-17',
   g: '理解 Reactor 模式与 one loop per thread 并发模型，读通 muduo 的事件循环、连接管理与缓冲区设计，并能重写出一个结构完整的精简版网络库',
   c: '精简版网络库支持 echo 与定时器，核心类具备单元测试覆盖',
   k: ['Google Test 单元测试', 'perf 火焰图']},
  {id: 'm4', lv: 'LV.04', n: 'HTTP 服务器项目', start: '2026-12-18', end: '2027-01-28',
   g: '在自研网络库之上完成一个多线程 HTTP/1.1 服务器，具备请求解析、静态资源服务、长连接与超时管理能力；建立以压测数据和性能剖析驱动优化的工程方法',
   c: 'README 记录 QPS 测试结果与一轮优化前后的性能对比',
   k: ['wrk / ab 压测', 'Docker', 'perf 火焰图']},
  {id: 'm5', lv: 'LV.05', n: 'KV-Cache 项目', start: '2027-01-29', end: '2027-02-25',
   g: '完成一个并发安全的键值缓存服务，覆盖分片锁、LRU 淘汰、TTL 过期、协议解析与持久化恢复；形成可量化、可复现、且每项设计取舍均有论证的项目交付',
   c: 'CI 全部通过，benchmark 数据完整，各项设计取舍均有书面论证',
   k: ['GitHub Actions CI', 'benchmark', '压测对比']},
  {id: 'm6', lv: 'LV.06', n: '投递简历', start: '2027-02-26', end: '2027-03-31',
   when: '2027-02-26 → 2027-03', note: '2 周冲刺后开始投递',
   g: '完成简历定稿与八股知识体系的系统梳理，使 C++、操作系统、网络与数据库的高频问题能够由自身项目经验支撑作答，并进入批量投递状态',
   c: '简历定稿，进入批量投递阶段',
   k: ['项目追问自查表', '模拟面试', '投递进度表']},
  {id: 'm7', lv: 'LV.07', n: '实习面试', start: '2027-03-01', end: '2027-06-30',
   when: '2027-03 → 2027-06',
   g: '在真实面试中完成能力校准，以每场复盘驱动针对性补漏，通过持续投递与面试取得暑期实习 offer',
   c: '2027 年 6 月前取得暑期实习 offer',
   k: ['面试复盘表', '限时手撕代码']},
  {id: 'm8', lv: 'LV.08', n: '暑期实习', start: '2027-06-01', end: '2027-08-31',
   when: '2027-06 → 2027-09',
   g: '在真实工程环境中产出可写入简历的交付物，熟悉团队协作规范与线上问题排查流程，争取转正资格',
   c: '取得转正 offer，或形成一段有明确产出的实习经历',
   k: ['Code Review 与代码规范', '线上问题排查']},
  {id: 'm9', lv: 'BOSS', n: '秋招', start: '2027-09-01', end: '2027-09-30',
   when: '2027-09',
   g: '以两个项目、一段实习与一年算法积累为基础参加秋招正式批，完成从投递到 offer 的全流程',
   c: '取得可供选择的 offer', k: []},
  {id: 'm10', lv: 'GOAL', n: 'OFFER', start: '2027-10-15', end: '2027-10-15', ms: true,
   when: '2027 年秋',
   g: '路线终点：取得 C++ 后端方向的正式 offer', c: '', k: []}
];

var AI = [
  {id: 's1', lv: 'S-A', n: 'ML', start: '2026-10-01', end: '2026-12-31',
   when: '2026-10 → 2026-12', note: '周末为主',
   g: '掌握经典机器学习算法的原理与推导，理解偏差方差权衡与过拟合的成因及应对手段，具备使用 scikit-learn 完成完整建模流程的能力',
   c: '掌握偏差方差权衡的成因，并能给出过拟合的应对方案',
   k: ['NumPy / Pandas', 'scikit-learn', 'Jupyter']},
  {id: 's2', lv: 'S-B', n: 'DL', start: '2026-12-01', end: '2027-03-31',
   when: '2026-12 → 2027-03', note: '周末为主',
   g: '掌握 PyTorch 的张量运算与自动求导机制，理解主流网络结构的设计动机，具备独立完成一次从数据准备到模型评估的完整训练的能力',
   c: '独立完成一次完整训练流程，结果可复现',
   k: ['PyTorch', 'CUDA 环境配置', 'TensorBoard']},
  {id: 's3', lv: 'S-C', n: 'RL', start: '2027-03-01', end: '2027-06-30',
   when: '2027-03 → 2027-06', note: '周末为主',
   g: '掌握强化学习的基本框架与主流算法，理解价值方法与策略方法的差异，具备在标准环境中独立完成一次完整训练并解读实验曲线的能力',
   c: '独立完成一次完整的强化学习训练',
   k: ['Gymnasium', '实验记录与调参']},
  {id: 's4', lv: 'S-D', n: 'AI-Infra', start: '2027-06-01', end: '2027-09-30', opt: true,
   when: '2027-06 → 2027-09', note: '学有余力时推进',
   g: '待扩展方向，聚焦 CUDA 编程、算子优化与推理框架；该方向实习门槛高于通用 C++ 后端，路径规划为先以后端岗位入职、再向 Infra 转型',
   c: '', k: ['CUDA', '算子优化', '推理框架']}
];

/* 算法是常驻线：不设通关、没有状态，只有两个训练阶段 */
var ALGO = {id: 'a1', lv: '常驻', n: '算法', start: '2026-09-11', end: '2027-09-30', algo: true,
  when: '2026-09-11 → 2027-09', note: '每天 1.5–2h',
  g: '贯穿全程的常驻训练，不占用关卡周期；前期建立基础题型与高频题的解题模式，2027-01 起以周赛和模拟笔试训练限时手感',
  c: '常驻训练线，不设通关条件，以训练的连续性为唯一考核标准',
  k: ['LeetCode Hot 100 → 高频题', '周赛 / 模拟笔试', '限时手撕（45 分钟内）'],
  segs: [
    {n: '基础题型与高频题', start: '2026-09-11', end: '2026-12-31'},
    {n: '周赛与模拟笔试', start: '2027-01-01', end: '2027-09-30'}
  ]};

/* 阶段由三个时间节点切开；每个阶段的说明就是旧版对应路标的「准入状态」 */
var PHASES = [
  {n: '打基础、做项目', from: '2026-09-11', to: '2027-02-28', cp: null,
   goal: '投递季的准入状态：主线 LV.01–05 全部通关，两个可讲清实现细节的项目成型，简历定稿，算法训练累计满半年，AI 支线推进至强化学习'},
  {n: '投递与实习面试', from: '2027-03-01', to: '2027-05-31', cp: '投递季',
   goal: '暑期实习的起点：已取得实习 offer 并入职；若未落实，则转为持续投递并加深既有项目的技术深度'},
  {n: '暑期实习', from: '2027-06-01', to: '2027-08-31', cp: '实习季',
   goal: '秋招正式批的入场状态：一段完整实习经历、两个成型项目、一年的算法积累，此阶段不再引入新的学习内容'},
  {n: '秋招', from: '2027-09-01', to: '2027-10-31', cp: '秋招正式批',
   goal: '路线终点：取得 C++ 后端方向的正式 offer'}
];

MAIN.forEach(function (it) { it.tk = 'main'; });
AI.forEach(function (it) { it.tk = 'ai'; });
ALGO.tk = 'algo';
var QUESTS = MAIN.concat(AI);                 // 有状态、计入进度的关卡
var ALL = QUESTS.concat([ALGO]);
var byId = {};
ALL.forEach(function (it) {
  it.s = day(it.start); it.e = day(it.end);
  byId[it.id] = it;
});
ALGO.segs.forEach(function (sg) { sg.s = day(sg.start); sg.e = day(sg.end); });
PHASES.forEach(function (p) { p.s = day(p.from); p.e = day(p.to); });

function prevOf(it) {
  if (it.id === 's4') return byId.m8;        // AI-Infra 接在暑期实习之后，沿用旧版的依赖
  var chain = it.tk === 'main' ? MAIN : AI, i = chain.indexOf(it);
  return i > 0 ? chain[i - 1] : null;
}

/* ================= 日期 ================= */
function day(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function diff(a, b) { return Math.round((b - a) / 864e5); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function md(d) { return pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

/* ?today=2027-01-20 可以模拟某一天，方便检查各种状态 */
var TODAY = (function () {
  var q = new URLSearchParams(location.search).get('today');
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return day(q);
  var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate());
})();

/* 列表行里的短日期：只要起止，不要周数和备注 */
function shortWhen(it) {
  if (it.ms) return it.when;
  if (!it.when) return md(it.s) + ' → ' + md(it.e);
  /* 只精确到月的写成「3月」，免得「03 → 06」被看成日期 */
  return it.when.split(' → ').map(function (x) {
    var p = x.split('-');
    return p.length === 3 ? p[1] + '-' + p[2] : (+p[1]) + '月';
  }).join(' → ');
}
function whenText(it) { return it.when || it.start + ' → ' + it.end; }
/* 日期后的补充说明（周数、周末为主…）单独成一段浅色字，靠间距分开，不用分隔符 */
function whenHTML(it) {
  var note = it.note || (it.when ? '' : Math.round((diff(it.s, it.e) + 1) / 7) + ' 周');
  return esc(whenText(it)) + (note ? '<span class="note">' + esc(note) + '</span>' : '');
}

/* ================= 状态 ================= */
var KEY = 'cppquest.v3', ST = {};
function lLoad() { try { var s = localStorage.getItem(KEY); if (s) ST = (JSON.parse(s) || {}).st || {}; } catch (e) {} }
function lSave() { try { localStorage.setItem(KEY, JSON.stringify({st: ST})); } catch (e) {} }
function cleared(id) { return ST[id] === 'done' || ST[id] === 'skip'; }

/* 一个关卡此刻的状态：手动标记优先，其余按今天和计划窗口推算 */
function status(it) {
  var s = ST[it.id];
  if (s === 'done') return {k: 'done', t: '已完成'};
  if (s === 'skip') return {k: 'skip', t: '已跳过'};
  if (TODAY > it.e) return {k: 'late', t: '逾期 ' + diff(it.e, TODAY) + ' 天'};
  if (TODAY >= it.s) {
    var left = diff(TODAY, it.e);
    return {k: 'active', t: left === 0 ? '今天到期' : '剩 ' + left + ' 天'};
  }
  if (s === 'learning') return {k: 'active', t: '提前开始'};
  var n = diff(TODAY, it.s);
  return {k: 'todo', t: n === 1 ? '明天开始' : n + ' 天后开始'};
}
function elapsed(it) {
  var total = diff(it.s, it.e) + 1, gone = diff(it.s, TODAY) + 1;
  return Math.max(0, Math.min(1, gone / total));
}

function setState(id, v) {
  if (ST[id] === v) delete ST[id]; else ST[id] = v;
  lSave(); renderAll(); push();
  if (dlg.open && cur) openCard(cur);
}

/* ================= 渲染工具 ================= */
function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function tkChip(it) { return '<span class="tk tk-' + it.tk + '">' + TRACKS[it.tk].name + '</span>'; }
function cvars(it) { return '--c:' + TRACKS[it.tk].c + ';--bg-c:' + TRACKS[it.tk].bg; }
function actBtns(it) {
  return [['learning', '学习中'], ['done', '✓ 完成'], ['skip', '跳过']].map(function (b) {
    return '<button type="button" class="btn ' + b[0] + (ST[it.id] === b[0] ? ' on' : '') +
           '" data-set="' + it.id + '" data-v="' + b[0] + '">' + b[1] + '</button>';
  }).join('');
}

/* ================= 顶部 ================= */
function renderTop() {
  document.getElementById('d1').textContent = Math.max(0, diff(TODAY, day('2027-03-01')));
  document.getElementById('d2').textContent = Math.max(0, diff(TODAY, day('2027-09-01')));
  var n = QUESTS.filter(function (it) { return ST[it.id] === 'done'; }).length;
  document.getElementById('donen').textContent = n;
  document.getElementById('totaln').textContent = QUESTS.length;
  document.getElementById('donebar').style.width = (n / QUESTS.length * 100) + '%';
  var wk = '日一二三四五六'.charAt(TODAY.getDay());
  document.getElementById('today').textContent = '今天 ' + ymd(TODAY) + ' 周' + wk;
}

/* ================= 现在 ================= */
function renderNow() {
  var live = QUESTS.filter(function (it) {
    var k = status(it).k; return k === 'active' || k === 'late';
  });
  var html = live.map(function (it) {
    var st = status(it), p = Math.round(elapsed(it) * 100);
    return '<article class="ncard ' + st.k + '" style="' + cvars(it) + '">' +
      '<div class="ncard-h">' + tkChip(it) + '<span class="lv">' + it.lv + '</span>' +
        '<span class="chip ' + st.k + '">' + st.t + '</span></div>' +
      '<div><h3>' + esc(it.n) + '</h3><div class="when">' + whenHTML(it) + '</div></div>' +
      '<div class="tbar" title="计划时间已过 ' + p + '%"><div style="width:' + p + '%"></div></div>' +
      (it.c ? '<p class="cond">' + esc(it.c) + '</p>' : '') +
      '<div class="acts">' + actBtns(it) +
        '<button type="button" class="btn ghost" data-open="' + it.id + '">详情</button></div>' +
    '</article>';
  }).join('');

  document.getElementById('now').innerHTML = html ||
    '<p class="empty">这段时间没有排关卡，看看下面接下来要做什么</p>';

  /* 算法是常驻线、没有状态要操作，不值得占一张卡片，压成一行 */
  var seg = ALGO.segs.filter(function (sg) { return TODAY >= sg.s && TODAY <= sg.e; })[0];
  var algo = seg ? '<div class="next-row"><span class="k">常驻</span><button type="button" data-open="a1">' +
    tkChip(ALGO) + ' <b>' + esc(seg.n) + '</b><span class="m">' + ALGO.note + '</span></button></div>' : '';

  /* 每条线下一个还没开始的关卡 */
  var nx = ['main', 'ai'].map(function (tk) {
    return QUESTS.filter(function (it) { return it.tk === tk && status(it).k === 'todo'; })[0];
  }).filter(Boolean);
  document.getElementById('next').innerHTML = algo + (nx.length ? '<div class="next-row"><span class="k">接下来</span>' +
    nx.map(function (it) {
      return '<button type="button" data-open="' + it.id + '">' + tkChip(it) + ' <b>' + esc(it.n) + '</b>' +
             '<span class="m">' + status(it).t + '（' + md(it.s) + '）</span></button>';
    }).join('') + '</div>' : '');
}

/* ================= 时间线 ================= */
var R0 = day('2026-09-01'), R1 = day('2027-11-01');
function xp(d) { return (diff(R0, d) / diff(R0, R1) * 100).toFixed(3) + '%'; }
function wp(s, e) { return ((diff(s, e) + 1) / diff(R0, R1) * 100).toFixed(3) + '%'; }

/* 同一条线里时间重叠的关卡分行摆放：贪心地放进第一个已经空出来的行 */
function stack(items) {
  var rows = [];
  items.forEach(function (it) {
    for (var r = 0; r < rows.length; r++) if (rows[r] < it.s) break;
    rows[r] = it.e; it.row = r;
  });
  return rows.length;
}

function renderTimeline() {
  var ROW = 38, PADY = 9, h = '';

  var ov = '';
  var axis = '<div class="tl-axis">';
  for (var d = new Date(R0); d < R1; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    var m = d.getMonth() + 1, first = +d === +R0 || m === 1;
    axis += '<div class="tl-m' + (first ? ' y' : '') + '" style="left:' + xp(d) + '">' +
            (first ? '<b>' + d.getFullYear() + '</b> ' : '') + m + '月</div>';
    ov += '<div class="tl-grid" style="left:' + xp(d) + '"></div>';
  }
  PHASES.forEach(function (p) {
    if (!p.cp) return;
    axis += '<div class="tl-cp" style="left:' + xp(p.s) + '">' + p.cp + '</div>';
    ov += '<div class="tl-cpl" style="left:' + xp(p.s) + '"></div>';
  });
  axis += '</div>';

  var lanes = [
    {tk: 'main', items: MAIN},
    {tk: 'algo', items: ALGO.segs.map(function (sg) {
      return {id: 'a1', n: sg.n, s: sg.s, e: sg.e, tk: 'algo', seg: true};
    })},
    {tk: 'ai', items: AI}
  ];
  var body = '<div class="tl-body">';
  lanes.forEach(function (ln) {
    var rows = stack(ln.items);
    body += '<div class="tl-lane"><div class="tl-lab" style="color:' + TRACKS[ln.tk].c + '">' + TRACKS[ln.tk].name + '</div>' +
            '<div class="tl-track" style="height:' + (rows * ROW + PADY * 2 - 8) + 'px">';
    ln.items.forEach(function (it) {
      var cls = 'bar', inner, title = it.n;
      if (it.seg) {
        inner = '<span class="bn">' + esc(it.n) + '</span>';
      } else {
        var st = status(it);
        cls += ' ' + st.k + (it.opt ? ' opt' : '') + (it.ms ? ' ms' : '');
        title = it.lv + ' ' + it.n + '：' + st.t;
        inner = it.ms ? '★' :
          (st.k === 'active' ? '<span class="fill" style="width:' + (elapsed(it) * 100) + '%"></span>' : '') +
          '<span class="bn">' + (st.k === 'done' ? '✓ ' : '') + esc(it.n) + '</span>';
      }
      body += '<button type="button" class="' + cls + '" data-open="' + it.id + '" title="' + esc(title) + '" ' +
              'style="' + cvars(it) + ';left:' + xp(it.s) + ';width:' + wp(it.s, it.e) + ';top:' + (PADY + it.row * ROW) + 'px">' +
              inner + '</button>';
    });
    body += '</div></div>';
  });
  body += '</div>';

  if (TODAY >= R0 && TODAY < R1) {
    ov += '<div class="tl-today" style="left:' + xp(TODAY) + '"><span>今天 ' + md(TODAY) + '</span></div>';
  }
  h = axis + body + '<div class="tl-foot"></div><div class="tl-ov" style="position:absolute;top:0;bottom:0;left:var(--gut);right:0;pointer-events:none">' + ov + '</div>';
  document.getElementById('tl').innerHTML = h;
}

/* ================= 全部关卡（按阶段） ================= */
function renderPhases() {
  var html = PHASES.map(function (p, i) {
    var items = QUESTS.filter(function (it) { return it.s >= p.s && it.s <= p.e; })
                      .sort(function (a, b) { return a.s - b.s; });
    var rows = items.map(function (it) {
      var st = status(it);
      return '<div class="row ' + st.k + '" data-open="' + it.id + '" role="button" tabindex="0">' +
        '<button type="button" class="tick" data-tick="' + it.id + '" aria-label="' +
          (ST[it.id] === 'done' ? '取消完成：' : '标记完成：') + esc(it.n) + '">' +
          (st.k === 'skip' ? '–' : '✓') + '</button>' +
        '<span class="dot" style="background:' + TRACKS[it.tk].c + '" title="' + TRACKS[it.tk].name + '"></span>' +
        '<b class="row-n">' + esc(it.n) + '</b>' +
        '<span class="row-d">' + esc(shortWhen(it)) + '</span>' +
        '<span class="chip ' + st.k + '">' + st.t + '</span>' +
      '</div>';
    }).join('');
    var done = items.filter(function (it) { return ST[it.id] === 'done'; }).length;
    /* 阶段目标默认收起：常看的是关卡，不是阶段说明 */
    return '<div class="phase"><div class="phase-h"><span class="ph-no">阶段 ' + (i + 1) + '</span><h3>' + p.n + '</h3>' +
      '<span class="when">' + p.from.slice(0, 7) + ' → ' + p.to.slice(0, 7) + '</span>' +
      '<span class="phase-n">' + done + ' / ' + items.length + '</span>' +
      '<details><summary>阶段目标</summary><p>' + esc(p.goal) + '</p></details></div>' + rows + '</div>';
  }).join('');
  document.getElementById('phases').innerHTML = html;
}

function renderAll() { renderTop(); renderNow(); renderTimeline(); renderPhases(); }

/* ================= 详情弹窗 ================= */
var dlg = document.getElementById('dlg'), card = document.getElementById('card'), cur = null;
function openCard(it) {
  cur = it;
  var st = it.algo ? {k: '', t: '常驻'} : status(it), p = it.algo ? null : prevOf(it);
  card.style.cssText = cvars(it);
  card.innerHTML =
    '<div class="card-h">' + tkChip(it) + '<span class="lv">' + it.lv + '</span>' +
      '<span class="chip ' + st.k + '">' + st.t + '</span>' +
      '<button type="button" class="btn ghost x" data-close aria-label="关闭">✕</button></div>' +
    '<div class="card-b">' +
      '<div><h2 id="dlg-title">' + esc(it.n) + '</h2><div class="when">' + whenHTML(it) + '</div></div>' +
      (it.algo ? '' : '<div class="acts">' + actBtns(it) + '</div>') +
      (it.c ? '<div><div class="lbl">' + (it.algo ? '考核' : '通关条件') + '</div><p class="cond">' + esc(it.c) + '</p></div>' : '') +
      '<div><div class="lbl">目标</div><p class="goal">' + esc(it.g) + '</p></div>' +
      (p ? '<div><div class="lbl">前置关卡</div><button type="button" class="pre" data-open="' + p.id + '">' +
             tkChip(p) + '<span class="lv">' + p.lv + '</span>' + esc(p.n) +
             '<span class="chip ' + status(p).k + '">' + status(p).t + '</span></button></div>' : '') +
      (it.k.length ? '<div><div class="lbl">配套工具与技能</div><div class="tags">' +
             it.k.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>' : '') +
    '</div>';
  if (!dlg.open) dlg.showModal();
  card.scrollTop = 0;
  card.focus();                               // 否则焦点落在关闭按钮上，一打开就是一圈焦点框
}

/* 所有交互走事件委托：页面经常整块重绘，逐个绑定很容易漏 */
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-tick],[data-set],[data-open],[data-close]');
  if (!t) { if (e.target === dlg) dlg.close(); return; }
  if (t.dataset.tick) { e.stopPropagation(); setState(t.dataset.tick, 'done'); return; }
  if (t.dataset.set) { setState(t.dataset.set, t.dataset.v); return; }
  if (t.hasAttribute('data-close')) { dlg.close(); return; }
  if (t.dataset.open) openCard(byId[t.dataset.open]);
});
/* 列表行是 div（里面还嵌着勾选按钮），键盘回车也要能打开 */
document.addEventListener('keydown', function (e) {
  var t = e.target;
  if ((e.key === 'Enter' || e.key === ' ') && t.classList && t.classList.contains('row')) {
    e.preventDefault(); openCard(byId[t.dataset.open]);
  }
});
document.getElementById('reset').addEventListener('click', function () {
  if (!confirm('清空所有关卡状态？')) return;
  ST = {}; lSave(); renderAll(); push();
});

/* ================= 同步 =================
   页面在 GitHub Pages，进度接口在腾讯云：api.bandbox.cloud/roadmap/progress 由 next-go 的 nginx
   转发到 roadmap-api，跨域头也在 nginx 里加，只放行 https://roadmap.bdathe.wiki。
   不走 roadmap.bdathe.wiki 自己的域名，是因为它没有备案，大陆服务器上会被拦截。
   接口不可达（本地预览、断网）时只存 localStorage。
   协议与旧版相同：GET 读、PUT 写，写入要带 X-Token 口令。 */
var syncEl = document.getElementById('sync');
var API = 'https://api.bandbox.cloud/roadmap/progress', TKEY = 'cppquest.token', mode = 'local', timer = null;

function getTok() { try { return localStorage.getItem(TKEY) || ''; } catch (e) { return ''; } }
function setTok(v) { try { v ? localStorage.setItem(TKEY, v) : localStorage.removeItem(TKEY); } catch (e) {} }
function sync(t, bad) { syncEl.textContent = t; syncEl.className = 'sync' + (bad ? ' bad' : ''); }

function askTok(force) {
  var v = window.prompt(force ? '写入口令不正确，请重新输入：' : '首次写入需要口令，只需设置一次：', getTok());
  if (v === null) return '';
  v = v.trim(); setTok(v); return v;
}
function sendHTTP() {
  var t = getTok() || askTok(false);
  if (!t) { sync('仅本地保存', true); return; }
  sync('同步中…');
  fetch(API, {method: 'PUT', headers: {'Content-Type': 'application/json', 'X-Token': t}, body: JSON.stringify({st: ST})})
    .then(function (r) {
      if (r.status === 401) { setTok(''); sync('口令不对，点此重设', true); return; }
      if (!r.ok) throw new Error(r.status);
      sync('已同步');
    })
    .catch(function () { sync('同步失败，仅本地保存', true); });
}
function push() {
  if (mode !== 'http') return;
  clearTimeout(timer); timer = setTimeout(sendHTTP, 400);   // 连点合并成一次请求
}
function resync() { if (mode === 'http' && askTok(true)) sendHTTP(); }
syncEl.addEventListener('click', resync);
syncEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resync(); } });

lLoad(); renderAll();

(function () {
  fetch(API, {cache: 'no-store'})
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (v) {
      mode = 'http';
      if (v && v.st && Object.keys(v.st).length) { ST = v.st; lSave(); renderAll(); }
      else if (Object.keys(ST).length) push();
      sync(getTok() ? '已同步' : '点此设置口令');
    })
    .catch(function () { sync('仅本地保存'); });
})();
