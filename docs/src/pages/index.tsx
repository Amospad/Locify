import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/formativo/formulacion-constitucion">
            📚 Ir a Documentación SENA
          </Link>
          <Link
            className="button button--secondary button--lg"
            style={{marginLeft: '10px'}}
            to="/docs/tecnico/arquitectura-hexagonal">
            🛠️ Ir a Arquitectura Técnica
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Inicio`}
      description="Documentación técnica y formativa del proyecto LOCIFY">
      <HomepageHeader />
      <main>
        <div className="container" style={{padding: '2rem 0', textAlign: 'center'}}>
          <h2>Bienvenido a la documentación de LOCIFY</h2>
          <p>Selecciona una sección en el menú superior o usa los botones para comenzar.</p>
        </div>
      </main>
    </Layout>
  );
}