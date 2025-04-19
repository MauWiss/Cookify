import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePicture,
  updatePassword,
} from "../../api/api";
import { useAuth } from "../Auth/AuthContext.jsx";;
import { Link } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import defaultProfileImage from "../../images/female-chef-avatar-icon-vector-32095494.jpg";


export default function UserProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [profilePictureBase64, setProfilePictureBase64] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserProfile();
        console.log(res);
        setProfile(res.data);
        setBio(res.data.data.bio || "");
        setProfilePictureBase64(res.data.data.profilePictureBase64 || "");
        setBio(res.data.data.bio || "");
        setGender(res.data.data.gender || "");
        setBirthDate(res.data.data.birthDate || "");

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
      await updateUserProfilePicture({ profilePictureBase64 });

      setUser((prev) => ({
        ...prev,
        profileImage: `data:image/jpeg;base64,${profilePictureBase64}`,
      }));

      toast.success("✅ Profile picture updated!");
    } catch (err) {
      console.error("Error updating picture:", err);
      toast.error("❌ Failed to update picture.");
    }
  };

  const handleSaveBio = async () => {
    try {
      const payload = {};

      if (bio) payload.bio = bio;
      if (gender) payload.gender = gender;
      if (birthDate) payload.birthDate = birthDate;

      await updateUserProfile(payload);
      console.log(user);

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
    const getDefaultImage = () => {
    if (user?.gender === "male") return "/images/avatar-male.png";
    if (user?.gender === "female") return "/images/avatar-female.png";
    return "/images/avatar-default.png";
  };

  const imageSrc = user?.profileImage
    ? user.profileImage
    : "";


  if (!profile && !user)
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

      <p className="text-center  text-2xl text-gray-600 dark:text-gray-300">
        Logged in as: <strong>{user?.username}</strong>
      </p>

      {/* Profile Picture */}
      <div className="space-y-4 rounded-xl bg-white p-6 text-center shadow dark:bg-zinc-800">
        <img
          src={
            user?.profileImage &&
              user.profileImage.trim() !== "" &&
              user.profileImage !== "data:image/jpeg;base64,"
              ? user.profileImage
              : getDefaultImage()
          }
          alt="Profile"
          className="mx-auto h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow transition-all duration-300"
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


      {/* Bio + Gender + Birth Date */}
      <div className="space-y-4 rounded-xl bg-white p-6 text-left shadow dark:bg-zinc-800">
        {/* Bio */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your bio..."
            className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Birth Date */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded border border-gray-300 p-3 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveBio}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>


      {/* Password */}
      <div className="space-y-4 rounded-xl bg-white p-6 text-center shadow dark:bg-zinc-800">
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
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-col gap-4 md:flex-row py-6">
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
