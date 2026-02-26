"use client";

interface Props {
  bookmark: any;
  setBookmark: (b: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditBookmarkModal({
  bookmark,
  setBookmark,
  onCancel,
  onSave,
}: Props) {
  if (!bookmark) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">
          Edit Bookmark
        </h3>

        <input
          className="input-field w-full"
          value={bookmark.title}
          onChange={(e) =>
            setBookmark({ ...bookmark, title: e.target.value })
          }
        />

        <input
          className="input-field w-full"
          value={bookmark.url}
          onChange={(e) =>
            setBookmark({ ...bookmark, url: e.target.value })
          }
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}