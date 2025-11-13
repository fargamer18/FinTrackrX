import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
            <span className="text-5xl">💎</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Take Control of Your
            <span className="text-gray-600 dark:text-gray-400 block mt-2">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered financial tracking and insights designed for Indian households
            to make smarter decisions with your money.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/advisor"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Try Advisor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
            <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Everything</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Monitor income, expenses, and investments in one place
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
            <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get personalized financial advice powered by AI
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
            <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visualize your financial health with beautiful charts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
