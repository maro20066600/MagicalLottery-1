import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize application data
  app.get("/api/init", async (req, res) => {
    await storage.initializeData();
    res.json({ success: true, message: "Application initialized" });
  });

  // Get all governorates
  app.get("/api/governorates", async (req, res) => {
    const governorates = await storage.getAllGovernorates();
    res.json(governorates);
  });

  // Get all groups
  app.get("/api/groups", async (req, res) => {
    const groups = await storage.getAllGroups();
    res.json(groups);
  });

  // Start lottery (assign governorates to groups but don't reveal)
  app.post("/api/lottery/start", async (req, res) => {
    await storage.assignGovernorateGroups();
    res.json({ success: true, message: "Lottery started" });
  });

  // Reset lottery
  app.get("/api/lottery/reset", async (req, res) => {
    await storage.resetLottery();
    res.json({ success: true, message: "Lottery reset" });
  });

  // Reveal a governorate
  app.post("/api/lottery/reveal/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    
    const governorate = await storage.revealGovernorate(id);
    res.json({ success: true, governorate });
  });

  const httpServer = createServer(app);
  return httpServer;
}
