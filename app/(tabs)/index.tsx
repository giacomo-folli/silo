import React, { useState, useEffect } from 'react';
import EditorPage from "../../components/EditorPage";
import SwipeNavigator from '../../components/SwipeNavigator';

export default function EditorTab() {
  const [archivedNotes, setArchivedNotes] = useState<{ id: number; content: string }[]>([]);

  return (      
    <SwipeNavigator>
      <EditorPage
        archivedNotes={archivedNotes}
        setArchivedNotes={setArchivedNotes}
      />
    </SwipeNavigator>
  );
}