import { StyleSheet } from 'react-native';
import TabNavigator from './src/components/tabnavigator';
import { PreferencesProvider } from './src/context/PreferencesContext';
import { LikedRecipesProvider } from './src/context/LikedRecipesContext';
import { RecipeFeedProvider } from './src/context/RecipeFeedContext';

export default function App() {
  return (
    <PreferencesProvider>
      <LikedRecipesProvider>
        <RecipeFeedProvider>
          <TabNavigator />
        </RecipeFeedProvider>
      </LikedRecipesProvider>
    </PreferencesProvider>
  );
}
/*
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
  */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
