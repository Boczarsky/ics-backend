import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT
    "u1"."user_id",
    "u1"."user_type",
    "u1"."login",
    "u1"."email",
    "u1"."first_name",
    "u1"."last_name",
    "u1"."manager_id",
    "emp"."icecream_shop_id",
    "ics"."name",
    nullif(trim(concat("u1"."first_name", ' ', "u1"."last_name")), '') as "full_name"
  FROM "user" "u1"
  LEFT JOIN "user" "u2" ON "u1"."manager_id" = "u2"."user_id"
  LEFT JOIN "employment" "emp" ON "u1"."user_id" = "emp"."user_id"
  LEFT JOIN "icecream_shop" "ics" ON "emp"."icecream_shop_id" = "ics"."icecream_shop_id"
  `,
})
export class SearchEmployee {

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  user_type: number;

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
  name: string;

  @ViewColumn()
  full_name: string;

}
