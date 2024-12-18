import { Post } from 'src/post/entities/post.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany
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

    @Column({ nullable: true, default: null }) // cho phép nó null - và mặc định khi tạo nó sẽ gán giá trị null
    refresh_token: string; // lưu refreshtoken

    @Column({ nullable: true, default: null }) // cho phép nó null - và mặc định khi tạo nó sẽ gán giá trị null
    avatar: string; // lưu refreshtoken

    @Column({ default: 1 })
    status: number; // trạng thái account

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    // định nghĩa 1 user có nhiều post
    // posts nó là 1 mảng danh sách các post mà user này sở hữu
    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}
