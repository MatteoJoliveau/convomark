import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';
import {Collection} from './Collection';
import {BaseEntity} from './BaseEntity';

@Entity({name: 'bookmarks'})
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  messageLink!: string;

  @Column({type: 'varchar', nullable: true})
  name: string | undefined;

  @ManyToOne(() => User, user => user.bookmarks)
  user!: User;

  @ManyToOne(() => Collection, collection => collection.bookmarks)
  collection!: Collection;

  constructor(data?: Partial<Bookmark>) {
    super(data);
  }
}
