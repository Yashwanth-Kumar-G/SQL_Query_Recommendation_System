import { Person, Table, QueryResult } from '../types/database';

export class QueryEngine {
  private tables: Table[];

  constructor(tables: Table[]) {
    this.tables = tables;
  }

  updateTables(tables: Table[]) {
    this.tables = tables;
  }

  executePersonFriendsQuery(personName: string, tableName: string = 'stdnts1'): QueryResult {
    const table = this.tables.find(t => t.name === tableName);
    if (!table) {
      return { columns: [], rows: [], message: `Table ${tableName} not found` };
    }

    const person = table.data.find(p => p.name.toLowerCase() === personName.toLowerCase());
    if (!person) {
      return { columns: ['NAME'], rows: [], message: `Person ${personName} not found` };
    }

    // Find all people who share the same friend_id as this person (including the person themselves)
    const friends = table.data.filter(p => p.frnd_id === person.frnd_id && p.name !== person.name);
    const uniqueFriends = friends.reduce((acc: Person[], current) => {
      const exists = acc.find(p => p.name === current.name);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    return {
      columns: ['NAME'],
      rows: uniqueFriends.map(friend => [friend.name])
    };
  }

  executeFriendOfFriendQuery(personName: string): QueryResult {
    const stdnts1 = this.tables.find(t => t.name === 'stdnts1');
    const stdnts2 = this.tables.find(t => t.name === 'stdnts2');
    
    if (!stdnts1 || !stdnts2) {
      return { columns: [], rows: [], message: 'Required tables not found' };
    }

    const person = stdnts1.data.find(p => p.name.toLowerCase() === personName.toLowerCase());
    if (!person) {
      return { columns: ['NAME'], rows: [], message: `Person ${personName} not found` };
    }

    // Find person's friends (people who share the same friend_id)
    const friends = stdnts1.data.filter(p => p.frnd_id === person.frnd_id && p.name !== person.name);
    
    // Find friends of friends
    const friendsOfFriends: Person[] = [];
    friends.forEach(friend => {
      // Find people in stdnts2 who share the same friend_id as this friend
      const fof = stdnts2.data.filter(p => p.frnd_id === friend.frnd_id && p.name !== friend.name);
      friendsOfFriends.push(...fof);
    });

    const uniqueFoF = friendsOfFriends.reduce((acc: Person[], current) => {
      const exists = acc.find(p => p.name === current.name);
      if (!exists && current.name !== personName) acc.push(current);
      return acc;
    }, []);

    return {
      columns: ['NAME'],
      rows: uniqueFoF.map(person => [person.name])
    };
  }

  executeInterestsQuery(interest: string): QueryResult {
    const stdnts2 = this.tables.find(t => t.name === 'stdnts2');
    const celebrities = this.tables.find(t => t.name === 'celebrities');
    
    if (!stdnts2 || !celebrities) {
      return { columns: [], rows: [], message: 'Required tables not found' };
    }

    // Combine data from both tables
    const allPeople = [...stdnts2.data, ...celebrities.data];
    
    // Filter by interest and sort by followers
    const matches = allPeople
      .filter(p => p.hob.toLowerCase().includes(interest.toLowerCase()))
      .sort((a, b) => b.foll - a.foll);

    return {
      columns: ['NAME', 'FOLL'],
      rows: matches.map(person => [person.name, person.foll.toLocaleString()])
    };
  }

  executeYouMayLikeQuery(personName: string): QueryResult {
    const stdnts2 = this.tables.find(t => t.name === 'stdnts2');
    const celebrities = this.tables.find(t => t.name === 'celebrities');
    
    if (!stdnts2 || !celebrities) {
      return { columns: [], rows: [], message: 'Required tables not found' };
    }

    const person = stdnts2.data.find(p => p.name.toLowerCase() === personName.toLowerCase());
    if (!person) {
      return { columns: ['NAME', 'FOLL'], rows: [], message: `Person ${personName} not found` };
    }

    // Find person's friend
    const friend = stdnts2.data.find(p => p.id === person.frnd_id);
    if (!friend) {
      return { columns: ['NAME', 'FOLL'], rows: [], message: `Friend not found for ${personName}` };
    }

    // Find people with same hobby as friend
    const allPeople = [...stdnts2.data, ...celebrities.data];
    const suggestions = allPeople
      .filter(p => p.hob === friend.hob && p.name !== personName)
      .sort((a, b) => b.foll - a.foll);

    return {
      columns: ['NAME', 'FOLL'],
      rows: suggestions.map(person => [person.name, person.foll.toLocaleString()])
    };
  }
}