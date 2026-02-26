"use client";

interface Props {
  bookmark: any;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteBookmarkModal({
  bookmark,
  onCancel,
  onConfirm,
}: Props) {
  if (!bookmark) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">
          Delete Bookmark?
        </h3>

        <p className="text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-medium">
            {bookmark.title}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}