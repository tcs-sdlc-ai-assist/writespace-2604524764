import PropTypes from 'prop-types';

/**
 * Present a compact dashboard statistic with a readable label and value.
 *
 * @param {{ label: string, value: number }} props Statistic properties.
 * @returns {JSX.Element} Statistic card.
 */
export default function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
    </article>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
