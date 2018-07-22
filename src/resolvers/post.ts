import { Post, Category } from '../../db/entity';
import { Pagenation } from '../utils';
import { GraphQLResolveInfo } from '../../node_modules/@types/graphql';

interface PostsInput {
	contain?: string;
	order?: 'ASC' | 'DESC';
}

export const Query = {
	async posts(_, args: { data?: Pagenation & PostsInput }, ctx) {
		// 需要搜索
		if (args.data && args.data.contain) {
			return await Post.createQueryBuilder('post')
				.where('post.title like :keyword')
				.orWhere('post.subTitle like :keyword')
				.orWhere('post.Content like :keyword')
				.setParameter('keyword', `%${args.data.contain}%`)
				.take(args.data.take)
				.skip(args.data.skip)
				.orderBy('post.createdAt', args.data.order)
				.getMany();
		} else if (args.data) {
			return await Post.find({
				order: { createdAt: args.data.order },
				take: args.data.take,
				skip: args.data.skip
			});
		} else {
			return await Post.find();
		}
	},
	async post(_, args: { id: number }) {
		return await Post.findOne(args.id);
	}
};

interface CreatePostInput {
	title: string;
	subTitle: string;
	content: string;
	category: string;
}

interface UpdatePostInput {
	id: number;
	title?: string;
	subTitle?: string;
	content?: string;
	category?: string;
}

export const Mutation = {
	async createPost(_, args: { data: CreatePostInput }) {
		const input = args.data;
		const category =
			(await Category.findOne({ name: input.category })) ||
			(input.category && (await Category.create({ name: input.category }).save()));
		return await Post.create({ ...input, category }).save();
	},
	async deletePost(_, args: { id: number }) {
		await Post.delete(args.id);
		return 1;
	},
	async updatePost(_, args: { data: UpdatePostInput }) {
		const input = args.data;
		const category =
			(await Category.findOne({ name: input.category })) ||
			(input.category && (await Category.create({ name: input.category }).save()));
		await Post.update(args.data.id, { ...args.data, category });
		return await Post.findOne(input.id);
	}
};
