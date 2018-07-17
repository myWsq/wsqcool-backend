import { ContextParameters } from '../node_modules/graphql-yoga/dist/types';
import { AuthError, getUserId } from './utils';
import { User } from '../db/entity';

export const isAuthenticated = async (next, source, args, ctx: ContextParameters) => {
	const hasUser = getUserId(ctx) && (await User.findOne(getUserId(ctx)));
	if (hasUser) return next();
	else throw new AuthError();
};
