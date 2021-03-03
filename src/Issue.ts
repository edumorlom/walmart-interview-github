import User from './User';

export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: 'open' | 'closed';
  locked: boolean;
  comments: number;
  created_at: Date;
  updated_at: Date;
  body: string;
}

export interface Label {
  name: string;
  color: string;
}
