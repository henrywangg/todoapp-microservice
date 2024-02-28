import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Todo {
    @ObjectIdColumn()
    id: string

    @Column({ unique: true })
    admin_id: number

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