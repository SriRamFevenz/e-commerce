import { useEffect, useState } from "react";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    name: string;
    email: string;
    role: string;
    ordersCount?: number;
    totalSpent?: number;
}

const Settings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Profile Edit State
    const [newName, setNewName] = useState("");

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

    useEffect(() => {
        fetchProfile();
        generateConfirmationText();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/users/profile");
            setProfile(res.data);
            setNewName(res.data.name);
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
            const res = await api.put("/users/profile", { name: newName });
            setProfile(res.data.user);
            setSuccess("Profile updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
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

    if (!profile && !error) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2>Public Profile</h2>
                            <p style={{ color: '#6b7280' }}>Manage your personal information</p>
                        </div>

                        <div className="avatar-section">
                            <div className="avatar-large">
                                {profile?.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-black">Change Photo</button>
                                <button className="btn-outline">Delete</button>
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
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                Email address cannot be changed.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                placeholder="Tell us about yourself..."
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>

                        <button className="btn-black" onClick={handleUpdateProfile}>Save Changes</button>
                    </div>
                );
            case 'security':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2>Security</h2>
                            <p style={{ color: '#6b7280' }}>Manage your password and account security</p>
                        </div>

                        <form onSubmit={handleUpdatePassword}>
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
            case 'delete':
                return (
                    <div className="profile-section">
                        <div className="settings-header">
                            <h2 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Trash2 size={24} /> Delete Account
                            </h2>
                            <p style={{ color: '#6b7280' }}>Permanently delete your account and all associated data</p>
                        </div>

                        <div className="danger-zone" style={{ marginTop: '2rem', paddingTop: 0, borderTop: 'none' }}>
                            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                                <h3 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '1rem' }}>⚠️ Warning</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    Once you delete your account, there is no going back. This action will:
                                </p>
                                <ul style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                                    <li>Permanently delete your profile and personal information</li>
                                    <li>Remove all your order history</li>
                                    <li>Cancel any pending orders</li>
                                    <li>Remove all saved preferences</li>
                                </ul>
                            </div>

                            {!showDeleteConfirm ? (
                                <button
                                    className="btn-outline"
                                    style={{ borderColor: '#fee2e2', color: '#dc2626', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
                            ) : (
                                <div style={{ background: '#fff', padding: '1.5rem', border: '2px solid #fee2e2', borderRadius: '8px' }}>
                                    <p style={{ fontWeight: '600', color: '#dc2626', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                        Are you absolutely sure?
                                    </p>
                                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                        To confirm, please type <strong style={{ color: '#dc2626', fontSize: '1.1rem', fontFamily: 'monospace' }}>{confirmationText}</strong> in the box below:
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
                                        style={{ marginBottom: '1rem', fontFamily: 'monospace', fontSize: '1rem' }}
                                    />
                                    {deleteError && (
                                        <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            {deleteError}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            className="btn-black"
                                            style={{ background: '#dc2626' }}
                                            onClick={handleDeleteAccount}
                                            disabled={userConfirmationInput !== confirmationText}
                                        >
                                            Yes, Delete My Account
                                        </button>
                                        <button
                                            className="btn-outline"
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setUserConfirmationInput("");
                                                setDeleteError("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                        <p>This section is coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
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
                            <User size={20} /> Profile
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={20} /> Security
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
                        style={{ marginTop: 'auto', color: '#dc2626', width: '100%', border: '1px solid #e5e7eb', justifyContent: 'center' }}
                        onClick={logout}
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
        </div>
    );
};

export default Settings;
