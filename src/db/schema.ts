import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const rsvpTable = pgTable('rsvp', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  attendance: varchar('attendance', { length: 20 }).notNull(), // 'hadir' atau 'tidak_hadir'
  guestCount: varchar('guest_count', { length: 10 }).default('1'),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const wishesTable = pgTable('wishes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  message: text('message').notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type RSVP = typeof rsvpTable.$inferSelect;
export type NewRSVP = typeof rsvpTable.$inferInsert;
export type Wish = typeof wishesTable.$inferSelect;
export type NewWish = typeof wishesTable.$inferInsert;
