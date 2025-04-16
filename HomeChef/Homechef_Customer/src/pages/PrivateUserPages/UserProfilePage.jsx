import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { GiCook } from "react-icons/gi";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [profilePictureBase64, setProfilePictureBase64] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserProfile();
        setProfile(res.data);
        setBio(res.data.bio || "");
        setProfilePictureBase64(res.data.profilePictureBase64 || "");
      } catch (error) {
        toast.error("❌ Failed to load profile.");
      }
    }
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setProfilePictureBase64(base64String);
      toast.success("✅ Image loaded — click Save Picture");
    };
    reader.readAsDataURL(file);
  };

  const handleSavePicture = async () => {
    if (!profilePictureBase64) {
      toast.warning("⚠️ Please upload a picture first.");
      return;
    }

    try {
      await updateUserProfile({ profilePictureBase64 });
      toast.success("✅ Profile picture updated!");
    } catch (err) {
      toast.error("❌ Failed to update picture.");
    }
  };

  const handleSaveBio = async () => {
    try {
      await updateUserProfile({ bio });
      toast.success("✅ Bio updated!");
    } catch {
      toast.error("❌ Failed to update bio");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.warning("⚠️ Fill both fields.");
      return;
    }
    if (oldPassword === newPassword) {
      toast.warning("⚠️ New password must be different.");
      return;
    }
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("✅ Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data || "❌ Failed to update password");
    }
  };

  const imageSrc = profilePictureBase64
    ? `data:image/jpeg;base64,${profilePictureBase64}`
    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  if (!profile)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-300">
        Loading profile...
      </div>
    );

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8 px-4">
      <h1 className="flex items-center justify-center gap-2 text-center text-4xl font-bold text-blue-700 dark:text-blue-400">
        <FaUserCircle /> My Profile
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-300">
        Logged in as: <strong>{user?.username}</strong>
      </p>

      {/* Profile Picture */}
      <div className="space-y-4 rounded-xl bg-white p-6 text-center shadow dark:bg-zinc-800">
        <img
          src={imageSrc}
          alt="Profile"
          className="mx-auto h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow"
        />
        <div className="flex flex-col items-center gap-3">
          <label className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
            Change Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSavePicture}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Picture
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Your bio..."
          className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
        />
        <button
          onClick={handleSaveBio}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save Bio
        </button>
      </div>

      {/* Password */}
      <div className="space-y-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
          🔐 Change Password
        </h2>
        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
        />
        <button
          onClick={handleChangePassword}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Change Password
        </button>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Link
          to="/favorites"
          className="flex-1 rounded border border-blue-500 bg-blue-50 px-4 py-2 text-center text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:bg-zinc-900 dark:text-blue-400 dark:hover:bg-zinc-700"
        >
          <FaHeart className="mr-1 inline" />
          My Favorites
        </Link>
        <Link
          to="/my-recipes"
          className="flex-1 rounded border border-orange-500 bg-orange-50 px-4 py-2 text-center text-orange-600 hover:bg-orange-100 dark:border-orange-400 dark:bg-zinc-900 dark:text-orange-400 dark:hover:bg-zinc-700"
        >
          <GiCook className="mr-1 inline" />
          My Recipes
        </Link>
      </div>
    </div>
  );
}
