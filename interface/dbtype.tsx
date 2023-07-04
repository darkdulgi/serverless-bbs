export interface PostType {
  writer: string;
  writerImage: string;
  title: string;
  content: string;
  date: string;
}

export interface CommentType {
  postId: string;
  writer: string;
  writerImage: string;
  content: string;
  date: string;
}