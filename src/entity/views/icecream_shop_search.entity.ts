import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
	"i"."icecream_shop_id",
	"i"."owner_id",
	"i"."name",
	"i"."city",
	"i"."street",
	"i"."postal_code",
	"l"."longitude",
	"l"."latitude",
  "lo"."logo_id",
  "h"."hashtag"
FROM "icecream_shop" "i"
LEFT JOIN "localization" "l" ON "i"."icecream_shop_id" = "l"."icecream_shop_id"
LEFT JOIN "icecream_shop_logo" "lo" ON "i"."icecream_shop_id" = "lo"."icecream_shop_id"
LEFT JOIN "icecream_flavour" "f" ON "i"."icecream_shop_id" = "f"."icecream_shop_id"
LEFT JOIN "flavour_hashtag" "h" ON "f"."icecream_flavour_id" = "h"."icecream_flavour_id"
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
  longitude: number;

  @ViewColumn()
  latitude: number;

  @ViewColumn()
  logoId: number;

  @ViewColumn()
  hashtag: string;

}
