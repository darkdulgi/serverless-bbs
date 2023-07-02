import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export function getPostList(){
  // DB 연결
  const data = [
    {
      id: 1,
      writer: "darkdulgi",
      title: "안녕하세요!",
      content: "더미데이터",
      date: 1234,
      numOfComment: 3,
    },
  ];

  return data;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'GET') {
    // DB
    res.status(200).json({ message: "good" });
  }
  else {
    res.status(400).json({message:"400 Bad Request"});
  }
}