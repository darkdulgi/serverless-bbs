import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { id } = req.query;
  let client: any;
  try {
    client = await MongoClient.connect(process.env.MONGODB_CONNECT as string);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" })
    return;
  };

  const db = client.db();
  const _post = await db.collection('post').findOne(new ObjectId(id as string));
  res.status(200).json({
    message: "글 로드 완료",
    post: _post,
  });
  client.close();
}