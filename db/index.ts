import 'reflect-metadata';
import { createConnection } from 'typeorm';
import entities from './entity';
export default async () => {
	await createConnection({
		type: 'postgres',
		host: '101.200.48.1',
		port: 5432,
		username: 'test',
		password: 'test',
		database: 'test',
		synchronize: true,
		entities
	});
	console.log('数据库连接成功');
};
