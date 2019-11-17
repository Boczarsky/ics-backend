import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT "u1"."user_id", "u1"."user_type", "u1"."login", "u1"."email", "u1"."first_name", "u1"."last_name", nullif(trim(concat("u1"."first_name", ' ', "u1"."last_name")), '') as "full_name", nullif(trim(concat("u2"."first_name", ' ', "u2"."last_name")), '') as "manager"
  FROM "user" "u1"
  LEFT JOIN "user" "u2" ON "u1"."manager_id" = "u2"."user_id"
  `,
})
export class SearchUser {

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
  manager: string;

  @ViewColumn()
  full_name: string;

}
