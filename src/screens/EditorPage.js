import { NotePage } from "@/screens";
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, PanResponder } from 'react-native';

const STORAGE_KEY = 'silo_note';

// Create debounced save function outside component
const createDebouncedSave = (callback) => debounce(callback, 1000);

export default function EditorPage({ onNavigateToArchive, onArchiveNote, archivedNotes, setArchivedNotes }) {
  const [currentNote, setCurrentNote] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [editingArchivedNoteId, setEditingArchivedNoteId] = useState(null);
  const wordCount = currentNote.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Create a stable reference to the save function
  const saveFunction = useCallback(async (note) => {
    try {
      setSaveStatus('saving');
      if (editingArchivedNoteId !== null) {
        // Update the archived note
        setArchivedNotes(prevNotes => 
          prevNotes.map(note => 
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
  }, [editingArchivedNoteId, currentNote, setArchivedNotes]);

  // Create a stable debounced save function
  const debouncedSaveRef = useRef(null);
  useEffect(() => {
    debouncedSaveRef.current = createDebouncedSave(saveFunction);
    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [saveFunction]);

  // Update current note with debounced save
  const updateNote = useCallback((note) => {
    setCurrentNote(note);
    debouncedSaveRef.current?.(note);
  }, []);

  // Function to start a new note
  const startNewNote = () => {
    setCurrentNote('');
    setEditingArchivedNoteId(null);
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

  // PanResponder for slide down gesture
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < 20;
      },
      onPanResponderEnd: (evt, gestureState) => {
        if (gestureState.vy > 0.5) Keyboard.dismiss();
      },
    })
  ).current;

  return (
    <NotePage
      currentNote={currentNote}
      setCurrentNote={updateNote}
      wordCount={wordCount}
      archiveNote={onArchiveNote}
      toggleArchive={onNavigateToArchive}
      panResponder={panResponder}
      saveStatus={saveStatus}
      isEditingArchivedNote={editingArchivedNoteId !== null}
      startNewNote={startNewNote}
    />
  );
} 