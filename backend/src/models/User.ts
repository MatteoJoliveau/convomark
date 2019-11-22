import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {Bookmark} from './Bookmark';
import {Collection} from './Collection';
import {BaseEntity} from './BaseEntity';

@Entity({name: 'users'})
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column({type: 'varchar', nullable: true})
  lastName: string | undefined;

  @Column({type: 'varchar', nullable: true})
  username: string | undefined;

  @Column()
  languageCode!: string;

  @Column({type: 'varchar', nullable: true})
  photoUrl: string | undefined;

  @OneToMany(
    () => Bookmark,
    bookmark => bookmark.user,
  )
  bookmarks!: Promise<Bookmark[]>;

  @OneToMany(
    () => Collection,
    collection => collection.user,
  )
  collections!: Promise<Collection[]>;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
