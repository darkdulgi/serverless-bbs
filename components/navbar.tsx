import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-center shadow-md shadow-indigo-200 h-40 text-white flex justify-between items-center font-bold" style={{backgroundImage:"url('/city.jpg')",}}>
      <span className="px-5 text-xl md:text-3xl">
        <Link href='/'>
          Next.js를 활용한 서버리스 게시판
        </Link>
      </span>

      <div className="px-5 flex gap-5">
        <Link href='/mypage' className={`flex gap-2 items-center ${session ? "" : "hidden"}`}>
          <img src={session?.user?.image as string} className="object-cover h-8 w-8 rounded-full border-2 border-sky-300" />
          <span className="hidden md:inline">{session?.user?.name}</span>
        </Link>

        <button
          className="flex gap-1 items-center"
          onClick={() => session ? signOut() : signIn("google")}>
          <img src={session ? "/logout.png" : "/login.png"} className="h-8" />
          <span>{session ? "로그아웃" : "로그인"}</span>
        </button>
      </div>
    </nav>
  );
}