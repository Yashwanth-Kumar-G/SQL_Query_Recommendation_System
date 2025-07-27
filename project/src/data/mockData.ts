import { Person, Table } from '../types/database';

export const initialStdnts1: Person[] = [
  { id: 1, name: 'pranava', frnd_id: 4, hob: 'dance', foll: 58 },
  { id: 2, name: 'srujan', frnd_id: 3, hob: 'reading', foll: 234 },
  { id: 3, name: 'shashank', frnd_id: 5, hob: 'politics', foll: 584 },
  { id: 4, name: 'vivek', frnd_id: 5, hob: 'music', foll: 342 },
  { id: 5, name: 'praneeth', frnd_id: 4, hob: 'programming', foll: 9 },
  { id: 6, name: 'yashwanth', frnd_id: 4, hob: 'sports', foll: 0 },
  { id: 7, name: 'vishnu', frnd_id: 1, hob: 'photography', foll: 156 },
  { id: 8, name: 'suansh', frnd_id: 6, hob: 'dance', foll: 346 },
  { id: 9, name: 'ranaveer', frnd_id: 8, hob: 'politics', foll: 346 },
  { id: 10, name: 'prateek', frnd_id: 5, hob: 'programming', foll: 42 }
];

export const initialStdnts2: Person[] = [
  { id: 1, name: 'pranava', frnd_id: 4, hob: 'dance', foll: 58 },
  { id: 3, name: 'shashank', frnd_id: 5, hob: 'politics', foll: 584 },
  { id: 4, name: 'vivek', frnd_id: 5, hob: 'music', foll: 342 },
  { id: 5, name: 'praneeth', frnd_id: 4, hob: 'programming', foll: 9 },
  { id: 6, name: 'yashwanth', frnd_id: 4, hob: 'education', foll: 0 },
  { id: 7, name: 'vishnu', frnd_id: 1, hob: 'photography', foll: 156 },
  { id: 8, name: 'suansh', frnd_id: 6, hob: 'dance', foll: 346 },
  { id: 9, name: 'ranaveer', frnd_id: 8, hob: 'politics', foll: 346 },
  { id: 10, name: 'prateek', frnd_id: 5, hob: 'programming', foll: 42 }
];

export const initialCelebrities: Person[] = [
  { id: 1, name: 'A.Arjun', frnd_id: 0, hob: 'dance', foll: 2000000 },
  { id: 2, name: 'N.Modi', frnd_id: 0, hob: 'politics', foll: 85000000 },
  { id: 3, name: 'phywallah', frnd_id: 0, hob: 'education', foll: 2000000 },
  { id: 4, name: 'G.Selena', frnd_id: 0, hob: 'music', foll: 429000000 }
];

export const initialTables: Table[] = [
  {
    name: 'stdnts1',
    data: initialStdnts1,
    structure: [
      { name: 'ID', type: 'NUMBER(3)', nullable: false },
      { name: 'NAME', type: 'VARCHAR2(10)', nullable: false },
      { name: 'FRND_ID', type: 'NUMBER(3)', nullable: false },
      { name: 'HOB', type: 'VARCHAR2(15)', nullable: false },
      { name: 'FOLL', type: 'NUMBER(10)', nullable: false }
    ]
  },
  {
    name: 'stdnts2',
    data: initialStdnts2,
    structure: [
      { name: 'ID', type: 'NUMBER(3)', nullable: false },
      { name: 'NAME', type: 'VARCHAR2(10)', nullable: false },
      { name: 'FRND_ID', type: 'NUMBER(3)', nullable: false },
      { name: 'HOB', type: 'VARCHAR2(15)', nullable: false },
      { name: 'FOLL', type: 'NUMBER(10)', nullable: false }
    ]
  },
  {
    name: 'celebrities',
    data: initialCelebrities,
    structure: [
      { name: 'ID', type: 'NUMBER(3)', nullable: false },
      { name: 'NAME', type: 'VARCHAR2(10)', nullable: false },
      { name: 'FRND_ID', type: 'NUMBER(3)', nullable: false },
      { name: 'HOB', type: 'VARCHAR2(15)', nullable: false },
      { name: 'FOLL', type: 'NUMBER(10)', nullable: false }
    ]
  }
];