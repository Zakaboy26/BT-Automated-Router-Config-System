import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadIcon from "@mui/icons-material/UploadFile";
import CreateIcon from "@mui/icons-material/EditNote";
import axios from "axios";

/* 🌟 Styled Components */

const HeaderBar = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "60px",
  background: "linear-gradient(to right, #6200ea, #9c27b0)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "18px",
  zIndex: 1000,
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
});

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f3e5f5, #ede7f6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "100px",
  paddingBottom: "60px",
  position: "relative",
  overflow: "hidden",
});

const EditorCard = styled(Paper)({
  width: "100%",
  maxWidth: "860px",
  padding: "50px 40px",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  position: "relative",
});

const CardHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(135deg, #6200ea, #9c27b0)",
  color: "#fff",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "10px",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(135deg, #4d00b3, #750093)",
  },
});

const BackButton = styled(Button)({
  background: "#f06292",
  color: "#fff",
  textTransform: "none",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: "8px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  "&:hover": {
    background: "#ec407a",
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: "22px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fafafa",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#a855f7" },
    "&.Mui-focused fieldset": { borderColor: "#7e22ce" },
  },
});

const UploadLabel = styled("label")({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 18px",
  border: "1.5px dashed #b39ddb",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#444",
  backgroundColor: "#f8f5ff",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#f1e6ff",
    borderColor: "#9c27b0",
  },
});

const HiddenInput = styled("input")({ display: "none" });

const Dot = styled(Box)(({ top, left, size }) => ({
  position: "absolute",
  top,
  left,
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: "#ce93d8",
  opacity: 0.3,
  zIndex: 0,
}));

/* 📢 Component */

const NewsEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValidType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType) return setError("❌ Only PNG, JPG, and JPEG files are allowed.");
    if (!isValidSize) return setError("❌ Image must be 2MB or less.");

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("⚠️ Title and description cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await axios.post("/api/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ News post created successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderBar>
        📢 News & Updates - BT IoT Router Services
      </HeaderBar>

      <PageWrapper>
        {/* ✨ Decorative Dots */}
        <Dot top="10%" left="5%" size="20px" />
        <Dot top="25%" left="80%" size="14px" />
        <Dot top="60%" left="90%" size="18px" />
        <Dot top="80%" left="20%" size="12px" />

        <EditorCard>
          <CardHeader>
            <Box display="flex" alignItems="center" gap={1}>
              <CreateIcon sx={{ color: "#7e22ce" }} />
              <Typography variant="h5" fontWeight="bold">
                Create a News Post
              </Typography>
            </Box>
            <BackButton onClick={() => navigate("/home")}>⬅ Back to Dashboard</BackButton>
          </CardHeader>

          <StyledTextField
            fullWidth
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 characters`}
          />

          <StyledTextField
            fullWidth
            label="Post Description"
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${description.length}/1000 characters`}
          />

          {/* 🖼️ Image Upload */}
          <Box mt={1}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              📎 Attach Image (optional)
            </Typography>
            <UploadLabel>
              <UploadIcon fontSize="small" />
              Choose File
              <HiddenInput type="file" accept="image/*" onChange={handleImageChange} />
            </UploadLabel>

            {error && <Typography color="error" mt={1}>{error}</Typography>}

            {preview && (
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight="medium" mb={1}>
                  🖼️ Image Preview
                </Typography>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            )}
          </Box>

          {/* 🚀 Submit */}
          <Box mt={4} display="flex" justifyContent="flex-end">
            <StyledButton onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "🚀 Publish Post"}
            </StyledButton>
          </Box>
        </EditorCard>
      </PageWrapper>
    </>
  );
};

export default NewsEditor;
