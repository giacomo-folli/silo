import React from 'react';
import ArchivePageWrapper from "../../components/ArchivePageWrapper";
import SwipeNavigator from '../../components/SwipeNavigator';

export default function ArchiveTab() {
  return (
    <SwipeNavigator>
      <ArchivePageWrapper
        onLoadArchivedNote={(note) => {
          // Handle note loading if needed - 
          // currently handled by navigation in ArchivePageWrapper
        }}
      />
    </SwipeNavigator>
  );
}