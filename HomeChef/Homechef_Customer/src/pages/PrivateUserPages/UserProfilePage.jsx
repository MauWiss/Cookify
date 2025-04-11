import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  uploadBase64Image,
} from "../../api/api";

import { useAuth } from "../../hooks/useAuth";

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
        toast.error("Failed to load profile.");
      }
    }
    fetchData();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({ bio });
      toast.success("Profile updated");
    } catch {
      toast.error("Error updating profile");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("Password updated");
    } catch {
      toast.error("Incorrect current password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await uploadBase64Image(file);
      setProfilePicture(base64);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8">
      <h1 className="text-center text-3xl font-bold">👤 My Profile</h1>

      {/* ✅ הצגת שם משתמש ואימייל */}
      {user && (
        <p className="text-center text-zinc-600 dark:text-zinc-300">
          Logged in as: <strong>{user.username}</strong> ({user.email})
        </p>
      )}

      {/* תמונה + העלאה */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <img
            src={`data:image/jpeg;base64,${profilePicture}`}
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

      {/* טופס עריכה */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
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

      {/* טופס סיסמה */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">🔐 Change Password</h2>
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
    </div>
  );
}
