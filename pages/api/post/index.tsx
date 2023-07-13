import type { NextApiRequest, NextApiResponse } from 'next'
import { PostType } from '@/interface/dbtype';
import dbConnect from '@/helper/db-connect';
import { getServerSession } from "next-auth/next";
import authOptions from "@/pages/api/auth/[...nextauth]";

export async function getPostList() {
  const { client, db } = await dbConnect();
  const data = await db.collection('post').find().sort({ date: -1 }).toArray();
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { client, db } = await dbConnect();
  const session: any = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    res.status(200).json({
      message: "글 목록 조회 완료",
      postList: await getPostList(),
    });
  }
  else if (req.method === 'POST') {
    const newPost: PostType = { ...req.body, writer: session.user.name, writerImage: session.user.image };
    if(!session){
      res.status(401).json({ message: "권한 없음" });
    }
    else if (!newPost.title.trim() || !newPost.content.trim() || !newPost.date) {
      res.status(400).json({ message: "누락되거나 비어 있는 데이터의 요청" });
    }
    else if (newPost.title.length > 50 || newPost.content.length > 200) {
      res.status(403).json({ message: "용량 초과 (제목은 50자 이하, 내용은 200자 이하)" });
    }
    else {
      try {
        await db.collection('post').insertOne(newPost);
        res.status(201).json({ message: "글 작성 완료" });
      } catch (error) {
        res.status(500).json({ message: "서버 네트워크 오류" })
      }
    }
  }
  else {
    res.status(405).json({ message: "잘못된 요청", })
  }
  client.close();
}