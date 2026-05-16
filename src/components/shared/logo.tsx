import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
export default function Logo() {
  return (
  <Suspense>
    <Link href="/">
        <Image src="/logo.png" alt="Logo" width={100} height={100} priority />
      </Link>
  </Suspense>
  );
}
