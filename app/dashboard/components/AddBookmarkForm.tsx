"use client";

import { Plus } from "lucide-react";

interface AddBookmarkFormProps {
  title: string;
  setTitle: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  folderId: string | null;
  setFolderId: (v: string | null) => void;
  folders: any[];

  tags: any[];
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;

  addBookmark: () => void;
}

export default function AddBookmarkForm({
  title,
  setTitle,
  url,
  setUrl,
  folderId,
  setFolderId,
  folders,
  tags,
  selectedTags,
  setSelectedTags,
  addBookmark,
}: AddBookmarkFormProps) {
  return (
    <div className="card mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          placeholder="Title"
          className="input-field flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="https://example.com"
          className="input-field flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <select
          className="input-field flex-1"
          value={folderId ?? ""}
          onChange={(e) =>
            setFolderId(e.target.value || null)
          }
        >
          <option value="">No Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                if (selectedTags.includes(tag.id)) {
                  setSelectedTags(
                    selectedTags.filter((id) => id !== tag.id)
                  );
                } else {
                  setSelectedTags([...selectedTags, tag.id]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTags.includes(tag.id)
                  ? "bg-primary text-white"
                  : "bg-soft"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <button
          onClick={addBookmark}
          className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}