import ArchivePageWrapper from "@/components/pages/ArchivePageWrapper";
import EditorPage from "@/components/pages/EditorPage";
import React, { useState } from 'react';

export default function App() {
  const [showArchive, setShowArchive] = useState(false);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');

  // Function to move the current note to the archive
  const archiveNote = () => {
    if (currentNote.trim().length > 0) {
      const newNote = { id: Date.now(), content: currentNote };
      setArchivedNotes([...archivedNotes, newNote]);
      setCurrentNote('');
    }
  };

  // Function to load an archived note back into the editor
  const loadArchivedNote = (note) => {
    setCurrentNote(note.content);
  };

  if (showArchive) {
    return (
      <ArchivePageWrapper
        onNavigateToEditor={() => setShowArchive(false)}
        onLoadArchivedNote={loadArchivedNote}
      />
    );
  }

  return (
    <EditorPage
      onNavigateToArchive={() => setShowArchive(true)}
      onArchiveNote={archiveNote}
      archivedNotes={archivedNotes}
      setArchivedNotes={setArchivedNotes}
    />
  );
}

