import React from 'react';
import Link from 'next/link';
import { TrendingUp, Bell, BarChart3, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Signal Generation',
      description: 'Multi-timeframe technical analysis with EMA crossovers, RSI filters, and ATR-based risk management.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified via web push and Telegram when your custom trading conditions are met.',
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Professional-grade charts with signal markers, technical indicators, and multi-timeframe analysis.',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in position sizing calculator and automated risk controls to protect your capital.',
    },
    {
      icon: Zap,
      title: 'Semi-Automated Trading',
      description: 'Execute trades with one click while maintaining full control over your positions.',
    },
    {
      icon: Users,
      title: 'Professional Tools',
      description: 'Backtesting, performance analytics, and comprehensive trade history tracking.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SignalPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Trading Signals
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get high-quality trading signals based on proven technical analysis. 
            Receive alerts, manage risk, and execute trades with confidence using our advanced platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/demo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Try Live Demo
            </Link>
            <Link
              href="/auth/register"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Trade Smarter
          </h2>
          <p className="text-lg text-gray-600">
            Professional-grade tools designed for serious traders
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your trading style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Basic signals (3 alerts)
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  1 chart & timeframe
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Email notifications
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors text-center block"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border border-blue-600 rounded-lg p-8 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $29<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Unlimited alerts
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  All timeframes & charts
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Web Push & Telegram
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Semi-automated trading
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Advanced backtesting
                </li>
              </ul>
              <Link
                href="/auth/register?plan=pro"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center block"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $99<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Custom indicators
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  API access
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  White-label options
                </li>
              </ul>
              <Link
                href="/contact"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">SignalPro</span>
              </div>
              <p className="text-gray-400">
                Professional trading signals and automated trading tools for serious traders.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SignalPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}