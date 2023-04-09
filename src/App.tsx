import { Camera } from './pages/camera';

function App() {
  return (
    <Camera
      onStream={(stream) => console.log(stream)}
      onError={(error) => console.error(error)}
    />
  );
}

export default App;
