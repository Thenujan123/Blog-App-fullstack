export type BlogType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string;
    lastName: string;
  };
};
