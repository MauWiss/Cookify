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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setBio(data.bio || "");
        setProfilePicPreview(data.profilePictureBase64 || "");
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
      setOldPassword("");
      setNewPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Incorrect current password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadBase64Image(file);
      setProfilePicPreview(res.base64);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      <h1 className="text-center text-3xl font-bold">👤 My Profile</h1>

      {/* פרטי משתמש */}
      <div className="space-y-2 rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <p>
          <span className="font-semibold">Username:</span> {profile.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* תמונת פרופיל */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">🖼 Profile Picture</h2>
        <div className="flex flex-col items-center gap-4">
          <img
            src={`data:image/jpeg;base64,${profilePicPreview}`}
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-purple-500 object-cover shadow"
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
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">📝 Bio</h2>
        <textarea
          className="textarea textarea-bordered mb-4 w-full"
          placeholder="Tell us about yourself..."
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button
          onClick={handleProfileUpdate}
          className="btn btn-primary w-full"
        >
          Save Bio
        </button>
      </div>

      {/* Change Password */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">🔐 Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          className="input input-bordered mb-3 w-full"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
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

      {/* כרטיסים: קישורים לעמודים נוספים */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-start rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
          <h3 className="mb-2 text-lg font-semibold">🍳 My Recipes</h3>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            View and manage recipes you've created.
          </p>
          <button
            onClick={() => (window.location.href = "/my-recipes")}
            className="btn btn-outline btn-primary"
          >
            Go to My Recipes
          </button>
        </div>

        <div className="flex flex-col items-start rounded-xl bg-white p-6 shadow dark:bg-zinc-800">
          <h3 className="mb-2 text-lg font-semibold">❤️ Favorites</h3>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Explore recipes you've marked as favorite.
          </p>
          <button
            onClick={() => (window.location.href = "/favorites")}
            className="btn btn-outline btn-secondary"
          >
            View Favorites
          </button>
        </div>
      </div>
    </div>
  );
}
