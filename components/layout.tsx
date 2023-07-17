import Head from "next/head"
import NavBar from "./navbar"

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Head> 
        <title>게시판</title>
        <meta name="description" content="서버리스 게시판입니다." />
        <meta name="icon" content="favicon.svg" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <NavBar />
      <div className="mt-5 mx-auto w-full max-w-5xl">
        {children}
      </div>
    </>
  );
}