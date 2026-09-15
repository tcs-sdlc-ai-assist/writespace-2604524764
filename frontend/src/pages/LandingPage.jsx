import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import PublicNavbar from '../components/PublicNavbar';
import { getPosts } from '../utils/storage';

const features = [
  {
    accent: 'bg-indigo-100 text-indigo-700',
    description: 'A focused plain-text canvas that keeps your words at the center.',
    label: '01',
    title: 'Write Freely',
  },
  {
    accent: 'bg-violet-100 text-violet-700',
    description: 'Your posts stay in this browser—private, portable, and yours.',
    label: '02',
    title: 'Private & Local',
  },
  {
    accent: 'bg-pink-100 text-pink-700',
    description: 'No server wait. Open your space and start shaping a thought.',
    label: '03',
    title: 'Instant & Fast',
  },
];

/**
 * Sort posts newest first and limit the public preview to three records.
 *
 * @param {Array<object>} posts Stored post records.
 * @returns {Array<object>} Safe, latest-first preview records.
 */
function getLatestPosts(posts) {
  return [...posts]
    .sort((firstPost, secondPost) => {
      const firstTime = new Date(firstPost.createdAt).getTime() || 0;
      const secondTime = new Date(secondPost.createdAt).getTime() || 0;
      return secondTime - firstTime;
    })
    .slice(0, 3);
}

/**
 * Render the public WriteSpace discovery page and locally persisted post preview.
 *
 * @param {{ session: object|null }} props Component properties.
 * @returns {JSX.Element} Public landing page.
 */
export default function LandingPage({ session }) {
  const latestPosts = getLatestPosts(getPosts());
  const readingPath = session ? '/blogs' : '/login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PublicNavbar session={session} />
      <main>
        <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4 py-20 sm:px-6">
          <div className="absolute inset-0 bg-slate-950/10" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-100">A local home for words</p>
              <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                WriteSpace
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-8 text-indigo-50 sm:text-2xl">
                Your thoughts. Your space. Beautifully simple.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={readingPath}
                  className="rounded-full bg-white px-6 py-3 text-center font-bold text-indigo-700 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                >
                  Start Reading
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-white/70 bg-white/10 px-6 py-3 text-center font-bold text-white shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md" aria-hidden="true">
              <div className="animate-bounce rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur" style={{ animationDuration: '4s' }}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-700">Draft</span>
                  <span className="h-3 w-3 rounded-full bg-teal-400" />
                </div>
                <div className="mt-8 h-4 w-2/3 rounded-full bg-indigo-900" />
                <div className="mt-4 h-3 w-full rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-5/6 rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-3/4 rounded-full bg-slate-200" />
                <div className="mt-9 flex items-center gap-3 border-t border-slate-200 pt-5">
                  <span className="h-9 w-9 rounded-full bg-violet-600" />
                  <span className="h-3 w-24 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">Made for your next thought</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">A writing space without the noise.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold tracking-wider ${feature.accent}`}>
                  {feature.label}
                </span>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">From this browser</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Latest writing</h2>
              </div>
              <Link to={readingPath} className="text-sm font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4 hover:text-indigo-900">
                Read all posts
              </Link>
            </div>
            {latestPosts.length > 0 ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-lg font-medium text-slate-600">
                No posts yet — check back soon!
              </p>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-slate-900 px-4 py-10 text-slate-200 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-white">WriteSpace</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to={readingPath} className="hover:text-white">All Blogs</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </nav>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} WriteSpace</p>
        </div>
      </footer>
    </div>
  );
}

LandingPage.propTypes = {
  session: PropTypes.shape({
    displayName: PropTypes.string,
    role: PropTypes.string,
    username: PropTypes.string,
  }),
};

LandingPage.defaultProps = {
  session: null,
};
