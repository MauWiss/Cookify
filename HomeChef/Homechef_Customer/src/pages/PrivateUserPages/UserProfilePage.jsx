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

export default function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setBio(data.bio || "");
        setProfilePicture(data.profilePictureBase64 || "");
      } catch {
        toast.error("❌ Failed to load profile.");
      }
    }
    fetchData();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({ bio });
      toast.success("✅ Profile updated");
    } catch {
      toast.error("❌ Error updating profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      toast.warning("⚠️ Please fill both password fields.");
      return;
    }
    if (oldPassword === newPassword) {
      toast.warning("⚠️ New password must be different from the current one.");
      return;
    }
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("✅ Password updated");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error updating password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadBase64Image(file);
      setProfilePicture(res.data.base64);
      toast.success("✅ Image uploaded");
    } catch {
      toast.error("❌ Failed to upload image");
    }
  };

  if (!profile)
    return <div className="p-10 text-center">Loading profile...</div>;

  const imageSrc = profilePicture
    ? `data:image/jpeg;base64,${profilePicture}`
    : "https://static.vecteezy.com/system/resources/thumbnails/000/364/628/small_2x/Chef_Avatar_Illustration-03.jpg";

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8">
      {/* Title */}
      <h1 className="flex items-center justify-center gap-2 text-center text-4xl font-bold text-purple-800">
        <FaUserCircle className="text-5xl text-purple-600" />
        My Profile
      </h1>

      {/* User Info */}
      {(user?.username || profile.username) && (
        <p className="text-center text-zinc-600 dark:text-zinc-300">
          Logged in as: <strong>{user?.username || profile.username}</strong> (
          {user?.email || profile.email})
        </p>
      )}

      {/* Profile Image Upload */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <img
            src={imageSrc}
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-purple-500 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-800">
        <textarea
          placeholder="Your bio..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="textarea textarea-bordered mb-4 w-full"
        />
        <button
          onClick={handleProfileUpdate}
          className="btn btn-primary w-full"
        >
          Save Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold text-purple-800">
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
          className="btn btn-secondary w-full"
        >
          Change Password
        </button>
      </div>

      {/* Favorites & My Recipes */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-6 text-lg shadow-md dark:bg-zinc-800 md:flex-row">
        <Link
          to="/favorites"
          className="btn btn-outline btn-info flex w-full items-center justify-center gap-2"
        >
          <FaHeart /> My Favorites
        </Link>
        <Link
          to="/my-recipes"
          className="btn btn-outline btn-warning flex w-full items-center justify-center gap-2"
        >
          <GiCook /> My Recipes
        </Link>
      </div>
    </div>
  );
}
