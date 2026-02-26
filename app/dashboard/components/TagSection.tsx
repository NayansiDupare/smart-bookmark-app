"use client";

import { Trash } from "lucide-react";

interface Props {
  tags: any[];
  newTagName: string;
  setNewTagName: (v: string) => void;
  createTag: () => void;
  deleteTag: (id: string) => void;
}

export default function TagSection({
  tags,
  newTagName,
  setNewTagName,
  createTag,
  deleteTag,
}: Props) {
  return (
    <div className="pt-4 border-t space-y-2">
      <h3 className="font-medium">Tags</h3>

      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex justify-between items-center px-3 py-2 bg-soft rounded-lg"
        >
          <span className="text-sm">{tag.name}</span>

          <Trash
            size={14}
            className="cursor-pointer text-red-500"
            onClick={() => deleteTag(tag.id)}
          />
        </div>
      ))}

      <input
        placeholder="New tag..."
        className="input-field w-full"
        value={newTagName}
        onChange={(e) => setNewTagName(e.target.value)}
      />

      <button
        onClick={createTag}
        className="btn-outline w-full"
      >
        Add Tag
      </button>
    </div>
  );
}