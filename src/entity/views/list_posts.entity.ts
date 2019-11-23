import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
 "p"."post_id",
 "p"."content",
 "p"."created_at",
 "ics"."icecream_shop_id",
 "ics"."name",
 "ics"."logo_file_name",
 "pc"."post_comment_id",
 "pc"."user_id" as "comment_author",
 "pc"."content" as "comment_content",
 "pc"."post_id" as "comment_to",
 "pr"."user_id" as "reaction_author",
 "pr"."reaction_type",
 "pr"."post_id" as "reaction_to",
 "pa"."file_name"
FROM "post" "p"
LEFT JOIN "icecream_shop" "ics" ON "p"."icecream_shop_id" = "ics"."icecream_shop_id"
LEFT JOIN "post_comment" "pc" ON "p"."post_id" = "pc"."post_id"
LEFT JOIN "post_reaction" "pr" ON "p"."post_id" = "pr"."post_id"
LEFT JOIN "post_attachment" "pa" ON "p"."post_id" = "pa"."post_id"
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
  post_comment_id: number;

  @ViewColumn()
  comment_author: number;

  @ViewColumn()
  comment_content: string;

  @ViewColumn()
  comment_to: number;

  @ViewColumn()
  reaction_author: number;

  @ViewColumn()
  reaction_type: number;

  @ViewColumn()
  reaction_to: number;

  @ViewColumn()
  file_name: number;

}
