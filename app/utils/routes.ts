export const AppRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/signup",
  PROFILE: "/profile",
  ORGANIZED_MATCHES: "/profile/organized-matches",
  MATCH_DETAILS: (id: string) => `/match/${id}`,
  MATCH_CALENDAR: (id: string) => `/match/${id}/calendar`,
  PLAYERS: "/players",
  PITCHES: "/pitches",
};
