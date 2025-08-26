import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Lock, Activity, Save } from "lucide-react";
import { updateProfile } from "../../store/slices/authSlice";

const profileSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activityLogs } = useSelector((state) => state.analytics);
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.username?.toUpperCase() || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data) => {
    try {
      dispatch(updateProfile(data));
      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      // Simulate password change
      passwordForm.reset();
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    // { id: "password", name: "Change Password", icon: Lock },
    // { id: "activity", name: "Activity Log", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Profile Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Profile card */}

      {/* <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              className="h-20 w-20 rounded-full"
              src={user?.avatar}
              alt={user?.username}
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900">
              {user?.username}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {/* User icon instead of image */}
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900">
              {user?.username?.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "profile" && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Profile Information
          </h3>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  disabled={true}
                  type="text"
                  {...profileForm.register("name")}
                  className={`input-field ${
                    profileForm.formState.errors.name ? "border-red-300" : ""
                  }`}
                  placeholder="Enter your full name"
                />
                {profileForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  disabled={true}
                  type="email"
                  {...profileForm.register("email")}
                  className={`input-field ${
                    profileForm.formState.errors.email ? "border-red-300" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {profileForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                {...profileForm.register("avatar")}
                className="input-field"
                placeholder="Enter avatar URL"
              />
            </div> */}

            {/* <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {profileForm.formState.isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div> */}
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Change Password
          </h3>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                {...passwordForm.register("currentPassword")}
                className={`input-field ${
                  passwordForm.formState.errors.currentPassword
                    ? "border-red-300"
                    : ""
                }`}
                placeholder="Enter current password"
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register("newPassword")}
                  className={`input-field ${
                    passwordForm.formState.errors.newPassword
                      ? "border-red-300"
                      : ""
                  }`}
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  className={`input-field ${
                    passwordForm.formState.errors.confirmPassword
                      ? "border-red-300"
                      : ""
                  }`}
                  placeholder="Confirm new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="btn-primary flex items-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                {passwordForm.formState.isSubmitting
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activityLogs.slice(0, 20).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                    {activity.target && (
                      <span className="font-medium text-primary-600">
                        {" "}
                        {activity.target}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
