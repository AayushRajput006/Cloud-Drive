import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import { authService } from '../services/authService';

// Mock user data - replace with actual API call
const mockUserData = {
  id: 1,
  username: 'john.doe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://picsum.photos/200/200',
  createdAt: '2025-01-15T10:00:00Z',
  lastLoginAt: '2026-05-10T09:30:00Z',
  storageUsed: 5242880, // 5MB in bytes
  storageLimit: 5368709120, // 5GB in bytes
  fileCount: 156,
  folderCount: 23,
  sharedFiles: 12,
  starredFiles: 8,
  plan: {
    name: 'Premium',
    storageLimit: 536870912, // 50GB
    features: ['Unlimited uploads', 'Advanced sharing', 'Priority support']
  }
};

// Mock storage breakdown data
const mockStorageBreakdown = [
  { type: 'Documents', size: 2097152, count: 45, color: 'bg-blue-500' },
  { type: 'Images', size: 1572864, count: 67, color: 'bg-green-500' },
  { type: 'Videos', size: 1048576, count: 12, color: 'bg-purple-500' },
  { type: 'Audio', size: 524288, count: 23, color: 'bg-yellow-500' },
  { type: 'Other', size: 0, count: 9, color: 'bg-gray-500' }
];

// Mock recent activity
const mockRecentActivity = [
  {
    id: 1,
    action: 'uploaded',
    fileName: 'Q1 2024 Report.pdf',
    timestamp: '2026-05-10T14:30:00Z',
    size: 2048576
  },
  {
    id: 2,
    action: 'shared',
    fileName: 'Marketing Assets.zip',
    timestamp: '2026-05-09T11:15:00Z',
    size: 5242880
  },
  {
    id: 3,
    action: 'deleted',
    fileName: 'Old Draft.docx',
    timestamp: '2026-05-08T16:45:00Z',
    size: 102400
  }
];

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [storageBreakdown, setStorageBreakdown] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from API
    const token = authService.getToken();
    if (token) {
      // TODO: Replace with actual API calls
      // fetch('/api/user/profile', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // .then(response => response.json())
      // .then(data => {
      //   setUserData(data);
      //   setEditForm({
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     email: data.email
      //   });
      // });
      
      // fetch('/api/user/storage/breakdown', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // .then(response => response.json())
      // .then(data => setStorageBreakdown(data));
      
      // fetch('/api/user/activity/recent', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // .then(response => response.json())
      // .then(data => setRecentActivity(data));
      
      // Use mock data for now
      setUserData(mockUserData);
      setEditForm({
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        email: mockUserData.email
      });
      setStorageBreakdown(mockStorageBreakdown);
      setRecentActivity(mockRecentActivity);
    }
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // TODO: Call API to update profile
    console.log('Saving profile:', editForm);
    
    // Update local state
    setUserData(prev => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form to current values
    if (userData) {
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStoragePercentage = () => {
    if (!userData) return 0;
    return (userData.storageUsed / userData.storageLimit) * 100;
  };

  const getActivityIcon = (action) => {
    const iconMap = {
      uploaded: 'upload',
      shared: 'share',
      deleted: 'delete',
      downloaded: 'download',
      created: 'folder_new',
      moved: 'drive_file_move'
    };
    return iconMap[action] || 'info';
  };

  if (!userData) {
    return (
      <AppShell sidebar={<DriveSidebar active="Profile" />} topbar={<DriveTopbar title="Profile" />}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">refresh</span>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">Loading profile...</h2>
            <p className="text-body-md text-on-surface-variant">
              Please wait while we load your profile
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={<DriveSidebar active="Profile" />} topbar={<DriveTopbar title="Profile" />}>
      <div className="p-lg">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-surface-container-low rounded-xl p-lg mb-lg">
            <div className="flex items-center gap-lg">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-surface-container-low">
                  <span className="material-symbols-outlined text-sm text-on-primary">camera_alt</span>
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-sm">
                  <h1 className="font-h1 text-h1 text-on-surface">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <button
                    onClick={handleLogout}
                    className="px-sm py-xs bg-error text-on-error rounded-lg hover:bg-error-hover"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
                  </button>
                </div>
                
                <p className="text-body-md text-on-surface-variant mb-sm">
                  @{userData.username} • {userData.email}
                </p>
                
                <div className="flex items-center gap-sm">
                  <span className="px-xs py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-medium">
                    {userData.plan.name}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Member since {formatDate(userData.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-lg">
              <div className="bg-surface-container-low rounded-xl p-lg">
                <div className="flex items-center justify-between mb-md">
                  <h2 className="font-h2 text-h2 text-on-surface">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEditProfile}
                      className="px-sm py-xs bg-primary text-on-primary rounded-lg hover:bg-primary-hover"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-sm">
                      <button
                        onClick={handleCancelEdit}
                        className="px-sm py-xs bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-hover"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-sm py-xs bg-primary text-on-primary rounded-lg hover:bg-primary-hover"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-md">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-sm">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-sm">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="bg-surface-container-low rounded-xl p-lg">
                <h2 className="font-h2 text-h2 text-on-surface mb-md">Storage Breakdown</h2>
                
                <div className="mb-md">
                  <div className="flex justify-between items-center mb-sm">
                    <span className="text-label-sm text-on-surface-variant">Storage Used</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {formatFileSize(userData.storageUsed)} / {formatFileSize(userData.storageLimit)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                    />
                  </div>
                  <p className="text-label-xs text-on-surface-variant mt-sm">
                    {getStoragePercentage().toFixed(1)}% used
                  </p>
                </div>
                
                <div className="space-y-sm">
                  {storageBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-sm">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-label-sm text-on-surface-variant">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-label-sm text-on-surface-variant">
                          {formatFileSize(item.size)}
                        </span>
                        <span className="text-label-xs text-on-surface-variant ml-sm">
                          ({item.count} files)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-surface-container-low rounded-xl p-lg">
                <h2 className="font-h2 text-h2 text-on-surface mb-md">Recent Activity</h2>
                
                <div className="space-y-sm">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-sm p-sm bg-surface rounded-lg">
                      <span className="material-symbols-outlined text-primary">
                        {getActivityIcon(activity.action)}
                      </span>
                      <div className="flex-1">
                        <p className="text-body-sm text-on-surface">
                          {activity.action === 'uploaded' && 'Uploaded '}
                          {activity.action === 'shared' && 'Shared '}
                          {activity.action === 'deleted' && 'Deleted '}
                          {activity.action === 'downloaded' && 'Downloaded '}
                          {activity.action === 'created' && 'Created '}
                          {activity.action === 'moved' && 'Moved '}
                          {activity.fileName}
                        </p>
                        <p className="text-label-xs text-on-surface-variant">
                          {formatDateTime(activity.timestamp)} • {formatFileSize(activity.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-lg">
              <div className="bg-surface-container-low rounded-xl p-lg">
                <h2 className="font-h2 text-h2 text-on-surface mb-md">Statistics</h2>
                
                <div className="space-y-md">
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-on-surface-variant">Total Files</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {userData.fileCount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-on-surface-variant">Folders</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {userData.folderCount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-on-surface-variant">Shared Files</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {userData.sharedFiles}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-on-surface-variant">Starred Files</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {userData.starredFiles}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-on-surface-variant">Last Login</span>
                    <span className="font-semibold text-label-sm text-on-surface">
                      {formatDateTime(userData.lastLoginAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-lg">
                <h2 className="font-h2 text-h2 text-on-surface mb-md">Plan Details</h2>
                
                <div className="space-y-md">
                  <div>
                    <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-xs font-medium">
                      {userData.plan.name}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-label-sm text-on-surface-variant">Storage Limit</span>
                    <p className="font-semibold text-label-sm text-on-surface">
                      {formatFileSize(userData.plan.storageLimit)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-label-sm text-on-surface-variant mb-sm">Features</span>
                    <ul className="space-y-sm">
                      {userData.plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-sm text-label-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm text-success">check_circle</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default ProfilePage;
