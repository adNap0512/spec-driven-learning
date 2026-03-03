import { LearningProvider } from '@/context/LearningContext';
import { LearningPage } from '@/pages/LearningPage';

function App() {
  return (
    <LearningProvider>
      <LearningPage />
    </LearningProvider>
  );
}

export default App;
