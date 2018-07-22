import { pubsub, gun, getOnce } from '../utils';
import 'gun/lib/then';
import 'gun/lib/erase';
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
				.once((data: Notification) => {
					data && data.category && tmp.push(data);
				})
				.then();
		}
		return tmp;
	}
};

export const Mutation = {
	async deleteNotification(_, args: { id: string }) {
		await gun.get('notification').get(args.id).put(null);
		return;
	},
	async clearNotification() {
		gun.get('notification').off();
		return;
	}
};

export const Subscription = {
	notification: {
		subscribe() {
			return pubsub.asyncIterator([ 'NOTIFICATION' ]);
		}
	}
};
