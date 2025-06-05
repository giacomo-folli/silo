import { styles } from "@/styles/styles";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface NotePageProps {
  currentNote: string;
  setCurrentNote: (note: string) => void;
  wordCount: number;
  archiveNote: () => void;
  toggleArchive: () => void;
  panResponder: any; // TODO: fix this type
}

export default function NotePage({ currentNote, setCurrentNote, wordCount, archiveNote, toggleArchive, panResponder }: NotePageProps) {
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
      <View style={styles.wordCountContainer}>
        <Text style={styles.wordCountText}>Saved</Text>
        <Text style={styles.wordCountText}>{wordCount == 1 ? `${wordCount} word` : `${wordCount} words`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={archiveNote} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Archive Note</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleArchive} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}