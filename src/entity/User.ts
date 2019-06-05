import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { Message } from "./Message";

@Entity()
export class User {
    @PrimaryColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName: string | undefined;

    @Column()
    username: string | undefined;

    @Column()
    languageCode!: string;

    @OneToMany(type => Message, message => message.from)
    messages!: Message[];

}
