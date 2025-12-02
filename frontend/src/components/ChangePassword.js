import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/change-password/${userId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error(data.message || "Error updating password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "450px" }}>
      <h3 className="text-center mb-3">Change Password</h3>

      <form className="p-4 shadow rounded" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            className="form-control"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100 mt-2">Update Password</button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
