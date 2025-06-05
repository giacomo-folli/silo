import NotePage from "@/components/pages/NotePage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Keyboard, PanResponder } from 'react-native';
import ArchivePage from "./components/pages/ArchivePage";

const ARCHIVE_STORAGE_KEY = 'silo_notes_archive';
const STORAGE_KEY = 'silo_note'; // Added STORAGE_KEY definition  

export default function App() {
  const [currentNote, setCurrentNote] = useState('');
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const wordCount = currentNote.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Function to move the current note to the archive
  const archiveNote = () => {
    if (currentNote.trim().length > 0) {
      setArchivedNotes([...archivedNotes, { id: Date.now(), content: currentNote }]);
      setCurrentNote('');
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
    setArchivedNotes(archivedNotes.filter(item => item.id !== note.id));
    setShowArchive(false);
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

  // Effect to save current note and archived notes to storage whenever they change
  useEffect(() => {
    const saveData = async () => {
      try {
        // Save current note
        await AsyncStorage.setItem(STORAGE_KEY, currentNote);
        // Save archived notes
        await AsyncStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archivedNotes));
      } catch (e) {
        console.error('Failed to save data to storage', e);
      }
    };
    saveData();
  }, [currentNote, archivedNotes]);

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
      setCurrentNote={setCurrentNote}
      wordCount={wordCount}
      archiveNote={archiveNote}
      toggleArchive={toggleArchive}
      panResponder={panResponder}
    />
  );

}

