import { useEffect, useState } from "react";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, User as UserIcon, Shield, Trash2, Moon, Sun, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { User } from "../../types";
import Loading from "../../components/Loading";
import ImageCropper from "../../components/ImageCropper";
import Spinner from "../../components/Spinner";

const Settings = () => {
    useDocumentTitle("Settings");
    const { user, logout, updateUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // Profile Edit State
    const [newName, setNewName] = useState("");
    const [newMobile, setNewMobile] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newAddress, setNewAddress] = useState("");

    // Password State
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Delete Account State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [userConfirmationInput, setUserConfirmationInput] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // Modal States
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showProfileConfirm, setShowProfileConfirm] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showDeletePicConfirm, setShowDeletePicConfirm] = useState(false);


    useEffect(() => {
        fetchProfile();
        generateConfirmationText();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/users/profile");
            setProfile(res.data);
            setNewName(res.data.name);
            setNewMobile(res.data.mobile || "");
            setNewBio(res.data.bio || "");
            setNewAddress(res.data.address || "");
        } catch (err) {
            setError("Failed to fetch profile");
        }
    };

    const generateConfirmationText = () => {
        const words = ['DELETE', 'REMOVE', 'CONFIRM', 'DESTROY', 'ERASE'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        setConfirmationText(`${randomWord}-${randomNum}`);
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await api.put("/users/profile", {
                name: newName,
                mobile: newMobile,
                bio: newBio,
                address: newAddress
            });
            setProfile(res.data.user);
            setSuccess("Profile updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    const handleUpdatePassword = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }
        try {
            await api.put("/users/profile/password", { oldPassword, newPassword });
            setSuccess("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || "Failed to update password");
        }
    };

    const handleDeleteAccount = async () => {
        if (userConfirmationInput !== confirmationText) {
            setDeleteError("Confirmation text does not match. Please try again.");
            return;
        }
        try {
            await api.delete("/users/profile");
            logout();
            navigate("/");
        } catch (err) {
            setDeleteError("Failed to delete account");
        }
    };



    if (!profile && !error) return <Loading />;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2>Public Profile</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information</p>
                        </div>

                        <div className="avatar-section">
                            <div className="avatar-large" style={{
                                backgroundImage: profile?.profilePicture ? `url(${profile.profilePicture})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: profile?.profilePicture ? 'transparent' : undefined
                            }}>
                                {!profile?.profilePicture && profile?.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const reader = new FileReader();
                                        reader.addEventListener("load", () => {
                                            setImageSrc(reader.result as string);
                                            setShowCropper(true);
                                        });
                                        reader.readAsDataURL(file);
                                        e.target.value = ""; // Reset input
                                    }}
                                />
                                <button className="btn-black" onClick={() => document.getElementById('avatar-upload')?.click()} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {uploading ? <><Spinner size="sm" /> Uploading...</> : "Change Photo"}
                                </button>
                                <button
                                    className="btn-outline"
                                    onClick={() => {
                                        if (profile?.profilePicture) {
                                            setShowDeletePicConfirm(true);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={profile?.email}
                                disabled
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Email address cannot be changed.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={newMobile}
                                onChange={(e) => setNewMobile(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>

                        <button className="btn-black" onClick={() => setShowProfileConfirm(true)}>Save Changes</button>
                    </div>
                );
            case 'security':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2>Security</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Manage your password and account security</p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); setShowPasswordConfirm(true); }}>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {passwordError && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{passwordError}</p>}
                            <button type="submit" className="btn-black">Update Password</button>
                        </form>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2>Appearance</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Customize the look and feel of the application</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Theme</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    className={`btn-outline ${theme === 'light' ? 'active-theme' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        borderColor: theme === 'light' ? 'var(--text-primary)' : 'var(--border-color)',
                                        background: theme === 'light' ? 'var(--bg-secondary)' : 'transparent',
                                        color: 'var(--text-primary)'
                                    }}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun size={18} /> Light
                                </button>
                                <button
                                    className={`btn-outline ${theme === 'dark' ? 'active-theme' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        borderColor: theme === 'dark' ? 'var(--text-primary)' : 'var(--border-color)',
                                        background: theme === 'dark' ? 'var(--bg-secondary)' : 'transparent',
                                        color: 'var(--text-primary)'
                                    }}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon size={18} /> Dark
                                </button>
                                <button
                                    className={`btn-outline ${theme === 'system' ? 'active-theme' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        borderColor: theme === 'system' ? 'var(--text-primary)' : 'var(--border-color)',
                                        background: theme === 'system' ? 'var(--bg-secondary)' : 'transparent',
                                        color: 'var(--text-primary)'
                                    }}
                                    onClick={() => setTheme('system')}
                                >
                                    <Palette size={18} /> System
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'delete':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Trash2 size={24} /> Delete Account
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Permanently delete your account and all associated data</p>
                        </div>

                        <div className="danger-zone" style={{ marginTop: '2rem', paddingTop: 0, borderTop: 'none' }}>
                            <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                                <h3 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '1rem' }}>⚠️ Warning</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    Once you delete your account, there is no going back. This action will:
                                </p>
                                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                                    <li>Permanently delete your profile and personal information</li>
                                    <li>Remove all your order history</li>
                                    <li>Cancel any pending orders</li>
                                    <li>Remove all saved preferences</li>
                                </ul>
                            </div>

                            <button
                                className="btn-outline"
                                style={{ borderColor: '#dc2626', color: '#dc2626', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                onClick={() => {
                                    setShowDeleteConfirm(true);
                                    generateConfirmationText();
                                    setUserConfirmationInput("");
                                    setDeleteError("");
                                }}
                            >
                                <Trash2 size={18} />
                                Delete My Account
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p>This section is coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <GoBackButton style={{ marginBottom: 0 }} />
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    <div style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Settings</h1>
                    </div>

                    <div className="sidebar-nav">
                        <div
                            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <UserIcon size={20} /> Profile
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={20} /> Security
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'appearance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appearance')}
                        >
                            <Palette size={20} /> Appearance
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'delete' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delete')}
                            style={{ color: activeTab === 'delete' ? '#dc2626' : '#dc2626' }}
                        >
                            <Trash2 size={20} /> Delete Account
                        </div>
                    </div>

                    <button
                        className="sidebar-item"
                        style={{ marginTop: 'auto', color: '#dc2626', width: '100%', border: '1px solid var(--border-color)', justifyContent: 'center' }}
                        onClick={() => setShowLogoutConfirm(true)}
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>

                <div className="settings-content">
                    <Notification message={error} type="error" />
                    <Notification message={success} type="success" />
                    {renderContent()}
                </div>
            </div>

            {/* Profile Update Confirmation */}
            <ConfirmationModal
                isOpen={showProfileConfirm}
                onClose={() => setShowProfileConfirm(false)}
                onConfirm={() => {
                    handleUpdateProfile();
                    setShowProfileConfirm(false);
                }}
                title="Update Profile"
                message="Are you sure you want to update your profile information?"
                confirmText="Save Changes"
            />

            {/* Password Update Confirmation */}
            <ConfirmationModal
                isOpen={showPasswordConfirm}
                onClose={() => setShowPasswordConfirm(false)}
                onConfirm={() => {
                    handleUpdatePassword();
                    setShowPasswordConfirm(false);
                }}
                title="Update Password"
                message="Are you sure you want to change your password?"
                confirmText="Update Password"
            />

            {/* Delete Account Confirmation */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                confirmText="Delete Account"
                isDanger={true}
                disabled={userConfirmationInput !== confirmationText}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                        This action cannot be undone.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        To confirm, please type <strong style={{ color: '#dc2626', fontFamily: 'monospace' }}>{confirmationText}</strong> below:
                    </p>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={`Type ${confirmationText} to confirm`}
                        value={userConfirmationInput}
                        onChange={(e) => {
                            setUserConfirmationInput(e.target.value);
                            setDeleteError("");
                        }}
                        style={{ fontFamily: 'monospace' }}
                    />
                    {deleteError && (
                        <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {deleteError}
                        </p>
                    )}
                </div>
            </ConfirmationModal>

            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={() => {
                    logout();
                    setShowLogoutConfirm(false);
                }}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                isDanger={true}
            />

            {/* Profile Picture Delete Confirmation */}
            <ConfirmationModal
                isOpen={showDeletePicConfirm}
                onClose={() => setShowDeletePicConfirm(false)}
                onConfirm={async () => {
                    try {
                        await api.delete("/users/profile/picture");
                        const updatedProfile = { ...profile!, profilePicture: "" };
                        setProfile(updatedProfile);
                        if (user) {
                            updateUser({ ...user, profilePicture: "" });
                        }
                        setSuccess("Profile picture removed");
                        setTimeout(() => setSuccess(""), 3000);
                        setShowDeletePicConfirm(false);
                    } catch (err) {
                        setError("Failed to remove image");
                        setShowDeletePicConfirm(false);
                    }
                }}
                title="Remove Profile Picture"
                message="Are you sure you want to remove your profile picture?"
                confirmText="Remove"
                isDanger={true}
            />

            {showCropper && imageSrc && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCancel={() => setShowCropper(false)}
                    onCropComplete={async (croppedBlob) => {
                        setShowCropper(false);
                        setUploading(true);
                        const formData = new FormData();
                        formData.append('image', croppedBlob);

                        try {
                            const res = await api.post("/users/profile/picture", formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const updatedProfile = { ...profile!, profilePicture: res.data.profilePicture };
                            setProfile(updatedProfile);
                            if (user) {
                                updateUser({ ...user, profilePicture: res.data.profilePicture });
                            }
                            setSuccess("Profile picture updated");
                            setTimeout(() => setSuccess(""), 3000);
                        } catch (err: any) {
                            setError(err.response?.data?.error || "Failed to upload image");
                        } finally {
                            setUploading(false);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Settings;
