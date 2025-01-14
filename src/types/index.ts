

export type UserProfile = {
    id: UserId;
    name: string | null;
    image: string | null;
};

export type UserId = number;

export type UserName<T>=T;

export type UserSession = {
    id: UserId;
};


