import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { styles } from "@/styles/styles";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface NotePageProps {
  currentNote: string;
  setCurrentNote: (note: string) => void;
  wordCount: number;
  archiveNote: () => void;
  toggleArchive: () => void;
  panResponder: any; // TODO: fix this type
  saveStatus: 'saved' | 'saving' | 'error';
}

export default function NotePage({ 
  currentNote, 
  setCurrentNote, 
  wordCount, 
  archiveNote, 
  toggleArchive, 
  panResponder,
  saveStatus 
}: NotePageProps) {
  const theme = useColorScheme() ?? 'light';
  const iconColor = theme === 'light' ? Colors.light.icon : Colors.dark.icon;

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saved':
        return { name: 'checkmark.circle.fill', color: '#4CAF50' };
      case 'saving':
        return { name: 'clock.fill', color: iconColor };
      case 'error':
        return { name: 'exclamationmark.circle.fill', color: '#F44336' };
      default:
        return { name: 'checkmark.circle.fill', color: iconColor };
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
          {wordCount == 1 ? `${wordCount} word` : `${wordCount} words`}
        </Text>
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