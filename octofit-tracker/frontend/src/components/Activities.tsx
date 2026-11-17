import { useFetch } from '../hooks/useFetch.js';

type Activity = { type: string; minutes: number; points: number };
type ActivityResponse = { activities: Activity[] };

export default function Activities() {
  const state = useFetch<ActivityResponse>('/api/activities');

  if (state.loading) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Activities</h2>
          <p role="status">Loading activities...</p>
        </div>
      </section>
    );
  }

  if ('error' in state) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Activities</h2>
          <div role="alert" className="alert alert-danger">
            Unable to load activities. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const { activities } = state.data;

  if (activities.length === 0) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h4">Activities</h2>
          <p>No activities recorded yet. Start tracking your workouts!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-body">
        <h2 className="h4">Activities</h2>
        <div className="list-group">
          {activities.map((activity, idx) => (
            <div key={idx} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-primary">{activity.type}</span>
                  <span className="ms-2">{activity.minutes} minutes</span>
                </div>
                <strong>{activity.points} points</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

