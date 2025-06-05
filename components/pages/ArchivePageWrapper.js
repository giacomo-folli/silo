import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import ArchivePage from "./ArchivePage";

const ARCHIVE_STORAGE_KEY = 'silo_notes_archive';

export default function ArchivePageWrapper({ onNavigateToEditor, onLoadArchivedNote }) {
  const [archivedNotes, setArchivedNotes] = useState([]);

  // Function to delete a note from the archive
  const deleteNote = async (id) => {
    const updatedNotes = archivedNotes.filter(note => note.id !== id);
    setArchivedNotes(updatedNotes);
  };

  // Effect to load archived notes from storage on initial mount
  useEffect(() => {
    const loadArchivedNotes = async () => {
      try {
        const savedArchivedNotes = await AsyncStorage.getItem(ARCHIVE_STORAGE_KEY);
        if (savedArchivedNotes !== null) {
          setArchivedNotes(JSON.parse(savedArchivedNotes));
        }
      } catch (e) {
        console.error('Failed to load archived notes from storage', e);
      }
    };
    loadArchivedNotes();
  }, []);

  // Effect to save archived notes to storage whenever they change
  useEffect(() => {
    const saveArchivedNotes = async () => {
      try {
        await AsyncStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archivedNotes));
      } catch (e) {
        console.error('Failed to save archived notes', e);
      }
    };
    saveArchivedNotes();
  }, [archivedNotes]);

  return (
    <ArchivePage
      archivedNotes={archivedNotes}
      loadArchivedNote={(note) => {
        onLoadArchivedNote(note);
        onNavigateToEditor();
      }}
      deleteNote={deleteNote}
      toggleArchive={onNavigateToEditor}
    />
  );
} 