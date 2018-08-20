import { getUserId } from '../utils';
import { User } from '../../db/entity';
import * as jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import * as validator from 'validator';

interface AuthInput {
	name: string;
	password: string;
}

interface OssPayLoad {
	accessKeyId: string;
	accessKeySecret: string;
	region: string;
	bucket: string;
}

export const Query = {
	async me(_, $, ctx) {
		return await User.findOne(getUserId(ctx));
	},
	oss() {
		const res: OssPayLoad = {
			accessKeyId: process.env.OSS_ACCESS_KEY_ID,
			accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
			region: process.env.OSS_REGION,
			bucket: process.env.OSS_BUCKET
		};
		for (let k in res) {
			console.log(process.env);
			
			if (!res[k]) {
				throw Error('OSS配置无效,请检查配置信息');
			}
		}
		return res;
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
