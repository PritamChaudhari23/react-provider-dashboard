// components/PostsList.jsx
import { useData } from '../providers/DataProvider';

export default function PostsList() {
  const { posts } = useData();

  if (posts.length === 0) {
    return <p>No posts loaded</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
