// Test script สำหรับทดสอบ user profile API
const testProfileAPI = async () => {
  try {
    // ทดสอบ login ก่อน
    const loginResponse = await fetch("http://localhost:8000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "test@example.com", // เปลี่ยนเป็น email ที่มีอยู่จริง
        password: "password123"    // เปลี่ยนเป็น password ที่ถูกต้อง
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.token;
      
      console.log("Login successful, token:", token);

      // ทดสอบ profile API
      const profileResponse = await fetch("http://localhost:8000/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);
      } else {
        console.error("Profile API failed:", profileResponse.status, profileResponse.statusText);
      }
    } else {
      console.error("Login failed:", loginResponse.status, loginResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// รัน test
testProfileAPI();
