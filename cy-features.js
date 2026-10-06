/* 创意引擎 - 全局功能：成就系统 + 站内搜索 + 通用组件 + 对比度兜底 */
(function () {
    var CY = window.CY = window.CY || {};

    function LS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
    function SS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

    /* ========== 通用 Toast（样式走公共层 .cy-toast，随主题变量联动） ========== */
    CY.showToast = function (msg, ms) {
        ms = ms || 2600;
        var t = document.getElementById('cyToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'cyToast';
            t.className = 'cy-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._tm);
        t._tm = setTimeout(function () { t.classList.remove('show'); }, ms);
    };

    /* ========== 公共工具（供各页面复用，页面勿重复实现） ========== */
    CY.escapeHtml = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    };
    CY.fmtDate = function (d) {
        d = d || new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    };
    CY.download = function (fileName, text, mime) {
        try {
            var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
        } catch (e) {}
    };
    CY.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

    /* ========== 事件总线：同页直调 + 跨 tab（BroadcastChannel + storage 兜底） ========== */
    CY._evt = {};
    CY.on = function (type, cb) {
        (CY._evt[type] = CY._evt[type] || []).push(cb);
    };
    CY.emit = function (type, payload) {
        var list = CY._evt[type] || [];
        for (var i = 0; i < list.length; i++) { try { list[i](payload || {}); } catch (e) {} }
        try {
            new BroadcastChannel('cy-muse').postMessage({ type: type, payload: payload || {}, at: Date.now() });
        } catch (e) {}
        try { localStorage.setItem('cy_evt_' + type, JSON.stringify({ payload: payload || {}, at: Date.now() })); } catch (e2) {}
    };
    try {
        var _cyBC = new BroadcastChannel('cy-muse');
        _cyBC.onmessage = function (e) {
            var d = e.data || {};
            var list = CY._evt[d.type] || [];
            for (var i = 0; i < list.length; i++) { try { list[i](d.payload || {}); } catch (err) {} }
        };
    } catch (e) {}
    /* storage 兜底：BroadcastChannel 不可用时，跨 tab 靠同源 storage 事件同步 */
    window.addEventListener('storage', function (e) {
        if (!e.newValue || e.key.indexOf('cy_evt_') !== 0) return;
        var type = e.key.slice(7);
        var list = CY._evt[type] || [];
        try { var p = JSON.parse(e.newValue).payload; } catch (e2) { return; }
        for (var i = 0; i < list.length; i++) { try { list[i](p || {}); } catch (err) {} }
    });

    /* ========== V2.0 活动数据层 cy_activity_v1（事件驱动数据资产） ==========
     * 记录全站创作动作（生成点子/文案/配色/记录灵感等），供首页/关于页聚合：
     *   CY.activity.add({type, itemId, page, extra}) -> 写日志 + emit 'cy.activity'
     *   CY.activity.recent(n)     最近 n 条
     *   CY.activity.todayCount()  今日活动数
     *   CY.activity.streakDays()  连续活跃天数（今天未活动则以今天为断点回退）
     * 条目：{type, itemId, page, at} */
    (function () {
        var KEY = 'cy_activity_v1';
        var MAX = 500;
        function read() {
            try { var a = JSON.parse(localStorage.getItem(KEY)); if (Object.prototype.toString.call(a) === '[object Array]') return a; } catch (e) {}
            return [];
        }
        function write(a) {
            if (a.length > MAX) a = a.slice(a.length - MAX);
            try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
            return a;
        }
        CY.activity = {
            add: function (entry) {
                var a = read();
                a.push({
                    type: entry.type || 'use',
                    itemId: entry.itemId == null ? '' : String(entry.itemId),
                    page: entry.page || '',
                    at: entry.at || Date.now()
                });
                write(a);
                CY.emit('cy.activity', a[a.length - 1]);
                if (CY.activity.streakDays() >= 7) CY.unlock('checkin_7');
            },
            recent: function (n) {
                var a = read();
                return n ? a.slice(-n) : a;
            },
            todayCount: function () {
                var a = read(), now = new Date(), c = 0;
                for (var i = 0; i < a.length; i++) {
                    var d = new Date(a[i].at);
                    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) c++;
                }
                return c;
            },
            streakDays: function () {
                var a = read(), days = {};
                for (var i = 0; i < a.length; i++) {
                    var d = new Date(a[i].at);
                    days[d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()] = 1;
                }
                var now = new Date(), n = 0, cur = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                function key(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
                if (!days[key(cur)]) cur.setDate(cur.getDate() - 1); // 今天没活动，从昨天起算
                while (days[key(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
                return n;
            }
        };
    })();

    /* ========== V2.0 版本与数据迁移框架 ==========
     * cy_app_version = {ver, at, read[]}：ver=数据已迁移到的版本，read=已读过的更新记录
     * 新功能发布流程：CY.APP_VER 升版 → VERSION_LOG 补一条 → whatsNew() 自动触达用户
     * dataMigration(name, toVer, fn)：确保数据结构演进到 toVer，幂等，只执行一次 */
    CY.APP_VER = '1.0.0';
    CY.VERSION_LOG = [
        { ver: '1.0.0', title: '创意引擎 · 初版发布', desc: '12 个创作工具 + 10 主题 + 离线可用；数据全部保存在本地' }
    ];
    function verState() {
        var st = { ver: '', read: [] };
        try {
            var p = JSON.parse(localStorage.getItem('cy_app_version') || '{}');
            if (p && typeof p.ver === 'string') st.ver = p.ver;
            if (Object.prototype.toString.call(p && p.read) === '[object Array]') st.read = p.read;
        } catch (e) {}
        return st;
    }
    function verGte(a, b) {
        var pa = String(a || '0').split('.').map(Number);
        var pb = String(b || '0').split('.').map(Number);
        while (pa.length < 3) pa.push(0);
        while (pb.length < 3) pb.push(0);
        for (var i = 0; i < 3; i++) { if (pa[i] > pb[i]) return true; if (pa[i] < pb[i]) return false; }
        return true;
    }
    CY.dataMigration = function (name, toVer, fn) {
        var st = verState();
        if (verGte(st.ver, toVer)) return;
        try { if (fn) fn(); } catch (e) {}
        st.ver = toVer;
        try { localStorage.setItem('cy_app_version', JSON.stringify({ ver: st.ver, at: Date.now(), read: st.read })); } catch (e2) {}
    };
    CY.whatsNew = function () {
        var st = verState(), out = [];
        for (var i = 0; i < CY.VERSION_LOG.length; i++) {
            var v = CY.VERSION_LOG[i];
            if (st.read.indexOf(v.ver) < 0 && verGte(v.ver, st.ver)) out.push(v);
        }
        return out;
    };
    CY.markVersionSeen = function () {
        var st = verState(), read = st.read.slice();
        for (var i = 0; i < CY.VERSION_LOG.length; i++) {
            var v = CY.VERSION_LOG[i].ver;
            if (read.indexOf(v) < 0) read.push(v);
        }
        try { localStorage.setItem('cy_app_version', JSON.stringify({ ver: st.ver, at: Date.now(), read: read })); } catch (e) {}
    };
    // 内置迁移：v1.0.0 —— 初始化笔记数据结构（幂等无害）
    CY.dataMigration('notes_norm', '1.0.0', function () {
        try {
            var notes = JSON.parse(localStorage.getItem('cy_notes_v1') || '[]');
            if (Object.prototype.toString.call(notes) !== '[object Array]') return;
            var changed = false;
            for (var i = 0; i < notes.length; i++) {
                if (notes[i] && notes[i].tags == null) { notes[i].tags = []; changed = true; }
                if (notes[i] && notes[i].fav == null) { notes[i].fav = false; changed = true; }
            }
            if (changed) localStorage.setItem('cy_notes_v1', JSON.stringify(notes));
        } catch (e) {}
    });

    /* ========== 页面索引（站内搜索 + sitemap 单一来源，构建脚本读取） ========== */
    CY.PAGES = [
        { f: 'index.html', t: '创意引擎主站·灵感工坊', k: '首页 导航 灵感 创意 引擎 火花' },
        { f: '1.html', t: '灵感火花·创意点子生成器', k: '点子 灵感 创意 生成 脑暴 选题' },
        { f: '2.html', t: '文案工坊·标语金句生成', k: '文案 标语 标题 金句 广告 祝福' },
        { f: '3.html', t: '摘要萃取·智能摘要提炼', k: '摘要 关键词 提炼 文本 压缩' },
        { f: '4.html', t: '文本体检·深度文本分析', k: '字数 词频 词云 可读性 情感 分析' },
        { f: '5.html', t: '配色灵感·调色板与对比度', k: '配色 色板 颜色 对比度 WCAG 和谐' },
        { f: '6.html', t: '生成艺术·创意画布', k: '画布 艺术 生成 图片 导出 流场 分形' },
        { f: '7.html', t: '决策矩阵·加权决策辅助', k: '决策 选择 打分 权衡 权重 敏感性' },
        { f: '8.html', t: '目标拆解·SMART里程碑规划', k: '目标 拆解 SMART 计划 里程碑 甘特' },
        { f: '9.html', t: '灵感记录本·想法速记', k: '记录 笔记 想法 标签 速记 导出' },
        { f: '10.html', t: '创意连线·联想训练', k: '联想 词汇 训练 思维 连接 配对' },
        { f: '11.html', t: '创作方法库·方法论与引导', k: '方法论 创意 方法 SCAMPER 六顶思考帽 头脑风暴' },
        { f: '12.html', t: '关于与更新·签到统计', k: '关于 版本 更新 声明 签到 统计 反馈' },
        { f: 'verify.html', t: '全站自检', k: '自检 检测 状态 体检' }
    ];

    /* ========== 成就系统 ========== */
    CY.ACHIEVEMENTS = [
        { id: 'idea_first', t: '初燃火花', d: '用灵感火花生成第一个点子', icon: '💡' },
        { id: 'copy_first', t: '妙笔生花', d: '生成第一句文案', icon: '✍️' },
        { id: 'digest_first', t: '提纲挈领', d: '完成一次文本摘要', icon: '📑' },
        { id: 'palette_10', t: '调色高手', d: '生成过 10 个配色方案', icon: '🎨' },
        { id: 'art_first', t: '艺术创想', d: '用生成艺术画出第一幅作品', icon: '🖼️' },
        { id: 'decide_5', t: '当机立断', d: '完成 5 次决策打分', icon: '⚖️' },
        { id: 'plan_first', t: '谋定后动', d: '完成一次目标拆解', icon: '🎯' },
        { id: 'note_10', t: '灵感收藏家', d: '记录 10 条灵感笔记', icon: '📓' },
        { id: 'link_10', t: '天马行空', d: '完成 10 次创意连线', icon: '🧩' },
        { id: 'method_first', t: '初窥门径', d: '完成一次创作方法引导', icon: '📚' },
        { id: 'tool_8', t: '工具达人', d: '使用过 8 个不同工具', icon: '🛠️' },
        { id: 'checkin_7', t: '七日之约', d: '连续活跃 7 天', icon: '📅' }
    ];

    CY.getUnlocked = function () { return LS('cy_ach') || []; };
    CY.unlock = function (id) {
        var u = CY.getUnlocked();
        if (u.indexOf(id) < 0) {
            u.push(id);
            SS('cy_ach', u);
            var meta = null;
            for (var i = 0; i < CY.ACHIEVEMENTS.length; i++) { if (CY.ACHIEVEMENTS[i].id === id) { meta = CY.ACHIEVEMENTS[i]; break; } }
            CY.showToast('🏆 解锁成就：' + (meta ? meta.icon + ' ' + meta.t : id));
        }
    };

    /* 工具使用计数（跨页统计，去重） */
    CY.trackPage = function (pageKey) {
        if (!pageKey) return;
        var used = LS('cy_used') || [];
        if (used.indexOf(pageKey) < 0) {
            used.push(pageKey);
            SS('cy_used', used);
        }
        if (used.length >= 8) CY.unlock('tool_8');
    };

    /* ========== 站内搜索 ========== */
    CY.search = function (q) {
        q = (q || '').trim().toLowerCase();
        if (!q) return [];
        var out = [];
        for (var i = 0; i < CY.PAGES.length; i++) {
            var p = CY.PAGES[i];
            if ((p.t + ' ' + p.k).toLowerCase().indexOf(q) >= 0) {
                out.push(p);
            }
        }
        return out;
    };

    CY.openSearch = function () {
        if (document.getElementById('cySearchBox')) { document.getElementById('cySearchInput').focus(); return; }
        var box = document.createElement('div');
        box.id = 'cySearchBox';
        box.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;background:rgba(8,10,30,.55);display:flex;align-items:flex-start;justify-content:center;padding-top:12vh;';
        box.innerHTML = '<div style="width:min(560px,92%);background:var(--card);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);overflow:hidden;">' +
            '<div style="display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line);">' +
            '<span style="font-size:18px;margin-right:10px;">🔍</span>' +
            '<input id="cySearchInput" placeholder="搜索页面/功能，如：点子、配色、摘要…" style="flex:1;border:none;outline:none;font-size:16px;background:transparent;color:var(--txt);">' +
            '<button id="cySearchClose" style="border:none;background:none;font-size:20px;cursor:pointer;color:var(--dim);padding:2px 6px;">✕</button></div>' +
            '<div id="cySearchResults" style="max-height:52vh;overflow-y:auto;padding:6px 0;"></div></div>';
        document.body.appendChild(box);
        var input = document.getElementById('cySearchInput');
        var results = document.getElementById('cySearchResults');
        function render() {
            var q = input.value;
            var list = CY.search(q);
            if (!q) { results.innerHTML = '<div style="padding:20px;text-align:center;color:var(--dim);font-size:13px;">输入关键词开始搜索全站功能</div>'; return; }
            if (!list.length) { results.innerHTML = '<div style="padding:20px;text-align:center;color:var(--dim);">未找到相关功能</div>'; return; }
            results.innerHTML = '';
            for (var i = 0; i < list.length; i++) {
                var a = document.createElement('a');
                a.href = list[i].f;
                a.style.cssText = 'display:block;padding:12px 18px;text-decoration:none;color:var(--txt);font-size:15px;';
                a.innerHTML = '<span style="color:var(--blue);font-weight:bold;">' + list[i].t + '</span>';
                a.onmouseenter = function () { this.style.background = 'var(--card-2)'; };
                a.onmouseleave = function () { this.style.background = ''; };
                results.appendChild(a);
            }
        }
        input.addEventListener('input', render);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var list = CY.search(input.value);
                if (list.length) { window.location.href = list[0].f; }
            } else if (e.key === 'Escape') { box.remove(); }
        });
        document.getElementById('cySearchClose').onclick = function () { box.remove(); };
        box.onclick = function (e) { if (e.target === box) box.remove(); };
        input.focus();
    };

    /* 快捷键 "/" 呼出搜索（输入框内不拦截） */
    document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            var tag = (document.activeElement && document.activeElement.tagName) || '';
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
                e.preventDefault();
                e.stopPropagation();
                CY.openSearch();
            }
        }
    });

    /* ========== 最近记录面板（灵感/文案/文本等生成类页面） ========== */
    CY.RECENT_MAP = {
        '1.html': { key: 'cy_recent_ideas', input: null, label: '点子' },
        '2.html': { key: 'cy_recent_copy', input: null, label: '文案' },
        '4.html': { key: 'cy_recent_text', input: '#ta', label: '文本' }
    };
    CY.saveRecent = function (key, text) {
        try {
            var list = LS(key) || [];
            list.unshift({ t: String(text).slice(0, 120), time: new Date().toLocaleString() });
            SS(key, list.slice(0, 10));
        } catch (e) {}
    };
    CY.openRecent = function () {
        var page = (window.location.pathname.split('/').pop() || '').toLowerCase();
        var cfg = CY.RECENT_MAP[page];
        if (!cfg) { CY.showToast('本页无最近记录功能'); return; }
        var list = LS(cfg.key) || [];
        if (document.getElementById('cyRecentPanel')) document.getElementById('cyRecentPanel').remove();
        var panel = document.createElement('div');
        panel.id = 'cyRecentPanel';
        panel.style.cssText = 'position:fixed;bottom:76px;right:20px;width:min(300px,86vw);max-height:46vh;overflow-y:auto;z-index:2147483646;background:var(--card,#fff);color:var(--txt,#333);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.4);padding:10px 0;';
        var head = document.createElement('div');
        head.style.cssText = 'padding:8px 16px;font-size:14px;font-weight:bold;color:var(--blue,#667eea);border-bottom:1px solid var(--line,#eee);display:flex;justify-content:space-between;align-items:center;';
        head.innerHTML = '🕘 最近' + cfg.label + '<span style="cursor:pointer;color:var(--dim,#999);" id="cyRecentClose">✕</span>';
        panel.appendChild(head);
        if (!list.length) {
            var empty = document.createElement('div');
            empty.style.cssText = 'padding:20px;text-align:center;color:var(--dim,#999);font-size:13px;';
            empty.textContent = '暂无记录';
            panel.appendChild(empty);
        } else {
            list.forEach(function (it) {
                var row = document.createElement('div');
                row.style.cssText = 'padding:10px 16px;font-size:13px;color:var(--txt,#333);cursor:pointer;border-bottom:1px solid var(--line,#f3f3f3);word-break:break-all;';
                row.innerHTML = '<span style="color:var(--dim,#888);"></span><br>';
                row.firstChild.textContent = it.time;
                row.appendChild(document.createTextNode(it.t));
                row.onmouseenter = function () { this.style.background = 'var(--card-2,#f4f6ff)'; };
                row.onmouseleave = function () { this.style.background = ''; };
                row.onclick = function () {
                    if (cfg.input) {
                        var inp = document.querySelector(cfg.input);
                        if (inp) {
                            inp.value = it.t;
                            inp.focus();
                            CY.showToast('已回填，可重新分析');
                        }
                    } else {
                        try { navigator.clipboard.writeText(it.t).then(function () { CY.showToast('已复制内容'); }).catch(function () {}); } catch (e) {}
                    }
                    panel.remove();
                };
                panel.appendChild(row);
            });
        }
        document.body.appendChild(panel);
        document.getElementById('cyRecentClose').onclick = function () { panel.remove(); };
    };

    /* 主题按钮左侧：最近记录浮钮（仅记录功能页显示） */
    var _page = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (CY.RECENT_MAP[_page]) {
        (function () {
            var btn = document.createElement('div');
            btn.textContent = '🕘';
            btn.title = '最近记录';
            btn.setAttribute('aria-label', '最近记录');
            btn.style.cssText = 'position:fixed;bottom:20px;right:74px;z-index:2147483646;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;box-shadow:0 4px 16px rgba(0,0,0,.35);user-select:none;-webkit-user-select:none;';
            btn.onclick = function () { CY.openRecent(); };
            if (document.body) { document.body.appendChild(btn); }
            else { document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); }); }
        })();
    }

    /* ========== V1.9.2 对比度兜底：深底暗字/浅底亮字自动换主题色 ========== */
    function _cyLuma(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255; }
    function _cyParse(c) {
        if (!c) return null;
        var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) { return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), m[4] === undefined ? 1 : parseFloat(m[4])]; }
        var h = c.match(/^#([0-9a-f]{6})$/i);
        if (h) { var v = parseInt(h[1], 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255, 1]; }
        var h3 = c.match(/^#([0-9a-f]{3})$/i);
        if (h3) { var s = h3[1]; return [parseInt(s[0] + s[0], 16), parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), 1]; }
        return null;
    }
    function _cyIsGray(rgb) { return (Math.max(rgb[0], rgb[1], rgb[2]) - Math.min(rgb[0], rgb[1], rgb[2])) < 24; }
    function _cyGradLuma(bi) {
        if (!bi || bi.indexOf('gradient') < 0) return null;
        var m = bi.match(/gradient\([^)]*\)/g);
        if (!m) return null;
        var sum = 0, cnt = 0;
        for (var i = 0; i < m.length; i++) {
            var cols = m[i].match(/#[0-9a-f]{6}|#[0-9a-f]{3}|rgba?\([^)]*\)/gi);
            if (!cols) continue;
            for (var j = 0; j < cols.length; j++) {
                var p = _cyParse(cols[j]);
                if (p) { sum += _cyLuma(p); cnt++; }
            }
        }
        return cnt ? sum / cnt : null;
    }
    var _cyLight = false;
    function _cyBgOf(el) {
        var n = el, acc = null;
        while (n) {
            var cs = getComputedStyle(n);
            var g = _cyGradLuma(cs.backgroundImage);
            if (g !== null) { return (acc && acc[3] >= 0.95) ? _cyLuma(acc) : g; }
            var bg = _cyParse(cs.backgroundColor);
            if (bg && bg[3] > 0) {
                if (bg[3] >= 0.95) { return acc ? _cyLuma(_cyBlend(acc, bg)) : _cyLuma(bg); }
                acc = acc ? _cyBlend(bg, acc) : bg;
            }
            if (n === document.body) break;
            n = n.parentElement;
        }
        if (acc) {
            var b2 = _cyParse(getComputedStyle(document.body).backgroundColor);
            if (b2 && b2[3] > 0) { return _cyLuma(_cyBlend(acc, b2)); }
            return _cyLuma(_cyBlend(acc, _cyLight ? [244, 246, 251, 1] : [10, 14, 31, 1]));
        }
        var b3 = _cyParse(getComputedStyle(document.body).backgroundColor);
        if (b3 && b3[3] > 0) { return _cyLuma(b3); }
        return 0.1;
    }
    function _cyBlend(top, bottom) {
        var a = top[3];
        return [bottom[0] * (1 - a) + top[0] * a, bottom[1] * (1 - a) + top[1] * a, bottom[2] * (1 - a) + top[2] * a, 1];
    }
    var _cyFixRan = false;
    CY.contrastFix = function (force) {
        if (_cyFixRan && !force) return;
        _cyFixRan = true;
        try {
            var _rcs = getComputedStyle(document.documentElement);
            var _bgV = _cyParse(_rcs.getPropertyValue('--bg'));
            var lightTheme = _bgV ? _cyLuma(_bgV) > 0.5 : false;
            _cyLight = lightTheme;
            var dim = (_rcs.getPropertyValue('--dim') || '#8b93a7').trim();
            var txt = (_rcs.getPropertyValue('--txt') || '#e8ecf5').trim();
            var blue = (_rcs.getPropertyValue('--blue') || '#7aa8ff').trim();
            if (dim.indexOf('#') === 0) dim = 'rgb(' + parseInt(dim.slice(1, 3), 16) + ',' + parseInt(dim.slice(3, 5), 16) + ',' + parseInt(dim.slice(5, 7), 16) + ')';
            if (txt.indexOf('#') === 0) txt = 'rgb(' + parseInt(txt.slice(1, 3), 16) + ',' + parseInt(txt.slice(3, 5), 16) + ',' + parseInt(txt.slice(5, 7), 16) + ')';
            if (blue.indexOf('#') === 0) blue = 'rgb(' + parseInt(blue.slice(1, 3), 16) + ',' + parseInt(blue.slice(3, 5), 16) + ',' + parseInt(blue.slice(5, 7), 16) + ')';
            var els = document.querySelectorAll('body *');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var tag = el.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS' || tag === 'IMG' || tag === 'VIDEO' || tag === 'SVG' || tag === 'BR' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') continue;
                if (el.children.length > 0 && el.childNodes.length === el.children.length) continue;
                if (!el.textContent || !el.textContent.trim()) continue;
                var cs = getComputedStyle(el);
                var c = _cyParse(cs.color);
                if (!c) continue;
                if (c[3] === 0) continue;
                var bg = _cyBgOf(el);
                var cl = _cyLuma(c);
                var isHeading = /^(H1|H2|H3|H4|H5|H6)$/.test(tag) || /title|heading/i.test(el.className || '');
                var _dlp = _cyParse(dim);
                var dimLuma = _dlp ? _cyLuma(_dlp) : 0.5;
                var rep = '';
                if (_cyIsGray(c)) {
                    if (bg < 0.4 && cl < 0.45) { rep = dimLuma > 0.5 ? dim : 'rgb(219,227,245)'; }
                    else if (bg > 0.82 && cl > 0.82) { rep = isHeading ? 'rgb(30,39,51)' : 'rgb(30,39,51)'; }
                } else if (bg < 0.4 && cl < 0.45) { rep = lightTheme ? 'rgb(219,227,245)' : blue; }
                else if (bg > 0.82 && cl > 0.82) { rep = 'rgb(30,39,51)'; }
                if (rep) {
                    el.style.transition = 'none';
                    el.style.setProperty('color', rep, 'important');
                    try { el.style.setProperty('-webkit-text-fill-color', rep, 'important'); } catch (e2) {}
                }
            }
        } catch (e) {}
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(CY.contrastFix, 200); });
    } else {
        setTimeout(CY.contrastFix, 200);
    }
    try {
        var _cyThemeObs = new MutationObserver(function (muts) {
            for (var i = 0; i < muts.length; i++) {
                if (muts[i].attributeName === 'data-theme') {
                    setTimeout(function () { CY.contrastFix(true); }, 120);
                    setTimeout(function () { CY.contrastFix(true); }, 700);
                    return;
                }
            }
        });
        _cyThemeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (e2) {}

    /* 自动统计当前页使用（排除自检/关于页） */
    var cur = (window.location.pathname.split('/').pop() || '').toLowerCase();
    var skipPages = ['verify.html'];
    if (cur && skipPages.indexOf(cur) < 0 && cur.indexOf('.html') > 0) {
        CY.trackPage(cur);
    }
})();

/* ========== V2 悬浮回首页按钮：仅当页面没有任何指向首页的链接时注入 ========== */
(function () {
    function initHomeBtn() {
        var cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (cur === 'index.html' || cur === '') return;
        if (document.querySelector('a[href="index.html"], a[href="./index.html"], a[href="./"]')) return;
        var b = document.createElement('button');
        b.id = 'cyHomeBtn';
        b.type = 'button';
        b.setAttribute('aria-label', '返回首页');
        b.title = '返回首页';
        b.style.cssText = 'position:fixed;left:16px;bottom:76px;width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#ddd);background:var(--card,#fff);color:var(--txt,#333);font-size:20px;line-height:1;cursor:pointer;z-index:2147483000;box-shadow:0 4px 14px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:0;';
        b.textContent = '🏠';
        b.onclick = function () { location.href = 'index.html'; };
        document.body.appendChild(b);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeBtn);
    else initHomeBtn();
})();
