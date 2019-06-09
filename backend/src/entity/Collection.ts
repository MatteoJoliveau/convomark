import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from "typeorm";
import { User } from "./User";
import { Bookmark } from "./Bookmark";
import slug from 'slug';

@Entity({ name: 'collections' })
export class Collection {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column()
    slug!: string;

    @ManyToOne(type => User, user => user.collections)
    user!: User;

    @ManyToMany(type => Bookmark, bookmark => bookmark.collections, { eager: true })
    @JoinTable({
        name: 'bookmarks_collections',
        joinColumn: {
            name: 'collectionId'
        },
        inverseJoinColumn: {
            name: 'bookmarkId'
        }
    })
    bookmarks!: Promise<Bookmark[]>;

    static defaultCollection(): Collection {
        const collection = new Collection();
        collection.title = 'Default'
        return collection;
    }

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        const username = this.user.username || this.user.id;
        this.slug = slug(`${username}-${this.title}`).toLowerCase();
        console.log('Generated slug', this.slug)
    }
}
