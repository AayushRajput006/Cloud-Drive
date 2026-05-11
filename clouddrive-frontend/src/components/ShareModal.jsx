import { useState, useEffect } from 'react';
import shareService from "../services/shareService";

function ShareModal({ isOpen, onClose, file, onShare }) {
  const [shareSettings, setShareSettings] = useState({
    type: 'link', // 'link' or 'email'
    permissions: {
      canView: true,
      canEdit: false,
      canComment: false,
      canDownload: true
    },
    expires: 'never', // '1day', '7days', '30days', 'never'
    password: false,
    passwordValue: ''
  });

  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Calculate expiration date based on selection
      let expiresAt = null;
      if (shareSettings.expires !== 'never') {
        const now = new Date();
        const days = parseInt(shareSettings.expires);
        expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      // Map permissions to shareService format
      const permissions = {
        view: shareSettings.permissions.canView,
        edit: shareSettings.permissions.canEdit,
        download: shareSettings.permissions.canDownload,
        reshare: false
      };

      const shareData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        shareType: shareSettings.type,
        permissions: permissions,
        password: shareSettings.password ? shareSettings.passwordValue : null,
        passwordValue: shareSettings.password ? shareSettings.passwordValue : null,
        expiresAt: expiresAt,
        downloadLimit: null,
        sharedBy: {
          userId: 'current-user',
          name: 'Current User',
          email: 'user@example.com'
        }
      };

      // Create share using shareService
      const createdShare = shareService.shareFile(file.id, shareData);
      
      if (createdShare) {
        setShareLink(createdShare.shareLink);
        // Also call the parent onShare if it exists for backward compatibility
        await onShare?.({
          fileId: file.id,
          shareId: createdShare.id,
          shareLink: createdShare.shareLink
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const fileId = file.id;
    return `${baseUrl}/shared/${fileId}`;
  };

  useEffect(() => {
    if (isOpen && file) {
      setShareLink(generateShareLink());
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-outline-variant rounded-xl w-full max-w-md mx-4 p-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-h2 text-h2 text-on-surface">Share "{file.name}"</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Share Type */}
        <div className="mb-lg">
          <h3 className="font-h3 text-h3 text-on-surface mb-md">Share Type</h3>
          <div className="flex gap-sm">
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="radio"
                name="shareType"
                value="link"
                checked={shareSettings.type === 'link'}
                onChange={(e) => setShareSettings(prev => ({ ...prev, type: e.target.value }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Share Link</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="radio"
                name="shareType"
                value="email"
                checked={shareSettings.type === 'email'}
                onChange={(e) => setShareSettings(prev => ({ ...prev, type: e.target.value }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Share via Email</span>
            </label>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-lg">
          <h3 className="font-h3 text-h3 text-on-surface mb-md">Permissions</h3>
          <div className="space-y-sm">
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="checkbox"
                checked={shareSettings.permissions.canView}
                onChange={(e) => setShareSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, canView: e.target.checked }
                }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Can view</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="checkbox"
                checked={shareSettings.permissions.canEdit}
                onChange={(e) => setShareSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, canEdit: e.target.checked }
                }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Can edit</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="checkbox"
                checked={shareSettings.permissions.canComment}
                onChange={(e) => setShareSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, canComment: e.target.checked }
                }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Can comment</span>
            </label>
            <label className="flex items-center gap-sm cursor-pointer">
              <input
                type="checkbox"
                checked={shareSettings.permissions.canDownload}
                onChange={(e) => setShareSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, canDownload: e.target.checked }
                }))}
                className="text-primary"
              />
              <span className="text-body-md text-on-surface">Can download</span>
            </label>
          </div>
        </div>

        {/* Expiration */}
        <div className="mb-lg">
          <h3 className="font-h3 text-h3 text-on-surface mb-md">Link Expiration</h3>
          <select
            value={shareSettings.expires}
            onChange={(e) => setShareSettings(prev => ({ ...prev, expires: e.target.value }))}
            className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface"
          >
            <option value="never">Never expires</option>
            <option value="1day">1 day</option>
            <option value="7days">7 days</option>
            <option value="30days">30 days</option>
          </select>
        </div>

        {/* Password Protection */}
        <div className="mb-lg">
          <label className="flex items-center gap-sm cursor-pointer">
            <input
              type="checkbox"
              checked={shareSettings.password}
              onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.checked }))}
              className="text-primary"
            />
            <span className="text-body-md text-on-surface">Password protect</span>
          </label>
          
          {shareSettings.password && (
            <input
              type="password"
              value={shareSettings.passwordValue}
              onChange={(e) => setShareSettings(prev => ({ ...prev, passwordValue: e.target.value }))}
              placeholder="Enter password"
              className="w-full mt-sm px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface"
            />
          )}
        </div>

        {/* Share Link */}
        {shareLink && (
          <div className="mb-lg">
            <h3 className="font-h3 text-h3 text-on-surface mb-md">Share Link</h3>
            <div className="flex gap-sm">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-body-md text-on-surface"
              />
              <button
                onClick={copyToClipboard}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center gap-sm"
              >
                <span className="material-symbols-outlined">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-sm mt-lg">
          <button
            onClick={onClose}
            className="px-md py-sm bg-surface-container text-on-surface-container rounded-lg font-semibold hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center gap-sm"
          >
            <span className="material-symbols-outlined">share</span>
            Share File
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
