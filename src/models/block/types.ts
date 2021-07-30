interface BlockResponse {
  object: 'block';
  id: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  type: BlockTypes;
  [type: string]: any;
}

type BlockTypes =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'child_page'
  | 'unsupported';

interface BlockObject {
  id: string;
  type: BlockTypes;
  createdTime: globalThis.Date;
  lastEditedTime: globalThis.Date;
  hasChildren: boolean;
  data: Record<string, any>;
}

export { BlockResponse, BlockTypes, BlockObject };
