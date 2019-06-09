import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Collection } from "./Collection";
import { User } from "./User";

@Entity({ name: "bookmarks" })
export class Bookmark {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    messageLink!: string;

    @ManyToOne((type) => User, (user) => user.bookmarks)
    user!: User;

    @ManyToMany((type) => Collection, (collection) => collection.bookmarks)
    collections!: Promise<Collection[]>;
}
