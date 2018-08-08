import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from '../node_modules/graphql-yoga/dist/types';
import * as directiveResolvers from './directiveResolvers';
import resolvers from './resolvers';
import Orm from '../db';
import { User } from '../db/entity';
import { hashSync } from 'bcryptjs';

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	directiveResolvers,
	context(req: ContextParameters) {
		return { ...req };
	}
});
server.use('/', require('express').static('src/pages'));
server.start({ endpoint: '/graphql', subscriptions: '/graphql', playground: false }, async (options) => {
	console.log(`服务器初始化完毕🎉`);
	await Orm();
	const name = process.env.INIT_NAME || 'admin';
	const password = process.env.INIT_PASSWORD || 'admin';
	let admin = (await User.findOne({ name })) || new User();
	admin.name = name;
	admin.password = hashSync(password);
	await admin.save();
	console.log(
		`数据库初始化成功🎉 初始用户名:${name}, 密码:${password} \n服务器运行在 http://localhost:${options.port}${options.endpoint === '/'
			? ''
			: options.endpoint}`
	);
});
