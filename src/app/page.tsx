import Image from "next/image";
import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Craiova App</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.name}</h2>
        </div>
      ))}
      <Image src="/assets/olguta.jpg" alt="craiova" width={500} height={500} />
    </main>
  );
}
