import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route for Answer Verification
  app.post("/api/verify", (req, res) => {
    const { answer } = req.body;
    
    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid missing answer" });
    }

    // Normalize answer: remove all whitespace, convert to lowercase
    const normalizedAnswer = answer.trim().toLowerCase().replace(/\s+/g, '');
    
    // Valid typo variations and exact match
    const validAnswers = ['mclaren', 'maclaren', 'macleren', 'maklaren', 'mclarn', 'mclaern'];

    if (validAnswers.includes(normalizedAnswer)) {
      return res.json({ 
        success: true, 
        redirectUrl: "https://medium.com/@random111" 
      });
    }

    return res.json({ success: false });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the React app build directory
    const distPath = path.join(process.cwd(), 'dist/client'); 
    // In our build setup `vite build` writes to `dist/`, but wait, 
    // Vite creates `dist/` by default. Let's adjust to standard `dist/` since we override outfile for server to `dist/server.cjs`
    const servePath = path.join(process.cwd(), 'dist');
    app.use(express.static(servePath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(servePath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
