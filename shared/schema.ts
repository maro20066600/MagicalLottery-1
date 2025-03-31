import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Governorate model
export const governorates = pgTable("governorates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  groupId: integer("group_id"),
  revealed: boolean("revealed").notNull().default(false),
  groupName: text("group_name"),
});

export const insertGovernorateSchema = createInsertSchema(governorates).pick({
  name: true,
  groupId: true,
  revealed: true,
  groupName: true,
});

export type InsertGovernorate = z.infer<typeof insertGovernorateSchema>;
export type Governorate = typeof governorates.$inferSelect;

// Group model
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  theme: text("theme").notNull(),
  icon: text("icon").notNull(),
});

export const insertGroupSchema = createInsertSchema(groups).pick({
  name: true,
  theme: true,
  icon: true,
});

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

// User model (keeping for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
