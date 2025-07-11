
export default function LoginPage() {
    return (
      <section className="py-20 px-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Login to Continue</h2>
        <p className="text-gray-600 mb-6">We’ll integrate Clerk authentication here.</p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700">
          Login with Clerk
        </button>
      </section>
    );
  }
  