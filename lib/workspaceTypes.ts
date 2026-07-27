export interface Poem {
  id: string;
  title: string;
  text: string;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  poems: Poem[];
  createdAt: number;
}

export interface WorkspaceState {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activePoemId: string | null;
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultWorkspace(): WorkspaceState {
  const notebookId = createId();
  const poemId = createId();
  const now = Date.now();

  return {
    notebooks: [
      {
        id: notebookId,
        name: "Drafts",
        createdAt: now,
        poems: [
          {
            id: poemId,
            title: "Untitled",
            text: "",
            updatedAt: now,
          },
        ],
      },
    ],
    activeNotebookId: notebookId,
    activePoemId: poemId,
  };
}
