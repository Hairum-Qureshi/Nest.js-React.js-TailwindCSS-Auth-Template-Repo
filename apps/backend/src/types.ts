type UserPayload = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  createdAt: Date;
};

type AuthRequest = Request & {
  user?: UserPayload;
};

export type { UserPayload, AuthRequest };
