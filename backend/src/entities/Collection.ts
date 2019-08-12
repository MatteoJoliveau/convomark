import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import slug from 'slug';
import {v4 as uuid} from 'uuid';
import {User} from './User';
import {Bookmark} from './Bookmark';
import {createHash} from 'crypto';
import {BaseEntity} from './BaseEntity';

@Entity({name: 'collections'})
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  slug!: string;

  @Column()
  shortId!: string;

  @ManyToOne(() => User, user => user.collections, {eager: true})
  user!: User;

  @OneToMany(() => Bookmark, bookmark => bookmark.collection)
  bookmarks!: Promise<Bookmark[]>;

  static defaultCollection(user: User): Collection {
    return new Collection({title: 'Default', user});
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    const username = this.user.username || this.user.id;
    this.slug = slug(`${username}-${this.title}`).toLowerCase();
  }

  @BeforeInsert()
  generateShortId() {
    const hash = createHash('SHA256');
    hash.update(uuid());
    this.shortId = hash.digest('hex').substring(0, 7);
  }

  constructor(data?: Partial<Collection>) {
    super(data);
  }
}
