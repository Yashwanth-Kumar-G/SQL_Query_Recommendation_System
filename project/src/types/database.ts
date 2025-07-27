export interface Person {
  id: number;
  name: string;
  frnd_id: number;
  hob: string;
  foll: number;
}

export interface Table {
  name: string;
  data: Person[];
  structure: TableColumn[];
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  message?: string;
}

export type QueryType = 'friends' | 'friend-of-friend' | 'interests' | 'you-may-like';