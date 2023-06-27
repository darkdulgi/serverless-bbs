import Link from "next/link";

interface PostType {
  id: number;
  writer: string;
  title: string;
  content: string;
}

export default function Index({ postList }: any) {
  return (
    <div className="mt-5 mx-auto w-full max-w-5xl">
      <div className="grid gap-5">
        {postList.map((post: PostType) =>
          <Link
            className="border flex rounded-3xl p-5 justify-between"
            key={post.id}
            href={`/${post.id}`}>

            <div className="grid max-w-xl">
              <span className="font-semibold text-2xl text-gray-700">
                {post.title}
              </span>

              <span className="text-gray-700">
                {post.content}
              </span>
            </div>

            <div className="text-gray-700 flex content-end items-end">
              <span>
                {post.writer}
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const data: PostType[] = [
    {
      id: 1,
      writer: "darkdulgi",
      title: "안녕하세요ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
      content: "잘부탁드립니다!ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
    },
    {
      id: 2,
      writer: "daniel",
      title: "저는",
      content: "닭둘기라고합니다!",
    },
  ];

  return {
    props: {
      postList: data,
    }
  }
}