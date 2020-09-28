import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity('cetegory')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Category;
