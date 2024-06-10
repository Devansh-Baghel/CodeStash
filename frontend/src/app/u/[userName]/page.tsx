export default function UserProfile({
  params,
}: {
  params: { userName: string };
}) {
  return <div>{params.userName}</div>;
}
