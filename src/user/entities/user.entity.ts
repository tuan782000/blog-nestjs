import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn
} from 'typeorm';

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

    @Column()
    refresh_token: string; // lưu refreshtoken

    @Column({ default: 1 })
    status: number; // trạng thái account

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;
}
