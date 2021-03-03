import User from './User';

export default interface Comment {
  id: number;
  node_id: string;
  created_at: Date;
  updated_at: Date;
  body: string;
  user: User;
}
