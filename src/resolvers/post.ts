import { Post } from '../../db/entity';
import { Pagenation } from '../utils';

interface PostsInput {
	contain?: string;
	order?: 'ASC' | 'DESC';
}

export const Query = {
	async posts(_, args: { data: Pagenation & PostsInput }) {
		// 需要搜索
		if (args.data.contain) {
			return await Post.createQueryBuilder('post')
				.where('post.title like :keyword')
				.orWhere('post.subTitle like :keyword')
				.orWhere('post.Content like :keyword')
				.setParameter('keyword', `%${args.data.contain}%`)
				.take(args.data.take)
				.skip(args.data.skip)
				.orderBy('post.createdAt', args.data.order)
				.getMany();
		} else {
			return await Post.find({
				order: { createdAt: args.data.order },
				take: args.data.take,
				skip: args.data.skip
			});
		}
	}
};
