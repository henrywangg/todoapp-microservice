import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({
        nullable: true
    })
    description: string

    @Column({
        nullable: true
    })
    image: string

    @Column({ default: 0 })
    isFinished: number
}