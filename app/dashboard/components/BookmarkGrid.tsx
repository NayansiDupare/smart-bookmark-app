"use client";

import DraggableBookmarkItem from "./DraggableBookmarkItem";

interface BookmarkGridProps {
  bookmarks: any[];
  togglePin: (b: any) => void;
  setEditing: (b: any) => void;
  showArchived: boolean;
  restoreBookmark: (id: string) => void;
  archiveBookmark: (id: string) => void;
  permanentlyDeleteBookmark: (id: string) => void;
}

export default function BookmarkGrid({
  bookmarks,
  togglePin,
  setEditing,
  showArchived,
  restoreBookmark,
  archiveBookmark,
  permanentlyDeleteBookmark,
}: BookmarkGridProps) {

  if (bookmarks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        {showArchived
          ? "No archived bookmarks yet."
          : "No bookmarks found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookmarks.map((bm) => (
        <DraggableBookmarkItem
        key={bm.id}
        bookmark={bm}
        togglePin={togglePin}
        setEditing={setEditing}
        showArchived={showArchived}
        restoreBookmark={restoreBookmark}
        archiveBookmark={archiveBookmark}
        permanentlyDeleteBookmark={permanentlyDeleteBookmark}
      />
      ))}
    </div>
  );
}