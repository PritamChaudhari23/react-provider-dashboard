// components/PostsAction.jsx
import { useData } from '../providers/DataProvider';

export default function PostsAction() {
  const { fetchPosts } = useData();

  return <button onClick={fetchPosts}>Load Posts</button>;
}
