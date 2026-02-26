"use client";

import { Pin, Pencil, Trash } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  bookmark: any;
  togglePin: (b: any) => void;
  setEditing: (b: any) => void;
  showArchived: boolean;
  restoreBookmark: (id: string) => void;
  archiveBookmark: (id: string) => void;
  permanentlyDeleteBookmark: (id: string) => void;
}

export default function DraggableBookmarkItem({
  bookmark,
  togglePin,
  setEditing,
  showArchived,
  restoreBookmark,
  archiveBookmark,
  permanentlyDeleteBookmark,
}: Props) {

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: bookmark.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`card ${
        bookmark.pinned ? "border-2 border-primary" : ""
      }`}
    >
      <div className="flex justify-between">
        <div className="min-w-0">
          <p className="font-semibold truncate">
            {bookmark.title}
          </p>
          <p className="text-sm text-primary truncate">
            {bookmark.url}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {showArchived ? (
            <>
              {/* RESTORE */}
              <button
                onClick={() => restoreBookmark(bookmark.id)}
                className="text-sm text-primary hover:underline"
              >
                Restore
              </button>

              {/* PERMANENT DELETE */}
              <Trash
                size={16}
                className="cursor-pointer text-red-500"
                onClick={() =>
                  permanentlyDeleteBookmark(bookmark.id)
                }
              />
            </>
          ) : (
            <>
              {/* PIN */}
              <Pin
                size={18}
                className={
                  bookmark.pinned
                    ? "text-primary cursor-pointer"
                    : "text-gray-400 cursor-pointer"
                }
                onClick={() => togglePin(bookmark)}
              />

              {/* EDIT */}
              <Pencil
                size={16}
                className="cursor-pointer"
                onClick={() => setEditing(bookmark)}
              />

              {/* ARCHIVE */}
              <button
                onClick={() =>
                  archiveBookmark(bookmark.id)
                }
                className="text-sm text-gray-500 hover:text-primary"
              >
                Archive
              </button>

              {/* PERMANENT DELETE */}
              <Trash
                size={16}
                className="cursor-pointer text-red-500"
                onClick={() =>
                  permanentlyDeleteBookmark(bookmark.id)
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}