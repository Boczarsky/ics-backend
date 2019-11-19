import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Employment } from './employment.entity';
import { Follower } from './follower.entity';
import { Promotion } from './promotion.entity';
import { IcecreamShopLogo } from './icecream_shop_logo.entity';
import { IcecreamShopPhoto } from './icecream_shop_photo.entity';
import { IcecreamFlavour } from './icecream_flavour.entity';
import { Localization } from './localization.entity';
import { Post } from './post.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn({type: 'int'})
  icecream_shop_id: number;

  @Column()
  logo_id: number;

  @Column()
  photo_id: number;

  @Column()
  localization_id: number;

  @Column({type: 'varchar'})
  name: string;

  @Column({type: 'int'})
  owner_id: number;

  @ManyToOne(() => User, user => user.icecream_shops)
  @JoinColumn({name: 'owner_id'})
  owner: User;

  @OneToMany(() => Employment, ew => ew.workplace)
  employees: Employment[];

  @OneToMany(() => Follower, ff => ff.favorite)
  followers: Follower[];

  @OneToMany(() => Promotion, promotion => promotion.icecream_shop)
  promotions: Promotion[];

  @OneToOne(() => IcecreamShopLogo, icecreamShopLogo => icecreamShopLogo.icecream_shop)
  @JoinColumn({name: 'logo_id'})
  logo: IcecreamShopLogo;

  @OneToOne(() => IcecreamShopPhoto, icecreamShopPhoto => icecreamShopPhoto.icecream_shop)
  @JoinColumn({name: 'photo_id'})
  photo: IcecreamShopPhoto;

  @OneToMany(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.icecream_shop)
  flavours: IcecreamFlavour[];

  @OneToOne(() => Localization, localization => localization.icecream_shop)
  @JoinColumn({name: 'localization_id'})
  localization: Localization;

  @OneToMany(() => Post, post => post.icecream_shop)
  posts: Post[];

}
