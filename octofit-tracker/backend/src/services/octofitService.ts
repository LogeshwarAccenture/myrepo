import { Activity, Team, User, Workout } from '../models/index.js';
import mongoose from 'mongoose';

function createError(message: string, status: number = 400) {
  return Object.assign(new Error(message), { status });
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!input || typeof input !== 'object') {
    throw createError('Invalid input');
  }

  const { userId, teamId, type, minutes } = input as Record<string, unknown>;

  // Validate required fields
  if (!userId || !teamId || !type || minutes === undefined) {
    throw createError('Missing required fields: userId, teamId, type, minutes');
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(String(userId))) {
    throw createError('Invalid userId format');
  }
  if (!mongoose.Types.ObjectId.isValid(String(teamId))) {
    throw createError('Invalid teamId format');
  }

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found');
  }

  // Verify team exists
  const team = await Team.findById(teamId);
  if (!team) {
    throw createError('Team not found');
  }

  // Compute points based on type
  const pointsMultiplier: Record<string, number> = { run: 1.5, cycle: 1.3, walk: 1.0 };
  const multiplier = pointsMultiplier[String(type)] ?? 1.0;
  const points = Math.round(Number(minutes) * multiplier);

  // Create activity with computed values
  const activity = await Activity.create({
    user: userId,
    team: teamId,
    type,
    minutes,
    points,
    occurredAt: new Date(),
  });

  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!input || typeof input !== 'object') {
    throw createError('Invalid input');
  }

  const { name, mascot, members } = input as Record<string, unknown>;

  // Validate required fields
  if (!name) {
    throw createError('Missing required field: name');
  }

  // Create team
  const team = await Team.create({
    name,
    mascot,
    members: members || [],
  });

  return team.toObject();
}

export async function getLeaderboard() {
  const activities = await Activity.find().lean();
  
  // Group by team and sum points
  const teamPoints: Record<string, { teamName: string; totalPoints: number }> = {};
  
  for (const activity of activities) {
    const team = await Team.findById(activity.team).lean();
    if (!team) continue;
    
    const teamId = activity.team.toString();
    if (!teamPoints[teamId]) {
      teamPoints[teamId] = { teamName: team.name, totalPoints: 0 };
    }
    teamPoints[teamId].totalPoints += activity.points || 0;
  }

  // Convert to array and sort by totalPoints descending
  const leaderboard = Object.values(teamPoints)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return leaderboard;
}

export async function suggestWorkouts(userEmail: string) {
  // Find user by email
  const user = await User.findOne({ email: userEmail }).lean();
  if (!user) {
    throw createError('User not found', 404);
  }

  // Get user's recent activities
  const activities = await Activity.find({ user: user._id }).sort({ occurredAt: -1 }).lean();

  // Find workouts matching user's fitness goal
  const matchingWorkouts = await Workout.find({ focus: user.fitnessGoal }).lean();

  if (matchingWorkouts.length === 0) {
    // Fallback: return any workout
    const anyWorkout = await Workout.findOne().lean();
    if (!anyWorkout) {
      throw createError('No workouts available');
    }
    return [
      {
        ...anyWorkout,
        reason: `Suggested based on fitness profile`,
      },
    ];
  }

  // Return matching workouts with reason
  return matchingWorkouts.map((workout) => ({
    ...workout,
    reason: `Matches your ${user.fitnessGoal} goal and recent ${activities[0]?.type || 'activity'} activities`,
  }));
}

export { User };
