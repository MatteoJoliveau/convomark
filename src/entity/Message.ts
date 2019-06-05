import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Message {
    @PrimaryColumn()
    id!: number;

    @ManyToOne(type => User, user => user.messages)
    from!: User;
}
