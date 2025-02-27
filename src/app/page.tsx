import { db } from "~/server/db";
import { Map } from "./_components/Map";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  return (
    <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* <h1>Craiova App</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.name}</h2>
        </div>
      ))} */}
      <div className="h-full w-full">
        <Map center={{ lat: 44.316, lng: 23.796 }} zoom={13} />
      </div>
    </main>
  );
}
