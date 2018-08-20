import {
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Entity,
	ManyToOne,
	OneToMany
} from '../node_modules/typeorm';

export abstract class Base extends BaseEntity {
	@PrimaryGeneratedColumn() id: number;
	@CreateDateColumn() createdAt: Date;
	@UpdateDateColumn() updateAt: Date;
}
// 用于登录管理页面的用户信息
@Entity()
export class User extends Base {
	@Column({ unique: true, type: String })
	name: string;
	@Column() password: string;
}
// 分类
@Entity()
export class Category extends Base {
	@Column({ unique: true })
	name: string;

	@OneToMany((type) => Post, (post) => post.category)
	posts: Post[];
}
// 文章
@Entity()
export class Post extends Base {
	@Column({ unique: true })
	title: string;

	@Column() subTitle: string;
	@Column('text') content: string;

	@Column({ default: 0 })
	views: number;

	@OneToMany((type) => Comment, (comment) => comment.post, { eager: true })
	comments: Comment[];

	@ManyToOne((type) => Category, (category) => category.posts, { nullable: true, onDelete: 'SET NULL', eager: true })
	category: Category;
}
// 评论
@Entity()
export class Comment extends Base {
	@Column() name: string;

	@Column({ type: 'text' })
	content: string;

	@Column() email: string;

	@Column({ nullable: true })
	host: string;

	@Column() ip: string;

	@ManyToOne((type) => Post, (post) => post.comments, { nullable: false, onDelete: 'CASCADE' })
	post: Post;
}
// 用于展示的用户信息
@Entity()
export class Info extends Base {
	@Column({ default: '' })
	name: string;
	@Column({ default: '' })
	avatar: string;
	@Column({ default: '' })
	github: string;
	@Column({ default: '' })
	email: string;
	@Column({ default: '', type: 'text' })
	description: string;
}

@Entity()
export class Message extends Base {
	@Column() name: string;

	@Column({ type: 'text' })
	content: string;

	@Column() email: string;

	@Column({ nullable: true })
	host: string;

	@Column() ip: string;
}

export default [ User, Category, Post, Comment, Info, Message ];
