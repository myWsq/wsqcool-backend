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

@Entity()
export class User extends Base {
	@Column({ unique: true })
	name: string;
	@Column() password: string;
}

@Entity()
export class Post extends Base {
	@Column({ unique: true })
	title: string;

	@Column() subTitle: string;
	@Column('text') content: string;

	@Column({ default: 0 })
	views: number;

	@Column({ default: 0 })
	likes: number;

	@OneToMany((type) => Comment, (comment) => comment.post,)
	comments: Comment[];
}

@Entity()
export class Comment extends Base {
	@Column({ type: 'text' })
	content: string;

	@Column() email: string;

	@Column({ nullable: true })
	host: string;

	@Column() ip: string;

	@ManyToOne((type) => Post, (post) => post.comments, { nullable: false, onDelete: 'CASCADE' })
	post: Post;
}

export default [ User, Post, Comment ];
