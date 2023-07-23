import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getPost } from '@/pages/api/post/[id]'
import { getCommentList } from '@/pages/api/comment'
import { useState } from "react";

export default function Index({ post, commentList }: any) {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { register, handleSubmit, } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    const newComment = {
      postId: id as string,
      content: data.comment.trim(),
      date: new Date().getTime(),
    };
    if (session) {
      setLoading(true);
      axios.post('/api/comment', newComment)
        .then(() => router.reload())
        .catch((error) => {
          alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message);
          setLoading(false);
        })
    }
    else alert("로그인이 필요합니다.");
  };

  const onDelete = () => {
    if (session?.user?.email !== post.writerEmail) {
      alert('로그인하지 않았거나 본인의 게시물이 아닙니다.');
    }
    else if (confirm("글을 삭제하시겠습니까?")) {
      setLoading(true);
      axios.delete('/api/post/' + id)
        .then(() => router.push('/'))
        .catch((error) => {
          alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message);
          setLoading(false);
        })
    }
  };

  const onCommentDelete = (commentId: string) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      setLoading(true);
      axios.delete('/api/comment',{
        params:{
          _id: commentId,
        }
      })
        .then(() => router.reload())
        .catch((error) => {
          alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message);
          setLoading(false);
        })
    }
  };

  return (
    <>
      <div className="border rounded-2xl p-4 gap-3 flex flex-col">
        <div className="font-semibold text-3xl">
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

      <div className="flex justify-end">
        <button
          className={`p-2 rounded-md text-sm ${loading ? "bg-red-400 border-none" : "hover:bg-red-500 hover:text-white hover:font-bold border border-red-600 bg-white text-red-600 transition active:bg-red-700 active:ring-4 active:ring-red-500 active:ring-opacity-50 "}`}
          onClick={onDelete}
          disabled={loading}>
          {loading ? <img src="/loading.svg" className="h-5 animate-spin" /> : "글 삭제"}
        </button>
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

            <div className="flex justify-between">
              <span>
                {comment.content}
              </span>

              <img
                src="/trash.svg"
                className={`h-6 cursor-pointer ${comment.writerEmail !== session?.user?.email ? "hidden" : ""}`}
                onClick={(e)=>{onCommentDelete(comment._id)}}
              />
            </div>
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
          className={`rounded-md p-2 w-24 flex justify-center ${loading ? "bg-red-400" : "hover:bg-red-500 bg-emerald-500 text-white text-sm transition duration-300 font-semibold"}`}
          onClick={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? <img src="/loading.svg" className="h-5 animate-spin" /> : "댓글 작성"}
        </button>
      </form>
    </>
  );
}

export async function getServerSideProps({ params }: any) {
  const _post = await getPost(params.id);
  const _commentList = await getCommentList({ postId: params.id });
  return {
    props: {
      post: _post,
      commentList: _commentList,
    },
  }
}