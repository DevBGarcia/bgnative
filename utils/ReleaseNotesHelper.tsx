import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export type ReleaseId = 'v1.0.0';

export const releaseIdList: ReleaseId[] = ['v1.0.0'];

export type ReleaseNotesProps = {
  releaseId: ReleaseId;
};

export const ReleaseNotesContents: React.FC<ReleaseNotesProps> = (props) => {
  const { releaseId } = props;

  if (releaseId === 'v1.0.0') {
    return (
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          persistentScrollbar={true}
        >
          <Text style={styles.subHeader}>Release Updates: </Text>
          <Text style={styles.releaseNotesText}>
            • Initial release! Basic functionality of an interval timer with some Halo-esque audio queues (Audio permission may need to be turned on){' '}
          </Text>
          <Text style={styles.releaseNotesText}>
            • Capabable of updating a single timer by interval count, interval time, rest time, warmup time, and name{' '}
          </Text>
          <Text style={styles.releaseNotesText}>
            • The app can be put to the background and push notifications will go through once the timer is finished. (Push notifications permission may need to
            be turned on)
          </Text>
          <View style={styles.sectionSpacer} />
          <Text style={styles.subHeader}>Future Updates: </Text>
          <Text style={styles.releaseNotesText}>• Update UI of the main timer screen (still looking at some designs to draw inspiration from)</Text>
          <Text style={styles.releaseNotesText}>• Updates to make the audio queues and warning audio toggleable via the edit screen </Text>
          <Text style={styles.releaseNotesText}>
            • Far future is to eventually make it so we can have more timers, but I'm trying to nail down 1 timer first.
          </Text>
        </ScrollView>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 8,
    gap: 8,
  },
  releaseNotesText: {
    fontSize: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  sectionSpacer: {
    marginVertical: 8, // Adjust the value as needed for spacing
  },
});
