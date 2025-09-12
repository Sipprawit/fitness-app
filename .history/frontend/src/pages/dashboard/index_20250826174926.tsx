import { Col, Row, Card } from "antd";
import gymImage1 from "../../assets/gymmy1.png";
import gymImage2 from "../../assets/gymmy1.png";
import gymImage3 from "../../assets/gymmy1.png";

export default function Home() {
  return (
    <>
      <Row gutter={[24, 24]}>
        {/* Section 1: Image Left, Text Right */}
        <Col xs={24}>
          <Row justify="center" align="middle" gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ padding: 0 }}>
                <img
                  src={gymImage1}
                  alt="Fitness facility"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ textAlign: "left", padding: "16px" }}>
                <h2>เริ่มต้นการเดินทางเพื่อสุขภาพที่ดีขึ้น</h2>
                <p>
                  เราเชื่อว่าการออกกำลังกายเป็นมากกว่าแค่การฝึกฝน
                  แต่คือการลงทุนในตัวคุณเอง ที่ฟิตเนสของเรา
                  คุณจะพบกับเครื่องมือที่ทันสมัยและผู้ฝึกสอนมากประสบการณ์
                  ที่พร้อมช่วยให้คุณบรรลุเป้าหมายด้านสุขภาพ
                </p>
              </div>
            </Col>
          </Row>
        </Col>
        
        {/* Section 2: Image Right, Text Left */}
        <Col xs={24}>
          <Row justify="center" align="middle" gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={{ textAlign: "left", padding: "16px" }}>
                <h2>คลาสที่หลากหลายเพื่อความสนุกที่ไม่มีวันสิ้นสุด</h2>
                <p>
                  ไม่ว่าคุณจะชอบคาร์ดิโอที่เร้าใจ, โยคะที่สงบ,
                  หรือการฝึกแบบกลุ่มที่เข้มข้น เรามีคลาสให้เลือกมากมาย
                  ที่ออกแบบมาเพื่อตอบสนองทุกระดับความสามารถ
                  เข้าร่วมกับเราและค้นพบการออกกำลังกายที่คุณรัก
                </p>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ padding: 0 }}>
                <img
                  src={gymImage2}
                  alt="Group fitness class"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Section 3: Image Left, Text Right (Same as Section 1) */}
        <Col xs={24}>
          <Row justify="center" align="middle" gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ padding: 0 }}>
                <img
                  src={gymImage3}
                  alt="Personal trainer with client"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ textAlign: "left", padding: "16px" }}>
                <h2>ผู้เชี่ยวชาญพร้อมให้คำแนะนำเฉพาะบุคคล</h2>
                <p>
                  ทีมผู้ฝึกสอนส่วนตัวของเราพร้อมที่จะสร้างโปรแกรมการฝึก
                  ที่เหมาะสมกับคุณโดยเฉพาะ ตั้งแต่การวางแผนโภชนาการ
                  ไปจนถึงการฝึกที่ถูกต้อง
                  เราจะร่วมเดินทางกับคุณในทุกขั้นตอนเพื่อผลลัพธ์ที่ดีที่สุด
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}