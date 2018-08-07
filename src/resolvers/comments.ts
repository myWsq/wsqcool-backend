import { Comment, Post } from '../../db/entity';
import { getUserIp, gun, pubsub } from '../utils';
import { In } from 'typeorm';
import { Notification } from './notification';
import * as shortid from 'shortid';
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

// 收到评论后发出通知

export const Mutation = {
	async createComment(_, args: { data: CreateCommentInput }, ctx) {
		const post = await Post.findOne(args.data.postId);
		if (!post) {
			throw Error('文章不存在');
		}
		delete args.data.postId;
		const comment = await Comment.create({ ...args.data, post, ip: getUserIp(ctx) } as CreateCommentPayLoad).save();
		const notification: Notification = {
			id: shortid.generate(),
			title: `${comment.name} 发表了对文章《${post.title}》的评论`,
			content: comment.content,
			category: '新的评论',
			time: comment.createdAt.toJSON()
		};
		// 存入通知列表
		gun.get('notification').get(notification.id).put(notification);
		// 发布订阅
		pubsub.publish('notification', { notification });
		return comment;
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
