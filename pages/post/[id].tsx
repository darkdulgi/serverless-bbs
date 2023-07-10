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
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const { data: post, isValidating } = useSWR('/api/post/' + id,
    id ? (url) => axios.get(url).then((res) => res.data.post) : null);

  if (!router.isReady || isValidating) return <>로딩 중..</>;

  const onSubmit = (data: any) => {
    const newComment: CommentType = {
      postId: id as string,
      content: data.comment.trim(),
      writer: session?.user?.name as string,
      writerImage: session?.user?.image as string,
      date: new Date().getTime(),
    }
    axios.post('/api/comment', newComment)
      .then(() => router.reload())
      .catch((error) => alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message))
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
        <span>댓글</span>
      </div>

      <form className="border">
        <input
          type="text"
          className="resize-none w-full bg-slate-100 focus:outline-sky-500 focus:outline-2 focus:bg-white text-gray-700"
          {...register("comment", { required: true })} />

        <button
          className="border border-black"
          onClick={handleSubmit(onSubmit)}>
          제출
        </button>
      </form>
    </>
  );
}