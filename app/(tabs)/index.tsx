import React, { useState } from 'react';
import EditorPage from "../../components/EditorPage";

export default function EditorTab() {
  const [archivedNotes, setArchivedNotes] = useState<{ id: number; content: string }[]>([]);

  return (      
      <EditorPage
        archivedNotes={archivedNotes}
        setArchivedNotes={setArchivedNotes}
      />
  );
}