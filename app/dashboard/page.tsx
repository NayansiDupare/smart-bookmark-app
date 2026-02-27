export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AddBookmarkForm from "./components/AddBookmarkForm";
import BookmarkGrid from "./components/BookmarkGrid";
import DeleteBookmarkModal from "./components/DeleteBookmarkModal";
import DeleteFolderModal from "./components/DeleteFolderModal";
import EditFolderModal from "./components/EditFolderModal";
import EditBookmarkModal from "./components/EditBookmarkModal";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { DndContext } from "@dnd-kit/core";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder_id: string | null;
  pinned: boolean;
  created_at: string;
  archived?: boolean;
  bookmark_tags?: any[];
}

interface Folder {
  id: string;
  name: string;
  pinned: boolean;
  created_at: string;
}

interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export default function Dashboard() {
  const [showArchived, setShowArchived] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");

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
  

  /* ================= SESSION ================= */

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/login";
        return;
      }

      fetchFolders();
      fetchBookmarks();
      fetchTags();
    };

    checkSession();
  }, []);


  useEffect(() => {
  fetchFolders();
  fetchBookmarks();
}, [showArchived]);

  /* ================= FETCH ================= */

  const fetchFolders = async () => {
  const { data: userData } =
    await supabase.auth.getUser();
  if (!userData.user) return;

  const { data } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("archived", showArchived) // 🔥 important
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: true });

  if (data) setFolders(data);
};

  const fetchTags = async () => {
    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", userData.user.id);

    if (data) setTags(data);
  };

  const fetchBookmarks = async () => {
  const { data: userData } =
    await supabase.auth.getUser();
  if (!userData.user) return;

  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      *,
      bookmark_tags (
        tag:tags (
          id,
          name
        )
      )
    `)
    .eq("user_id", userData.user.id)
    .eq("archived", showArchived) // 🔥 dynamic
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

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

  const toggleFolderPin = async (folder: Folder) => {
    await supabase
      .from("folders")
      .update({ pinned: !folder.pinned })
      .eq("id", folder.id);

    fetchFolders();
  };

  const updateFolder = async () => {
    if (!editingFolder) return;

    await supabase
      .from("folders")
      .update({ name: editingFolder.name })
      .eq("id", editingFolder.id);

    setEditingFolder(null);
    fetchFolders();
  };


const restoreBookmark = async (id: string) => {
  await supabase
    .from("bookmarks")
    .update({ archived: false })
    .eq("id", id);

  fetchBookmarks();
};

const restoreFolder = async (id: string) => {
  await supabase
    .from("folders")
    .update({ archived: false })
    .eq("id", id);

  await supabase
    .from("bookmarks")
    .update({ archived: false })
    .eq("folder_id", id);

  fetchFolders();
  fetchBookmarks();
};


const archiveBookmark = async (id: string) => {
  await supabase
    .from("bookmarks")
    .update({ archived: true })
    .eq("id", id);

  fetchBookmarks();
  toast.success("Bookmark archived");
};

const archiveFolder = async (id: string) => {
  // archive folder
  await supabase
    .from("folders")
    .update({ archived: true })
    .eq("id", id);

  // archive all bookmarks inside
  await supabase
    .from("bookmarks")
    .update({ archived: true })
    .eq("folder_id", id);

  fetchFolders();
  fetchBookmarks();
  toast.success("Folder archived");
};

const permanentlyDeleteFolder = async (id: string) => {
  // delete bookmark-tag relations
  const { data: bookmarksInside } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("folder_id", id);

  if (bookmarksInside) {
    for (const bm of bookmarksInside) {
      await supabase
        .from("bookmark_tags")
        .delete()
        .eq("bookmark_id", bm.id);
    }
  }

  // delete bookmarks
  await supabase
    .from("bookmarks")
    .delete()
    .eq("folder_id", id);

  // delete folder
  await supabase
    .from("folders")
    .delete()
    .eq("id", id);

  fetchFolders();
  fetchBookmarks();
  toast.success("Folder permanently deleted");
};

const permanentlyDeleteBookmark = async (id: string) => {
  // delete tag relations first
  await supabase
    .from("bookmark_tags")
    .delete()
    .eq("bookmark_id", id);

  // delete bookmark permanently
  await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  fetchBookmarks();
  toast.success("Bookmark permanently deleted");
};

const handleDragEnd = async (event: any) => {
  const { active, over } = event;

  if (!over) return;

  const bookmarkId = active.id;
  const folderId = over.id;

  await supabase
    .from("bookmarks")
    .update({ folder_id: folderId === "all" ? null : folderId })
    .eq("id", bookmarkId);

  fetchBookmarks();
};

  /* ================= TAG CRUD ================= */

  const createTag = async () => {
    if (!newTagName) return toast.error("Tag name required");

    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("tags")
      .insert([{ name: newTagName, user_id: userData.user.id }])
      .select()
      .single();

    setTags((prev) => [...prev, data]);
    setNewTagName("");
  };

  const deleteTag = async (id: string) => {
    await supabase.from("tags").delete().eq("id", id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  /* ================= BOOKMARK CRUD ================= */

  const addBookmark = async () => {
    if (!title || !url)
      return toast.error("Fill all fields");

    const { data: userData } =
      await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: inserted } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          folder_id: folderId,
          pinned: false,
          archived: false, // safe
          user_id: userData.user.id,
        },
      ])
      .select()
      .single();

    if (selectedTags.length > 0) {
      const relations = selectedTags.map((tagId) => ({
        bookmark_id: inserted.id,
        tag_id: tagId,
      }));

      await supabase.from("bookmark_tags").insert(relations);
    }

    setSelectedTags([]);
    setTitle("");
    setUrl("");
    setFolderId(null);

    fetchBookmarks();
  };

  const togglePin = async (bookmark: Bookmark) => {
    await supabase
      .from("bookmarks")
      .update({ pinned: !bookmark.pinned })
      .eq("id", bookmark.id);

    fetchBookmarks();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await supabase
      .from("bookmarks")
      .update({ archived: true })
      .eq("id", deleteTarget.id);

    setDeleteTarget(null);
    fetchBookmarks();
  };

  /* ================= FILTER ================= */

  const visibleBookmarks = bookmarks
    .filter((b) =>
      selectedFolder ? b.folder_id === selectedFolder : true
    )
    .filter((b) => {
      if (selectedTags.length === 0) return true;

      const tagIds =
        b.bookmark_tags?.map((bt: any) => bt.tag.id) || [];

      return selectedTags.every((id) =>
        tagIds.includes(id)
      );
    });

  const getFolderCount = (folderId: string | null) =>
  visibleBookmarks.filter((b) =>
    folderId ? b.folder_id === folderId : true
  ).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
     <DndContext onDragEnd={handleDragEnd}>
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        folders={folders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        getFolderCount={getFolderCount}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        addFolder={addFolder}
        tags={tags}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        createTag={createTag}
        toggleFolderPin={toggleFolderPin}
        setEditingFolder={setEditingFolder}
        archiveFolder={archiveFolder}
        restoreFolder={restoreFolder}
        permanentlyDeleteFolder={permanentlyDeleteFolder}
        deleteTag={deleteTag}
        showArchived={showArchived}            // ✅ add this
        setShowArchived={setShowArchived} 
        handleLogout={handleLogout}
      />

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

        <AddBookmarkForm
          title={title}
          setTitle={setTitle}
          url={url}
          setUrl={setUrl}
          folderId={folderId}
          setFolderId={setFolderId}
          folders={folders}
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          addBookmark={addBookmark}
        />

        <BookmarkGrid
        bookmarks={visibleBookmarks}
        togglePin={togglePin}
        setEditing={setEditing}
        showArchived={showArchived}
        restoreBookmark={restoreBookmark}
        archiveBookmark={archiveBookmark}
        permanentlyDeleteBookmark={permanentlyDeleteBookmark}
      />
      </div>

      
      <EditBookmarkModal
        bookmark={editing}
        setBookmark={setEditing}
        onCancel={() => setEditing(null)}
        onSave={() => {}}
      />

      <EditFolderModal
        folder={editingFolder}
        setFolder={setEditingFolder}
        onCancel={() => setEditingFolder(null)}
        onSave={updateFolder}
      />
    </div>
    </DndContext>
  );
}