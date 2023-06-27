import Link from "next/link";

export default function NavBar(){
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-emerald-600 shadow-md shadow-indigo-200 h-20 text-white flex justify-between items-center font-bold">
      <div className="px-5 text-2xl">
        <Link href='/'>
          서버리스 게시판
        </Link>
      </div>
      <div className="px-5 flex gap-5">
        <span>로그인</span>
        <span>설정</span>
      </div>
    </nav>
  );
}