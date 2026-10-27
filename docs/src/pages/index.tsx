import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Seccion = {
  numero: string;
  titulo: string;
  descripcion: string;
  href: string;
  etiqueta: string;
};

const secciones: Seccion[] = [
  {
    numero: '01',
    titulo: 'Formativo (SENA)',
    descripcion:
      'Formulación del proyecto, alcance, casos de uso, historias de usuario, matriz de trazabilidad y manual de usuario.',
    href: '/docs/formativo/formulacion-constitucion',
    etiqueta: 'Documentación académica',
  },
  {
    numero: '02',
    titulo: 'Arquitectura Técnica',
    descripcion:
      'Arquitectura hexagonal, modelo de datos, contrato de persistencia, arquitectura de agentes IA y guías de diseño.',
    href: '/docs/tecnico/arquitectura-hexagonal',
    etiqueta: 'Documentación de ingeniería',
  },
  {
    numero: '03',
    titulo: 'Gestión',
    descripcion:
      'Interesados, matriz RACI y metodología Scrum aplicada al desarrollo del ecosistema LOCIFY.',
    href: '/docs/gestion/gestion-interesados-proyecto',
    etiqueta: 'Documentación de proceso',
  },
];

function Hero(): React.JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={clsx('container', styles.heroContent)}>
        <p className={styles.eyebrow}>Documentación del proyecto</p>

        <h1 className={styles.title}>LOCIFY</h1>

        <p className={styles.subtitle}>
          La plataforma que conecta conductores y operadores de parqueaderos
          urbanos. Toda la documentación del proyecto, en un solo lugar.
        </p>

        <p className={styles.lead}>
          Del modelo de negocio al contrato de datos: decide con evidencia, no
          con suposiciones.
        </p>

        <div className={styles.actions}>
          <Link
            className="button button--primary button--lg"
            to="/docs/formativo/formulacion-constitucion">
            Documentación SENA
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/tecnico/arquitectura-hexagonal">
            Arquitectura Técnica
          </Link>
        </div>

        <p className={styles.meta}>
          Arquitectura Hexagonal · Prisma + PostgreSQL · SENA ADSO Ficha 3314811
        </p>
      </div>
    </header>
  );
}

function Secciones(): React.JSX.Element {
  return (
    <section className={styles.secciones} aria-labelledby="secciones-titulo">
      <div className="container">
        <h2 id="secciones-titulo" className={styles.seccionesTitulo}>
          Explora la documentación
        </h2>
        <p className={styles.seccionesIntro}>
          Tres recorridos con propósitos distintos, un mismo proyecto.
        </p>

        <div className={styles.cards}>
          {secciones.map((seccion) => (
            <Link
              key={seccion.numero}
              to={seccion.href}
              className={styles.card}
              aria-label={`Ir a ${seccion.titulo}`}>
              <span className={styles.cardNumero} aria-hidden="true">
                {seccion.numero}
              </span>
              <span className={styles.cardEtiqueta}>{seccion.etiqueta}</span>
              <h3 className={styles.cardTitulo}>{seccion.titulo}</h3>
              <p className={styles.cardTexto}>{seccion.descripcion}</p>
              <span className={styles.cardAccion} aria-hidden="true">
                Ver sección →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Documentación"
      description="Documentación técnica, formativa y de gestión del ecosistema de parqueaderos urbanos LOCIFY.">
      <main>
        <Hero />
        <Secciones />
      </main>
    </Layout>
  );
}
