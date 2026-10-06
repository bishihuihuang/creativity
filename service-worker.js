/* 创意引擎 Service Worker —— 离线缓存
 * 版本号与预缓存清单由 工具脚本/build.js 构建时自动生成，勿手改 CACHE_VERSION 与 PRECACHE 以下区域 */
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = 'cy-muse-' + CACHE_VERSION;
const PRECACHE = [
  './',
  'index.html',
  '1.html',
  '2.html',
  '3.html',
  '4.html',
  '5.html',
  '6.html',
  '7.html',
  '8.html',
  '9.html',
  '10.html',
  '11.html',
  '12.html',
  'verify.html',
  'common.css',
  'common.js',
  'theme.js',
  'cy-features.js',
  'manifest.json',
  '404.html',
  'favicon.svg',
  'favicon-48.png',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'robots.txt',
  'sitemap.xml'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE).catch(function (e) {});
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) {
                if (k !== CACHE_NAME) return caches.delete(k);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (event) {
    var req = event.request;
    if (req.method !== 'GET') return;
    var url = new URL(req.url);
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then(function (hit) {
            if (hit) {
                // 后台静默更新：命中缓存也顺手把网络结果写回（防旧缓存不失效）
                var upd = fetch(req).then(function (res) {
                    if (res && res.ok) {
                        var copy = res.clone();
                        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
                    }
                    return res;
                }).catch(function () { return null; });
                event.waitUntil(upd);
                return hit;
            }
            return fetch(req).then(function (res) {
                if (res && res.ok && res.type === 'basic') {
                    var copy = res.clone();
                    caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
                }
                return res;
            }).catch(function () {
                // 离线兜底：导航请求回退到首页
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return Response.error();
            });
        })
    );
});
