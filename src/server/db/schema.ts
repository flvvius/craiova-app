// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `craiova-app_${name}`);

export const places = createTable(
  "place",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    mainPhoto: varchar("main_photo", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    gallery: text("gallery").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const reviews = createTable(
  "review",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    placeId: integer("place_id").notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    userEmail: varchar("user_email", { length: 256 }).notNull(),
    rating: integer("rating").notNull(),
    comment: varchar("comment", { length: 1024 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("review_name_idx").on(example.id),
  }),
);

export const events = createTable("event", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  externalLink: text("external_link").notNull(),
  photo: varchar("photo", { length: 256 }).notNull(),
  userId: text("user_id").notNull(),
  userEmail: text("user_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});
