// ============================================================
// ARTH Frontend — Dashboard Page
// Overview of all financial intelligence modules.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, StatCard } from '../components/ui';
import { useAuth } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Financial Twin',
      description: 'Simulate your financial future with AI-powered predictions. See where your money is headed.',
      path: '/simulation',
      gradient: 'from-primary-500 to-blue-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Credit Intelligence',
      description: 'Understand your credit score with transparent, explainable AI. Know exactly why.',
      path: '/credit',
      gradient: 'from-accent-500 to-pink-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Fraud Detection',
      description: 'Protect your finances with behavioral AI that detects suspicious activity in real-time.',
      path: '/fraud',
      gradient: 'from-red-500 to-orange-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
        </h1>
        <p className="text-surface-200/50">Your AI-powered financial command center</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="System Status"
          value="Active"
          subtitle="All services running"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="AI Models"
          value="3"
          subtitle="Trained & ready"
          color="primary"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
        <StatCard
          title="Predictions"
          value="∞"
          subtitle="Unlimited forecasts"
          color="accent"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Security"
          value="24/7"
          subtitle="Real-time monitoring"
          color="yellow"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
      </div>

      {/* Feature Cards */}
      <div className="mb-6">
        <h2 className="section-title">Intelligence Modules</h2>
        <p className="section-subtitle">AI-powered tools to predict, explain, and protect your finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.path} to={feature.path} className="group">
            <div className="glass-card-hover p-6 h-full">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                              flex items-center justify-center mb-5 text-white
                              group-hover:shadow-glow transition-shadow duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-surface-200/50 leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="flex items-center gap-2 mt-4 text-primary-400/60 group-hover:text-primary-400 
                             transition-all group-hover:translate-x-1">
                <span className="text-sm font-medium">Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
