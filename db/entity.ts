import {
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn
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

export default [ User ];
