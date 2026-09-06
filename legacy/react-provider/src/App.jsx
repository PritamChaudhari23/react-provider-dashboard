// App.jsx
import Header from './components/Header';
import LoginPanel from './components/LoginPanel';
import StatusBar from './components/StatusBar';
import SecretAction from './components/SecretAction';
import PostsAction from './components/PostsAction';
import PostsList from './components/PostsList';
import ModalTrigger from './components/ModalTrigger';

export default function App() {
  return (
    <div>
      <Header />
      <LoginPanel />
      <StatusBar />

      <hr />

      <SecretAction />
      <ModalTrigger />

      <hr />

      <PostsAction />
      <PostsList />
    </div>
  );
}
