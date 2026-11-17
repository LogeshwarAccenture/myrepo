import { useFetch } from '../hooks/useFetch.js';

type LeaderboardEntry = { teamName: string; totalPoints: number; rank: number };
type LeaderboardResponse = { leaderboard: LeaderboardEntry[] };

export default function Leaderboard() {
  const state = useFetch<LeaderboardResponse>('/api/leaderboard');

  if (state.loading) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Leaderboard</h2>
          <p role="status">Loading leaderboard...</p>
        </div>
      </section>
    );
  }

  if ('error' in state) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Leaderboard</h2>
          <div role="alert" className="alert alert-danger">
            Unable to load leaderboard. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const { leaderboard } = state.data;

  if (leaderboard.length === 0) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Leaderboard</h2>
          <p>No rankings available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-body">
        <h2 className="h4">Leaderboard</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th className="text-end">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.rank}>
                <td>
                  <strong>#{entry.rank}</strong>
                </td>
                <td>{entry.teamName}</td>
                <td className="text-end">
                  <strong>{entry.totalPoints}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

