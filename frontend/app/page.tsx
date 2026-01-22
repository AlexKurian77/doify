'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show nothing while checking auth or redirecting
  if (loading || user) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-16">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="container mx-auto text-center max-w-4xl animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Now with AI-powered insights</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Manage Tasks with{' '}
              <span className="text-gradient">Elegance</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              A beautiful, intuitive task management dashboard that helps you stay organized
              and boost your productivity. Built for modern teams and individuals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn btn-lg btn-primary w-full sm:w-auto">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login" className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Everything you need to{' '}
              <span className="text-gradient">stay productive</span>
            </h2>
            <p className="text-center text-foreground-secondary mb-16 max-w-2xl mx-auto">
              Powerful features to help you manage tasks, track progress, and collaborate with your team.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card card-hover p-8">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Task Management</h3>
                <p className="text-foreground-secondary">
                  Create, organize, and prioritize tasks with ease. Set due dates, add descriptions, and track status.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card card-hover p-8">
                <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Filtering</h3>
                <p className="text-foreground-secondary">
                  Find tasks instantly with powerful search and filter options. Filter by status, priority, or due date.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card card-hover p-8">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-foreground-secondary">
                  Your data is protected with industry-standard encryption. JWT authentication keeps your account safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 gradient-hero">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to boost your productivity?
            </h2>
            <p className="text-gray-300 mb-10 max-w-xl mx-auto">
              Join thousands of users who have transformed the way they manage tasks.
            </p>
            <Link href="/signup" className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100">
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-background-secondary border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold">Doify</span>
              </div>
              <p className="text-foreground-secondary text-sm">
                © 2026 Doify. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
