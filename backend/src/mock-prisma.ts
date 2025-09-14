// Simple in-memory database for testing authentication without Prisma
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private users: User[] = [];
  private nextId = 1;

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(email: string, name: string, hashedPassword: string): Promise<User> {
    const user: User = {
      id: this.nextId++,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async deleteUserByEmail(email: string): Promise<void> {
    this.users = this.users.filter(user => user.email !== email);
  }
}

// Mock Prisma Client that mimics the expected interface
export class PrismaClient {
  private db = new MockDatabase();

  user = {
    findFirst: async (args: { where: { email: string } }): Promise<User | null> => {
      return this.db.findUserByEmail(args.where.email);
    },

    findUnique: async (args: { where: { email: string } }): Promise<User | null> => {
      return this.db.findUserByEmail(args.where.email);
    },

    create: async (args: { data: { email: string; name: string; password: string } }): Promise<User> => {
      return this.db.createUser(args.data.email, args.data.name, args.data.password);
    },

    deleteMany: async (args: { where: { email: string } }): Promise<{ count: number }> => {
      const user = await this.db.findUserByEmail(args.where.email);
      if (user) {
        await this.db.deleteUserByEmail(args.where.email);
        return { count: 1 };
      }
      return { count: 0 };
    }
  };

  async $disconnect(): Promise<void> {
    // Mock disconnect - does nothing
  }
}