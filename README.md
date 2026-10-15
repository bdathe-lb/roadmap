# CS-Roadmap

2026-09 → 2027-09 的 C++ 后端求职路线，时间线看板。线上：https://roadmap.bdathe.wiki

纯静态页面，没有构建步骤：`index.html` + `assets/`。

## 本地预览

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/?today=2027-01-10   ← today 参数可以模拟任意一天
```

本地预览连不上进度接口（跨域只放行线上域名），进度只存在浏览器里。

## 部署

GitHub Pages，直接从 `main` 分支根目录发布，推送即上线。

- `CNAME`：绑定 roadmap.bdathe.wiki
- `.nojekyll`：关掉 Jekyll，原样发布

## 进度同步

`GET / PUT https://api.bandbox.cloud/roadmap/progress`，写入要带 `X-Token` 口令。

- 接口是腾讯云上的 roadmap-api（`/opt/roadmap-api`），由 next-go 项目的 nginx 转发，跨域头也在那里加
- 不用 roadmap.bdathe.wiki 自己的域名：没有备案，大陆服务器上会被拦截
- 数据形状 `{st: {关卡id: 'learning' | 'done' | 'skip'}}`，关卡 id 和 localStorage 键
  `cppquest.v3` 与旧版（像素地图）一致，改动前要想清楚兼容
