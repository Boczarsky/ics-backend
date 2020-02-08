import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({expression: `
SELECT
  o.icecream_shop_id,
  o.opinion_id,
  o.user_id,
  o.created_at,
  o.content,
  o.grade,
  u.avatar_file_name,
  u.login,
  u.email,
  u.first_name,
  u.last_name,
  array_to_json(array(
	  SELECT json_build_object(
		  'comment_id', oc.opinion_comment_id,
		  'content', oc.content,
		  'created_at', oc.created_at,
		  'shop_name', ics.name,
		  'shop_logo', ics.logo_file_name,
		  'username', u.login,
		  'first_name', u.first_name,
		  'last_name', u.last_name,
		  'avatar', u.avatar_file_name
	  ) FROM opinion_comment oc
	  LEFT JOIN icecream_shop ics ON ics.icecream_shop_id = oc.icecream_shop_id
	  LEFT JOIN "user" u ON u.user_id = oc.user_id
	  WHERE oc.opinion_id = o.opinion_id
	  ORDER BY oc.created_at ASC
  )) as "comments"
FROM opinion o
LEFT JOIN "user" u ON o.user_id = u.user_id
`})
export class OpinionView {

  @ViewColumn()
  icecream_shop_id: number;

  @ViewColumn()
  opinion_id: number;

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  created_at: string;

  @ViewColumn()
  content: string;

  @ViewColumn()
  grade: number;

  @ViewColumn()
  avatar_file_name: string;

  @ViewColumn()
  login: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  last_name: string;

  @ViewColumn()
  first_name: string;

  @ViewColumn()
  comments: string;

}
