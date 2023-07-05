import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-emerald-600 shadow-md shadow-indigo-200 h-20 text-white flex justify-between items-center font-bold">
      <div className="px-5 text-2xl">
        <Link href='/'>
          서버리스 게시판
        </Link>
      </div>
      
      <div className="px-5 flex gap-5">

        <div className={`flex gap-2 items-center ${session ? "" : "hidden"}`}>
          <img src={session?.user?.image as string} className="object-cover h-8 w-8 rounded-full border-2 border-sky-300"/>
          <span>{session?.user?.name}</span>
        </div>

        <button
          className="flex gap-1 items-center"
          onClick={() => session ? signOut() : signIn("kakao") }>
          <img src={session ? "logout.svg" : "login.svg"} className="h-8" />
          <span>{session ? "로그아웃" : "로그인"}</span>
        </button>

      </div>
    </nav>
  );
}