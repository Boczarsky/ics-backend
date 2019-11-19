import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class IcecreamShopLogo {

  @PrimaryColumn()
  icecream_shop_id: number;

  @Column()
  file_path: string;

  @Column()
  file_name: string;

  @Column()
  file_ext: string;

  @OneToOne(() => IcecreamShop, icecreamShop => icecreamShop.logo)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
