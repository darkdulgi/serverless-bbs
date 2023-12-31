import type { NextApiRequest, NextApiResponse } from 'next'
import { CommentType } from '@/interface/dbtype';
import dbConnect from '@/helper/db-connect';
import { getServerSession } from "next-auth/next";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { ObjectId } from 'mongodb';

export async function getCommentList(params: any) {
  const { client, db } = await dbConnect();
  const data = await db.collection('comment').find(params).sort({ date: 1 }).toArray();
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { client, db } = await dbConnect();
  const session: any = await getServerSession(req, res, authOptions);
  let params: any = req.query;
  if (params._id) params._id = new ObjectId(params._id as string);

  if (req.method === 'GET') {
    res.status(200).json({ message: "댓글 로드 완료", commentList: await getCommentList(params) });
  }
  else if (req.method === 'DELETE') {
    await db.collection('comment').deleteOne(params);
    res.status(200).json({ message: "댓글 삭제 완료" });
  }
  else if (req.method === 'POST') {
    const newComment: CommentType = { ...req.body, writer: session?.user?.name, writerImage: session?.user?.image, writerEmail: session?.user?.email };
    if (!session) {
      res.status(401).json({ message: "권한 없음" });
    }
    else if (!newComment.postId.trim() || !newComment.content.trim() || !newComment.date) {
      res.status(400).json({ message: "누락되거나 비어 있는 데이터의 요청" });
    }
    else if (newComment.content.length > 100) {
      res.status(403).json({ message: "용량 초과 (댓글은 100자 이하)" });
    }
    else {
      try {
        await db.collection('comment').insertOne(newComment);
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