import EditorPage from "@/components/EditorPage";
import React, { useState } from 'react';

export default function EditorTab() {
  const [archivedNotes, setArchivedNotes] = useState<{ id: number; content: string }[]>([]);

  return (
    <EditorPage
      archivedNotes={archivedNotes}
      setArchivedNotes={setArchivedNotes}
    />
  );
} 