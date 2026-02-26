"use client";

import { Folder, Pin, Pencil, Trash } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  folder: any;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
  getFolderCount: (id: string | null) => number;
  toggleFolderPin: (folder: any) => void;
  setEditingFolder: (folder: any) => void;

  // 🔥 NEW
  archiveFolder: (id: string) => void;
  restoreFolder: (id: string) => void;
  permanentlyDeleteFolder: (id: string) => void;
  showArchived: boolean;
}

export default function DroppableFolderItem({
  folder,
  selectedFolder,
  setSelectedFolder,
  getFolderCount,
  toggleFolderPin,
  setEditingFolder,
  archiveFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  showArchived,
}: Props) {

  const { setNodeRef } = useDroppable({
    id: folder.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`px-3 py-2 rounded-lg ${
        selectedFolder === folder.id
          ? "bg-soft font-medium"
          : "hover:bg-soft/60"
      }`}
    >
      <div className="flex justify-between items-center">
        <span
          onClick={() => setSelectedFolder(folder.id)}
          className="cursor-pointer flex items-center gap-2"
        >
          <Folder size={16} />
          {folder.name}
        </span>

        <span className="text-sm text-primary">
          {getFolderCount(folder.id)}
        </span>
      </div>

      <div className="flex gap-3 mt-2 items-center">
        {showArchived ? (
          <>
            {/* RESTORE */}
            <button
              onClick={() => restoreFolder(folder.id)}
              className="text-sm text-primary hover:underline"
            >
              Restore
            </button>

            {/* PERMANENT DELETE */}
            <Trash
              size={14}
              className="cursor-pointer text-red-500"
              onClick={() =>
                permanentlyDeleteFolder(folder.id)
              }
            />
          </>
        ) : (
          <>
            {/* PIN */}
            <Pin
              size={14}
              className={
                folder.pinned
                  ? "text-primary cursor-pointer"
                  : "text-gray-400 cursor-pointer"
              }
              onClick={() => toggleFolderPin(folder)}
            />

            {/* EDIT */}
            <Pencil
              size={14}
              className="cursor-pointer"
              onClick={() => setEditingFolder(folder)}
            />

            {/* ARCHIVE */}
            <button
              onClick={() => archiveFolder(folder.id)}
              className="text-sm text-gray-500 hover:text-primary"
            >
              Archive
            </button>

            {/* PERMANENT DELETE */}
            <Trash
              size={14}
              className="cursor-pointer text-red-500"
              onClick={() =>
                permanentlyDeleteFolder(folder.id)
              }
            />
          </>
        )}
      </div>
    </div>
  );
}