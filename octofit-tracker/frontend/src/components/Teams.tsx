import { useFetch } from '../hooks/useFetch.js';

type Team = { name: string; members: string[] };
type TeamsResponse = { teams: Team[] };

export default function Teams() {
  const state = useFetch<TeamsResponse>('/api/teams');

  if (state.loading) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Teams</h2>
          <p role="status">Loading teams...</p>
        </div>
      </section>
    );
  }

  if ('error' in state) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Teams</h2>
          <div role="alert" className="alert alert-danger">
            Unable to load teams. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const { teams } = state.data;

  if (teams.length === 0) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Teams</h2>
          <p>No teams created yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-body">
        <h2 className="h4">Teams</h2>
        <div className="list-group">
          {teams.map((team, idx) => (
            <div key={idx} className="list-group-item">
              <div>
                <strong>{team.name}</strong>
                <div className="small text-muted mt-1">
                  {team.members.length > 0 ? `${team.members.length} member${team.members.length !== 1 ? 's' : ''}` : 'No members'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

