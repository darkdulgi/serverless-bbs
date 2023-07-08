import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react"
import { getPostList } from "@/pages/api/post";
import { PostType } from "@/interface/dbtype";

export default function Index({ postList }: { postList: PostType[] }) {
  const { data: session } = useSession();
  const [formVisible, setFormVisible] = useState(false);
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const router = useRouter();

  const onSubmit = (data: any) => {
    const newPost = {
      title: data.title,
      content: data.content,
      writer: session?.user?.name,
      writerImage: session?.user?.image,
      date: new Date().toLocaleString(),
    }
    if (confirm('이대로 글을 작성하시겠습니까?')) {
      axios.post("/api/post", newPost)
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          alert('코드 에러 ' + error.response.status + ': ' + error.response.data.message);
        });
    }
  };

  return <>
    <div className="grid gap-5">
      {postList.map((post: any) =>
        <Link
          className="border flex flex-col rounded-3xl p-3 duration-300 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100"
          key={post._id}
          href={`/post/${post._id}`}>

          <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-gray-200 text-gray-700">
            <span className="font-semibold text-2xl">
              {post.title}
            </span>

            <span className="">
              {post.content}
            </span>
          </div>

          <div className="text-gray-500 self-end flex items-center">
            <span className="text-sm mr-2">
              {post.date}
            </span>
            <img className="object-cover h-8 w-8 mr-1 rounded-full border border-white" src={post.writerImage} />
            <span className="font-semibold">
              {post.writer}
            </span>
          </div>
        </Link>
      )}
    </div>

    <div className="absolute bottom-8 right-0 px-8 flex flex-col gap-5 items-end w-full max-w-xl">
      <form className={`${formVisible ? "" : "invisible"} bg-white w-full flex flex-col gap-3 items-end border border-sky-300 rounded-3xl p-5 shadow-lg shadow-sky-200`}>
        <span className="self-start text-xl font-bold text-sky-700">
          글 작성하기
        </span>

        <input
          {...register("title", { required: true })}
          className="p-2 w-full rounded-xl outline-none bg-slate-100 focus:outline-sky-500 focus:outline-2 focus:bg-white text-gray-700"
          type="text"
          placeholder="제목을 입력하세요."
        />

        <textarea
          {...register("content", { required: true })}
          className="resize-none w-full h-64 p-2 rounded-xl outline-none bg-slate-100 focus:outline-sky-500 focus:outline-2 focus:bg-white text-gray-700"
          placeholder="내용을 입력하세요."
        />

        <button
          className="bg-sky-500 text-white font-semibold p-2 shadow-md rounded-lg hover:bg-emerald-500  focus:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
          onClick={handleSubmit(onSubmit)}>
          제출
        </button>
      </form>

      <img
        className="h-14 hover:scale-110 duration-300 ease-out cursor-pointer"
        src="https://www.svgrepo.com/show/121490/pencil.svg"
        onClick={() => {
          if (session) setFormVisible(!formVisible);
          else alert("글을 작성하려면 먼저 로그인을 해야 합니다.");
        }}
      />
    </div>

  </>;
}

export async function getStaticProps() {
  const data = await getPostList();
  return {
    props: {
      postList: data,
    },
    revalidate: 1,
  }
}