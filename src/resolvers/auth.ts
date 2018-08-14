import { getUserId } from '../utils';
import { User } from '../../db/entity';
import * as jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import * as validator from 'validator';

interface AuthInput {
	name: string;
	password: string;
}

export const Query = {
	async me(_, $, ctx) {
		return await User.findOne(getUserId(ctx));
	}
};

export const Mutation = {
	async login(_, args: { data: AuthInput }) {
		const user = await User.findOne({ name: args.data.name });
		if (!user) {
			throw Error('用户不存在');
		} else if (!compareSync(args.data.password, user.password)) {
			throw Error('密码错误');
		} else {
			return user;
		}
	},
	async userReset(_, args: { data: AuthInput }, ctx) {
		const user = await User.findOne(getUserId(ctx));
		console.log(args.data);

		if (args.data.name && args.data.name.length > 0) {
			
			user.name = args.data.name;
		}
		if (args.data.password && args.data.password.length > 0) {
			user.password = hashSync(args.data.password);
		}
		return await user.save();
	}
};

// 添加token
export const AuthPayLoad = {
	token(parent: User) {
		return jwt.sign({ id: parent.id }, process.env.APP_SECRET);
	},
	user(parent: User) {
		return parent;
	}
};
