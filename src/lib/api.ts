import { getDb } from '../db';
import { rsvpTable, wishesTable, type NewRSVP, type NewWish, type RSVP, type Wish } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

export type { NewRSVP, NewWish, RSVP, Wish };

// Base URL for API (will be set based on environment)
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return window.location.origin;
  }
  return 'http://localhost:3000'; // Fallback for server
};

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${getApiUrl()}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// RSVP Functions (Client-side API calls)
export async function createRSVP(data: NewRSVP) {
  return apiCall('/rsvp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getRSVPs(publicOnly = true) {
  return apiCall(`/rsvp?publicOnly=${publicOnly}`);
}

export async function getRSVPStats() {
  return apiCall('/rsvp/stats');
}

// Wishes Functions (Client-side API calls)
export async function createWish(data: NewWish) {
  return apiCall('/wishes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getWishes(publicOnly = true) {
  return apiCall(`/wishes?publicOnly=${publicOnly}`);
}

// Server-side functions (untuk API routes)
export const serverApi = {
  async createRSVP(data: NewRSVP) {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not available');
      
      const [rsvp] = await db.insert(rsvpTable).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return { success: true, data: rsvp };
    } catch (error) {
      console.error('Error creating RSVP:', error);
      return { success: false, error: 'Failed to create RSVP' };
    }
  },

  async getRSVPs(publicOnly = true) {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not available');
      
      let query = db.select().from(rsvpTable).orderBy(desc(rsvpTable.createdAt));
      
      if (publicOnly) {
        query = query.where(eq(rsvpTable.isPublic, true)) as any;
      }
      
      const rsvps = await query;
      return { success: true, data: rsvps };
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      return { success: false, error: 'Failed to fetch RSVPs' };
    }
  },

  async getFile(filename: string) {
    const file = Bun.file(`${process.cwd()}/src/data/${filename}`);
    if (await file.exists()) {
      return { success: true, data: file };
    } else {
      return { success: false, error: 'File not found' };
    }
  },

  async getRSVPStats() {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not available');
      
      const allRsvps = await db.select().from(rsvpTable);
      
      const stats = {
        total: allRsvps.length,
        attending: allRsvps.filter(r => r.attendance === 'hadir').length,
        notAttending: allRsvps.filter(r => r.attendance === 'tidak_hadir').length,
        totalGuests: allRsvps
          .filter(r => r.attendance === 'hadir')
          .reduce((sum, r) => sum + parseInt(r.guestCount || '1'), 0)
      };
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching RSVP stats:', error);
      return { success: false, error: 'Failed to fetch RSVP stats' };
    }
  },

  async createWish(data: NewWish) {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not available');
      
      const [wish] = await db.insert(wishesTable).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return { success: true, data: wish };
    } catch (error) {
      console.error('Error creating wish:', error);
      return { success: false, error: 'Failed to create wish' };
    }
  },

  async getWishes(publicOnly = true) {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not available');
      
      let query = db.select().from(wishesTable).orderBy(desc(wishesTable.createdAt));
      
      if (publicOnly) {
        query = query.where(eq(wishesTable.isPublic, true)) as any;
      }
      
      const wishes = await query;
      return { success: true, data: wishes };
    } catch (error) {
      console.error('Error fetching wishes:', error);
      return { success: false, error: 'Failed to fetch wishes' };
    }
  }
};
