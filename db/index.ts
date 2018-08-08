import 'reflect-metadata';
import { createConnection } from 'typeorm';
import entities from './entity';
export default async () => {
	await createConnection({
		type: 'postgres',
		host: '159.65.66.21',
		port: 5432,
		username: 'wsq',
		password: 'wsq123',
		database: 'wsq',
		synchronize: true,
		entities
	});
	console.log('数据库连接成功');
};
