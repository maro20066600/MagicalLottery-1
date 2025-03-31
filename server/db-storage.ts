
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { IStorage } from './storage';
import { 
  governorates, 
  groups,
  type Governorate,
  type InsertGovernorate,
  type Group,
  type InsertGroup,
  type User,
  type InsertUser,
  users 
} from "@shared/schema";
import { EGYPTIAN_GOVERNORATES, ADDITIONAL_PARTICIPANTS, GROUPS } from "../client/src/lib/constants";
import { eq } from 'drizzle-orm';

export class PostgresStorage implements IStorage {
  private db;
  
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    this.db = drizzle(pool);
  }

  async initializeData(): Promise<void> {
    // Initialize groups if not already done
    const existingGroups = await this.getAllGroups();
    if (existingGroups.length === 0) {
      for (const group of GROUPS) {
        await this.db.insert(groups).values({
          name: group.name,
          theme: group.theme,
          icon: group.icon
        });
      }
    }

    // Initialize governorates if not already done
    const existingGovernorates = await this.getAllGovernorates();
    if (existingGovernorates.length === 0) {
      // Add Egyptian governorates
      for (const name of EGYPTIAN_GOVERNORATES) {
        await this.db.insert(governorates).values({
          name,
          revealed: false,
        });
      }

      // Add additional participants
      for (const name of ADDITIONAL_PARTICIPANTS) {
        await this.db.insert(governorates).values({
          name,
          revealed: false,
        });
      }
    }
  }

  async getAllGovernorates(): Promise<Governorate[]> {
    return this.db.select().from(governorates);
  }

  async getAllGroups(): Promise<Group[]> {
    return this.db.select().from(groups);
  }

  async assignGovernorateGroups(): Promise<void> {
    const allGovernorates = await this.getAllGovernorates();
    const allGroups = await this.getAllGroups();
    
    // Shuffle governorates
    const shuffled = [...allGovernorates].sort(() => Math.random() - 0.5);
    
    // Calculate governorates per group
    const governoratesPerGroup = Math.ceil(shuffled.length / allGroups.length);
    
    // Assign groups
    for (let i = 0; i < shuffled.length; i++) {
      const groupIndex = Math.floor(i / governoratesPerGroup);
      const group = allGroups[groupIndex % allGroups.length];
      
      await this.db
        .update(governorates)
        .set({ 
          groupId: group.id,
          groupName: group.name,
          revealed: false 
        })
        .where(eq(governorates.id, shuffled[i].id));
    }
  }

  async resetLottery(): Promise<void> {
    await this.db
      .update(governorates)
      .set({ 
        groupId: null,
        groupName: null,
        revealed: false 
      });
  }

  async revealGovernorate(id: number): Promise<Governorate> {
    await this.db
      .update(governorates)
      .set({ revealed: true })
      .where(eq(governorates.id, id));

    const [governorate] = await this.db
      .select()
      .from(governorates)
      .where(eq(governorates.id, id));

    if (!governorate) {
      throw new Error(`Governorate with id ${id} not found`);
    }

    return governorate;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}
