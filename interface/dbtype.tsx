export interface PostType {
  id: string;
  writer: string;
  writerImage: string;
  title: string;
  content: string;
  date: number;
}

export interface CommentType {
  id: string;
  postId: string;
  writer: string;
  writerImage: string;
  content: string;
  date: number;
}