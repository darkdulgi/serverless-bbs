import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyPage() {
  const { data: session } = useSession();
  if(!session) return redirectPage();

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
    </div>
  );
}

const redirectPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, []);
  return <></>;
}