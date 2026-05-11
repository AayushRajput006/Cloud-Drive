import { useState, useEffect } from 'react';

function ShareSettingsModal({ isOpen, onClose, share, onUpdate }) {
  const [settings, setSettings] = useState({
    password: false,
    passwordValue: '',
    expiresAt: null,
    downloadLimit: null,
    isActive: true
  });
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorPermissions, setNewCollaboratorPermissions] = useState({
    view: true,
    edit: false,
    download: true
  });

  useEffect(() => {
    if (share) {
      setSettings({
        password: !!share.shareSettings.passwordValue,
        passwordValue: share.shareSettings.passwordValue || '',
        expiresAt: share.shareSettings.expiresAt || null,
        downloadLimit: share.shareSettings.downloadLimit || null,
        isActive: share.shareSettings.isActive
      });
      setCollaborators(share.sharedWith || []);
    }
  }, [share]);

  const handleSave = () => {
    const updatedSettings = {
      ...settings,
      password: settings.password ? settings.passwordValue : null
    };
    onUpdate(share.id, updatedSettings);
    onClose();
  };

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail) return;

    const newCollaborator = {
      userId: `user_${Date.now()}`,
      name: newCollaboratorEmail.split('@')[0],
      email: newCollaboratorEmail,
      permissions: newCollaboratorPermissions,
      addedAt: new Date().toISOString()
    };

    setCollaborators([...collaborators, newCollaborator]);
    setNewCollaboratorEmail('');
    setNewCollaboratorPermissions({ view: true, edit: false, download: true });
  };

  const handleRemoveCollaborator = (userId) => {
    setCollaborators(collaborators.filter(c => c.userId !== userId));
  };

  const handleUpdateCollaboratorPermissions = (userId, permissions) => {
    setCollaborators(collaborators.map(c =>
      c.userId === userId ? { ...c, permissions } : c
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-md">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest">
          <h2 className="text-xl font-bold">Share Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-lg space-y-lg">
          {/* File Info */}
          <div className="bg-surface-container p-md rounded-lg">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-3xl text-primary">
                description
              </span>
              <div>
                <h3 className="font-semibold">{share.fileName}</h3>
                <p className="text-sm text-on-surface-variant">
                  Share Link: {share.shareLink}
                </p>
              </div>
            </div>
          </div>

          {/* Share Settings */}
          <div className="space-y-md">
            <h3 className="font-semibold text-lg">Security Settings</h3>

            {/* Password Protection */}
            <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
              <div>
                <p className="font-medium">Password Protection</p>
                <p className="text-sm text-on-surface-variant">
                  Require password to access
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.password}
                  onChange={(e) => setSettings({ ...settings, password: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {settings.password && (
              <input
                type="password"
                placeholder="Enter password"
                value={settings.passwordValue}
                onChange={(e) => setSettings({ ...settings, passwordValue: e.target.value })}
                className="w-full border border-outline-variant rounded-lg px-md py-sm"
              />
            )}

            {/* Expiration Date */}
            <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
              <div>
                <p className="font-medium">Expiration Date</p>
                <p className="text-sm text-on-surface-variant">
                  Set when the link expires
                </p>
              </div>
              <input
                type="datetime-local"
                value={settings.expiresAt ? settings.expiresAt.slice(0, 16) : ''}
                onChange={(e) => setSettings({ ...settings, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="border border-outline-variant rounded-lg px-md py-sm"
              />
            </div>

            {/* Download Limit */}
            <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
              <div>
                <p className="font-medium">Download Limit</p>
                <p className="text-sm text-on-surface-variant">
                  Limit number of downloads
                </p>
              </div>
              <input
                type="number"
                min="1"
                placeholder="Unlimited"
                value={settings.downloadLimit || ''}
                onChange={(e) => setSettings({ ...settings, downloadLimit: e.target.value ? parseInt(e.target.value) : null })}
                className="w-24 border border-outline-variant rounded-lg px-md py-sm"
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-md">
            <h3 className="font-semibold text-lg">Permissions</h3>
            <div className="grid grid-cols-2 gap-sm">
              <label className="flex items-center gap-sm p-md bg-surface-container rounded-lg cursor-pointer hover:bg-surface-container-high">
                <input
                  type="checkbox"
                  checked={share.permissions.view}
                  disabled
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>View</span>
              </label>
              <label className="flex items-center gap-sm p-md bg-surface-container rounded-lg cursor-pointer hover:bg-surface-container-high">
                <input
                  type="checkbox"
                  checked={share.permissions.edit}
                  disabled
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>Edit</span>
              </label>
              <label className="flex items-center gap-sm p-md bg-surface-container rounded-lg cursor-pointer hover:bg-surface-container-high">
                <input
                  type="checkbox"
                  checked={share.permissions.download}
                  disabled
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>Download</span>
              </label>
              <label className="flex items-center gap-sm p-md bg-surface-container rounded-lg cursor-pointer hover:bg-surface-container-high">
                <input
                  type="checkbox"
                  checked={share.permissions.reshare}
                  disabled
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>Reshare</span>
              </label>
            </div>
          </div>

          {/* Collaborators */}
          <div className="space-y-md">
            <h3 className="font-semibold text-lg">Collaborators</h3>
            
            {/* Add Collaborator */}
            <div className="p-md bg-surface-container rounded-lg space-y-sm">
              <input
                type="email"
                placeholder="Enter email address"
                value={newCollaboratorEmail}
                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-md py-sm"
              />
              <div className="flex flex-wrap gap-xs">
                <label className="flex items-center gap-xs text-sm">
                  <input
                    type="checkbox"
                    checked={newCollaboratorPermissions.view}
                    onChange={(e) => setNewCollaboratorPermissions({ ...newCollaboratorPermissions, view: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  View
                </label>
                <label className="flex items-center gap-xs text-sm">
                  <input
                    type="checkbox"
                    checked={newCollaboratorPermissions.edit}
                    onChange={(e) => setNewCollaboratorPermissions({ ...newCollaboratorPermissions, edit: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  Edit
                </label>
                <label className="flex items-center gap-xs text-sm">
                  <input
                    type="checkbox"
                    checked={newCollaboratorPermissions.download}
                    onChange={(e) => setNewCollaboratorPermissions({ ...newCollaboratorPermissions, download: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  Download
                </label>
              </div>
              <button
                onClick={handleAddCollaborator}
                className="w-full bg-primary text-white py-sm rounded-lg hover:bg-primary-container transition-colors"
              >
                Add Collaborator
              </button>
            </div>

            {/* Collaborators List */}
            {collaborators.length > 0 && (
              <div className="space-y-sm">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.userId}
                    className="flex items-center justify-between p-md bg-surface-container rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{collaborator.name}</p>
                      <p className="text-sm text-on-surface-variant">{collaborator.email}</p>
                      <div className="flex gap-xs mt-xs">
                        {collaborator.permissions.view && (
                          <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded">View</span>
                        )}
                        {collaborator.permissions.edit && (
                          <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded">Edit</span>
                        )}
                        {collaborator.permissions.download && (
                          <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded">Download</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-xs">
                      <button
                        onClick={() => handleUpdateCollaboratorPermissions(collaborator.userId, {
                          view: !collaborator.permissions.view,
                          edit: !collaborator.permissions.edit,
                          download: !collaborator.permissions.download
                        })}
                        className="text-xs bg-surface-container-high px-2 py-1 rounded hover:bg-surface-container transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.userId)}
                        className="text-xs bg-error-container px-2 py-1 rounded text-on-error-container hover:bg-error hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-lg py-md border-t border-outline-variant flex justify-end gap-sm sticky bottom-0 bg-surface-container-lowest">
          <button
            onClick={onClose}
            className="px-md py-sm rounded-lg border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-md py-sm rounded-lg bg-primary text-white hover:bg-primary-container transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareSettingsModal;
