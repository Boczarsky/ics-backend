import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
 "p"."post_id",
 "p"."content",
 "p"."created_at",
 "ics"."icecream_shop_id",
 "ics"."name",
 "ics"."logo_file_name",
 "pr"."user_id" as "reaction_author",
 "pr"."reaction_type",
 "pr"."post_id" as "reaction_to",
 "p"."file_name",
 "p"."title"
FROM "post" "p"
LEFT JOIN "icecream_shop" "ics" ON "p"."icecream_shop_id" = "ics"."icecream_shop_id"
LEFT JOIN "post_reaction" "pr" ON "p"."post_id" = "pr"."post_id"
`})
export class ListPost {

  @ViewColumn()
  post_id: number;

  @ViewColumn()
  content: string;

  @ViewColumn()
  created_at: string;

  @ViewColumn()
  icecream_shop_id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  logo_file_name: number;

  @ViewColumn()
  reaction_author: number;

  @ViewColumn()
  reaction_type: number;

  @ViewColumn()
  reaction_to: number;

  @ViewColumn()
  file_name: number;

  @ViewColumn()
  title: string;

}
