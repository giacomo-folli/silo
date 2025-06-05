import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
      width: '100%',
      paddingHorizontal: 10,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    saveStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveStatusIcon: {
      marginRight: 4,
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
      paddingHorizontal: 5,
      paddingVertical: 5,
      borderRadius: 5,
      marginLeft: 10, // Add space between text and delete button
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });