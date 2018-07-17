import * as jwt from 'jsonwebtoken';
import { ContextParameters } from '../node_modules/graphql-yoga/dist/types';

export function getUserId(ctx: ContextParameters) {
	const Authorization = ctx.request.get('Authorization');
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { id } = jwt.verify(token, process.env.APP_SECRET) as { id: string };
		return id;
	}

	throw new AuthError();
}

export class AuthError extends Error {
	constructor() {
		super('未经授权的访问');
	}
}
