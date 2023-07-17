import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb';
import dbConnect from '@/helper/db-connect';
import { getServerSession } from "next-auth/next";
import authOptions from "@/pages/api/auth/[...nextauth]";

export async function getPost(id: string) {
  const { client, db } = await dbConnect();
  const data = await db.collection('post').findOne(new ObjectId(id as string));
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { id } = req.query;
  const session: any = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    res.status(200).json({
      message: "글 로드 완료",
      post: await getPost(id as string),
    });
  }
  else if (req.method === 'DELETE') {
    const post = await getPost(id as string);
    if (post.writerEmail !== session?.user?.email) {
      res.status(401).json({ message: "권한 없음" });
    }
    else {
      const { client, db } = await dbConnect();
      await db.collection('post').deleteOne({ _id: new ObjectId(id as string) });
      await db.collection('comment').deleteMany({ postId: id });
      client.close();
      res.status(200).json({ message: "글 삭제 완료" });
    }
  }
  else {
    res.status(405).json({ message: "잘못된 요청", })
  }
}