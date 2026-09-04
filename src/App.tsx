import { About } from './components/About';
import { EventTypes } from './components/EventTypes';
import { Experience } from './components/Experience';
import { FAQ } from './components/FAQ';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { MobileDock } from './components/MobileDock';
import { Process } from './components/Process';
import { VideoShowcase } from './components/VideoShowcase';
import { QuoteProvider } from './components/quote/QuoteProvider';
import { useScrollReveal } from './hooks/useScrollReveal';

export function App() {
  useScrollReveal();

  return (
    <QuoteProvider>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <EventTypes />
        <Experience />
        <Gallery />
        <VideoShowcase />
        <Process />
        <About />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
      <MobileDock />
    </QuoteProvider>
  );
}
