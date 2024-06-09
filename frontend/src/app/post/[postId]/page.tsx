export default async function Post({ params }: { params: { postId: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return <p>Post: {params.postId}</p>;
}
