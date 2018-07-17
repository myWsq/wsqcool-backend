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

默认使用TypeORM作为事务层,  支持多种关系型数据库, 项目默认使用**PostgreSQL**.

### 数据库初始化

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





