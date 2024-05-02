import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/campaigns", async (req, res) => {
  const campaigns = await prisma.campaign.findMany();
  res.json(campaigns);
});

app.post("/api/campaigns", async (req, res) => {
  const { name, platform, landingPage, imageUrl } = req.body;
  if (!name || !platform || !landingPage || !imageUrl) {
    return res.status(400).send("some fields are missing");
  }
  try {
    const campaign = await prisma.campaign.create({
      data: { name, platform, landingPage, imageUrl },
    });
    res.json(campaign);
  } catch (err) {
    res.status(500).send("oops, something went wrong");
  }
});

app.put("/api/campaigns/:id", async (req, res) => {
  const { name, platform, landingPage, imageUrl } = req.body;
  const id = parseInt(req.params.id);

  if (!name || !platform || !landingPage || !imageUrl){
    return res.status(400).send("some required fields are missing")
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
  } catch (err) {
    res.status(500).send("oops something went wrong while updating");
  }
});

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
    } catch (err) {
      console.error(err);
      res.status(500).send("Oops, something went wrong");
    }
  });
  

app.listen(8800, () => {
  console.log("start running on localhost 8800");
});
