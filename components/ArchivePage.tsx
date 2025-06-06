import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../components/ui/IconSymbol";
import { styles } from "../utils/styles/styles";

export interface ArchivedNote {
  id: number;
  content: string;
}

interface ArchivePageProps {
  archivedNotes: ArchivedNote[];
  loadArchivedNote: (note: ArchivedNote) => void;
  deleteNote: (id: number) => void;
  toggleArchive: () => void;
}

export default function ArchivePage({ archivedNotes, loadArchivedNote, deleteNote, toggleArchive }: ArchivePageProps) {
  return <View style={styles.archiveContainer}>
    <Text style={styles.archiveTitle}>Notes</Text>
    <ScrollView>
      {archivedNotes.map((note) => (
        <View key={note.id} style={styles.archivedNoteItem}>
          <TouchableOpacity onPress={() => loadArchivedNote(note)}>
            <Text style={styles.archivedNoteText}>{note.content.substring(0, 45)}...</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
            <IconSymbol name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    <TouchableOpacity onPress={toggleArchive} style={styles.backButton}>
      <Text style={styles.backButtonText}>Back to Editor</Text>
    </TouchableOpacity>
  </View>
} 