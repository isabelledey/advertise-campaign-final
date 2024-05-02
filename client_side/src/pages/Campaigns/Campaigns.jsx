import React, { useEffect, useState } from "react";
import "./Campaigns.css";
import { Link } from "react-router-dom";

export const Campaigns = () => {
  const [showModal, setShowModal] = useState(false);
  const [campaignData, setCampaignData] = useState([]);

  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [landingPage, setLandingPage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedCamp, setSelectedCamp] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/campaigns");
        const campaigns = await response.json();
        setCampaignData(campaigns);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCampClick = (camp) => {
    setSelectedCamp(camp);
    setName(camp.name);
    setPlatform(camp.platform);
    setLandingPage(camp.landingPage);
    setImageUrl(camp.imageUrl);
    openModal();
  };

  const handleUpdateCamp = async (e) => {
    e.preventDefault();
    if (!selectedCamp) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8800/api/campaigns/${selectedCamp.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            platform,
            landingPage,
            imageUrl,
          }),
        }
      );
      const updatedCamp = await response.json();
      const updatedCampsList = campaignData.map((camp) =>
        camp.id === selectedCamp.id ? updatedCamp : camp
      );

      setCampaignData(updatedCampsList);
      setName("");
      setPlatform("");
      setLandingPage("");
      setImageUrl("");
      setSelectedCamp(null);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setName("");
    setPlatform("");
    setLandingPage("");
    setImageUrl("");
    setSelectedCamp(null);
    closeModal();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8800/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          platform,
          landingPage,
          imageUrl,
        }),
      });
      const newCampaign = await response.json();
      setCampaignData([newCampaign, ...campaignData]);
      setName("");
      setPlatform("");
      setLandingPage("");
      setImageUrl("");

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <button onClick={openModal}>Add Campaign</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <form
              onSubmit={(e) =>
                selectedCamp ? handleUpdateCamp(e) : handleAddCampaign(e)
              }
            >
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label for="platform">Platform:</label>
              <select
                id="platform"
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
              >
                <option value="">Select Platform</option>
                <option value="Google">Google</option>
                <option value="Taboola">Taboola</option>
                <option value="TikTok">TikTok</option>
              </select>
              <label>
                Landing page:
                <input
                  type="text"
                  name="landingPage"
                  value={landingPage}
                  onChange={(e) => setLandingPage(e.target.value)}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imageURL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </label>
              {selectedCamp ? (
                <div className="edit-buttons">
                  <button type="submit">Save</button>
                  <button className="cancelButton" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="submit">Submit</button>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="campaign-table">
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Platform</th>
              <th>Landing Page</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {campaignData.map((camp) => (
              <tr key={camp.id}>
                <td>{camp.name}</td>
                <td>{camp.platform}</td>
                <td>{camp.landingPage}</td>
                <td>
                  <img
                    src={camp.imageUrl}
                    alt="camp-img"
                    style={{ width: 40 + "%" }}
                  />
                </td>
                <td>
                  <button onClick={() => handleCampClick(camp)}>Edit</button>
                </td>
                <td>
                  <Link to={`/preview/${camp.id}`}>
                    <button>Preview</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
