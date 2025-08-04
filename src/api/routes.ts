import { serverApi } from '../lib/api';

export default {
  // RSVP endpoints
  async '/api/rsvp'(req: Request) {
    const url = new URL(req.url);
    
    if (req.method === 'POST') {
      try {
        const data = await req.json();
        const result = await serverApi.createRSVP(data);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }
    }
    
    if (req.method === 'GET') {
      const publicOnly = url.searchParams.get('publicOnly') !== 'false';
      const result = await serverApi.getRSVPs(publicOnly);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  },

  async '/api/rsvp/stats'(req: Request) {
    if (req.method === 'GET') {
      const result = await serverApi.getRSVPStats();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  },

  // Wishes endpoints
  async '/api/wishes'(req: Request) {
    const url = new URL(req.url);
    
    if (req.method === 'POST') {
      try {
        const data = await req.json();
        const result = await serverApi.createWish(data);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }
    }
    
    if (req.method === 'GET') {
      const publicOnly = url.searchParams.get('publicOnly') !== 'false';
      const result = await serverApi.getWishes(publicOnly);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  },
};
