export const AppRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/signup",
  PROFILE: "/profile",
  MATCH_DETAILS: (id: string) => `/match/${id}`,
  PLAYERS: "/players",
  PITCHES: "/pitches",
};
