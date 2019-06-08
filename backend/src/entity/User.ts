import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { Bookmark } from "./Bookmark";
import { Collection } from "./Collection";

@Entity({ name: 'users' })
export class User {
    
    @PrimaryColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column({ type: 'varchar', nullable: true })
    lastName: string | undefined;

    @Column({ type: 'varchar', nullable: true })
    username: string | undefined;

    @Column()
    languageCode!: string;

    @Column({ type: 'varchar', nullable: true })
    photoUrl: string | undefined;

    @OneToMany(type => Bookmark, bookmark => bookmark.user)
    bookmarks!: Bookmark[];

    @OneToMany(type => Collection, collection => collection.user)
    collections!: Promise<Collection[]>;
}
