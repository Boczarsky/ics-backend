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
	"f"."name" as "flavour_name",
	"e"."user_id" as "employee_id",
	count("fl"."user_id") as follows,
	"f"."status" as flavour_status
FROM "icecream_shop" "i"
LEFT JOIN "icecream_flavour" "f" ON "i"."icecream_shop_id" = "f"."icecream_shop_id"
LEFT JOIN "flavour_hashtag" "h" ON "f"."icecream_flavour_id" = "h"."icecream_flavour_id"
LEFT JOIN "employment" "e" ON "i"."icecream_shop_id" = "e"."icecream_shop_id"
LEFT JOIN "follower" "fl" ON "i"."icecream_shop_id" = "fl"."icecream_shop_id"
LEFT JOIN "flavour_reaction" "fr" ON "fr"."icecream_flavour_id" = "f"."icecream_flavour_id"
GROUP BY "i"."icecream_shop_id",
	"i"."logo_file_name",
	"i"."owner_id",
	"i"."name",
	"i"."city",
	"i"."street",
	"i"."postal_code",
	"h"."hashtag",
	"f"."name",
	"f"."status",
	"employee_id";
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

  @ViewColumn()
  follows: string;

  @ViewColumn()
  flavour_name: string;

  @ViewColumn()
  flavour_status: number;

}
