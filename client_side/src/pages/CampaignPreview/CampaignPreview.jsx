
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CampaignPreview.css"

const CampaignPreview = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/preview/${id}`);
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };
    fetchCampaign();
  }, [id]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="heading">Campaign Preview</h1>
      <div className="campaign-info">
        <p><strong>Name:</strong> {campaign.name}</p>
        <p><strong>Platform:</strong> {campaign.platform}</p>
        <div className="image-container">
          <img src={campaign.imageUrl} alt="CampaignImage" />
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;
