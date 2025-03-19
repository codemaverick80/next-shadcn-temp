export type UserProfile = {
  id: UserId;
  name: string | null;
  image: string | null;
};

export type UserId = number;

export type UserName<T> = T;

export type UserSession = {
  id: UserId;
  roles: string[];
  permissions: string[];
};

export type CurrentUserProfile = {
  id: number;
  userId: number;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  imageId: string | null;
  image: string | null;
  bio: string | null;
};
