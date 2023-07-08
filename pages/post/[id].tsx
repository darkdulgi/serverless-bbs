import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from 'swr';
import axios from "axios";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: post, isValidating } = useSWR('/api/post/' + id,
    id ? (url) => axios.get(url).then((res) => res.data.post) : null);
    
  if (!router.isReady || isValidating) return <>로딩 중..</>;

  return (
    <>
      <div className="border rounded-2xl p-4 gap-3 flex flex-col">
        <div className="font-semibold text-4xl">
          {post.title}
        </div>

        <div className="flex items-center gap-2 border-b border-gray-200 pb-5">
          <img className="h-10 w-10 object-cover rounded-full" src={post.writerImage} alt="프로필사진" />

          <div>
            <div className="font-semibold">
              {post.writer}
            </div>
            <div className="text-gray-600 text-sm">
              {post.date}
            </div>
          </div>

        </div>

        <div className="text-lg">
          {post.content}
        </div>
      </div>
    </>
  );
}