import { useState } from 'react';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { login: 'user1', role: 'USER' };
  });

  const handleAddPost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      content: newPost.trim(),
      createdAt: new Date().toLocaleString('ru-RU')
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const handleDeletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="container">
      <header>
        <h1>Dashboard</h1>
        <button 
          className="btn logout"
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
        >
          Выйти
        </button>
      </header>

      <div className="card">
        <h2>Профиль</h2>
        <p><strong>Логин:</strong> {user.login}</p>
        <p><strong>Роль:</strong> {user.role}</p>
      </div>

      <div className="card post-form">
        <h2>Новый пост</h2>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Введите текст поста..."
          rows="3"
        />
        <button 
          className="btn" 
          style={{ backgroundColor: '#1976d2', color: 'white' }}
          onClick={handleAddPost}
        >
          Добавить пост
        </button>
      </div>

      <div className="card posts-list">
        <h2>Ваши посты ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="empty-posts">У вас пока нет постов. Добавьте первый!</p>
        ) : (
          <div className="posts-container">
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <div className="post-content">{post.content}</div>
                <div className="post-meta">
                  <span>{post.createdAt}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}