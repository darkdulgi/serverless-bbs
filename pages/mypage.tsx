import RedirectPage from "@/pages/redirectPage";
import { useEffect, useState } from "react";
import axios from "axios";
import authOptions from "./api/auth/[...nextauth]"
import { getServerSession } from "next-auth";
import Link from "next/link";

export default function MyPage({ session }: any) {
  const [postList, setPostList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    if (session) {
      axios.get('/api/post', { params: { writerEmail: session?.user?.email } })
        .then((res) => setPostList(res.data.postList))
        .catch((error) => alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message));
      axios.get('/api/comment', { params: { writerEmail: session?.user?.email } })
        .then((res) => setCommentList(res.data.commentList))
        .catch((error) => alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message));
    }
  }, [session]);

  if (!session) return <RedirectPage />;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">마이페이지</span>

      <div className="border flex rounded-lg p-5 gap-3">
        <img className="rounded-lg h-16" src={session?.user?.image as string} alt="프로필사진" />

        <div className="flex flex-col">
          <span className="text-gray-700 text-xl">
            {session?.user?.name}
          </span>

          <span className="text-gray-500 text-sm">
            {session?.user?.email}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-bold mb-2 text-lg">
            나의 글 ({postList.length})
          </p>

          <div className="border grid px-2 rounded-lg divide-y">
            {postList.map((post: any) =>
              <Link
                key={post._id}
                href={'/post/' + post._id}
                className="flex justify-between py-1 items-center">
                <span>
                  {post.title}
                </span>

                <span className="text-xs text-gray-500 min-w-fit">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div>
          <p className="font-bold mb-2 text-lg">
            나의 댓글 ({commentList.length})
          </p>

          <div className="border grid px-2 rounded-lg divide-y">
            {commentList.map((comment: any) =>
              <Link
                key={comment._id}
                href={'/post/' + comment.postId}
                className="flex justify-between py-1 items-center">
                <span>
                  {comment.content}
                </span>

                <span className="text-xs text-gray-500 min-w-fit">
                  {new Date(comment.date).toLocaleDateString()}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}