import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
  "u"."user_id",
  "u"."manager_id",
  "u"."login",
  "u"."email",
  "u"."first_name",
  "u"."last_name",
  concat("u"."first_name", ' ', "u"."last_name") as full_name,
  "e"."icecream_shop_id" as "workplace_id",
  CASE WHEN "is"."name" is not null THEN concat("is"."name", ' - ', "is"."city", ', ', "is"."street") ELSE null END as "workplace_name"
FROM "user" "u"
LEFT JOIN "employment" "e" ON "u"."user_id" = "e"."user_id"
LEFT JOIN "icecream_shop" "is" ON "e"."icecream_shop_id" = "is"."icecream_shop_id"
WHERE "u"."user_type" = 2
`})
export class Employee {

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  login: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  first_name: string;

  @ViewColumn()
  last_name: string;

  @ViewColumn()
  manager_id: number;

  @ViewColumn()
  icecream_shop_id: number;

  @ViewColumn()
  icecream_shop_name: string;

  @ViewColumn()
  full_name: string;

}
