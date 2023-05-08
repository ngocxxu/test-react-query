import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';

const POSTS = [
  { id: 1, title: 'post 1' },
  { id: 2, title: 'post 2' },
];

function App() {
  const queryClient = useQueryClient();

  // Auto fetch when slate changed
  queryClient.getQueryCache();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) =>
      wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title })),
    onSuccess: () => {
      console.log(queryClient.invalidateQueries(['posts']));
      queryClient.invalidateQueries(['posts']);
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate('hello')}
      >
        Add New
      </button>
    </div>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
