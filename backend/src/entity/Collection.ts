import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { User } from "./User";
import { Bookmark } from "./Bookmark";

@Entity({ name: 'collections' })
export class Collection {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    messageLink!: string;
    
    @ManyToOne(type => User, user => user.collections)
    user!: User;

    @ManyToMany(type => Bookmark, bookmark => bookmark.collections)
    @JoinTable({ name: 'bookmarks_collections' })
    bookmarks!: Bookmark[];
}
