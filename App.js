import NotePage from "@/components/pages/NotePage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, PanResponder } from 'react-native';
import ArchivePage from "./components/pages/ArchivePage";

const ARCHIVE_STORAGE_KEY = 'silo_notes_archive';
const STORAGE_KEY = 'silo_note'; // Added STORAGE_KEY definition  

export default function App() {
  const [currentNote, setCurrentNote] = useState('');
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [editingArchivedNoteId, setEditingArchivedNoteId] = useState(null);
  const wordCount = currentNote.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (note) => {
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
    }, 1000),
    [editingArchivedNoteId, currentNote]
  );

  // Update current note with debounced save
  const updateNote = (note) => {
    setCurrentNote(note);
    debouncedSave(note);
  };

  // Function to move the current note to the archive
  const archiveNote = () => {
    if (currentNote.trim().length > 0) {
      const newNote = { id: Date.now(), content: currentNote };
      setArchivedNotes([...archivedNotes, newNote]);
      setCurrentNote('');
      setEditingArchivedNoteId(null);
    }
  };

  // Function to delete a note from the archive
  const deleteNote = async (id) => {
    const updatedNotes = archivedNotes.filter(note => note.id !== id);
    setArchivedNotes(updatedNotes);
  };

  // Function to load an archived note back into the editor
  const loadArchivedNote = (note) => {
    setCurrentNote(note.content);
    setEditingArchivedNoteId(note.id);
    setShowArchive(false);
  };

  // Function to start a new note
  const startNewNote = () => {
    setCurrentNote('');
    setEditingArchivedNoteId(null);
  };

  // Function to toggle between the editor and the archive view
  const toggleArchive = () => {
    setShowArchive(!showArchive);
  };

  // Effect to load data from storage on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedNote !== null) {
          setCurrentNote(savedNote);
        }

        const savedArchivedNotes = await AsyncStorage.getItem(ARCHIVE_STORAGE_KEY);
        if (savedArchivedNotes !== null) {
          setArchivedNotes(JSON.parse(savedArchivedNotes));
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      }
    };
    loadData();
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

  // PanResponder for slide down gesture
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Activate pan responder if the swipe is primarily downwards
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < 20;
      },
      onPanResponderEnd: (evt, gestureState) => {
        // Dismiss the keyboard on a downward slide gesture
        if (gestureState.vy > 0.5) Keyboard.dismiss();
      },
    })
  ).current;

  // Render the UI based on whether the archive is being shown
  if (showArchive) {
    return (
      <ArchivePage
        archivedNotes={archivedNotes}
        loadArchivedNote={loadArchivedNote}
        deleteNote={deleteNote}
        toggleArchive={toggleArchive}
      />
    );
  }

  // Render the main editor view
  return (
    <NotePage
      currentNote={currentNote}
      setCurrentNote={updateNote}
      wordCount={wordCount}
      archiveNote={archiveNote}
      toggleArchive={toggleArchive}
      panResponder={panResponder}
      saveStatus={saveStatus}
      isEditingArchivedNote={editingArchivedNoteId !== null}
      startNewNote={startNewNote}
    />
  );

}

