import { MongoClient } from 'mongodb';

export default async function dbConnect() {
  const _client = await MongoClient.connect(process.env.MONGODB_CONNECT as string);
  const _db = _client.db();
  return {
    client: _client,
    db: _db,
  }
}