import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsersAirtableClient, UsersRecord } from '@/core/airtable/UsersAirtableClient';

const JWT_EXPIRES_IN = '7d';

export type JwtPayload = { sub: string; email: string };

export class AuthService {
  private users = new UsersAirtableClient();
  private jwtSecret: string;

  constructor() {
    const s = process.env.JWT_SECRET;
    if (!s) throw new Error('JWT_SECRET must be defined');
    this.jwtSecret = s;
  }

  async signup(email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error('Un compte existe déjà avec cet email.');

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await this.users.createUser({ Email: email, PasswordHash: passwordHash });
    const token = this.signToken({ sub: created.id, email });
    return { token, user: { id: created.id, email } };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Identifiants invalides.');

    const ok = await bcrypt.compare(password, user.fields.PasswordHash);
    if (!ok) throw new Error('Identifiants invalides.');

    const token = this.signToken({ sub: user.id, email });
    return { token, user: { id: user.id, email } };
  }

  verify(token: string) {
    return jwt.verify(token, this.jwtSecret) as JwtPayload;
  }

  async getUser(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new Error('Utilisateur non trouvé.');
    return user;
  }

  async updateProfile(id: string, fields: Partial<UsersRecord['fields']>) {
    return this.users.updateUser(id, fields);
  }

  async deleteAccount(id: string) {
    return this.users.deleteUser(id);
  }

  private signToken(payload: JwtPayload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
  }
}