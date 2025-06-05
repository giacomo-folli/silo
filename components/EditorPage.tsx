import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { debounce, DebouncedFunc } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import NotePage from "../components/NotePage";
import GestureHandler from "./GestureHandler";

const STORAGE_KEY = 'silo_note';

// Create debounced save function outside component
const createDebouncedSave = (callback: (note: string) => Promise<void>): DebouncedFunc<(note: string) => Promise<void>> => 
  debounce(callback, 1000);

interface EditorPageProps {
  archivedNotes: { id: number; content: string }[];
  setArchivedNotes: (notes: { id: number; content: string }[]) => void;
}

export default function EditorPage({ archivedNotes, setArchivedNotes }: EditorPageProps) {
  const router = useRouter();
  const [currentNote, setCurrentNote] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [editingArchivedNoteId, setEditingArchivedNoteId] = useState<number | null>(null);
  const wordCount = currentNote.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Create a stable reference to the save function
  const saveFunction = useCallback(async (note: string) => {
    try {
      setSaveStatus('saving');
      if (editingArchivedNoteId !== null) {
        // Update the archived note
        setArchivedNotes(
          archivedNotes.map(note => 
            note.id === editingArchivedNoteId 
              ? { ...note, content: currentNote }
              : note
          )
        );
      } else {
        // Save as current note
        await AsyncStorage.setItem(STORAGE_KEY, note);
      }
      setSaveStatus('saved');
    } catch (e) {
      console.error('Failed to save note', e);
      setSaveStatus('error');
    }
  }, [editingArchivedNoteId, currentNote, setArchivedNotes, archivedNotes]);

  // Create a stable debounced save function
  const debouncedSaveRef = useRef<DebouncedFunc<(note: string) => Promise<void>> | null>(null);
  useEffect(() => {
    debouncedSaveRef.current = createDebouncedSave(saveFunction);
    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [saveFunction]);

  // Update current note with debounced save
  const updateNote = useCallback((note: string) => {
    setCurrentNote(note);
    debouncedSaveRef.current?.(note);
  }, []);

  // Function to start a new note
  const startNewNote = () => {
    setCurrentNote('');
    setEditingArchivedNoteId(null);
  };

  // Function to archive the current note
  const archiveNote = () => {
    if (currentNote.trim().length > 0) {
      const newNote = { id: Date.now(), content: currentNote };
      setArchivedNotes([...archivedNotes, newNote]);
      setCurrentNote('');
    }
  };

  // Effect to load data from storage on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedNote !== null) {
          setCurrentNote(savedNote);
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      }
    };
    loadData();
  }, []);



  // Handle swipe to archive
  const handleSwipeLeft = useCallback(() => {
    // Only navigate to archive if we're not already viewing an archived note
    if (editingArchivedNoteId === null) {
      router.push('/(tabs)/archive');
    }
  }, [editingArchivedNoteId, router]);

  // Handle swipe right from archive (navigate back to editor)
  const handleSwipeRight = useCallback(() => {
    // If we're viewing an archived note, go back to the editor
    if (editingArchivedNoteId !== null) {
      startNewNote();
    }
  }, [editingArchivedNoteId, startNewNote]);
  
  // Handle swipe down to dismiss keyboard
  const handleSwipeDown = useCallback(() => {
    // Additional swipe down handling if needed
    console.log('Swiped down');
  }, []);

  return (
    <GestureHandler 
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeDown={handleSwipeDown}
      dismissKeyboardOnSwipeDown={true}
    >
      <NotePage
        currentNote={currentNote}
        setCurrentNote={updateNote}
        wordCount={wordCount}
        archiveNote={archiveNote}
        toggleArchive={() => router.push('/(tabs)/archive')}
        saveStatus={saveStatus}
        isEditingArchivedNote={editingArchivedNoteId !== null}
        startNewNote={startNewNote}
      />
    </GestureHandler>
  );
} 