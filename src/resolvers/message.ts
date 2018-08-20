import { Message } from '../../db/entity';
import { Pagenation, getUserIp, gun, pubsub } from '../utils';
import { Notification } from './notification';
import * as shortid from 'shortid';
import { In } from 'typeorm';
interface MsgInput {
	order?: 'ASC' | 'DESC';
}

interface MessageInput {
	name: string;
	content: string;
	email: string;
	host?: string;
}

export const Query = {
	async messages(_, args: { data: Pagenation & MsgInput }) {
		return await Message.find({
			order: { createdAt: args.data.order },
			take: args.data.take,
			skip: args.data.skip
		});
	},
	async message(_, args: { id: number }) {
		return await Message.findOne(args.id);
	}
};

export const Mutation = {
	async createMessage(_, args: { data: MessageInput }, ctx) {
		const message = await Message.create({ ...args.data, ip: getUserIp(ctx) }).save();
		const notification: Notification = {
			id: shortid.generate(),
			title: `${message.name} 有新的留言`,
			content: message.content,
			category: '新的留言',
			time: message.createdAt.toJSON()
		};
		// 存入通知列表
		gun.get('notification').get(notification.id).put(notification);
		// 发布订阅
		pubsub.publish('notification', { notification });
		return message;
	},
	async deleteMessages(_, args: { ids: number[] }) {
		const total = await Message.count({
			where: {
				id: In(args.ids)
			}
		});
		if (!total) {
			throw Error('留言不存在');
		}
		await Message.delete(args.ids);
		return total;
	}
};
