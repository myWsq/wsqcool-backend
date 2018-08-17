# wsq.cool backend

1. 总体是一个通用的博客系统,  可少许定制.  完成后会夹杂一些私货在上面.
2. 将默认带一套GUI,  API全开放, 可以基于这个自己做新的界面.

## 架构

Typescript + [GraphQL Yoga](https://github.com/prismagraphql/graphql-yoga)  + [TypeORM](http://typeorm.io) .  摸索了很久, 算是现阶段比较理想的组合.  

详细架构说明转到: https://github.com/myWsq/grpahql-server-startkit.

使用 [Gun](https://github.com/amark/gun) 缓存消息队列.  JavaScript编写的键值对内存数据库, 比Redis更加轻量.

默认GUI将使用Vue编写并由express提供静态文件.

## 进度

- [x] 鉴权系统(登录, 重置)
- [x] 防爆破
- [x] 文章获取(全文搜索, 排序, 分页)
- [ ] ~~文章点赞~~
- [x] 文章分类
- [x] 文章CUD
- [x] 评论CRD
- [x] 评论通知
- [x] 评论通知删除
- [ ] 留言CRD
- [x] 基础信息展示

## 遇到的问题

1. Gun的文档很糟糕, 删除节点没有明确的方法

## 接口调用频率限制

防止接口被暴力破解, 对部分开放接口进行了调用频率限制.

限制函数同鉴权函数相同,以装饰器的形式进行复用:

```typescript
rateLimit(times: number, delta: number, key ?: string)
```
规定了接口在`delta`秒内最多调用`times`次, 当两个限制函数用于同一接口时, 应携带不同的参数key以区分.

# wsq.cool backend gui

由 express serve 的静态页面, root路径为`@/src/pages`

```js
// graphql 默认使用
server.use('/', require('express').static('src/pages'));
```

具体细节refer to [wsq.cool-admin](https://github.com/myWsq/wsqcool-admin)
