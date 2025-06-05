import ArchivePage, { ArchivedNote } from "@/components/ArchivePage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

const ARCHIVE_STORAGE_KEY = 'silo_notes_archive';

interface ArchivePageWrapperProps {
  onLoadArchivedNote: (note: ArchivedNote) => void;
}

export default function ArchivePageWrapper({ onLoadArchivedNote }: ArchivePageWrapperProps) {
  const router = useRouter();
  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>([]);

  // Function to delete a note from the archive
  const deleteNote = async (id: number) => {
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
        router.push('/(tabs)/editor');
      }}
      deleteNote={deleteNote}
      toggleArchive={() => router.push('/(tabs)/editor')}
    />
  );
} 