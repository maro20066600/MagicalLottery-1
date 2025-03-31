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

export interface IStorage {
  initializeData(): Promise<void>;
  getAllGovernorates(): Promise<Governorate[]>;
  getAllGroups(): Promise<Group[]>;
  assignGovernorateGroups(): Promise<void>;
  resetLottery(): Promise<void>;
  revealGovernorate(id: number): Promise<Governorate>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private governorates: Map<number, Governorate>;
  private groups: Map<number, Group>;
  private currentUserId: number;
  private currentGovernorateId: number;
  private currentGroupId: number;

  constructor() {
    this.users = new Map();
    this.governorates = new Map();
    this.groups = new Map();
    this.currentUserId = 1;
    this.currentGovernorateId = 1;
    this.currentGroupId = 1;
  }

  async initializeData(): Promise<void> {
    // Initialize groups if not already done
    if (this.groups.size === 0) {
      for (const group of GROUPS) {
        await this.createGroup({
          name: group.name,
          theme: group.theme,
          icon: group.icon
        });
      }
    }

    // Initialize governorates if not already done
    if (this.governorates.size === 0) {
      // Add Egyptian governorates
      for (const name of EGYPTIAN_GOVERNORATES) {
        await this.createGovernorate({
          name,
          revealed: false,
        });
      }

      // Add additional participants
      for (const name of ADDITIONAL_PARTICIPANTS) {
        await this.createGovernorate({
          name,
          revealed: false,
        });
      }
    }
  }

  async getAllGovernorates(): Promise<Governorate[]> {
    return Array.from(this.governorates.values());
  }

  async getAllGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async assignGovernorateGroups(): Promise<void> {
    const governorates = Array.from(this.governorates.values());
    const groups = Array.from(this.groups.values());

    // Shuffle the governorates
    const shuffledGovernorates = this.shuffleArray([...governorates]);
    
    // Calculate how many governorates per group (approximately)
    const governoratesPerGroup = Math.ceil(shuffledGovernorates.length / groups.length);
    
    // Assign governorates to groups
    for (let i = 0; i < shuffledGovernorates.length; i++) {
      const groupIndex = Math.floor(i / governoratesPerGroup);
      
      // If we have more governorates than can fit in the groups, wrap around
      const group = groups[groupIndex % groups.length];
      
      // Update the governorate
      const governorate = shuffledGovernorates[i];
      governorate.groupId = group.id;
      governorate.groupName = group.name;
      governorate.revealed = false;
      this.governorates.set(governorate.id, governorate);
    }
  }

  async resetLottery(): Promise<void> {
    // Reset all governorates (remove group assignments and revealed status)
    for (const governorate of this.governorates.values()) {
      governorate.groupId = undefined;
      governorate.groupName = undefined;
      governorate.revealed = false;
      this.governorates.set(governorate.id, governorate);
    }
  }

  async revealGovernorate(id: number): Promise<Governorate> {
    const governorate = this.governorates.get(id);
    if (!governorate) {
      throw new Error(`Governorate with id ${id} not found`);
    }
    
    governorate.revealed = true;
    this.governorates.set(id, governorate);
    return governorate;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private async createGovernorate(insertGovernorate: Partial<InsertGovernorate>): Promise<Governorate> {
    const id = this.currentGovernorateId++;
    const governorate: Governorate = { 
      id, 
      name: insertGovernorate.name!, 
      revealed: insertGovernorate.revealed || false,
      groupId: insertGovernorate.groupId,
      groupName: insertGovernorate.groupName
    };
    this.governorates.set(id, governorate);
    return governorate;
  }

  private async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = this.currentGroupId++;
    const group: Group = { ...insertGroup, id };
    this.groups.set(id, group);
    return group;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

import { PostgresStorage } from './db-storage';
export const storage = new PostgresStorage();
