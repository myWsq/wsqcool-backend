import { pubsub, gun } from '../utils';
import 'gun/lib/then';
import 'gun/lib/unset.js';
export interface Notification {
	id: string;
	category: string;
	title: string;
	content: string;
	time: string;
}

export const Query = {
	async notifications() {
		let tmp = [];
		if (await gun.get('notification').then()) {
			await gun
				.get('notification')
				.map()
				.on((data: Notification) => {
					console.log(data);
					if (data) {
						tmp.push(data);
					}
				})
				.then();
		}
		return tmp;
	}
};

export const Mutation = {
	async deleteNotification(_, args: { id: string }) {
		const node = gun.get('notification').get(args.id);
		if (await node.then()) {
			node.put(null);
			return;
		}
		throw Error('通知不存在');
	},
	async clearNotification() {
		// 手动置空
		await gun
			.get('notification')
			.map()
			.on(async (data, k) => {
				if (data) {
					await gun.get('notification').get(k).put(null).then();
				}
			})
			.then();
		return;
	}
};

export const Subscription = {
	notification: {
		subscribe() {
			return pubsub.asyncIterator('notification');
		}
	}
};
