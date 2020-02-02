import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
  "i"."icecream_shop_id",
  "i"."logo_file_name",
	"i"."owner_id",
	"i"."name",
	"i"."city",
	"i"."street",
	"i"."postal_code",
  "h"."hashtag",
  "e"."user_id" as "employee_id"
FROM "icecream_shop" "i"
LEFT JOIN "icecream_flavour" "f" ON "i"."icecream_shop_id" = "f"."icecream_shop_id"
LEFT JOIN "flavour_hashtag" "h" ON "f"."icecream_flavour_id" = "h"."icecream_flavour_id"
LEFT JOIN "employment" "e" ON "i"."icecream_shop_id" = "e"."icecream_shop_id"
`})
export class IcecreamShopSearch {

  @ViewColumn()
  icecream_shop_id: number;

  @ViewColumn()
  owner_id: number;

  @ViewColumn()
  name: number;

  @ViewColumn()
  city: string;

  @ViewColumn()
  street: string;

  @ViewColumn()
  postal_code: string;

  @ViewColumn()
  hashtag: string;

  @ViewColumn()
  logo_file_name: string;

  @ViewColumn()
  employee_id: string;

}
