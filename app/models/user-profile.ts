export interface PlayerPreferences {
  preferred_area: string | null;
  preferred_position: string | null;
}

export interface UserProfile extends PlayerPreferences {
  date_of_birth: string | null;
  avatar_url: string | null;
}