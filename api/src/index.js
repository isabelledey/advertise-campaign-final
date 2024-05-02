import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Get all campaigns
app.get("/api/campaigns", async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).send("Oops, something went wrong");
  }
});

// Add a new campaign
app.post("/api/campaigns", async (req, res) => {
  const { name, platform, landingPage, imageUrl } = req.body;

  if (!name || !platform || !landingPage || !imageUrl) {
    return res.status(400).send("Some fields are missing");
  }

  try {
    const campaign = await prisma.campaign.create({
      data: { name, platform, landingPage, imageUrl },
    });
    res.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).send("Oops, something went wrong");
  }
});

// Update an existing campaign
app.put("/api/campaigns/:id", async (req, res) => {
  const { name, platform, landingPage, imageUrl } = req.body;
  const id = parseInt(req.params.id);

  if (!name || !platform || !landingPage || !imageUrl) {
    return res.status(400).send("Some required fields are missing");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { name, platform, landingPage, imageUrl },
    });
    res.json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).send("Oops, something went wrong");
  }
});

// Get campaign preview by ID
app.get("/api/preview/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).send("Campaign not found");
    }

    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign preview:", error);
    res.status(500).send("Oops, something went wrong");
  }
});


const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
