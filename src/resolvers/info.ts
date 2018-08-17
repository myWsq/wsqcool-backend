import { Info } from '../../db/entity';

export const Query = {
	async info() {
		const post = await Info.findOne();
		return post;
	}
};

interface UpdateInfoInput {
	name: string;
	avatar: string;
	github: string;
	email: string;
	description: string;
}

export const Mutation = {
	async updateInfo(_, args: { data: UpdateInfoInput }) {
		let post = await Info.findOne();
		if (!post) {
            post = new Info();
		}
		for (let k of Object.keys(args.data)) {
			post[k] = args.data[k];
		}
		await post.save();
		return post;
	}
};
