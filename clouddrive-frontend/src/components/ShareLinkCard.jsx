import { useState } from 'react';

function ShareLinkCard({ share, onManage, onViewAnalytics, onRevoke, onCopyLink }) {
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = share.shareSettings.expiresAt && new Date(share.shareSettings.expiresAt) < new Date();
  const isPasswordProtected = share.shareSettings.passwordValue;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-md">
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-sm">
            <span className="material-symbols-outlined text-2xl text-primary">
              {share.fileType === 'application/pdf' ? 'picture_as_pdf' : 
               share.fileType.includes('image') ? 'image' : 
               share.fileType.includes('video') ? 'video_file' : 'description'}
            </span>
            <div>
              <h3 className="font-semibold text-on-surface truncate">{share.fileName}</h3>
              <div className="flex items-center gap-xs text-sm text-on-surface-variant">
                <span>Shared {new Date(share.createdAt).toLocaleDateString()}</span>
                {share.shareType === 'public' && (
                  <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full">Public</span>
                )}
                {isPasswordProtected && (
                  <span className="material-symbols-outlined text-sm">lock</span>
                )}
                {isExpired && (
                  <span className="bg-warning text-white text-xs px-2 py-0.5 rounded-full">Expired</span>
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="flex flex-wrap gap-xs mb-sm">
            {share.permissions.view && (
              <span className="text-xs bg-surface-container px-2 py-1 rounded text-on-surface-variant">
                View
              </span>
            )}
            {share.permissions.edit && (
              <span className="text-xs bg-surface-container px-2 py-1 rounded text-on-surface-variant">
                Edit
              </span>
            )}
            {share.permissions.download && (
              <span className="text-xs bg-surface-container px-2 py-1 rounded text-on-surface-variant">
                Download
              </span>
            )}
            {share.permissions.reshare && (
              <span className="text-xs bg-surface-container px-2 py-1 rounded text-on-surface-variant">
                Reshare
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-md text-sm text-on-surface-variant">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>{share.accessCount} views</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">download</span>
              <span>{share.downloadCount} downloads</span>
            </div>
            {share.sharedWith && share.sharedWith.length > 0 && (
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">group</span>
                <span>{share.sharedWith.length} people</span>
              </div>
            )}
          </div>

          {/* Share Link */}
          {showLink && (
            <div className="mt-sm flex gap-sm">
              <input
                type="text"
                readOnly
                value={share.shareLink}
                className="flex-1 text-xs bg-surface border border-outline-variant rounded px-sm py-1"
              />
              <button
                onClick={handleCopy}
                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary-container transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-xs">
          <button
            onClick={() => setShowLink(!showLink)}
            className="text-xs bg-surface-container px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high transition-colors"
            title="Show link"
          >
            <span className="material-symbols-outlined text-sm">link</span>
          </button>
          <button
            onClick={onViewAnalytics}
            className="text-xs bg-surface-container px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high transition-colors"
            title="View analytics"
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
          </button>
          <button
            onClick={onManage}
            className="text-xs bg-surface-container px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high transition-colors"
            title="Manage settings"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
          <button
            onClick={onRevoke}
            className="text-xs bg-error-container px-3 py-1.5 rounded text-on-error-container hover:bg-error hover:text-white transition-colors"
            title="Revoke share"
          >
            <span className="material-symbols-outlined text-sm">block</span>
          </button>
        </div>
      </div>

      {/* Expiration Warning */}
      {share.shareSettings.expiresAt && !isExpired && (
        <div className="mt-sm text-xs text-warning flex items-center gap-xs">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span>Expires: {new Date(share.shareSettings.expiresAt).toLocaleDateString()}</span>
        </div>
      )}

      {/* Download Limit Warning */}
      {share.shareSettings.downloadLimit && (
        <div className="mt-sm text-xs text-on-surface-variant flex items-center gap-xs">
          <span className="material-symbols-outlined text-sm">download</span>
          <span>{share.downloadCount}/{share.shareSettings.downloadLimit} downloads</span>
        </div>
      )}
    </div>
  );
}

export default ShareLinkCard;
