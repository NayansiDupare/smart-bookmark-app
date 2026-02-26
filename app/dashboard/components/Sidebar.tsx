"use client";

import FolderSection from "./FolderSection";
import TagSection from "./TagSection";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  folders: any[];
  selectedFolder: string | null;
  setSelectedFolder: (v: string | null) => void;
  getFolderCount: (id: string | null) => number;

  newFolderName: string;
  setNewFolderName: (v: string) => void;
  addFolder: () => void;

  tags: any[];
  newTagName: string;
  setNewTagName: (v: string) => void;
  createTag: () => void;

  toggleFolderPin: (folder: any) => void;
  setEditingFolder: (folder: any) => void;

  // 🔥 NEW
  archiveFolder: (id: string) => void;
  restoreFolder: (id: string) => void;
  permanentlyDeleteFolder: (id: string) => void;

  showArchived: boolean;
  setShowArchived: (value: boolean) => void;

  deleteTag: (id: string) => void;

  handleLogout: () => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  folders,
  selectedFolder,
  setSelectedFolder,
  getFolderCount,
  newFolderName,
  setNewFolderName,
  addFolder,
  tags,
  newTagName,
  setNewTagName,
  createTag,
  toggleFolderPin,
  setEditingFolder,
  archiveFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  showArchived,
  setShowArchived,
  deleteTag,
  handleLogout,
}: SidebarProps) {
  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-full md:h-auto
        w-64 bg-card p-6 shadow-sm flex flex-col overflow-y-auto
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="space-y-6 flex-1">

        {/* FOLDERS */}
        <FolderSection
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={(id) => {
            setSelectedFolder(id);
            setSidebarOpen(false);
          }}
          getFolderCount={getFolderCount}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          addFolder={addFolder}
          toggleFolderPin={toggleFolderPin}
          setEditingFolder={setEditingFolder}
          archiveFolder={archiveFolder}
          restoreFolder={restoreFolder}
          permanentlyDeleteFolder={permanentlyDeleteFolder}
          showArchived={showArchived}
        />

        {/* TAGS */}
        <TagSection
          tags={tags}
          newTagName={newTagName}
          setNewTagName={setNewTagName}
          createTag={createTag}
          deleteTag={deleteTag}
        />

        {/* VIEW TOGGLE */}
        <div
          onClick={() => {
            setShowArchived(false);
            setSelectedFolder(null);
            setSidebarOpen(false);
          }}
          className={`cursor-pointer px-3 py-2 rounded-lg ${
            !showArchived ? "bg-soft font-medium" : "hover:bg-soft/60"
          }`}
        >
          📂 Active
        </div>

        <div
          onClick={() => {
            setShowArchived(true);
            setSelectedFolder(null);
            setSidebarOpen(false);
          }}
          className={`cursor-pointer px-3 py-2 rounded-lg ${
            showArchived ? "bg-soft font-medium" : "hover:bg-soft/60"
          }`}
        >
          📦 Archived
        </div>
      </div>

      <div className="pt-6 border-t mt-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}