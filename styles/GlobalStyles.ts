import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  backButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
