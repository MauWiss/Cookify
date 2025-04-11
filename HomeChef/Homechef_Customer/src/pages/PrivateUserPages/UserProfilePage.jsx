import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  uploadBase64Image,
} from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import confetti from "canvas-confetti";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "",
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setBio(data.bio || "");
        setProfilePicture(data.profilePictureBase64 || "");
        localStorage.setItem("bio", data.bio || "");
        localStorage.setItem("profilePicture", data.profilePictureBase64 || "");
      } catch {
        toast.error("❌ Failed to load profile.");
      }
    }
    fetchData();
  }, []);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00BFFF", "#1E90FF", "#87CEFA"],
    });
  };

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({ bio });
      localStorage.setItem("bio", bio);
      toast.success("🎉 Profile updated successfully!");
      launchConfetti();
    } catch {
      toast.error("Error updating profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      toast.warning("Please fill both password fields.");
      return;
    }
    if (oldPassword === newPassword) {
      toast.warning("New password must be different from the current one.");
      return;
    }
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("🔒 Password updated!");
      launchConfetti();
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadBase64Image(file);
      setProfilePicture(res.data.base64);
      localStorage.setItem("profilePicture", res.data.base64);
      toast.success("📸 Image uploaded successfully!");
      launchConfetti();
    } catch {
      toast.error("Failed to upload image");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8 px-4">
      <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-bold text-blue-700">
        <FaUserCircle size={30} /> My Profile
      </h1>

      {user && (
        <p className="text-center text-zinc-600 dark:text-zinc-300">
          Logged in as: <strong>{user.username}</strong> ({user.email})
        </p>
      )}

      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              profilePicture
                ? `data:image/jpeg;base64,${profilePicture}`
                : "https://static.vecteezy.com/system/resources/thumbnails/000/364/628/small_2x/Chef_Avatar_Illustration-03.jpg"
            }
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <textarea
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            localStorage.setItem("bio", e.target.value);
          }}
          className="textarea textarea-bordered mb-4 w-full"
        />
        <button
          onClick={handleProfileUpdate}
          className="btn w-full bg-blue-600 text-white transition hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold text-blue-600">
          🔐 Change Password
        </h2>
        <input
          type="password"
          placeholder="Current password"
          className="input input-bordered mb-3 w-full"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="input input-bordered mb-4 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordChange}
          className="btn w-full bg-blue-500 text-white transition hover:bg-blue-600"
        >
          Change Password
        </button>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-6 text-lg shadow dark:bg-zinc-800 md:flex-row">
        <Link
          to="/favorites"
          className="btn btn-outline btn-info flex w-full items-center justify-center gap-2 md:w-1/2"
        >
          <FaHeart /> My Favorites
        </Link>
        <Link
          to="/my-recipes"
          className="btn btn-outline btn-primary flex w-full items-center justify-center gap-2 md:w-1/2"
        >
          <GiCook /> My Recipes
        </Link>
      </div>
    </div>
  );
}
