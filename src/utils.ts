import * as jwt from 'jsonwebtoken';
import { ContextParameters } from '../node_modules/graphql-yoga/dist/types';
import * as Gun from 'gun';

export const gun = Gun();

// 分页参数
export interface Pagenation {
	skip?: number;
	take?: number;
}

export const getUserId = (ctx: ContextParameters) => {
	const Authorization = ctx.request.get('Authorization');
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { id } = jwt.verify(token, process.env.APP_SECRET) as { id: string };
		return id;
	}
	return null;
};

export class AuthError extends Error {
	constructor() {
		super('未经授权的访问');
	}
}

export const getUserIp = (ctx: ContextParameters) => {
	const req = ctx.request;
	const headers = req.headers['x-forwarded-for'] as string;
	return headers ? headers.split(',').pop() : req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
};

// 转化为promise
export const getOnce = (gunIns: any) => {
	return new Promise<any>((resolve, reject) => {
		gunIns.once((data) => {
			resolve(data);
		});
	});
};
