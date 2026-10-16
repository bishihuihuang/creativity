/* ============================================================================
   灵感运营看板：原生 canvas 图表 + 水滴分裂筛选 + 模块就地放大
   ----------------------------------------------------------------------------
   数据来源：前端种子随机生成的演示数据（刷新后一致），非真实业务数据。
   颜色全部读取 :root 令牌，随 9 套主题自动适配。

   注意：必须等 common.js（defer）执行完再取 CY.glass —— 内联脚本在解析期运行，
   那时玻璃模块还没就绪。本文件以 defer 方式加载，DOMContentLoaded 触发时
   CY.glass 已就绪，无需额外协调。
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {
    window.CYDASH = (function () {
        var G = (window.CY && window.CY.glass) || {};
        if (!G.stage) return null;

        /* 种子随机：保证同一周期每次刷新数据一致 */
        function srand(seed) {
            var s = seed >>> 0;
            return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
        }

        var TOOLS = [['💡灵感', 14], ['✍️文案', 11], ['📑摘要', 8], ['🎨配色', 7],
            ['🔍体检', 6], ['🖼️艺术', 5], ['⚖️决策', 4], ['🎯目标', 5],
            ['📓记录', 6], ['🧩连线', 3], ['📚方法', 3], ['🛡️自检', 2]];
        var TYPES = [['灵感', 40], ['文案', 24], ['艺术', 16], ['分析', 12], ['其他', 8]];
        var RANGES = [
            { key: 'today', icon: '☀️', label: '今天', seed: 11, n: 12,
                x: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'] },
            { key: 'week', icon: '📅', label: '本周', seed: 23, n: 7,
                x: ['一', '二', '三', '四', '五', '六', '日'] },
            { key: 'month', icon: '🗓️', label: '本月', seed: 47, n: 20, x: null },
            { key: 'year', icon: '🌸', label: '全年', seed: 89, n: 12,
                x: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] }
        ];

        function buildData(r) {
            var rnd = srand(r.seed);
            var trend = [], up = 6 + rnd() * 8;
            for (var i = 0; i < r.n; i++) {
                up += (rnd() - 0.42) * 7;
                up = Math.max(3, Math.min(46, up));
                trend.push(Math.round(up));
            }
            var bars = TOOLS.map(function (t) {
                return { name: t[0], v: Math.max(1, Math.round(t[1] * (0.55 + rnd() * 0.9))) };
            });
            var ring = TYPES.map(function (t) {
                return { name: t[0], v: Math.max(1, Math.round(t[1] * (0.6 + rnd() * 0.8))) };
            });
            var heat = [];
            for (var ri = 0; ri < 4; ri++) {
                var row = [];
                for (var ci = 0; ci < r.n; ci++) row.push(Math.round(rnd() * 100));
                heat.push(row);
            }
            var sum = trend.reduce(function (a, b) { return a + b; }, 0);
            var calls = bars.reduce(function (a, b) { return a + b.v; }, 0);
            var active = bars.filter(function (b) { return b.v >= 3; }).length;
            return {
                x: r.x, trend: trend, bars: bars, ring: ring, heat: heat,
                metrics: [
                    { l: '灵感产出', v: sum, suf: ' 条' },
                    { l: '工具调用', v: calls, suf: ' 次' },
                    { l: '活跃工具', v: active, suf: ' / 13' },
                    { l: '日均灵感', v: +(sum / r.n).toFixed(1), suf: ' 条' }
                ]
            };
        }

        /* ---- canvas 基础 ---- */
        function fit(canvas) {
            var dpr = window.devicePixelRatio || 1;
            var w = canvas.clientWidth || 100, h = canvas.clientHeight || 60;
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            var ctx = canvas.getContext('2d');
            if (!ctx) return null;            /* 环境不支持 2D 上下文时跳过绘制 */
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            return { ctx: ctx, w: w, h: h };
        }
        function tok(name, fb) {
            var v = getComputedStyle(document.documentElement).getPropertyValue(name);
            return (v && v.trim()) || fb;
        }
        function rrect(ctx, x, y, w, h, r) {
            if (w < 0) w = 0; if (h < 0) h = 0;
            r = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }
        /* 平滑曲线（贝塞尔中点插值） */
        function smooth(ctx, pts) {
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (var i = 1; i < pts.length; i++) {
                var p0 = pts[i - 1], p1 = pts[i], mx = (p0[0] + p1[0]) / 2;
                ctx.bezierCurveTo(mx, p0[1], mx, p1[1], p1[0], p1[1]);
            }
        }

        function drawTrend(f, d, small) {
            var ctx = f.ctx, w = f.w, h = f.h;
            var max = Math.max.apply(null, d.trend), min = Math.min.apply(null, d.trend);
            var span = Math.max(1, max - min);
            var labH = small ? 0 : 16;
            var pts = d.trend.map(function (v, i) {
                var x = 4 + (w - 8) * (d.trend.length < 2 ? 0 : i / (d.trend.length - 1));
                var y = (h - labH - 4) - ((v - min) / span) * (h - labH - 12);
                return [x, y];
            });
            var c1 = tok('--glow', '#6366f1'), c2 = tok('--glow-2', '#a855f7'), c3 = tok('--glow-3', '#22d3ee');
            /* 面积填充（用 globalAlpha 而非解析色值，兼容任意主题色格式） */
            ctx.save();
            ctx.globalAlpha = small ? 0.2 : 0.3;
            ctx.fillStyle = c1;
            ctx.beginPath();
            smooth(ctx, pts);
            ctx.lineTo(pts[pts.length - 1][0], h - 2);
            ctx.lineTo(pts[0][0], h - 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            /* 折线渐变描边 */
            var lg = ctx.createLinearGradient(0, 0, w, 0);
            lg.addColorStop(0, c1); lg.addColorStop(0.5, c2); lg.addColorStop(1, c3);
            ctx.beginPath();
            smooth(ctx, pts);
            ctx.strokeStyle = lg;
            ctx.lineWidth = small ? 1.4 : 2.6;
            ctx.lineJoin = 'round'; ctx.lineCap = 'round';
            ctx.stroke();
            if (small) return;
            /* 末端高亮点 */
            var p = pts[pts.length - 1];
            ctx.beginPath(); ctx.arc(p[0], p[1], 4.5, 0, 6.2832);
            ctx.fillStyle = c3; ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.stroke();
            /* 稀疏 x 轴标签 */
            ctx.fillStyle = tok('--dim', '#8b93a7');
            ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
            if (d.x) {
                var step = Math.ceil(d.x.length / 8);
                for (var i = 0; i < d.x.length; i += step) {
                    ctx.fillText(d.x[i], pts[i][0], h - 3);
                }
            }
        }

        function drawBars(f, d, small) {
            var ctx = f.ctx, w = f.w, h = f.h;
            var max = Math.max.apply(null, d.bars.map(function (b) { return b.v; }));
            var n = d.bars.length, bw = (w - 8) / n;
            var labH = small ? 0 : 15;
            var c1 = tok('--glow', '#6366f1'), c3 = tok('--glow-3', '#22d3ee');
            d.bars.forEach(function (b, i) {
                var bh = Math.max(2, (b.v / max) * (h - labH - 6));
                var x = 4 + i * bw, y = h - labH - 3 - bh;
                var g = ctx.createLinearGradient(0, y, 0, h - labH - 3);
                g.addColorStop(0, c3); g.addColorStop(1, c1);
                ctx.fillStyle = g;
                rrect(ctx, x + bw * 0.16, y, bw * 0.68, bh, small ? 2 : 6);
                ctx.fill();
                if (!small) {
                    ctx.fillStyle = tok('--dim', '#8b93a7');
                    ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText(b.name, x + bw / 2, h - 4);
                }
            });
        }

        function drawRing(f, d, small) {
            var ctx = f.ctx, w = f.w, h = f.h;
            var cx = w / 2, cy = h / 2;
            var R = Math.min(w, h) / 2 - 3;
            var ri = R * (small ? 0.62 : 0.6);
            var total = d.ring.reduce(function (a, b) { return a + b.v; }, 0);
            var cols = [tok('--glow', '#6366f1'), tok('--glow-2', '#a855f7'),
                tok('--glow-3', '#22d3ee'), tok('--green', '#11998e'), tok('--red', '#ef4444')];
            var a = -Math.PI / 2, gap = small ? 0.01 : 0.05;
            d.ring.forEach(function (s, i) {
                var ang = s.v / total * Math.PI * 2;
                if (ang - gap * 2 <= 0) { a += ang; return; }
                ctx.beginPath();
                ctx.arc(cx, cy, R, a + gap, a + ang - gap);
                ctx.arc(cx, cy, ri, a + ang - gap, a + gap, true);
                ctx.closePath();
                ctx.fillStyle = cols[i % cols.length];
                ctx.fill();
                a += ang;
            });
            if (small) return;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = tok('--txt', '#333');
            ctx.font = '800 20px sans-serif';
            ctx.fillText(total, cx, cy - 5);
            ctx.fillStyle = tok('--dim', '#8b93a7');
            ctx.font = '600 10px sans-serif';
            ctx.fillText('总计', cx, cy + 12);
            /* 图例 */
            ctx.textBaseline = 'middle';
            var lx = 8, ly = 10;
            ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
            d.ring.forEach(function (s, i) {
                ctx.fillStyle = cols[i % cols.length];
                ctx.fillRect(lx, ly, 7, 7);
                ctx.fillStyle = tok('--dim', '#8b93a7');
                ctx.fillText(s.name, lx + 10, ly + 1);
                ly += 13;
            });
        }

        function drawHeat(f, d, small) {
            var ctx = f.ctx, w = f.w, h = f.h;
            var rows = d.heat.length, cols = d.heat[0].length;
            var cw = (w - 4) / cols, ch = (h - 4) / rows;
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    var v = d.heat[r][c] / 100;
                    ctx.globalAlpha = 0.12 + v * 0.82;
                    ctx.fillStyle = v > 0.66 ? tok('--glow-3', '#22d3ee') : tok('--glow', '#6366f1');
                    rrect(ctx, c * cw + 1, r * ch + 1, cw - 2, ch - 2, small ? 1.5 : 3);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        }

        /* 统一入口：G.stage 的 renderer 会传 (canvas, mod, compact) */
        var cur = RANGES[1];
        var data = buildData(cur);
        function paint(canvas, mod, small) {
            var key = mod && mod.dataset ? mod.dataset.mod : null;
            if (!key) return;
            var f = fit(canvas);
            if (!f) return;
            try {
                if (key === 'trend') drawTrend(f, data, small);
                else if (key === 'bars') drawBars(f, data, small);
                else if (key === 'ring') drawRing(f, data, small);
                else if (key === 'heat') drawHeat(f, data, small);
            } catch (e) { }
        }

        return {
            G: G, RANGES: RANGES,
            get data() { return data; },
            set range(r) { cur = r; data = buildData(r); },
            get range() { return cur; },
            paint: paint,
            fit: fit, tok: tok
        };
        })();
    });

    /* ========================================================================
       看板装配：渲染四个图表模块 + 指标卡，并绑定水滴筛选与就地放大
       同样挂在 DOMContentLoaded 上，且注册在上面的看板模块之后，顺序可控
       ======================================================================== */
        document.addEventListener('DOMContentLoaded', function () {
            var M = window.CYDASH;
            if (!M || !M.G) return;
            var G = M.G;

            var MODS = [
                { key: 'trend', icon: '📈', title: '灵感产出趋势' },
                { key: 'bars', icon: '🧮', title: '工具使用分布' },
                { key: 'ring', icon: '🍩', title: '创作类型占比' },
                { key: 'heat', icon: '🌡️', title: '时段活跃热力' }
            ];

            var grid = document.getElementById('cyDashGrid');
            var metricsBox = document.getElementById('cyMetrics');
            var dripBox = document.getElementById('cyDrip');
            if (!grid || !metricsBox) return;

            /* 1. 图表模块 */
            grid.innerHTML = MODS.map(function (m) {
                return '<div class="cy-dash-mod" data-mod="' + m.key + '" data-title="' + m.title + '" tabindex="0">' +
                    '<div class="cy-dash-mod-head">' +
                    '<span class="cy-dash-mod-title">' + m.icon + ' ' + m.title + '</span>' +
                    '<span class="cy-dash-mod-hint">点击放大 ⤢</span>' +
                    '</div><canvas></canvas></div>';
            }).join('');

            /* 2. 指标卡 */
            metricsBox.innerHTML = M.data.metrics.map(function (m, i) {
                return '<div class="cy-metric">' +
                    '<div class="cy-metric-label">' + m.l + '</div>' +
                    '<div class="cy-metric-num" data-i="' + i + '" data-roll="0">0</div>' +
                    '<div class="cy-metric-trend" data-i="' + i + '"></div></div>';
            }).join('');

            var stage = G.stage(grid, { render: M.paint });

            /* 3. 应用周期：滚动指标 + 重画全部图表 */
            function applyRange(key) {
                var r = M.RANGES.filter(function (x) { return x.key === key; })[0] || M.RANGES[1];
                M.range = r;
                var d = M.data;
                d.metrics.forEach(function (m, i) {
                    var node = metricsBox.querySelector('.cy-metric-num[data-i="' + i + '"]');
                    if (!node) return;
                    if (G.roll) G.roll(node, m.v, { decimals: (m.v % 1) ? 1 : 0, suffix: m.suf, dur: 850 });
                    else node.textContent = m.v + m.suf;
                    var tr = metricsBox.querySelector('.cy-metric-trend[data-i="' + i + '"]');
                    if (tr) tr.textContent = '📈 ' + r.label + '数据';
                });
                /* 缩略条与网格内的图一并刷新 */
                grid.querySelectorAll('.cy-dash-mod').forEach(function (mod) {
                    var cv = mod.querySelector('canvas');
                    if (cv) M.paint(cv, mod, false);
                });
                window.dispatchEvent(new Event('cydash:change'));
            }

            /* 4. 水滴分裂筛选 */
            if (dripBox) {
                G.drip(dripBox, {
                    capsule: '统计周期',
                    options: M.RANGES.map(function (r) {
                        return { key: r.key, label: r.label, icon: r.icon };
                    }),
                    value: 'week',
                    onSelect: applyRange
                });
            }

            /* 5. 初始绘制 + 尺寸变化重画 */
            function redraw() {
                grid.querySelectorAll('.cy-dash-mod').forEach(function (mod) {
                    var cv = mod.querySelector('canvas');
                    if (cv) M.paint(cv, mod, false);
                });
            }
            applyRange('week');
            var rt;
            window.addEventListener('resize', function () {
                clearTimeout(rt);
                rt = setTimeout(redraw, 200);
            });
            /* 阶段切换后重画缩略条迷你图 */
            window.addEventListener('cydash:change', function () {
                setTimeout(function () {
                    document.querySelectorAll('.cy-thumb canvas').forEach(function (cv, i) {
                        var mod = grid.querySelector('.cy-dash-mod[data-mod="' + MODS[i].key + '"]');
                        if (mod) M.paint(cv, mod, true);
                    });
                }, 60);
            });
            setTimeout(function () {
                document.querySelectorAll('.cy-thumb canvas').forEach(function (cv, i) {
                    var mod = grid.querySelector('.cy-dash-mod[data-mod="' + MODS[i].key + '"]');
                    if (mod) M.paint(cv, mod, true);
                });
            }, 120);

            /* 6. 看板卡片也启用跟随柔光（boot 时尚未渲染，需自行调用） */
            if (G.enableTilt) {
                G.enableTilt('.cy-dash-mod', { maxTilt: 4, lift: 2 });
                G.enableTilt('.cy-metric', { maxTilt: 4, lift: 2 });
            }
        });

