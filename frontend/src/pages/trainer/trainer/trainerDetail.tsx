// src/pages/trainer/TrainerDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Button, Spin } from "antd";
import { GetTrainerById } from "../../../services/https";
import type { TrainerInterface } from "../../../interface/ITrainer";

const TrainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [trainer, setTrainer] = useState<TrainerInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    GetTrainerById(Number(id))
      .then((res) => {
        if (res && res.data) {
          setTrainer(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (!trainer) {
    return <p style={{ textAlign: "center" }}>Trainer not found</p>;
  }

  return (
    <div style={{ padding: 32 }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#000" }}>
            Trainer Booking
          </h1>
          <p style={{ color: "#000" }}>ข้อมูลของเทรนเนอร์</p>
        </div>
        <Button
          type="default"
          onClick={() => navigate(-1)} // Use navigate(-1) for back button functionality
          style={{
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          ย้อนกลับ
        </Button>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* Profile Image */}
        <div style={{ flex: "0 0 300px" }}>
          <img
            alt={trainer.first_name}
            src={`http://localhost:8000${trainer.profile_image}`}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              background: "#ccc",
            }}
          />
        </div>

        {/* Right Section */}
        <div style={{ flex: 1, justifyContent: "center" }}>
          {/* Name */}
          <h2 style={{ marginBottom: "16px", fontWeight: "bold" }}>
            {trainer.first_name} {trainer.last_name}
          </h2>

          {/* Another Info */}
          <div
            style={{
              background: "#e0e0e0",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "24px",
            }}
          >
            <p>
              <strong>Skill:</strong> {trainer.skill}
            </p>
            <p>
              <strong>Email:</strong> {trainer.email}
            </p>
            <p>
              <strong>Tel:</strong> {trainer.tel}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {trainer.gender_id === 1
                ? "Male"
                : trainer.gender_id === 2
                ? "Female"
                : "-"}
            </p>
          </div>

          {/* Button */}
          <Button
            type="primary"
            style={{
              backgroundColor: "#C50000",
              borderColor: "#C50000",
              fontWeight: "bold",
              padding: "0 24px",
              height: "40px",
              justifyContent: "center",
            }}
            onClick={() => navigate(`/trainers/${trainer.ID}/train-bookings`)} // Navigate to the new schedule page
          >
            Get A Trainer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetail;