import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb';

export async function getPostList(){
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT as string);
  const db = client.db();
  const data = await db.collection('post').find().toArray();
  client.close();
  return JSON.parse(JSON.stringify(data));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT as string);
  const db = client.db();
  
  if (req.method === 'GET') {
    res.status(200).json({
      message: "글 목록 조회 완료",
      data: await getPostList(),
    });
  }
  else if(req.method === 'POST'){
    const newPost = req.body;
    //유효성 검사
    const result = await db.collection('post').insertOne(newPost);
    console.log(result);
    res.status(200).json({
      message: "글 작성 완료",
    });
  }
  else{
    res.status(400).json({
      message: "정의되지 않은 요청",
    })
  }
  client.close();
}