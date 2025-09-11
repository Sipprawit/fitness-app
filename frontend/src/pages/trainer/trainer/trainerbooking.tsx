import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { GetTrainers } from "../../../services/https";
import type { TrainerInterface } from "../../../interface/ITrainer";

const { Meta } = Card;

const TrainerBooking: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    GetTrainers()
      .then((res) => {
        if (res && res.data) {
          const filtered = (res.data as TrainerInterface[]).filter(
            (t) => t.email !== "trainer@gmail.com"
          );
          setTrainers(filtered);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  return (
    <div className="p-4 text-white">
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold mb-2">
          Trainer Booking
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-xl">
            สำหรับการจองเทรนเนอร์
          </p>
          <Button 
            type="default"
            onClick={() => navigate('/trainer-booking-history')}
            style={{
              backgroundColor: '#f5f5f5',
              borderColor: '#d9d9d9',
              color: '#595959',
              borderRadius: '6px',
              fontWeight: '400',
              fontSize: '14px',
              height: '32px',
              padding: '4px 15px',
              boxShadow: 'none'
            }}
          >
            ดูประวัติการจอง
          </Button>
        </div>
      </div>

      {/* รายการ Trainer */}
      <Row gutter={[16, 16]} justify="center">
        {trainers.map((trainer) => (
          <Col xs={24} sm={12} md={8} lg={6} key={trainer.ID}>
            <Card
              hoverable
              cover={
                <img
                  src={`http://localhost:8000${trainer.profile_image}`}
                  alt={`${trainer.first_name} ${trainer.last_name}`}
                />
              }
              onClick={() => navigate(`/trainers/${trainer.ID}`)}
            >
              <Meta
                title={`${trainer.first_name} ${trainer.last_name}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TrainerBooking;