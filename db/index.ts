import 'reflect-metadata';
import { createConnection } from 'typeorm';
import entities from './entity';
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
