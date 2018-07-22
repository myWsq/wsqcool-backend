import { Comment, Post } from '../../db/entity';
import { getUserIp } from '../utils';
import { In } from 'typeorm';

export const Query = {
	async comments(_, args: { postId: number }) {
		const post = await Post.findOne(args.postId);
		if (!post) {
			throw Error('文章不存在');
		}
		return await Comment.find({ post });
	}
};

interface CreateCommentBase {
	name: string;
	content: string;
	email: string;
	host?: string;
}

interface CreateCommentPayLoad extends CreateCommentBase {
	ip: string;
	post: Post;
}

interface CreateCommentInput extends CreateCommentBase {
	postId: number;
}

export const Mutation = {
	async createComment(_, args: { data: CreateCommentInput }, ctx) {
		const post = await Post.findOne(args.data.postId);
		if (!post) {
			throw Error('文章不存在');
		}
		delete args.data.postId;
		return await Comment.create({ ...args.data, post, ip: getUserIp(ctx) } as CreateCommentPayLoad).save();
	},
	async deleteComments(_, args: { ids: number[] }) {
		const total = await Comment.count({
			where: {
				id: In(args.ids)
			}
		});
		if (!total) {
			throw Error('文章不存在');
		}
		await Comment.delete(args.ids);
		return total;
	}
};
