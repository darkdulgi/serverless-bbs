import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    // DB 연결
    res.status(200).json({ message: "good" });
  }
  else {
    res.status(400).json({message:"400 Bad Request"});
  }
}