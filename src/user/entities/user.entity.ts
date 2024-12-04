import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// các @ là các anotation - thư viện cung cấp - thư viện typeorm
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 1 })
    status: number; // trạng thái account
}
