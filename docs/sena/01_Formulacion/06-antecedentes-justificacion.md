---
sidebar_position: 6
title: 06. Antecedentes y Justificación
---

# Antecedentes y Justificación del Proyecto LOCIFY

## 1. Antecedentes

### 1.1 Contexto Internacional y Académico
El fenómeno del *cruising for parking* (conducción innecesaria en busca de estacionamiento) ha sido documentado desde los estudios pioneros de Donald Shoup (2005). La literatura científica estima que entre el 8% y el 74% del tráfico urbano corresponde a vehículos que buscan un lugar donde estacionar, con un promedio del 30-34% en zonas céntricas congestionadas. El tiempo medio de búsqueda oscila entre 3.5 y 15.4 minutos, lo que genera congestión, emisiones adicionales de CO₂ y una pérdida significativa de tiempo para los conductores.

En la última década, los sistemas de parqueo inteligente (*Smart Parking Systems*) han emergido como una solución tecnológica validada por la academia. Una revisión sistemática de 124 artículos científicos (2016-2023) concluye que las aplicaciones móviles dominan las interfaces de usuario, y que el acceso a información en tiempo real mejora la eficiencia en la búsqueda de parqueo en un 45%. Tecnologías como IoT, sensores de ocupación y reservas anticipadas son tendencias consolidadas en el sector.

### 1.2 Contexto Local: Medellín y el Valle de Aburrá
Medellín enfrenta una crisis de movilidad estructural. Según el Concejo de Medellín (2025), la ciudad presenta un déficit de 600,000 metros cuadrados en zonas de estacionamiento, equivalente a dos Parques del Río. El parque automotor se ha multiplicado de forma exponencial: en los últimos 25 años pasó de 321,000 a más de 2.6 millones de vehículos, un aumento del 704%.

El TomTom Traffic Index 2025 posiciona a Medellín como una de las ciudades con mayor congestión del mundo: los conductores pierden 153 horas al año en el tráfico (equivalente a 6 días y 9 horas), con una congestión promedio del 66.9% y una velocidad promedio en hora pico de solo 20.7 km/h. Esta situación se ve agravada por la ocupación indebida del espacio público y la falta de herramientas digitales para optimizar la oferta de estacionamiento.

## 2. Problemática

La problemática de LOCIFY se puede sintetizar en cinco dimensiones críticas:

1. **Déficit estructural de celdas:** La ciudad no cuenta con infraestructura suficiente para absorber la demanda de estacionamiento, y el Plan Maestro Distrital de Parqueaderos 2025-2040 aún está en fase de implementación.
2. **Ineficiencia operativa:** Los parqueaderos tradicionales operan con taquillas físicas, papel térmico y efectivo, lo que genera filas, lentitud y falta de trazabilidad.
3. **Opacidad de la información:** Los conductores no tienen forma de conocer la disponibilidad real de cupos antes de llegar, lo que alimenta el *cruising for parking* y la congestión.
4. **Falta de confianza y legalidad:** Muchos operadores informales no cuentan con documentación verificada, lo que expone a los usuarios a riesgos de seguridad y fraudes.
5. **Ausencia de datos para la toma de decisiones:** Los operadores no cuentan con métricas en tiempo real sobre ocupación, ingresos o demanda, lo que impide optimizar tarifas y capacidad.

## 3. Justificación

LOCIFY se justifica como una respuesta tecnológica integral a estas problemáticas, abordando cuatro dimensiones:

### 3.1 Dimensión Técnica
La solución se construye sobre una **arquitectura hexagonal** que aísla el dominio del negocio de las dependencias externas (bases de datos, pasarelas de pago, frameworks). Esto garantiza testabilidad, mantenibilidad y escalabilidad. El stack incluye Node.js + TypeScript, PostgreSQL, Next.js y MapLibre GL, tecnologías modernas y de código abierto que reducen costos de licenciamiento.

### 3.2 Dimensión Económica
El modelo de negocio B2B2C genera ingresos por dos vías: un *fee* por transacción al conductor y una suscripción SaaS para operadores. La reducción del tiempo de búsqueda de parqueo (estimada en un 45% gracias a la información en tiempo real) se traduce en ahorro de combustible y horas-productivas para los usuarios, mientras que los operadores aumentan su rotación y visibilidad.

### 3.3 Dimensión Social y Ambiental
Al reducir el *cruising for parking*, LOCIFY contribuye directamente a disminuir la congestión vehicular y las emisiones de CO₂ asociadas. La literatura científica confirma que optimizar la búsqueda de estacionamiento reduce el impacto ambiental en centros urbanos. Además, la digitalización del acceso (QR) elimina el uso de papel térmico y mejora la experiencia del usuario.

### 3.4 Dimensión Legal y de Seguridad
El sistema cumple estrictamente con la **Ley 1581 de 2012** de protección de datos personales. Se implementa consentimiento informado, cifrado de contraseñas con Argon2, transmisión segura (TLS 1.3) y logs de auditoría inmutables. Asimismo, el flujo de *Onboarding KYB* (Know Your Business) garantiza que solo operadores legalmente verificados puedan ofrecer servicios en la plataforma, protegiendo a los usuarios y formalizando el sector.

## 4. Bibliografía (APA 7)

- Concejo de Medellín. (2025). *Urgente llamado en el Concejo para regular el mal parqueo en Medellín*. https://www.concejodemedellin.gov.co/blog/2025/10/20/urgente-llamado-en-el-concejo-para-regular-el-mal-parqueo-en-medellin/
- Hampshire, R., & Shoup, D. (2019). How Much Traffic is Cruising for Parking? *The Equalizer: Could Ride-Hailing Extend Equitable Car Access?*, 15-22.
- Shoup, D. (2005). *The High Cost of Free Parking*. APA Planners Press.
- TomTom. (2025). *Medellin traffic report | TomTom Traffic Index*. https://www.tomtom.com/traffic-index/city/medellin
- Superintendencia de Industria y Comercio. (2025). *Uso de Firebase en almacenamiento de datos y cumplimiento normativo en Colombia*. https://sedeelectronica.sic.gov.co/
- ScienceDirect. (2025). Smart parking systems: A comprehensive review of digitalization of parking services. *Journal of Urban Mobility*, 7, 100-115.
