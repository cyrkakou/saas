import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/presentation/components/landing/Header'
import { Hero } from '@/presentation/components/landing/Hero'
import { LogoCloud } from '@/presentation/components/landing/LogoCloud'
import { Features } from '@/presentation/components/landing/Features'
import { Workflow } from '@/presentation/components/landing/Workflow'
import { Operations } from '@/presentation/components/landing/Operations'
import { Integrations } from '@/presentation/components/landing/Integrations'
import { Pricing } from '@/presentation/components/landing/Pricing'
import { FAQ } from '@/presentation/components/landing/FAQ'
import { CTA } from '@/presentation/components/landing/CTA'
import { Footer } from '@/presentation/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <Workflow />
      <Operations />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
