"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Pin,
  Pencil,
  Trash,
  FolderPlus,
  Folder,
} from "lucide-react";
import toast from "react-hot-toast";


interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder_id: string | null;
  pinned: boolean;
  created_at: string;
}

interface Folder {
  id: string;
  name: string;
  pinned: boolean;
  created_at: string;
}




export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedFolder, setSelectedFolder] =
    useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] =
    useState<string | null>(null);
  const [newFolderName, setNewFolderName] =
    useState("");

  const [search, setSearch] = useState("");

  const [editing, setEditing] =
    useState<Bookmark | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<Bookmark | null>(null);

  const [editingFolder, setEditingFolder] =
    useState<Folder | null>(null);
  const [deleteFolderTarget, setDeleteFolderTarget] =
    useState<Folder | null>(null);

   

  useEffect(() => {
    fetchFolders();
    fetchBookmarks();
  }, []);





  useEffect(() => {
  const bookmarkChannel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  const folderChannel = supabase
    .channel("realtime-folders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "folders",
      },
      () => {
        fetchFolders();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(bookmarkChannel);
    supabase.removeChannel(folderChannel);
  };
}, []);


  /* ================= FETCH ================= */

  const fetchFolders = async () => {
    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: true });

    if (data) setFolders(data);
  };

  const fetchBookmarks = async () => {
    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  /* ================= FOLDER CRUD ================= */

  const addFolder = async () => {
    if (!newFolderName)
      return toast.error("Folder name required");

    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("folders")
      .insert([
        {
          name: newFolderName,
          pinned: false,
          user_id: userData.user.id,
        },
      ])
      .select()
      .single();

    setFolders((prev) => [...prev, data]);
    setNewFolderName("");
    toast.success("Folder created");
  };

  const updateFolder = async () => {
    if (!editingFolder) return;

    await supabase
      .from("folders")
      .update({ name: editingFolder.name })
      .eq("id", editingFolder.id);

    setFolders((prev) =>
      prev.map((f) =>
        f.id === editingFolder.id ? editingFolder : f
      )
    );

    setEditingFolder(null);
    toast.success("Folder renamed");
  };

  const confirmDeleteFolder = async () => {
    if (!deleteFolderTarget) return;

    await supabase
      .from("bookmarks")
      .update({ folder_id: null })
      .eq("folder_id", deleteFolderTarget.id);

    await supabase
      .from("folders")
      .delete()
      .eq("id", deleteFolderTarget.id);

    setFolders((prev) =>
      prev.filter(
        (f) => f.id !== deleteFolderTarget.id
      )
    );

    if (selectedFolder === deleteFolderTarget.id) {
      setSelectedFolder(null);
    }

    setDeleteFolderTarget(null);
    toast.success("Folder deleted");
  };

  const toggleFolderPin = async (folder: Folder) => {
    await supabase
      .from("folders")
      .update({ pinned: !folder.pinned })
      .eq("id", folder.id);

    fetchFolders();
  };

  /* ================= BOOKMARK CRUD ================= */

  const addBookmark = async () => {
    if (!title || !url)
      return toast.error("Fill all fields");

    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        folder_id: folderId,
        pinned: false,
        user_id: userData.user.id,
      },
    ]);

    setTitle("");
    setUrl("");
    setFolderId(null);
    fetchBookmarks();
    toast.success("Bookmark added");
  };

  const updateBookmark = async () => {
    if (!editing) return;

    await supabase
      .from("bookmarks")
      .update({
        title: editing.title,
        url: editing.url,
      })
      .eq("id", editing.id);

    setEditing(null);
    fetchBookmarks();
    toast.success("Bookmark updated");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", deleteTarget.id);

    setDeleteTarget(null);
    fetchBookmarks();
    toast.success("Bookmark deleted");
  };

  const togglePin = async (bookmark: Bookmark) => {
    await supabase
      .from("bookmarks")
      .update({ pinned: !bookmark.pinned })
      .eq("id", bookmark.id);

    fetchBookmarks();
  };

  /* ================= FILTER ================= */

  const visibleBookmarks = bookmarks
    .filter((b) =>
      selectedFolder ? b.folder_id === selectedFolder : true
    )
    .filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );

  const getFolderCount = (folderId: string | null) => {
    return bookmarks.filter((b) =>
      folderId ? b.folder_id === folderId : true
    ).length;
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  /* ================= UI ================= */

  return (
  <div className="min-h-screen bg-background flex flex-col md:flex-row relative">

    {/* OVERLAY (Mobile Only) */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* SIDEBAR */}
    <div
      className={`
        fixed md:static top-0 left-0 h-full md:h-auto
        w-64 bg-card p-6 shadow-sm flex flex-col justify-between
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >

      {/* Close button (mobile only) */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden mb-4 btn-outline"
      >
        Close
      </button>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">
          Folders
        </h2>

        {/* ALL FOLDER */}
        <div
          onClick={() => {
            setSelectedFolder(null);
            setSidebarOpen(false);
          }}
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

        {/* FOLDERS */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`px-3 py-2 rounded-lg ${
              selectedFolder === folder.id
                ? "bg-soft font-medium"
                : "hover:bg-soft/60"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setSidebarOpen(false);
                }}
                className="cursor-pointer flex items-center gap-2"
              >
                <Folder size={16} />
                {folder.name}
              </span>

              <span className="text-sm text-primary">
                {getFolderCount(folder.id)}
              </span>
            </div>

            <div className="flex gap-3 mt-2">
              <Pin
                size={14}
                className={
                  folder.pinned
                    ? "text-primary cursor-pointer"
                    : "text-gray-400 cursor-pointer"
                }
                onClick={() => toggleFolderPin(folder)}
              />
              <Pencil
                size={14}
                className="cursor-pointer"
                onClick={() => setEditingFolder(folder)}
              />
              <Trash
                size={14}
                className="cursor-pointer text-red-500"
                onClick={() => setDeleteFolderTarget(folder)}
              />
            </div>
          </div>
        ))}

        {/* ADD FOLDER */}
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

    {/* MAIN */}
    <div className="flex-1 p-6 md:p-10">

      {/* TOGGLE BUTTON (Mobile Only) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden mb-4 btn-outline"
      >
        ☰ Menu
      </button>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          placeholder="Search bookmarks..."
          className="input-field w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ADD BOOKMARK */}
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

          <button
            onClick={addBookmark}
            className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* BOOKMARK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleBookmarks.map((bm) => (
          <div
            key={bm.id}
            className={`card ${
              bm.pinned ? "border-2 border-primary" : ""
            }`}
          >
            <div className="flex justify-between">
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {bm.title}
                </p>
                <p className="text-sm text-primary truncate">
                  {bm.url}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <Pin
                  size={18}
                  className={
                    bm.pinned
                      ? "text-primary cursor-pointer"
                      : "text-gray-400 cursor-pointer"
                  }
                  onClick={() => togglePin(bm)}
                />
                <Pencil
                  size={16}
                  className="cursor-pointer"
                  onClick={() => setEditing(bm)}
                />
                <Trash
                  size={16}
                  className="cursor-pointer text-red-500"
                  onClick={() => setDeleteTarget(bm)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* DELETE BOOKMARK MODAL */}
    {deleteTarget && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">

          <h3 className="text-lg font-semibold">
            Delete Bookmark?
          </h3>

          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {deleteTarget.title}
            </span>
            ?
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* DELETE FOLDER MODAL */}
{deleteFolderTarget && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">

      <h3 className="text-lg font-semibold">
        Delete Folder?
      </h3>

      <p className="text-sm text-gray-500">
        Are you sure you want to delete{" "}
        <span className="font-medium">
          {deleteFolderTarget.name}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setDeleteFolderTarget(null)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={confirmDeleteFolder}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
{/* EDIT BOOKMARK MODAL */}
{editing && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">

      <h3 className="text-lg font-semibold">
        Edit Bookmark
      </h3>

      <input
        className="input-field w-full"
        value={editing.title}
        onChange={(e) =>
          setEditing({ ...editing, title: e.target.value })
        }
      />

      <input
        className="input-field w-full"
        value={editing.url}
        onChange={(e) =>
          setEditing({ ...editing, url: e.target.value })
        }
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={updateBookmark}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
{/* EDIT FOLDER MODAL */}
{editingFolder && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">

      <h3 className="text-lg font-semibold">
        Rename Folder
      </h3>

      <input
        className="input-field w-full"
        value={editingFolder.name}
        onChange={(e) =>
          setEditingFolder({
            ...editingFolder,
            name: e.target.value,
          })
        }
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setEditingFolder(null)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={updateFolder}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


  </div>
);
}
