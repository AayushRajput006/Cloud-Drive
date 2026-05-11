import { useState, useEffect, useRef } from 'react';

function ContextMenu({ isOpen, x, y, onClose, onAction, file }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAction = (action) => {
    onAction?.(action, file);
    onClose();
  };

  const menuItems = [
    { icon: 'open_in_new', label: 'Open', action: 'open' },
    { icon: 'download', label: 'Download', action: 'download' },
    { icon: 'share', label: 'Share', action: 'share' },
    { icon: 'edit', label: 'Rename', action: 'rename' },
    { icon: 'content_copy', label: 'Copy', action: 'copy' },
    { icon: 'drive_file_move', label: 'Move', action: 'move' },
    { icon: 'delete', label: 'Delete', action: 'delete' },
    { icon: 'info', label: 'File Info', action: 'info' }
  ];

  if (!isOpen || !file) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-outline-variant rounded-lg shadow-xl py-sm z-50 min-w-48"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      <div className="space-y-xs">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleAction(item.action)}
            className="w-full px-sm py-xs text-left text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContextMenu;
