import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { Message } from "./Message";

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
}
