import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb';
import dbConnect from '@/helper/db-connect';

export async function getPost(id: string) {
  const { client, db } = await dbConnect();
  const data = await db.collection('post').findOne(new ObjectId(id as string));
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { id } = req.query;

  if (req.method === 'GET') {
    res.status(200).json({
      message: "글 로드 완료",
      post: await getPost(id as string),
    });
  }
  else {
    res.status(405).json({ message: "잘못된 요청", })
  }
}