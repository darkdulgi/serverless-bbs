import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, []);
  return <></>;
}