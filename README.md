# GraphQL Server Start Kit

> 使用 Typescript + [GraphQL Yoga](https://github.com/prismagraphql/graphql-yoga) + [TypeORM](http://typeorm.io)

带有鉴权的 **GraphQL Server** 起手式, 用于学习和测试, 生产环境下还需自行添加相关配置.

## 使用

```shell
git clone https://github.com/myWsq/grpahql-server-startkit.git
cd grpahql-server-startkit

yarn install # 或者 npm install

# 调试
yarn dev

# 开始
yarn start
```

## 配置

默认使用typeorm作为事务层,  支持多种关系型数据库, 项目默认使用**PostgreSQL**.

### 数据库

@/db/index.ts

```js
export default async () => {
	await createConnection({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'test',
		password: 'test',
		database: 'test',
		synchronize: true,
		entities
	});
	console.log('数据库连接成功');
};
```

其他类型数据库请参阅[typeorm文档](http://typeorm.io/#/undefined/installation)

**注意:** 连接mongodb还处于beta阶段, 需要修改某些实体配置.

附: PostgreSQL 的 docker compose 配置.

```yaml
version: '3.1'

services:
  db:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    volumes:
      - ./data:/var/lib/postgresql/data

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
```

### 服务器

项目默认为不带注册的最小化用户系统. 每次脚本启动会在数据库新建一个初始用户(或修改密码). 

@/.env

```shell
APP_SECRET='wsq.cool'
INIT_NAME='admin'
INIT_PASSWORD='admin'
```

其中**APP_SECRET**为jsonwebtoken的密钥, 妥善保管, 防止泄露.

其余的为初始用户密码.

## 文档

`graphql-yoga` 基于以下这些库或工具

- [`express`](https://github.com/expressjs/express)/[`apollo-server`](https://github.com/apollographql/apollo-server): Performant, extensible web server framework
- [`graphql-subscriptions`](https://github.com/apollographql/graphql-subscriptions)/[`subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws): GraphQL subscriptions server
- [`graphql.js`](https://github.com/graphql/graphql-js)/[`graphql-tools`](https://github.com/apollographql/graphql-tools): GraphQL engine & schema helpers
- [`graphql-playground`](https://github.com/graphcool/graphql-playground): Interactive GraphQL IDE

### 模块分割

@/src/resolvers/index.ts 递归处理resolvers/*.ts. 

```js
import requireContext from 'require-context';
import merge from 'deepmerge';
const files = requireContext(__dirname, true, /\.ts$/);

let module = {};

files.keys().forEach((key) => {
	module = merge(module, files(key));
});

export default module;
```

在ts文件中export 与 schema 对应的类型, 编译时所有相同类型合并, 参考auth.ts

### 鉴权处理

这是目前为止我知道的最合理的鉴权方案.: https://www.prisma.io/blog/graphql-directive-permissions-authorization-made-easy-54c076b5368e/

有空我会写一篇理解🤔