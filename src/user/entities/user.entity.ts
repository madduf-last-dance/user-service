import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;
  
  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  address: string;

}