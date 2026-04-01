import { PostPageClient } from "./PostPageClient";

type SP = Record<string, string | string[] | undefined>;

function pickSingle(v: string | string[] | undefined, fallback: string) {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length > 0) return v[0];
  return fallback;
}

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const issue = pickSingle(sp.issue, "");
  const author = pickSingle(sp.author, "高手");
  const topic = pickSingle(sp.topic, "高手资料");

  return <PostPageClient issue={issue} author={author} topic={topic} />;
}
