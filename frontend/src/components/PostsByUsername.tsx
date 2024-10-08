import { PostTypes } from "@/types/postTypes";
import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { TbError404 as NotFoundIcon } from "react-icons/tb";
import PostItem from "./PostItem";
import PostsLoading from "./skeletons/PostsLoading";

export default function PostsByUsername({ username }: { username: string }) {
  const { data, isError, isPending } = useQuery<PostTypes[]>({
    queryKey: ["posts/username", username],
    queryFn: async () => {
      return await fetcher.post("/posts/get-posts-by-username", { username });
    },
  });

  if (isError) return "error";
  if (isPending) return <PostsLoading />;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="-mb-4 text-xl font-bold text-gray-600">
        All Posts by u/{username}
      </h1>
      {data.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <NotFoundIcon className="text-[200px] text-secondary" />
          <p>u/{username} hasn&apos;t created any post yet</p>
        </div>
      ) : (
        data.map((post) => <PostItem post={post} key={post._id} />)
      )}
    </div>
  );
}
