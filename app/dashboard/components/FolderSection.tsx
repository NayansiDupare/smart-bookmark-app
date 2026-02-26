"use client";

import { Folder, FolderPlus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import DroppableFolderItem from "./DroppableFolderItem";

interface Props {
  folders: any[];
  selectedFolder: string | null;
  setSelectedFolder: (v: string | null) => void;
  getFolderCount: (id: string | null) => number;

  newFolderName: string;
  setNewFolderName: (v: string) => void;
  addFolder: () => void;

  toggleFolderPin: (folder: any) => void;
  setEditingFolder: (folder: any) => void;

  // 🔥 NEW
  archiveFolder: (id: string) => void;
  restoreFolder: (id: string) => void;
  permanentlyDeleteFolder: (id: string) => void;
  showArchived: boolean;
}

export default function FolderSection({
  folders,
  selectedFolder,
  setSelectedFolder,
  getFolderCount,
  newFolderName,
  setNewFolderName,
  addFolder,
  toggleFolderPin,
  setEditingFolder,
  archiveFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  showArchived,
}: Props) {

  const { setNodeRef: setAllRef } = useDroppable({
    id: "all",
  });

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Folders</h2>

      {/* ALL */}
      <div
        ref={setAllRef}
        onClick={() => setSelectedFolder(null)}
        className={`cursor-pointer px-3 py-2 rounded-lg ${
          selectedFolder === null
            ? "bg-soft font-medium"
            : "hover:bg-soft/60"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Folder size={16} /> All
          </span>
          <span className="text-sm text-primary">
            {getFolderCount(null)}
          </span>
        </div>
      </div>

      {folders.map((folder) => (
        <DroppableFolderItem
          key={folder.id}
          folder={folder}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          getFolderCount={getFolderCount}
          toggleFolderPin={toggleFolderPin}
          setEditingFolder={setEditingFolder}
          archiveFolder={archiveFolder}
          restoreFolder={restoreFolder}
          permanentlyDeleteFolder={permanentlyDeleteFolder}
          showArchived={showArchived}
        />
      ))}

      {/* Add Folder */}
      {!showArchived && (
        <div className="pt-4 border-t space-y-2">
          <input
            placeholder="New folder..."
            className="input-field w-full"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />

          <button
            onClick={addFolder}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <FolderPlus size={16} />
            Add Folder
          </button>
        </div>
      )}
    </div>
  );
}