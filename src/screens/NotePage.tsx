import { IconSymbol } from "@/components/ui/IconSymbol";
import { styles } from "@/utils/styles/styles";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface NotePageProps {
  currentNote: string;
  setCurrentNote: (note: string) => void;
  wordCount: number;
  archiveNote: () => void;
  toggleArchive: () => void;
  panResponder: any; // TODO: fix this type
  saveStatus: 'saved' | 'saving' | 'error';
  isEditingArchivedNote: boolean;
  startNewNote: () => void;
}

export default function NotePage({ 
  currentNote, 
  setCurrentNote, 
  wordCount, 
  archiveNote, 
  toggleArchive, 
  panResponder,
  saveStatus,
  isEditingArchivedNote,
  startNewNote
}: NotePageProps) {
  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saved':
        return { name: 'checkmark.circle.fill'};
      case 'saving':
        return { name: 'clock.fill' };
      case 'error':
        return { name: 'exclamationmark.circle.fill' };
      default:
        return { name: 'checkmark.circle.fill' };
    }
  };

  const saveIcon = getSaveStatusIcon();

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
        <View style={styles.saveStatusContainer}>
          <IconSymbol
            name={saveIcon.name as any}
            size={16}
            color="black"
            style={styles.saveStatusIcon}
          />
        </View>
        <Text style={styles.wordCountText}>
          {wordCount === 1 ? `${wordCount} word` : `${wordCount} words`}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {isEditingArchivedNote ? (
          <TouchableOpacity onPress={startNewNote} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>New Note</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={archiveNote} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Archive Note</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleArchive} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}