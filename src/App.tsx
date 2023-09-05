import './App.css';


type AppProps = {
  name?: string,
};

export default function App({ name }: AppProps) {
  return (
    <div className='App'>
      <header>
        <h1>{name || 'React TypeScript Boilerplate App'}</h1>
      </header>
      <main>
        Edit <code>App.jsx</code> and save to hot reload your changes.
      </main>
    </div>
  );
}
