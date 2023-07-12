import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import axios from "axios";
import { CommentType } from "@/interface/dbtype";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { register, handleSubmit, } = useForm();

  const { data: post, isValidating: postIsValidating } = useSWR(id ? '/api/post/' + id : null,
    id ? (url) => axios.get(url).then((res) => res.data.post) : null);
  const { data: commentList, isValidating: commentIsValidating } = useSWR(id ? '/api/comment/?postId=' + id : null,
    id ? (url) => axios.get(url).then((res) => res.data.commentList) : null);

  if (!router.isReady || postIsValidating || commentIsValidating) return <>로딩 중..</>;

  const onSubmit = (data: any) => {
    const newComment: CommentType = {
      postId: id as string,
      content: data.comment.trim(),
      writer: session?.user?.name as string,
      writerImage: session?.user?.image as string,
      date: new Date().getTime(),
    };
    if (session) {
      axios.post('/api/comment', newComment)
        .then(() => router.reload())
        .catch((error) => alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message));
    }
    else alert("로그인이 필요합니다.");
  };

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
              {new Date(post.date).toLocaleString()}
            </div>
          </div>

        </div>

        <div className="text-lg whitespace-pre-line">
          {post.content}
        </div>
      </div>

      <div className="flex gap-1 items-center mt-5 text-xl text-gray-600">
        <img className="h-8 w-8" src="/comment.png" />
        <span>댓글({commentList.length})</span>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {commentList.map((comment: any) =>
          <div key={comment._id} className="border rounded-md p-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1 text-gray-700">
                <img src={comment.writerImage} className="rounded-full h-6 w-6" />
                {comment.writer}
              </div>

              <span className="text-xs text-gray-400">
                {new Date(comment.date).toLocaleString()}
              </span>
            </div>

            <span>
              {comment.content}
            </span>
          </div>
        )}
      </div>

      <form className="mt-5 flex justify-between">
        <input
          type="text"
          placeholder="댓글을 작성하세요. (100자 이하, 로그인 필요)"
          disabled={session ? false : true}
          className="bg-slate-100 w-full rounded-md p-2 text-sm focus:outline-sky-500 focus:outline-2 focus:bg-white text-gray-700"
          {...register("comment", { required: true })} />

        <button
          className="rounded-md p-2 w-24 bg-emerald-500 text-white text-sm transition duration-300 hover:bg-red-500 font-semibold"
          onClick={handleSubmit(onSubmit)}>
          댓글 작성
        </button>
      </form>
    </>
  );
}