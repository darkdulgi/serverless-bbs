import type { NextApiRequest, NextApiResponse } from 'next'
import { PostType } from '@/interface/dbtype';
import dbConnect from '@/helper/db-connect';

export async function getPostList() {
  const { client, db } = await dbConnect();
  const data = await db.collection('post').find().sort({ date: -1 }).toArray();
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { client, db } = await dbConnect();

  if (req.method === 'GET') {
    res.status(200).json({
      message: "글 목록 조회 완료",
      postList: await getPostList(),
    });
  }
  else if (req.method === 'POST') {
    const newPost: PostType = req.body;
    newPost.title = newPost.title.trim();
    newPost.content = newPost.content.trim();
    if (!newPost.title || !newPost.content || !newPost.writer.trim() || !newPost.writerImage.trim() || !newPost.date.trim()) {
      res.status(400).json({ message: "누락되거나 비어 있는 데이터의 요청" });
    }
    else if (newPost.title.length > 50 || newPost.content.length > 200) {
      res.status(403).json({ message: "용량 초과 (제목은 50자 이하, 내용은 200자 이하)" });
    }
    else {
      try {
        await db.collection('post').insertOne(newPost);
      } catch (error) {
        res.status(500).json({ message: "서버 네트워크 오류" })
        client.close();
        return;
      }
      res.status(201).json({ message: "글 작성 완료" });
    }
  }
  else {
    res.status(405).json({ message: "잘못된 요청", })
  }
  client.close();
}