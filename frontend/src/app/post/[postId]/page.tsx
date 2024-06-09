export default function Post({ params }: { params: { postId: string } }) {
  return <p>Post: {params.postId}</p>;
}
