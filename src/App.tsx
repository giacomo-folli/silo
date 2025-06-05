import { ArchivePageWrapper, EditorPage } from '@/screens';
import React, { useState } from 'react';

interface ArchivedNote {
  id: number;
  content: string;
}

export default function App() {
  const [showArchive, setShowArchive] = useState(false);
  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  // Function to move the current note to the archive
  const archiveNote = () => {
    if (currentNote.trim().length > 0) {
      const newNote: ArchivedNote = { id: Date.now(), content: currentNote };
      setArchivedNotes([...archivedNotes, newNote]);
      setCurrentNote('');
    }
  };

  // Function to load an archived note back into the editor
  const loadArchivedNote = (note: ArchivedNote) => {
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