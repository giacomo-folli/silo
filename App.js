import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, PanResponder, Keyboard } from 'react-native';

const ARCHIVE_STORAGE_KEY = 'silo_notes_archive';
const STORAGE_KEY = 'silo_note'; // Added STORAGE_KEY definition

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // Add padding at the top for better spacing
    paddingHorizontal: 20,
  },
  editorContainer: {
    flex: 1,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    lineHeight: 22,
    color: '#333',
    textAlignVertical: 'top', // Align text to the top on Android
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wordCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-end',
    backgroundColor: '#f0f0f0', // Match container background
  },
  wordCountText: {
    fontSize: 12,
    color: '#555',
  },
  archiveContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  archiveTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  archivedNoteItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', // Arrange text and delete button in a row
    justifyContent: 'space-between', // Space out text and button
    alignItems: 'center', // Vertically center items
  },
  archivedNoteText: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Add space between text and delete button
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

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
      <View style={styles.archiveContainer}>
        <Text style={styles.archiveTitle}>Archived Notes</Text>
        <ScrollView>
          {archivedNotes.map((note) => (
            <View key={note.id} style={styles.archivedNoteItem}>
              <TouchableOpacity onPress={() => loadArchivedNote(note)}>
                <Text style={styles.archivedNoteText}>{note.content.substring(0, 100)}...</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={toggleArchive} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Editor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the main editor view
  return (
    <View style={styles.container} {...panResponder.panHandlers} >
      <TextInput
        style={styles.noteInput}
        multiline
        placeholder="Write your note here..."
        value={currentNote}
        onChangeText={setCurrentNote}
        textAlignVertical='top' // Ensure text starts at the top
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={archiveNote} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Archive Note</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleArchive} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Archive</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.wordCountContainer}>
        <Text style={styles.wordCountText}>Word Count: {wordCount}</Text>
      </View>
    </View>
  );

}

