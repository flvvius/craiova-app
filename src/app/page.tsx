import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Craiova App</h1>
      <Image
        src="/assets/olguta.jpg"
        alt="craiova"
        width={500}
        height={500}
      />
    </main>
  );
}
