import { useFetch } from '../hooks/useFetch.js';

type Suggestion = { title: string; reason: string };
type SuggestionsResponse = { suggestions: Suggestion[] };

const USER_EMAIL = 'mona@example.com';

export default function Workouts() {
  const state = useFetch<SuggestionsResponse>(`/api/workouts/suggestions/${encodeURIComponent(USER_EMAIL)}`);

  if (state.loading) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Workout suggestions</h2>
          <p role="status">Loading workout suggestions...</p>
        </div>
      </section>
    );
  }

  if ('error' in state) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Workout suggestions</h2>
          <div role="alert" className="alert alert-danger">
            Unable to load workout suggestions. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const { suggestions } = state.data;

  if (suggestions.length === 0) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Workout suggestions</h2>
          <p>No workout suggestions available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <div className="list-group">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="list-group-item">
              <div>
                <strong>{suggestion.title}</strong>
                <p className="small text-muted mt-1 mb-0">{suggestion.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

