import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  created_at: string;
}

function ProfileCustomer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data || data);
        setEditData({
          first_name: data.data?.first_name || data.first_name || "",
          last_name: data.data?.last_name || data.last_name || "",
          email: data.data?.email || data.email || ""
        });
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8000/api/user/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData.data || updatedData);
        setIsEditing(false);
        alert("บันทึกข้อมูลสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("http://localhost:8000/api/user/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(prev => prev ? { ...prev, avatar: result.avatar_url } : null);
        alert("อัปโหลดรูปโปรไฟล์สำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
    } finally {
      setUploading(false);
    }
  };


  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}>⏳</div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={errorStyle}>
        <h2>ไม่พบข้อมูลโปรไฟล์</h2>
        <button onClick={() => navigate("/login")} style={buttonStyle}>
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>👤 โปรไฟล์ของฉัน</h1>
        <p style={subtitleStyle}>จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      {/* Profile Card */}
      <div style={profileCardStyle}>
        {/* Avatar Section */}
        <div style={avatarSectionStyle}>
          <div style={avatarContainerStyle}>
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Profile" 
                style={avatarImageStyle}
              />
            ) : (
              <div style={defaultAvatarStyle}>
                <span style={avatarIconStyle}>👤</span>
              </div>
            )}
            <div style={uploadOverlayStyle}>
              <label style={uploadButtonStyle}>
                {uploading ? "⏳" : "📷"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
          <h2 style={nameStyle}>
            {profile.first_name} {profile.last_name}
          </h2>
          <p style={usernameStyle}>@{profile.username}</p>
        </div>

        {/* Profile Information */}
        <div style={infoSectionStyle}>
          {isEditing ? (
            <div style={editFormStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>ชื่อ</label>
                <input
                  type="text"
                  value={editData.first_name}
                  onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                  style={inputStyle}
                  placeholder="ชื่อ"
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>นามสกุล</label>
                <input
                  type="text"
                  value={editData.last_name}
                  onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                  style={inputStyle}
                  placeholder="นามสกุล"
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>อีเมล</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  style={inputStyle}
                  placeholder="อีเมล"
                />
              </div>
              

              <div style={buttonGroupStyle}>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  style={{
                    ...saveButtonStyle,
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? "⏳ บันทึก..." : "💾 บันทึก"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  style={cancelButtonStyle}
                >
                  ❌ ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <div style={infoDisplayStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>📧 อีเมล:</span>
                <span style={infoValueStyle}>{profile.email}</span>
              </div>
              
              
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>📅 สมาชิกตั้งแต่:</span>
                <span style={infoValueStyle}>
                  {new Date(profile.created_at).toLocaleDateString('th-TH')}
                </span>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                style={editButtonStyle}
              >
                ✏️ แก้ไขข้อมูล
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #c50000 100%)",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  color: "#c50000",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "700",
  margin: "0 0 0.5rem 0",
  textShadow: "0 2px 4px rgba(197,0,0,0.3)",
  color: "#c50000",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  margin: 0,
  opacity: 0.9,
};

const profileCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "20px",
  padding: "2rem",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  maxWidth: "500px",
  width: "100%",
  marginBottom: "2rem",
};

const avatarSectionStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "2rem",
  borderBottom: "2px solid #f0f0f0",
};

const avatarContainerStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  marginBottom: "1rem",
};

const avatarImageStyle: React.CSSProperties = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #c50000",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.3)",
};

const defaultAvatarStyle: React.CSSProperties = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "4px solid #c50000",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.3)",
};

const avatarIconStyle: React.CSSProperties = {
  fontSize: "3rem",
  color: "white",
};

const uploadOverlayStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "0",
  right: "0",
  background: "#c50000",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(197, 0, 0, 0.4)",
  transition: "all 0.3s ease",
};

const uploadButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "1.2rem",
  cursor: "pointer",
  padding: 0,
  margin: 0,
};

const nameStyle: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 0.5rem 0",
};

const usernameStyle: React.CSSProperties = {
  fontSize: "1rem",
  color: "#6b7280",
  margin: 0,
  fontWeight: "500",
};

const infoSectionStyle: React.CSSProperties = {
  marginTop: "1rem",
};

const editFormStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "2px solid #e5e7eb",
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.3s ease",
  background: "white",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
};

const saveButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem 1rem",
  background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(197, 0, 0, 0.3)",
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem 1rem",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const infoDisplayStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const infoItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.75rem",
  background: "#f9fafb",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#374151",
};

const infoValueStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#6b7280",
  fontWeight: "500",
};

const editButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: "1rem",
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
};

const actionSectionStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "0.75rem 2rem",
  background: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
};

const loadingStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "1.2rem",
};

const spinnerStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  animation: "spin 1s linear infinite",
};

const errorStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 2rem",
  background: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  marginTop: "1rem",
};

export default ProfileCustomer;
