import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

/**
 * Render a create or authorized edit form for locally persisted blog posts.
 *
 * @returns {JSX.Element} Blog editor or a safe redirect when editing is unavailable.
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const existingPost = id ? getPosts().find((candidate) => candidate.id === id) : null;
  const isEditing = Boolean(id);
  const isAuthorizedEditor = !isEditing || Boolean(
    existingPost && session && (session.role === 'Admin' || existingPost.authorId === session.userId),
  );
  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');

  if (isEditing && (!existingPost || !isAuthorizedEditor)) {
    return <Navigate to="/blogs" replace />;
  }

  /**
   * Validate fields, persist the post, and navigate to its reading view.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submitted form event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();

    if (!normalizedTitle) {
      nextErrors.title = 'Title is required.';
    }

    if (!normalizedContent) {
      nextErrors.content = 'Content is required.';
    }

    setErrors(nextErrors);
    setSaveError('');

    if (Object.keys(nextErrors).length > 0 || !session) {
      return;
    }

    const posts = getPosts();
    const post = isEditing
      ? { ...existingPost, title: normalizedTitle, content: normalizedContent }
      : {
          id: crypto.randomUUID(),
          title: normalizedTitle,
          content: normalizedContent,
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName || session.username,
          authorRole: session.role,
        };
    const updatedPosts = isEditing
      ? posts.map((candidate) => (candidate.id === existingPost.id ? post : candidate))
      : [...posts, post];

    if (!savePosts(updatedPosts)) {
      setSaveError('We could not save your post. Please try again.');
      return;
    }

    navigate(`/blog/${post.id}`);
  }

  /**
   * Clear a field-specific error after the writer changes its value.
   *
   * @param {string} fieldName Field name to clear.
   * @returns {void}
   */
  function clearFieldError(fieldName) {
    setErrors((currentErrors) => ({ ...currentErrors, [fieldName]: '' }));
  }

  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="editor-heading">
      <Link
        to="/blogs"
        className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
      >
        Cancel
      </Link>
      <div className="mt-8 border-b border-slate-200 pb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Writing desk</p>
        <h1 id="editor-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{isEditing ? 'Edit blog' : 'Write a blog'}</h1>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="blog-title" className="block text-sm font-semibold text-slate-800">Title</label>
          <input
            id="blog-title"
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              clearFieldError('title');
            }}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'blog-title-error' : undefined}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition-colors duration-150 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.title && <p id="blog-title-error" role="alert" className="mt-2 text-sm text-rose-700">{errors.title}</p>}
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="blog-content" className="block text-sm font-semibold text-slate-800">Content</label>
            <span className="text-sm tabular-nums text-slate-500">{content.length} characters</span>
          </div>
          <textarea
            id="blog-content"
            name="content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              clearFieldError('content');
            }}
            aria-required="true"
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? 'blog-content-error' : undefined}
            rows={14}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition-colors duration-150 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200"
          />
          {errors.content && <p id="blog-content-error" role="alert" className="mt-2 text-sm text-rose-700">{errors.content}</p>}
        </div>
        {saveError && <p role="alert" className="text-sm text-rose-700">{saveError}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            {isEditing ? 'Save changes' : 'Publish blog'}
          </button>
          <Link
            to="/blogs"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
