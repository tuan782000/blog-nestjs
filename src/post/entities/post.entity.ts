import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne
} from 'typeorm';

// các @ là các anotation - thư viện cung cấp - thư viện typeorm
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    thumbnail: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    // định nghĩa relationship (1 user có nhiều bài viết - 1 bài viết chỉ thuộc 1 user)
    // thằng nhiều chứa id thằng 1
    // bên user vẫn phải có OneToMany để đối xứng bên này
    @ManyToOne(() => User, user => user.posts)
    user: User;
}
