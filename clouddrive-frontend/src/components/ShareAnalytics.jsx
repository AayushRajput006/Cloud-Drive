import { useState, useEffect } from 'react';
import shareService from '../services/shareService';

function ShareAnalytics({ isOpen, onClose, share }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (isOpen && share) {
      const data = shareService.getShareAnalytics(share.id);
      setAnalytics(data);
    }
  }, [isOpen, share]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-md">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest">
          <h2 className="text-xl font-bold">Share Analytics</h2>
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
                  Shared on {new Date(share.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {analytics ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div className="bg-surface-container p-md rounded-lg text-center">
                  <p className="text-3xl font-bold text-primary">{analytics.totalViews}</p>
                  <p className="text-sm text-on-surface-variant">Total Views</p>
                </div>
                <div className="bg-surface-container p-md rounded-lg text-center">
                  <p className="text-3xl font-bold text-secondary">{analytics.totalDownloads}</p>
                  <p className="text-sm text-on-surface-variant">Downloads</p>
                </div>
                <div className="bg-surface-container p-md rounded-lg text-center">
                  <p className="text-3xl font-bold text-tertiary">{analytics.uniqueVisitors}</p>
                  <p className="text-sm text-on-surface-variant">Unique Visitors</p>
                </div>
                <div className="bg-surface-container p-md rounded-lg text-center">
                  <p className="text-3xl font-bold text-warning">
                    {share.sharedWith?.length || 0}
                  </p>
                  <p className="text-sm text-on-surface-variant">Collaborators</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-sm">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <div className="bg-surface-container rounded-lg p-md">
                  {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                    <div className="space-y-sm">
                      {analytics.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-sm text-sm">
                          <span className="material-symbols-outlined text-lg text-on-surface-variant">
                            visibility
                          </span>
                          <div className="flex-1">
                            <p className="text-on-surface">
                              Viewed by {activity.visitorId}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {new Date(activity.timestamp).toLocaleString()} from {activity.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant text-center py-md">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>

              {/* Download Log */}
              <div className="space-y-sm">
                <h3 className="font-semibold text-lg">Download History</h3>
                <div className="bg-surface-container rounded-lg p-md">
                  {analytics.downloadLog && analytics.downloadLog.length > 0 ? (
                    <div className="space-y-sm">
                      {analytics.downloadLog.map((download, index) => (
                        <div key={index} className="flex items-center gap-sm text-sm">
                          <span className="material-symbols-outlined text-lg text-secondary">
                            download
                          </span>
                          <div className="flex-1">
                            <p className="text-on-surface">
                              Downloaded by {download.visitorId}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {new Date(download.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant text-center py-md">
                      No downloads yet
                    </p>
                  )}
                </div>
              </div>

              {/* Share Status */}
              <div className="bg-surface-container p-md rounded-lg space-y-sm">
                <h3 className="font-semibold">Share Status</h3>
                <div className="grid grid-cols-2 gap-sm text-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-sm">
                      {share.isActive ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={share.isActive ? 'text-success' : 'text-error'}>
                      {share.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {share.shareSettings.expiresAt && (
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>
                        Expires: {new Date(share.shareSettings.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {share.shareSettings.passwordValue && (
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Password Protected</span>
                    </div>
                  )}
                  {share.shareSettings.downloadLimit && (
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-sm">download</span>
                      <span>
                        {share.downloadCount}/{share.shareSettings.downloadLimit} downloads
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">
                analytics
              </span>
              <p className="text-on-surface-variant">No analytics data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-lg py-md border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-md py-sm rounded-lg bg-primary text-white hover:bg-primary-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareAnalytics;
