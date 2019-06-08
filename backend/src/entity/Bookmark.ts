import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";

@Entity({ name: 'bookmarks' })
export class Bookmark {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    messageLink!: string;
    
    @ManyToOne(type => User, user => user.bookmarks)
    user!: User;

    @ManyToMany(type => Collection, collection => collection.bookmarks)
    collections!: Promise<Collection[]>;
}
