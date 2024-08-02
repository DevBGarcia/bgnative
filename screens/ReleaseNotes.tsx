import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SearchSelectDropdown } from '../components/SearchSelectDropdown';
import { ReleaseId, releaseIdList, ReleaseNotesContents } from '../utils/ReleaseNotesHelper';

export const ReleaseNotes = () => {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(releaseIdList[0]);

  return (
    <View style={styles.screenContainer}>
      <SearchSelectDropdown
        data={releaseIdList}
        selectedValue={selectedReleaseId}
        setSelectedValue={setSelectedReleaseId}
      />
      <ReleaseNotesContents releaseId={selectedReleaseId as ReleaseId} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 8,
    gap: 8,
  },
  releaseNotesText: {
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
});
