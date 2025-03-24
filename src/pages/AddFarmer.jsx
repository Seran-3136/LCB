import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Map.css";
import "./AddFarmer.css";

const AddFarmer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery } = location.state || {};

  const [farmerDetails, setFarmerDetails] = useState({
    name: "",
    farmSize: "",
    phoneNumber: "",
  });

  const checkExistingData = async () => {
    if (!searchQuery) return;
    try {
      const docRef = doc(db, "farmerLocations", searchQuery.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFarmerDetails(docSnap.data());
      }
    } catch (error) {
      console.error("Error checking existing data:", error);
    }
  };

  React.useEffect(() => {
    checkExistingData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      alert("No location selected!");
      return;
    }

    try {
      const docRef = doc(db, "farmerLocations", searchQuery.toLowerCase());
      await setDoc(docRef, farmerDetails, { merge: true });
      alert("Farmer details saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("Error saving farmer details!");
    }
  };

  return (
    <div className="add-farmer-container">
      <h2>Add Farmer Details for {searchQuery}</h2>
      <form onSubmit={handleSubmit} className="farmer-form">
        <input
          type="text"
          name="name"
          value={farmerDetails.name}
          onChange={handleInputChange}
          placeholder="Farmer Name"
          className="farmer-input"
        />
        <input
          type="text"
          name="farmSize"
          value={farmerDetails.farmSize}
          onChange={handleInputChange}
          placeholder="Farm Size (acres)"
          className="farmer-input"
        />
        <input
          type="tel"
          name="phoneNumber"
          value={farmerDetails.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="farmer-input"
          pattern="[0-9]{10}" // Optional: enforces 10-digit phone number
          title="Please enter a 10-digit phone number"
        />
        <button type="submit" className="save-button">
          Save Details
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="cancel-button"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddFarmer;