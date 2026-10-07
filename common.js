
/* 防小白保护开始 */
(function(){
    var _0x1=document;
    var _0x2=null;
    var _isFirefox = typeof InstallTrigger !== 'undefined' || (navigator.userAgent && navigator.userAgent.indexOf('Firefox') !== -1);
    if(_0x1.body){
        _0x1.body.setAttribute('oncontextmenu','return false');
    }
    function _0xBlockNative(){
        var els=_0x1.querySelectorAll('input,textarea,[contenteditable="true"],select');
        for(var i=0;i<els.length;i++){
            els[i].setAttribute('oncontextmenu','return false');
        }
    }
    _0xBlockNative();
    if(_0x1.addEventListener){
        _0x1.addEventListener('DOMNodeInserted',function(){setTimeout(_0xBlockNative,100);});
    }
    var _0x3=_0x1.createElement('div');
    _0x3.style.cssText='position:fixed;z-index:2147483647;background:#1e1e1e;border:1px solid #3a3a3a;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.5);padding:4px 0;min-width:200px;display:none;font-family:"Microsoft YaHei","Segoe UI",sans-serif;font-size:13px;user-select:none;';
    _0x3.innerHTML='<div data-a="paste" style="display:flex;justify-content:space-between;align-items:center;height:28px;padding:0 20px;cursor:pointer;color:#fff;line-height:28px;">粘贴<span style="color:#cfcfcf;font-size:12px;">Ctrl+V</span></div><div data-a="cut" style="display:flex;justify-content:space-between;align-items:center;height:28px;padding:0 20px;cursor:pointer;color:#fff;line-height:28px;">剪切<span style="color:#cfcfcf;font-size:12px;">Ctrl+X</span></div><div data-a="copy" style="display:flex;justify-content:space-between;align-items:center;height:28px;padding:0 20px;cursor:pointer;color:#fff;line-height:28px;">复制<span style="color:#cfcfcf;font-size:12px;">Ctrl+C</span></div><div data-a="selectall" style="display:flex;justify-content:space-between;align-items:center;height:28px;padding:0 20px;cursor:pointer;color:#fff;line-height:28px;">全选<span style="color:#cfcfcf;font-size:12px;">Ctrl+A</span></div><div data-a="refresh" style="display:flex;justify-content:space-between;align-items:center;height:28px;padding:0 20px;cursor:pointer;color:#fff;line-height:28px;">刷新<span style="color:#cfcfcf;font-size:12px;">F5</span></div>';
    function _0xMount(){
        if(_0x1.body){_0x1.body.appendChild(_0x3);}
        else{_0x1.addEventListener('DOMContentLoaded',function(){if(_0x1.body){_0x1.body.appendChild(_0x3);}});}
    }
    _0xMount();
    _0x3.addEventListener('mouseover',function(e){if(e.target.getAttribute('data-a')||e.target.closest('[data-a]')){var t=e.target.closest('[data-a]');if(t)t.style.background='#3a3a3a';}});
    _0x3.addEventListener('mouseout',function(e){if(e.target.getAttribute('data-a')||e.target.closest('[data-a]')){var t=e.target.closest('[data-a]');if(t)t.style.background='';}});
    function _0x4(text){
        if(!text){return false;}
        if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(text).catch(function(){});
            return true;
        }
        var ta=_0x1.createElement('textarea');
        ta.value=text;
        ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
        _0x1.body.appendChild(ta);
        ta.focus();ta.select();
        try{_0x1.execCommand('copy');}catch(e){}
        _0x1.body.removeChild(ta);
        return true;
    }
    function _0x5(el){
        if(el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA')){
            var s=el.selectionStart||0,e=el.selectionEnd||0;
            return el.value.substring(s,e);
        }
        return window.getSelection().toString();
    }
    function _0x7(el,txt){
        if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
            var s=el.selectionStart||0,en=el.selectionEnd||0;
            el.value=el.value.substring(0,s)+txt+el.value.substring(en);
            el.selectionStart=el.selectionEnd=s+txt.length;
            el.dispatchEvent(new Event('input',{bubbles:true}));
        }else{
            try{_0x1.execCommand('insertText',false,txt);}catch(err){}
        }
    }
    function _0xContextHandler(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation){e.stopImmediatePropagation();}
        var t=e.target;
        if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)){
            t.focus();
            _0x2=t;
        }else{
            _0x2=_0x1.activeElement;
        }
        _0x3.style.display='block';
        _0x3.style.left=e.clientX+'px';
        _0x3.style.top=e.clientY+'px';
        setTimeout(function(){var r=_0x3.getBoundingClientRect();if(r.right>window.innerWidth){_0x3.style.left=(window.innerWidth-r.width-5)+'px';}if(r.bottom>window.innerHeight){_0x3.style.top=(window.innerHeight-r.height-5)+'px';}},0);
        return false;
    }
    _0x1.addEventListener('contextmenu',_0xContextHandler,true);
    _0x1.addEventListener('contextmenu',_0xContextHandler,false);
    if(window.addEventListener){
        window.addEventListener('contextmenu',_0xContextHandler,true);
        window.addEventListener('contextmenu',_0xContextHandler,false);
    }
    _0x1.addEventListener('click',function(){_0x3.style.display='none';});
    _0x1.addEventListener('scroll',function(){_0x3.style.display='none';});
    _0x1.addEventListener('keydown',function(e){if(e.keyCode===27){_0x3.style.display='none';}});
    _0x3.addEventListener('click',function(e){
        var t=e.target.closest('[data-a]');
        if(!t){return;}
        var a=t.getAttribute('data-a');
        _0x3.style.display='none';
        var el=_0x2||_0x1.activeElement;
        var isInput=el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA');
        var isEditable=el&&el.isContentEditable;
        if(a==='cut'){
            var txt=_0x5(el);
            if(txt){
                _0x4(txt);
                if(isInput){
                    var s=el.selectionStart||0,en=el.selectionEnd||0;
                    el.value=el.value.substring(0,s)+el.value.substring(en);
                    el.selectionStart=el.selectionEnd=s;
                    el.dispatchEvent(new Event('input',{bubbles:true}));
                }else if(isEditable){
                    try{_0x1.execCommand('delete');}catch(err){}
                }
            }
        }else if(a==='copy'){
            var txt=_0x5(el);
            if(txt){_0x4(txt);}
        }else if(a==='paste'){
            if(isInput||isEditable){
                el.focus();
                if(navigator.clipboard&&navigator.clipboard.readText){
                    navigator.clipboard.readText().then(function(txt){
                        if(txt){_0x7(el,txt);}
                    }).catch(function(){
                        var ta=_0x1.createElement('textarea');
                        ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
                        _0x1.body.appendChild(ta);
                        ta.focus();
                        try{_0x1.execCommand('paste');}catch(e){}
                        if(ta.value){_0x7(el,ta.value);}
                        _0x1.body.removeChild(ta);
                        el.focus();
                    });
                }else{
                    try{_0x1.execCommand('paste');}catch(err){}
                }
            }
        }else if(a==='selectall'){
            if(isInput){
                el.focus();
                el.select();
                if(el.setSelectionRange){
                    el.setSelectionRange(0, el.value.length);
                }
            }else if(isEditable){
                el.focus();
                try{
                    var range=_0x1.createRange();
                    range.selectNodeContents(el);
                    var sel=window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }catch(err){
                    try{_0x1.execCommand('selectAll');}catch(e){}
                }
            }else{
                try{_0x1.execCommand('selectAll');}catch(e){}
            }
        }else if(a==='refresh'){
            location.reload();
        }
    });
    _0x1.addEventListener('keydown',function(_0x8){
        var _0x9=_0x8.keyCode||_0x8.which;
        var _allowed = (_0x8.ctrlKey && (_0x9===86 || _0x9===67 || _0x9===88 || _0x9===65 || _0x9===70)) || _0x9===116;
        var _isFuncKey = _0x9>=112 && _0x9<=123;
        var _normal = !_0x8.ctrlKey && !_0x8.altKey && !_0x8.metaKey && !_isFuncKey;
        if(!_allowed && !_normal){
            _0x8.preventDefault();
            if(_0x8.stopPropagation){_0x8.stopPropagation();}
            if(_0x8.stopImmediatePropagation){_0x8.stopImmediatePropagation();}
            return false;
        }
    });
})();
/* 防小白保护结束 */


/* Service Worker 注册（离线缓存支持） */
(function(){
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('service-worker.js').catch(function(err){});
        });
    }
})();


/* =====================================================================
   玻璃拟态交互模块 CY.glass —— 全站复用
   ①液态滑动胶囊 ②跟随柔光+3D倾斜 ③就地放大舞台 ④水滴分裂筛选
   ⑤Ctrl+K 命令面板 ⑥底部玻璃停靠栏
   注意：本模块只读令牌，不新增主题；在 DOMContentLoaded 后启动。
   ===================================================================== */
(function () {
    var CY = (window.CY = window.CY || {});
    var G = (CY.glass = CY.glass || {});
    var D = document;
    var rAF = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };

    function $(sel, root) { return (root || D).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
    function el(tag, cls, html) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
    }
    G.$ = $; G.$all = $all; G.el = el;

    /* 当前页面文件名，用于停靠栏/命令面板高亮 */
    G.currentPage = function () {
        var p = (location.pathname || '/').split('/').pop() || 'index.html';
        return p === '' ? 'index.html' : p;
    };

    /* 页面图标表（与 index.html toolsConfig 保持一致） */
    G.ICON = {
        'index.html': '✨', '1.html': '💡', '2.html': '✍️', '3.html': '📑',
        '4.html': '🔍', '5.html': '🎨', '6.html': '🖼️', '7.html': '⚖️',
        '8.html': '🎯', '9.html': '📓', '10.html': '🧩', '11.html': '📚',
        '12.html': 'ℹ️', 'verify.html': '🛡️'
    };

    /* 统一跳转：优先走 index 的灵感覆盖层，否则直接跳 */
    G.goto = function (file) {
        if (!file || file === '#') return;
        if (typeof window.showLoadingOverlay === 'function') { window.showLoadingOverlay(file); return; }
        location.href = file;
    };

    /* ========== ② 跟随柔光 + 边框提亮 + 3D 倾斜 ==========
       光效层用 CSS 伪元素承载，JS 只负责写 --mx/--my 与 transform，
       避免与卡片各自的 :hover 位移规则打架。 */
    G.enableTilt = function (sel, opts) {
        opts = opts || {};
        var maxTilt = opts.maxTilt == null ? 7 : opts.maxTilt;
        var lift = opts.lift || 0;
        var zoom = opts.zoom || 1;
        $all(sel).forEach(function (n) {
            if (n.__cyGl) return;
            n.__cyGl = 1;
            n.classList.add('cy-gl-host');
            n.appendChild(el('span', 'cy-gl'));
            var raf = 0;
            n.addEventListener('mousemove', function (e) {
                var r = n.getBoundingClientRect();
                var mx = (e.clientX - r.left) / (r.width || 1) * 100;
                var my = (e.clientY - r.top) / (r.height || 1) * 100;
                var ry = (mx - 50) / 50 * maxTilt;
                var rx = (50 - my) / 50 * maxTilt;
                if (!raf) {
                    raf = rAF(function () {
                        raf = 0;
                        n.style.setProperty('--mx', mx.toFixed(1) + '%');
                        n.style.setProperty('--my', my.toFixed(1) + '%');
                        n.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) +
                            'deg) rotateY(' + ry.toFixed(2) +
                            'deg) translateY(' + (-lift) + 'px) scale(' + zoom + ')';
                    });
                }
            });
            n.addEventListener('mouseleave', function () {
                if (raf) { cancelAnimationFrame(raf); raf = 0; }
                n.classList.remove('is-tracking');
                n.style.transform = '';
                n.style.setProperty('--rx', '0deg');
                n.style.setProperty('--ry', '0deg');
            });
        });
    };

    /* ========== ① 液态滑动胶囊导航 ==========
       胶囊是绝对定位的独立层，通过 left/width 平滑追随目标项；
       到位后叠加一次 squash & stretch 回弹，制造“水滴落地”的重量感。 */
    G.liquidNav = function (container, items, onChange) {
        var nav = el('div', 'cy-liquid-nav');
        var pill = el('span', 'cy-liquid-pill');
        nav.appendChild(pill);
        var btns = [];
        var current = null;

        function movePill(target, bounce) {
            if (!target) return;
            pill.style.left = target.offsetLeft + 'px';
            pill.style.width = target.offsetWidth + 'px';
            if (bounce) {
                pill.classList.remove('is-landed');
                void pill.offsetWidth;            /* 强制回流以重启动画 */
                pill.classList.add('is-landed');
            }
        }
        function setActive(item, bounce) {
            if (current === item) { if (bounce) movePill(item, true); return; }
            if (current) current.classList.remove('is-active');
            current = item;
            item.classList.add('is-active');
            movePill(item, bounce);
        }

        items.forEach(function (it) {
            var b = el('button', 'cy-ln-item');
            b.type = 'button';
            b.dataset.key = it.key;
            b.innerHTML = (it.icon ? '<span class="cy-ln-ico">' + it.icon + '</span>' : '') +
                '<span>' + it.label + '</span>';
            b.addEventListener('mouseenter', function () { movePill(b, true); });
            b.addEventListener('click', function () {
                setActive(b, true);
                if (onChange) onChange(it.key, it);
            });
            nav.appendChild(b);
            btns.push(b);
        });
        nav.addEventListener('mouseleave', function () { movePill(current, false); });

        container.innerHTML = '';
        container.appendChild(nav);
        if (btns.length) setActive(btns[0], false);

        return {
            nav: nav, btns: btns,
            set: function (key) {
                var b = btns.filter(function (x) { return x.dataset.key === key; })[0];
                if (b) setActive(b, false);
            }
        };
    };

    /* ========== ① 采纳既有菜单条 ==========
       各工具页的 .cy-tab-row 是页内脚本各自构建的，这里不重建按钮，
       只在容器上叠一层液态胶囊：悬停时跟随滑动，点击后落位并回弹。 */
    G.adoptTabs = function (sel) {
        sel = sel || '.cy-tab-row';
        $all(sel).forEach(function (row) {
            if (row.__cyLiquid || !row.children.length) return;
            row.__cyLiquid = 1;
            row.classList.add('cy-liquid-adopt');
            var pill = el('span', 'cy-liquid-pill');
            row.insertBefore(pill, row.firstChild);
            var tabs = Array.prototype.filter.call(row.children, function (c) {
                return c !== pill;
            });
            if (!tabs.length) return;
            var current = null;

            function isOn(c) {
                return c.className && typeof c.className === 'string' &&
                    /(^| )(active|is-active|is-on|selected|current)( |$)/.test(c.className);
            }
            function movePill(t, bounce) {
                if (!t) return;
                pill.style.left = t.offsetLeft + 'px';
                pill.style.width = t.offsetWidth + 'px';
                if (bounce) {
                    pill.classList.remove('is-landed');
                    void pill.offsetWidth;            /* 强制回流以重启动画 */
                    pill.classList.add('is-landed');
                }
            }

            tabs.forEach(function (t) {
                if (isOn(t)) current = t;
                t.addEventListener('mouseenter', function () { movePill(t, true); });
                t.addEventListener('click', function () { current = t; movePill(t, true); });
            });
            movePill(current || tabs[0], false);
            row.addEventListener('mouseleave', function () { movePill(current, false); });

            /* 换行/宽度变化后重新对位，避免胶囊错行 */
            if (window.ResizeObserver) {
                new ResizeObserver(function () { movePill(current, false); }).observe(row);
            } else {
                window.addEventListener('resize', function () { movePill(current, false); });
            }
        });
    };

    /* ========== ⑥ 底部玻璃停靠栏 ==========
       悬停时当前图标上浮放大，左右各一档相邻图标跟随放大；
       图标溢出时横向滚动，不挤压内容。 */
    G.bootDock = function () {
        if ($('#cyDock')) return;
        var pages = (CY.PAGES || []).slice();
        if (!pages.length) return;
        var cur = G.currentPage();

        var dock = el('nav', 'cy-dock');
        dock.id = 'cyDock';
        dock.setAttribute('aria-label', '站点导航停靠栏');

        pages.forEach(function (p) {
            var b = el('button', 'cy-dock-item');
            b.type = 'button';
            b.dataset.file = p.f;
            b.innerHTML = '<span class="cy-dock-ico">' + (G.ICON[p.f] || '📄') + '</span>' +
                '<span class="cy-dock-tip">' + p.t + '</span>';
            if (p.f === cur) b.classList.add('is-active');
            b.addEventListener('click', function () { G.goto(p.f); });
            /* 相邻图标跟随放大：±1 近、±2 次近 */
            b.addEventListener('mouseenter', function () {
                var arr = $all('.cy-dock-item', dock);
                var i = arr.indexOf(b);
                arr.forEach(function (o, j) {
                    var d = Math.abs(j - i);
                    o.classList.remove('is-neighbor', 'is-neighbor-far');
                    if (d === 1) o.classList.add('is-neighbor');
                    else if (d === 2) o.classList.add('is-neighbor-far');
                });
            });
            dock.appendChild(b);
        });
        /* 末尾分隔 + 命令面板入口 */
        dock.appendChild(el('span', 'cy-dock-sep', '<span class="cy-dock-tip">⌘K 搜索</span>'));
        var cmdBtn = el('button', 'cy-dock-item', '<span class="cy-dock-ico">🔍</span>' +
            '<span class="cy-dock-tip">命令面板 Ctrl+K</span>');
        cmdBtn.type = 'button';
        cmdBtn.addEventListener('mouseenter', function () {
            var arr = $all('.cy-dock-item', dock);
            var i = arr.indexOf(cmdBtn);
            arr.forEach(function (o, j) {
                var d = Math.abs(j - i);
                o.classList.remove('is-neighbor', 'is-neighbor-far');
                if (d === 1) o.classList.add('is-neighbor');
                else if (d === 2) o.classList.add('is-neighbor-far');
            });
        });
        cmdBtn.addEventListener('click', function () { G.openCmd && G.openCmd(); });
        dock.appendChild(cmdBtn);

        D.body.appendChild(dock);
        /* 占位条：保证页面内容不会被停靠栏压住 */
        var sp = el('div', 'cy-dock-spacer');
        sp.setAttribute('aria-hidden', 'true');
        D.body.appendChild(sp);
    };

    /* 切换主题：优先复用 theme.js 面板里的真实按钮（保持面板高亮同步），
       面板未就绪时降级为直接写属性 + localStorage */
    G.setTheme = function (t) {
        var it = D.querySelector('.cy-theme-item[data-t="' + t + '"]');
        if (it) { it.click(); return; }
        D.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem('cy_theme', t); } catch (e) { }
        var btn = D.getElementById('cyThemeBtn');
        if (btn) btn.setAttribute('data-t', t);
        if (typeof CY.showToast === 'function') CY.showToast('已切换主题');
    };

    /* ========== ⑤ 命令面板（Ctrl+K） ==========
       居中玻璃搜索框 + 背景模糊；输入时实时过滤并在匹配片段上高亮；
       ↑↓ 选择、Enter 执行、Esc 关闭。命令来源：全站页面 + 常用动作。 */
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    }); }

    /* 只高亮 name 中与查询匹配的片段，desc 不截断结构 */
    function markName(name, q) {
        if (!q) return esc(name);
        var lower = name.toLowerCase();
        var idx = lower.indexOf(q.toLowerCase());
        if (idx < 0) return esc(name);
        return esc(name.slice(0, idx)) + '<mark>' + esc(name.slice(idx, idx + q.length)) + '</mark>' +
            esc(name.slice(idx + q.length));
    }

    /* 组装命令列表：页面跳转 + 页面内动作 */
    function cmdItems() {
        var cur = G.currentPage();
        var list = (CY.PAGES || []).map(function (p) {
            return {
                icon: G.ICON[p.f] || '📄',
                name: p.t,
                desc: p.k,
                keys: p.f === cur ? '当前页' : p.f,
                run: function () { G.goto(p.f); }
            };
        });
        list.push({
            icon: '📊', name: '滚动到灵感运营看板', desc: '看板 图表 数据 就地放大', keys: '#dash',
            run: function () {
                var t = $('#cyDash');
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        list.push({
            icon: '🧰', name: '回到工具库', desc: '工具 网格 13 个工具', keys: '#grid',
            run: function () {
                var t = $('#grid');
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        var THEMES = [['dark', '深空流光'], ['blue', '静谧蓝'], ['gold', '鎏金'], ['light', '明亮'],
            ['milk', '奶油'], ['guofeng', '国风'], ['snowsun', '雪阳'], ['cyber', '赛博'], ['aurora', '极光']];
        THEMES.forEach(function (t) {
            list.push({
                icon: '🎨', name: '切换主题 · ' + t[1], desc: '主题 配色 皮肤 换肤 ' + t[0], keys: 'theme',
                run: (function (th) { return function () { G.setTheme(th); }; })(t[0])
            });
        });
        return list;
    }

    var cmdState = null;

    function buildCmd() {
        var bd = el('div', 'cy-cmd-backdrop');
        bd.id = 'cyCmdBackdrop';
        bd.innerHTML =
            '<div class="cy-cmd-panel" role="dialog" aria-modal="true" aria-label="命令面板">' +
            '<div class="cy-cmd-bar">' +
            '<span>🔍</span>' +
            '<input class="cy-cmd-input" id="cyCmdInput" placeholder="输入页面 / 工具 / 动作，如：配色、看板、甘特…" autocomplete="off" spellcheck="false">' +
            '<span class="cy-cmd-hint">Esc</span>' +
            '</div>' +
            '<div class="cy-cmd-results" id="cyCmdResults"></div>' +
            '<div class="cy-cmd-foot">' +
            '<span><span class="cy-cmd-foot-k">↑↓</span> 选择</span>' +
            '<span><span class="cy-cmd-foot-k">Enter</span> 执行</span>' +
            '<span><span class="cy-cmd-foot-k">Ctrl+K</span> 开关</span>' +
            '</div></div>';
        D.body.appendChild(bd);

        var input = $('#cyCmdInput', bd);
        var box = $('#cyCmdResults', bd);
        var items = [];
        var sel = 0;

        function render(q) {
            items = cmdItems();
            var lower = q.trim().toLowerCase();
            if (lower) {
                items = items.filter(function (it) {
                    return (it.name + ' ' + it.desc + ' ' + it.keys).toLowerCase().indexOf(lower) >= 0;
                });
            }
            sel = 0;
            box.innerHTML = '';
            if (!items.length) {
                box.appendChild(el('div', 'cy-cmd-empty', '没有找到匹配项，换个关键词试试'));
                return;
            }
            items.forEach(function (it, i) {
                var row = el('div', 'cy-cmd-item');
                row.tabIndex = -1;
                row.innerHTML =
                    '<span class="cy-cmd-ico">' + esc(it.icon) + '</span>' +
                    '<span class="cy-cmd-body">' +
                    '<span class="cy-cmd-name">' + markName(it.name, q.trim()) + '</span>' +
                    '<span class="cy-cmd-desc">' + esc(it.desc) + '</span></span>' +
                    '<span class="cy-cmd-keys">' + esc(it.keys) + '</span>';
                row.addEventListener('mouseenter', function () { sel = i; paint(); });
                row.addEventListener('click', function () { fire(i); });
                box.appendChild(row);
            });
            paint();
        }
        function paint() {
            $all('.cy-cmd-item', box).forEach(function (r, i) {
                r.classList.toggle('is-selected', i === sel);
            });
            var c = box.children[sel];
            if (c && c.scrollIntoView) c.scrollIntoView({ block: 'nearest' });
        }
        function fire(i) {
            var it = items[i];
            if (!it) return;
            close();
            if (it.run) it.run();
        }
        function close() {
            bd.classList.remove('is-open');
            /* 面板收起后必须归还焦点，否则隐藏的输入框仍被 inField() 识别，"/" 呼出会失效 */
            if (D.activeElement === input) input.blur();
        }
        function open() {
            bd.classList.add('is-open');
            input.value = '';
            render('');
            input.focus();
        }
        input.addEventListener('input', function () { render(input.value); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); if (items.length) { sel = (sel + 1) % items.length; paint(); } }
            else if (e.key === 'ArrowUp') { e.preventDefault(); if (items.length) { sel = (sel - 1 + items.length) % items.length; paint(); } }
            else if (e.key === 'Enter') { e.preventDefault(); fire(sel); }
            else if (e.key === 'Escape') { e.preventDefault(); close(); }
        });
        bd.addEventListener('click', function (e) { if (e.target === bd) close(); });

        return { bd: bd, open: open, close: close };
    }
    G.openCmd = function () {
        if (!cmdState) cmdState = buildCmd();
        cmdState.open();
    };
    G.closeCmd = function () {
        if (cmdState) cmdState.close();
    };

    /* Ctrl+K 快捷键：必须在捕获阶段拦截。
       common.js 顶部的“防小白保护”在 document 冒泡阶段拦截了除
       Ctrl+V/C/X/A/F 与 F5 以外的组合键，这里抢在其之前处理。 */
    G.bootKey = function () {
        window.addEventListener('keydown', function (e) {
            var k = (e.key || '').toLowerCase();
            var mod = e.ctrlKey || e.metaKey;
            var inField = function () {
                var a = D.activeElement, t = a ? a.tagName : '';
                return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (a && a.isContentEditable);
            };
            if (mod && (k === 'k' || e.keyCode === 75)) {
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                if (cmdState && cmdState.bd && cmdState.bd.classList.contains('is-open')) G.closeCmd();
                else G.openCmd();
                return;
            }
            /* "/" 呼出：升级原 cy-features 的站内搜索入口到命令面板 */
            if (!mod && !e.altKey && k === '/' && !inField()) {
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                G.openCmd();
            }
        }, true);
    };

    /* ========== ③ 模块就地放大（不跳页） ==========
       用 FLIP：克隆模块进舞台，反向变换到原位置后释放到目标位置，
       其余模块置灰、缩为底部玻璃缩略条，关闭时原路收回。不移动真实 DOM。 */
    G.stage = function (container, opts) {
        opts = opts || {};
        var renderer = opts.render;              /* function(canvas, mod, compact) 按 canvas 当前尺寸重画 */
        var modEls = $all('.cy-dash-mod', container);
        if (!modEls.length) return null;

        var stage = null, body = null, thumbs = null;
        var cur = null, clone = null, anim = false;

        function ensure() {
            if (stage) return;
            stage = el('div', 'cy-stage');
            stage.innerHTML =
                '<div class="cy-stage-back"></div>' +
                '<button class="cy-stage-close" type="button" aria-label="关闭并收回模块">✕</button>' +
                '<div class="cy-stage-body"></div>' +
                '<div class="cy-thumbs"></div>';
            body = $('.cy-stage-body', stage);
            thumbs = $('.cy-thumbs', stage);
            $('.cy-stage-close', stage).addEventListener('click', closeStage);
            $('.cy-stage-back', stage).addEventListener('click', closeStage);
            D.body.appendChild(stage);

            modEls.forEach(function (m) {
                var th = el('button', 'cy-thumb');
                th.type = 'button';
                th.dataset.mod = m.dataset.mod || '';
                th.innerHTML = '<canvas class="cy-thumb-spark" width="92" height="18"></canvas>' +
                    '<span class="cy-thumb-name">' + esc(m.dataset.title || '') + '</span>';
                th.addEventListener('click', function () { switchTo(m); });
                thumbs.appendChild(th);
                var cv = $('canvas', th);
                if (renderer && cv) { try { renderer(cv, m, true); } catch (e) { } }
            });
        }

        function markThumbs(mod) {
            $all('.cy-thumb', thumbs).forEach(function (t) {
                t.classList.toggle('is-current', t.dataset.mod === (mod.dataset.mod || ''));
            });
        }
        function paint(mod) {
            if (!clone || !renderer) return;
            var cv = clone.querySelector('canvas');
            if (!cv) return;
            rAF(function () {
                try { renderer(cv, mod, false); } catch (e) { }
            });
        }

        function open(mod) {
            if (anim) return;
            ensure();
            cur = mod;
            var srcRect = mod.getBoundingClientRect();

            clone = mod.cloneNode(true);
            clone.removeAttribute('id');
            clone.classList.add('cy-stage-mod');
            clone.style.cursor = 'default';
            body.innerHTML = '';
            body.appendChild(clone);
            stage.classList.add('is-open');
            stage.style.pointerEvents = 'auto';
            markThumbs(mod);
            paint(mod);

            /* FLIP：目标框 vs 源框，算反向变换 */
            var dst = clone.getBoundingClientRect();
            var sx = srcRect.left + srcRect.width / 2, sy = srcRect.top + srcRect.height / 2;
            var dx = dst.left + dst.width / 2, dy = dst.top + dst.height / 2;
            var sc = (srcRect.width / dst.width) || 1;
            clone.style.transition = 'none';
            clone.style.transform = 'translate(' + (sx - dx).toFixed(1) + 'px,' +
                (sy - dy).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';

            /* 其余模块置灰，形成“缩为缩略条”的落差 */
            modEls.forEach(function (m) {
                m.classList.toggle('cy-mod-source', m === mod);
                m.classList.toggle('cy-mod-dimmed', m !== mod);
            });

            rAF(function () {
                rAF(function () {
                    clone.style.transition = 'transform .52s cubic-bezier(.34,1.56,.64,1)';
                    clone.style.transform = 'none';
                });
            });
        }

        function switchTo(mod) {
            if (!stage || !cur || cur === mod) return;
            cur = mod;
            markThumbs(mod);
            clone.style.transition = 'transform .18s ease-in';
            clone.style.transform = 'scale(.94)';
            paint(mod);
            setTimeout(function () {
                clone.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
                clone.style.transform = 'none';
            }, 180);
        }

        function closeStage() {
            if (!stage || !cur || anim) return;
            anim = true;
            var s = cur.getBoundingClientRect();
            var c = clone.getBoundingClientRect();
            var sx = s.left + s.width / 2, sy = s.top + s.height / 2;
            var cx = c.left + c.width / 2, cy = c.top + c.height / 2;
            var sc = (s.width / c.width) || 1;
            clone.style.transition = 'transform .46s cubic-bezier(.5,.05,.75,.35)';
            clone.style.transform = 'translate(' + (sx - cx).toFixed(1) + 'px,' +
                (sy - cy).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
            stage.classList.remove('is-open');
            stage.style.pointerEvents = 'none';
            setTimeout(function () {
                if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                clone = null; cur = null; anim = false;
                modEls.forEach(function (m) {
                    m.classList.remove('cy-mod-source', 'cy-mod-dimmed');
                });
            }, 500);
        }

        modEls.forEach(function (m) {
            m.addEventListener('click', function () { open(m); });
        });
        D.addEventListener('keydown', function (e) {
            if ((e.key === 'Escape' || e.keyCode === 27) &&
                stage && stage.classList.contains('is-open')) {
                closeStage();
            }
        });

        return { open: open, close: closeStage };
    };

    /* ========== ④ 水滴分裂筛选 ==========
       折叠态为一颗玻璃胶囊；点开时选项从胶囊位置错峰分裂飞出，
       选中后菜单原路融合回收，胶囊标签同步更新。 */
    G.drip = function (container, opts) {
        var options = (opts && opts.options) || [];
        var value = opts && opts.value;
        var capsuleLabel = (opts && opts.capsule) || '筛选';
        var onSelect = opts && opts.onSelect;

        function labelOf(key) {
            for (var i = 0; i < options.length; i++) {
                if (options[i].key === key) return options[i];
            }
            return options[0];
        }
        var cur = labelOf(value);

        var wrap = el('div', 'cy-drip');
        wrap.innerHTML =
            '<button class="cy-drip-capsule" type="button" aria-haspopup="true" aria-expanded="false">' +
            '<span>' + (capsuleLabel ? capsuleLabel + ' · ' : '') + '</span>' +
            '<span class="cy-drip-ico">' + (cur.icon || '') + '</span>' +
            '<span class="cy-drip-val">' + esc(cur.label) + '</span>' +
            '<span class="cy-drip-caret">▾</span></button>' +
            '<div class="cy-drip-menu" role="men"></div>';
        var capsule = $('.cy-drip-capsule', wrap);
        var menu = $('.cy-drip-menu', wrap);

        options.forEach(function (o) {
            var b = el('button', 'cy-drip-opt');
            b.type = 'button';
            b.dataset.key = o.key;
            if (o.key === cur.key) b.classList.add('is-on');
            b.innerHTML = (o.icon ? '<span>' + o.icon + '</span>' : '') + '<span>' + esc(o.label) + '</span>';
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                pick(o);
            });
            menu.appendChild(b);
        });

        function open() {
            wrap.classList.add('is-open');
            capsule.setAttribute('aria-expanded', 'true');
        }
        function shut() {
            wrap.classList.remove('is-open');
            capsule.setAttribute('aria-expanded', 'false');
        }
        function pick(o) {
            cur = o;
            $('.cy-drip-val', wrap).textContent = o.label;
            $('.cy-drip-ico', wrap).textContent = o.icon || '';
            $all('.cy-drip-opt', menu).forEach(function (b) {
                b.classList.toggle('is-on', b.dataset.key === o.key);
            });
            if (onSelect) onSelect(o.key, o);
            /* 稍等合并动画播完再收，让“融回”可见 */
            setTimeout(shut, 260);
        }
        capsule.addEventListener('click', function (e) {
            e.stopPropagation();
            if (wrap.classList.contains('is-open')) shut(); else open();
        });
        D.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) shut();
        });
        D.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') shut();
        });

        container.innerHTML = '';
        container.appendChild(wrap);
        return {
            wrap: wrap,
            set: function (key) { pick(labelOf(key)); }
        };
    };

    /* ========== 数字滚动更新 ==========
       从当前显示值缓动到新值，三次缓出；tabular-nums 防抖动。 */
    G.roll = function (node, to, opts) {
        opts = opts || {};
        var dur = opts.dur || 900;
        var dec = opts.decimals != null ? opts.decimals : 0;
        var suf = opts.suffix || '';
        var from = parseFloat(node.dataset.roll);
        if (!isFinite(from)) from = 0;
        var t0 = null;
        if (node.__cyRoll) cancelAnimationFrame(node.__cyRoll);
        function fmt(v) {
            var s = dec ? v.toFixed(dec) : String(Math.round(v));
            if (!dec) s = Number(s).toLocaleString('en-US');
            return s + suf;
        }
        function tick(t) {
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / dur);
            var e = 1 - Math.pow(1 - p, 3);
            node.textContent = fmt(from + (to - from) * e);
            if (p < 1) node.__cyRoll = rAF(tick);
            else node.dataset.roll = String(to);
        }
        node.__cyRoll = rAF(tick);
    };

    /* ========== 启动 ==========
       停靠栏 / 命令面板 / 倾斜光效在此统一初始化。
       图表模块与看板由 index.html 自行调用 G.stage / G.drip。 */
    G.boot = function () {
        try { G.bootDock(); } catch (e) { }
        try { G.bootKey(); } catch (e) { }
        try {
            G.adoptTabs('.cy-tab-row');
            G.enableTilt('.tool-box', { maxTilt: 7, lift: 8, zoom: 1.02 });
            G.enableTilt('.cy-card', { maxTilt: 5, lift: 3 });
            G.enableTilt('.cy-metric', { maxTilt: 4, lift: 2 });
            G.enableTilt('.cy-dash-mod', { maxTilt: 4, lift: 2 });
        } catch (e) { }
        /* 兜底：部分页面的菜单条/卡片在 load 之后才渲染，再补一轮（幂等） */
        setTimeout(function () {
            try { G.adoptTabs('.cy-tab-row'); } catch (e) { }
            try {
                G.enableTilt('.tool-box', { maxTilt: 7, lift: 8, zoom: 1.02 });
                G.enableTilt('.cy-card', { maxTilt: 5, lift: 3 });
            } catch (e) { }
        }, 500);
    };
    document.addEventListener('DOMContentLoaded', G.boot);
})();

/* 模块置灰样式（就地放大时用，避免污染主样式表） */
(function () {
    var s = document.createElement('style');
    s.textContent =
        '.cy-mod-source{opacity:.16;filter:blur(1.5px);pointer-events:none;' +
        'transition:opacity .35s ease,filter .35s ease}' +
        '.cy-mod-dimmed{opacity:.3;filter:saturate(.6);' +
        'transition:opacity .35s ease,filter .35s ease}' +
        '.cy-stage .cy-dash-mod canvas{height:340px}';
    document.head.appendChild(s);
})();


