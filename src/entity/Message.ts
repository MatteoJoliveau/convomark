import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    messageId!: number;
    
    @Column()
    chatUsername!: string;
}
