"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  createDefaultWorkspace,
  createId,
  type Notebook,
  type WorkspaceState,
} from "@/lib/workspaceTypes";

const STORAGE_KEY = "rhythmic-thesaurus-v2";

function loadWorkspace(): WorkspaceState {
  if (typeof window === "undefined") return createDefaultWorkspace();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultWorkspace();
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (!parsed.notebooks?.length) return createDefaultWorkspace();
    return parsed;
  } catch {
    return createDefaultWorkspace();
  }
}

function saveWorkspace(state: WorkspaceState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const subscribeToNothing = () => () => {};

export function useWorkspaceStore() {
  // Reading storage in the initializer is safe because nothing renders until `hydrated` flips.
  const [state, setState] = useState<WorkspaceState>(loadWorkspace);
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveWorkspace(state), 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  const activeNotebook = state.notebooks.find((n) => n.id === state.activeNotebookId) ?? null;
  const activePoem =
    activeNotebook?.poems.find((p) => p.id === state.activePoemId) ?? null;

  const updatePoemText = useCallback((text: string) => {
    setState((prev) => {
      if (!prev.activeNotebookId || !prev.activePoemId) return prev;
      return {
        ...prev,
        notebooks: prev.notebooks.map((nb) =>
          nb.id !== prev.activeNotebookId
            ? nb
            : {
                ...nb,
                poems: nb.poems.map((p) =>
                  p.id !== prev.activePoemId
                    ? p
                    : { ...p, text, updatedAt: Date.now() }
                ),
              }
        ),
      };
    });
  }, []);

  const updatePoemTitle = useCallback((title: string) => {
    setState((prev) => {
      if (!prev.activeNotebookId || !prev.activePoemId) return prev;
      return {
        ...prev,
        notebooks: prev.notebooks.map((nb) =>
          nb.id !== prev.activeNotebookId
            ? nb
            : {
                ...nb,
                poems: nb.poems.map((p) =>
                  p.id !== prev.activePoemId
                    ? p
                    : { ...p, title, updatedAt: Date.now() }
                ),
              }
        ),
      };
    });
  }, []);

  const selectPoem = useCallback((notebookId: string, poemId: string) => {
    setState((prev) => ({
      ...prev,
      activeNotebookId: notebookId,
      activePoemId: poemId,
    }));
  }, []);

  const createNotebook = useCallback((name = "New Notebook") => {
    const id = createId();
    const poemId = createId();
    const now = Date.now();
    const notebook: Notebook = {
      id,
      name,
      createdAt: now,
      poems: [{ id: poemId, title: "Untitled", text: "", updatedAt: now }],
    };
    setState((prev) => ({
      ...prev,
      notebooks: [...prev.notebooks, notebook],
      activeNotebookId: id,
      activePoemId: poemId,
    }));
  }, []);

  const createPoem = useCallback(() => {
    const id = createId();
    const now = Date.now();
    setState((prev) => {
      if (!prev.activeNotebookId) return prev;
      return {
        ...prev,
        activePoemId: id,
        notebooks: prev.notebooks.map((nb) =>
          nb.id !== prev.activeNotebookId
            ? nb
            : {
                ...nb,
                poems: [
                  { id, title: "Untitled", text: "", updatedAt: now },
                  ...nb.poems,
                ],
              }
        ),
      };
    });
  }, []);

  const deletePoem = useCallback((poemId: string) => {
    setState((prev) => {
      if (!prev.activeNotebookId) return prev;
      const nb = prev.notebooks.find((n) => n.id === prev.activeNotebookId);
      if (!nb || nb.poems.length <= 1) return prev;

      const remaining = nb.poems.filter((p) => p.id !== poemId);
      return {
        ...prev,
        activePoemId: remaining[0]?.id ?? null,
        notebooks: prev.notebooks.map((n) =>
          n.id !== prev.activeNotebookId ? n : { ...n, poems: remaining }
        ),
      };
    });
  }, []);

  return {
    hydrated,
    notebooks: state.notebooks,
    activeNotebook,
    activePoem,
    activeNotebookId: state.activeNotebookId,
    updatePoemText,
    updatePoemTitle,
    selectPoem,
    createNotebook,
    createPoem,
    deletePoem,
  };
}
