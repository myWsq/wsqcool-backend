# wsq.cool backend gui

由 express serve 的静态页面, root路径为`@/src/pages`

```js
// graphql 默认使用
server.use('/', require('express').static('src/pages'));
```

具体细节refer to (wsq.cool-admin)[https://github.com/myWsq/wsqcool-admin]
