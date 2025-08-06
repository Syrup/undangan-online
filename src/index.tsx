import { serve } from "bun";
import index from "./index.html";
import { serverApi } from "./lib/api";

const server = serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url).pathname;
    const file = Bun.file(`./public/${url}`);

    return new Response(file);
  },
  routes: {
    // Serve index.html for all unmatched routes.
    "/": index,

    // RSVP API endpoints
    "/api/rsvp": {
      async POST(req) {
        try {
          const data = await req.json();
          const result = await serverApi.createRSVP(data);
          return Response.json(result, {
            status: result.success ? 200 : 400
          });
        } catch (error) {
          return Response.json({ success: false, error: 'Invalid request' }, {
            status: 400
          });
        }
      },
      async GET(req) {
        const url = new URL(req.url);
        const publicOnly = url.searchParams.get('publicOnly') !== 'false';
        const result = await serverApi.getRSVPs(publicOnly);
        return Response.json(result, {
          status: result.success ? 200 : 500
        });
      }
    },

    "/api/rsvp/stats": {
      async GET(_req) {
        const result = await serverApi.getRSVPStats();
        return Response.json(result, {
          status: result.success ? 200 : 500
        });
      }
    },

    // Wishes API endpoints
    "/api/wishes": {
      async POST(req) {
        try {
          const data = await req.json();
          const result = await serverApi.createWish(data);
          return Response.json(result, {
            status: result.success ? 200 : 400
          });
        } catch (error) {
          return Response.json({ success: false, error: 'Invalid request' }, {
            status: 400
          });
        }
      },
      async GET(req) {
        const url = new URL(req.url);
        const publicOnly = url.searchParams.get('publicOnly') !== 'false';
        const result = await serverApi.getWishes(publicOnly);
        return Response.json(result, {
          status: result.success ? 200 : 500
        });
      }
    },

    "/api/files/:filename": async req => {
      const { filename } = req.params;
      const result = await serverApi.getFile(filename);
      if (!result) {
        return Response.json({ success: false, error: 'File not found' }, {
          status: 404
        });
      }
      return new Response(result.data, {
        status: 200
      });
    },

    // Legacy API for testing
    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
