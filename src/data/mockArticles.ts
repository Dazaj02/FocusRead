import { Article, UserStats, AppSettings } from '../types';

export const INITIAL_USER_STATS: UserStats = {
  currentStreakDays: 7,
  todayMinutesRead: 15,
  dailyGoalMinutes: 20,
  completedDosesCount: 14,
  articlesReadCount: 28,
  focusMinutesTotal: 142,
  retentionRatePercent: 91,
  savedHoursCognitive: 4.2,
  weeklyMinutes: [14, 22, 18, 25, 16, 20, 15],
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  deepSeekApiKey: '',
  targetDurationMinutes: 2.5,
  synthesisDepth: 'keypoints',
  retentionQuizEnabled: true,
  glossaryEnabled: true,
  voiceSpeaker: 'Elena',
  speechRate: 1.25,
  karaokeHighlightEnabled: true,
  binauralBeatEnabled: false,
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    sourceUrl: 'https://nature.com/articles/cognitive-overload',
    title: 'Cómo el cerebro procesa la sobrecarga de información digital',
    author: 'Dr. Marcus Vance',
    category: 'Neurociencia Cognitiva',
    fullCleanText: '...',
    executiveSummary: [
      'La memoria de trabajo colapsa tras 12 minutos de lectura continua sin pausa activa.',
      'Micro-bloques de 2 minutos aumentan la retención a largo plazo en un 43%.',
      'La síntesis por IA extrae únicamente la premisa accionable y descartable de cada fuente.'
    ],
    totalReadingTimeSeconds: 360,
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    microDoses: [
      {
        id: 'dose-001-1',
        articleId: 'art-001',
        sequenceOrder: 1,
        title: '01. ¿Por qué nos distraemos?',
        wordCount: 290,
        estimatedSeconds: 120,
        isCompleted: true,
        contentChunk: `La memoria de trabajo humana tiene una capacidad estrictamente limitada. En la era digital, la avalancha constante de notificaciones, hipervínculos y banners interrumpe el flujo cognitivo antes de que la información pase a la memoria de largo plazo.\n\nCuando intentamos abarcar artículos extensos en pantallas saturadas, el córtex prefrontal consume glucosa a un ritmo desproporcionado, provocando el característico agotamiento visual y mental conocido como niebla cognitiva digital.`,
        quiz: {
          question: '¿Qué ocurre con la memoria de trabajo tras 12 minutos de lectura sin descanso?',
          options: [
            'Aumenta su velocidad de procesamiento',
            'Colapsa y reduce drásticamente la retención',
            'Se vuelve inmune a las distracciones'
          ],
          correctIndex: 1,
          explanation: 'La investigación demuestra que pausas breves cada pocos minutos evitan la saturación de la memoria de trabajo.'
        }
      },
      {
        id: 'dose-001-2',
        articleId: 'art-001',
        sequenceOrder: 2,
        title: '02. La arquitectura de la atención',
        wordCount: 340,
        estimatedSeconds: 150,
        isCompleted: false,
        contentChunk: `Para construir un hábito lector sólido, la clave radica en modularizar el contenido. Al dividir un análisis complejo en micro-dosis de entre dos y tres minutos, el cerebro percibe cada unidad como una meta alcanzable y gratificante.\n\nEsta estrategia estimula la liberación de dopamina al completar cada bloque, manteniendo al lector en un estado de calma atenta (Modo Zen) mientras el audio asistido refuerza la asimilación mediante dos vías sensoriales simultáneas.`,
        quiz: {
          question: '¿Cuál es el beneficio de fragmentar el contenido en dosis de 2-3 minutos?',
          options: [
            'Permite leer mientras se realizan múltiples tareas a la vez',
            'Reduce la fricción inicial y aumenta la retención en un 43%',
            'Obliga al usuario a leer más rápido de lo habitual'
          ],
          correctIndex: 1,
          explanation: 'La modularidad reduce la resistencia psicológica a empezar y mejora la consolidación sin fatiga.'
        }
      },
      {
        id: 'dose-001-3',
        articleId: 'art-001',
        sequenceOrder: 3,
        title: '03. Estrategias de rescate cognitivo',
        wordCount: 310,
        estimatedSeconds: 130,
        isCompleted: false,
        contentChunk: `El paso final consiste en despojar al contenido de cualquier ruido circundante. Una interfaz limpia con contraste ergonómico (Papel Cálido o Sepia) junto a la síntesis ejecutiva asegura que el lector absorba la esencia conceptual sin el desgaste que producen los sitios web contemporáneos.`,
        quiz: {
          question: '¿Qué función cumple la síntesis ejecutiva por IA?',
          options: [
            'Remplazar por completo el hábito de lectura',
            'Extraer premisas clave accionables para orientar el enfoque',
            'Traducir el contenido a lenguajes informáticos'
          ],
          correctIndex: 1,
          explanation: 'La síntesis proporciona el mapa mental previo antes de profundizar en cada micro-dosis.'
        }
      }
    ]
  },
  {
    id: 'art-002',
    sourceUrl: 'https://paulgraham.com/deepwork.html',
    title: 'Atención profunda en la era de los algoritmos',
    author: 'Cal Newport',
    category: 'Productividad & Foco',
    fullCleanText: '...',
    executiveSummary: [
      'El trabajo profundo es la habilidad de concentrarse sin distracciones en una tarea cognitivamente exigente.',
      'Las aplicaciones modernas están optimizadas para monetizar la fragmentación de la atención.',
      'Programar bloques intencionales de lectura es el mejor antídoto contra el déficit de foco.'
    ],
    totalReadingTimeSeconds: 480,
    isFavorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    microDoses: [
      {
        id: 'dose-002-1',
        articleId: 'art-002',
        sequenceOrder: 1,
        title: '01. La fragmentación premeditada',
        wordCount: 320,
        estimatedSeconds: 120,
        isCompleted: true,
        contentChunk: `Vivimos en una economía de la atención donde el recurso más escaso no es la información, sino el silencio mental necesario para procesarla...`
      },
      {
        id: 'dose-002-2',
        articleId: 'art-002',
        sequenceOrder: 2,
        title: '02. Rituales de concentración',
        wordCount: 330,
        estimatedSeconds: 130,
        isCompleted: true,
        contentChunk: `Crear un ritual de lectura que comience con respiración consciente y un temporizador visible predispone al cerebro para la asimilación profunda...`
      },
      {
        id: 'dose-002-3',
        articleId: 'art-002',
        sequenceOrder: 3,
        title: '03. La métrica de foco diario',
        wordCount: 300,
        estimatedSeconds: 110,
        isCompleted: false,
        contentChunk: `Medir minutos de lectura en lugar de número de páginas leídas evita la ansiedad y premia la calidad del tiempo dedicado.`
      },
      {
        id: 'dose-002-4',
        articleId: 'art-002',
        sequenceOrder: 4,
        title: '04. Consolidación del conocimiento',
        wordCount: 310,
        estimatedSeconds: 120,
        isCompleted: false,
        contentChunk: `Al finalizar un artículo, responder una sola pregunta socrática refuerza las conexiones sinápticas a largo plazo.`
      }
    ]
  },
  {
    id: 'art-003',
    sourceUrl: 'https://fs.blog/mental-models',
    title: 'Modelos mentales para decisiones críticas bajo presión',
    author: 'Farnam Street',
    category: 'Cognición',
    fullCleanText: '...',
    executiveSummary: [
      'Los modelos mentales son atajos de razonamiento que simplifican la complejidad del mundo.',
      'El principio de inversión permite anticipar problemas antes de que se manifiesten.',
      'La navaja de Ockham nos recuerda optar por la hipótesis más sencilla cuando haya incertidumbre.'
    ],
    totalReadingTimeSeconds: 360,
    isFavorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    microDoses: [
      {
        id: 'dose-003-1',
        articleId: 'art-003',
        sequenceOrder: 1,
        title: '01. El mapa no es el territorio',
        wordCount: 320,
        estimatedSeconds: 120,
        isCompleted: true,
        contentChunk: `Nuestras ideas sobre la realidad son siempre simplificaciones. El valor de un buen modelo mental radica en ser útil, no en ser exhaustivo.`
      },
      {
        id: 'dose-003-2',
        articleId: 'art-003',
        sequenceOrder: 2,
        title: '02. Pensamiento de segundo orden',
        wordCount: 350,
        estimatedSeconds: 140,
        isCompleted: false,
        contentChunk: `Cualquiera puede predecir las consecuencias inmediatas de una acción. Los grandes pensadores analizan qué ocurrirá después del efecto inmediato.`
      },
      {
        id: 'dose-003-3',
        articleId: 'art-003',
        sequenceOrder: 3,
        title: '03. La navaja de Hanlon',
        wordCount: 290,
        estimatedSeconds: 100,
        isCompleted: false,
        contentChunk: `Nunca atribuyas a la malicia lo que puede ser explicado adecuadamente por el descuido o la sobrecarga cognitiva.`
      }
    ]
  },
  {
    id: 'art-004',
    sourceUrl: 'https://brainhealth.org/sleep-creative',
    title: 'La neurobiología del descanso y la chispa creativa',
    author: 'Dra. Sara Mednick',
    category: 'Bienestar Mental',
    fullCleanText: '...',
    executiveSummary: [
      'El descanso no es un estado pasivo, sino la fase activa donde el cerebro reorganiza ideas.',
      'La red neuronal por defecto (DMN) se activa durante las pausas breves de lectura.',
      'Micro-dosis de desconexión fomentan conexiones conceptuales novedosas.'
    ],
    totalReadingTimeSeconds: 300,
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    microDoses: [
      {
        id: 'dose-004-1',
        articleId: 'art-004',
        sequenceOrder: 1,
        title: '01. La red neuronal por defecto',
        wordCount: 310,
        estimatedSeconds: 120,
        isCompleted: false,
        contentChunk: `Cuando dejamos de prestar atención focalizada a estímulos externos, ciertas regiones cerebrales comienzan a sincronizarse espontáneamente.`
      },
      {
        id: 'dose-004-2',
        articleId: 'art-004',
        sequenceOrder: 2,
        title: '02. El papel del descanso deliberado',
        wordCount: 320,
        estimatedSeconds: 130,
        isCompleted: false,
        contentChunk: `Programar micro-descansos entre lecturas no es perder el tiempo: es cuando se produce la chispa de la creatividad humana.`
      }
    ]
  }
];
