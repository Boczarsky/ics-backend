import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `select
	pr.promotion_id,
	pr.user_id,
	pr.info,
	pr.limit,
	pr.prize,
	pr.start_date,
	pr.end_date,
	array_to_json(array(
		select json_build_object('value', ps.icecream_shop_id, 'name', ics.name) from promotion_shop ps
		left join icecream_shop ics on ics.icecream_shop_id = ps.icecream_shop_id
		where ps.promotion_id = pr.promotion_id
	)) as assigned_shops
from promotion pr`})
export class ManagerPromotionList {

  @ViewColumn()
  promotion_id: number;

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  info: string;

  @ViewColumn()
  limit: number;

  @ViewColumn()
  prize: string;

  @ViewColumn()
  start_date: string;

  @ViewColumn()
  end_date: string;

  @ViewColumn()
  assigned_shops: Array<{value: number, name: string}>;

}
