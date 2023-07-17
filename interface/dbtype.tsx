export interface PostType {
  writer: string;
  writerEmail: string;
  writerImage: string;
  title: string;
  content: string;
  date: number;
}

export interface CommentType {
  postId: string;
  writer: string;
  writerEmail: string;
  writerImage: string;
  content: string;
  date: number;
}