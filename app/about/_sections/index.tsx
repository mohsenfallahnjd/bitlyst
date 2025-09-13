import type { FC } from "react";
import { DonateSection } from "./DonateSection";

export const AboutPage: FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About Sniply
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Bite-sized tech tips—simple, minimal, useful.
        </p>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200/50 dark:border-blue-800/50">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100">What is Sniply?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Sniply is a minimal blog focused on delivering concise, actionable tech insights. In a world overflowing
            with lengthy tutorials and overwhelming documentation, Sniply cuts through the noise to bring you the
            essential knowledge you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🎯 Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To make technology more accessible by breaking down complex concepts into digestible, actionable tips that
              you can apply immediately.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">⚡ Quick Learning</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Each post is designed to be read in under 5 minutes, focusing on practical knowledge you can use right
              away in your projects.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🛠️ Practical Focus</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No fluff, no lengthy introductions—just the core concepts, examples, and actionable steps you need to
              succeed.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🌱 Always Growing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Covering everything from basic concepts to advanced techniques across web development, DevOps, and modern
              tooling.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">About the Author</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Hi! I'm Mohsen Fallahnejad, a passionate developer who believes in the power of concise, practical knowledge
            sharing. With experience across full-stack development and DevOps, I create these bite-sized guides to help
            fellow developers learn faster and build better software.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/mohsenfallahnjd/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <DonateSection />
    </div>
  );
};

export default AboutPage;
