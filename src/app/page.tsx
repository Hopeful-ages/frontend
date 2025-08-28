import { Button } from './components/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-white/80 p-8 shadow-lg">
        <Button variant="primary" size="md" loading={false}>
          Criar cenário
        </Button>
        <h1 className="mb-4 text-center text-4xl font-extrabold text-gray-900 drop-shadow">
          Bem-vindo ao Projeto Next.js!
        </h1>
        <p className="mb-6 text-center text-lg text-gray-700">
          Esta é sua nova Home usando{' '}
          <span className="font-semibold text-blue-600">Tailwind CSS</span>.
          <br />
          Edite este arquivo para começar a criar!
        </p>
        <a
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow transition-colors hover:bg-blue-700"
        >
          Documentação Tailwind
        </a>
      </div>
    </main>
  );
}
