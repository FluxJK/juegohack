(function(root){'use strict';
        const HOTSPOTS = {
          patrol: [
            {
              id: 'radio_policial',
              label: 'Radio policial',
              x: 49,
              y: 55,
              speaker: 'narrador',
              mood: 'neutral',
              dir: '(Estática en la frecuencia 460.2 MHz)',
              text: 'La radio crepita con avisos de robos menores y un reporte sospechoso en el minimercado de la esquina. Esta ciudad no descansa ni bajo la lluvia.',
            },
            {
              id: 'dibujo_sofia',
              label: 'Dibujo de Sofía',
              x: 68,
              y: 56,
              speaker: 'mateo',
              mood: 'triste',
              dir: '(Sonríe con cansancio al mirar el papel)',
              text: 'Sofía dibujó una patrulla azul con crayón rojo y escribió «Para papá». Tiene ocho años y todavía cree que su padre es invencible.',
            },
            {
              id: 'factura_inhalador',
              label: 'Factura vencida',
              x: 80,
              y: 57,
              speaker: 'mateo',
              mood: 'tenso',
              dir: '(Aprieta el volante)',
              text: 'Tercer aviso de la farmacia por el tratamiento respiratorio de Sofía. Con mi sueldo de suboficial apenas cubrimos el alquiler.',
            },
            {
              id: 'placa_mateo',
              label: 'Placa policial',
              x: 91,
              y: 53,
              speaker: 'mateo',
              mood: 'neutral',
              dir: '(Reflejo frío sobre el metal)',
              text: 'Doce años llevando esta insignia en el pecho. Prometí no doblarme jamás... hasta que la deuda empezó a respirar en mi propia casa.',
            },
          ],
          kitchen: [
            {
              id: 'inhalador_sofia',
              label: 'Inhalador de Sofía',
              x: 90,
              y: 40,
              speaker: 'elena',
              mood: 'triste',
              dir: '(Señalando el estante)',
              text: 'Quedan pocas dosis en este inhalador azul, Mateo. La doctora dijo que el nuevo medicamento no puede esperar otra semana.',
            },
            {
              id: 'foto_familiar',
              label: 'Foto familiar',
              x: 74,
              y: 31,
              speaker: 'mateo',
              mood: 'neutral',
              dir: '(Observando el imán de la nevera)',
              text: 'El verano pasado en la plaza, antes de que el asma de Sofía empeorara y antes de que Vargas me llamara a su despacho.',
            },
            {
              id: 'facturas_mesa',
              label: 'Cuentas sobre la mesa',
              x: 17,
              y: 52,
              speaker: 'mateo',
              mood: 'tenso',
              dir: '(Sobres sellados en rojo)',
              text: 'Luz, alquiler y clínica pediátrica. Todo vence el lunes. Elena trabaja doble turno en el colegio y aun así no llegamos.',
            },
          ],
          office: [
            {
              id: 'carpeta_roja',
              label: 'Carpeta roja',
              x: 40,
              y: 52,
              speaker: 'mateo',
              mood: 'tenso',
              dir: '(Leyendo en voz baja antes de que vuelva Vargas)',
              text: 'Denuncias de comerciantes del barrio contra «Los Sombra»... todas marcadas como «Archivadas por falta de mérito» con la firma de Vargas.',
            },
            {
              id: 'sobre_soborno',
              label: 'Sobre de soborno',
              x: 58,
              y: 53,
              speaker: 'narrador',
              mood: 'neutral',
              dir: '(Billetes nuevos atados con banda elástica)',
              text: 'Cinco mil dólares en efectivo sin número de serie. El precio exacto de mirar hacia otro lado durante un turno nocturno.',
            },
            {
              id: 'grabadora_telefono',
              label: 'Grabadora del teléfono',
              x: 72,
              y: 52,
              speaker: 'mateo',
              mood: 'tenso',
              dir: '(Desliza el teléfono en el bolsillo del chaleco)',
              text: 'Si dejo activa la grabadora de voz antes de que regrese el Comandante, cada palabra suya quedará registrada.',
            },
          ],
          garage: [
            {
              id: 'caja_herramientas',
              label: 'Caja de herramientas',
              x: 15,
              y: 49,
              speaker: 'julian',
              mood: 'neutral',
              dir: '(Limpiándose las manos con un trapo)',
              text: 'Ahí guardo llaves inglesas desde hace veinte años, Mateo. Cuando se te averió el coche bajo la lluvia, ni se me ocurrió cobrarte un centavo.',
            },
            {
              id: 'generador_electrico',
              label: 'Generador eléctrico',
              x: 84,
              y: 49,
              speaker: 'mateo',
              mood: 'tenso',
              dir: '(Observando el zumbido del motor)',
              text: 'El generador mantiene iluminado todo el taller. En mi bolsillo llevo la bolsa que Marcos me ordenó esconder aquí antes del allanamiento.',
            },
          ],
        };

        const COMBATS = {
          COMBAT_1: {
            title: 'Tiroteo en el Minimercado',
            scene: 'minimarket',
            location: 'Minimercado del Barrio',
            time: '22:15',
            nextNode: 'N1_MINIMERCADO_POST',
            envTarget: {
              id: 'vapor',
              name: 'Tubería de vapor',
              hint: 'Disparo al entorno: aturde y daña a todos',
              x: 70,
              y: 28,
              hp: 1,
              maxHp: 1,
              damageAll: 45,
              stunTurns: 2,
            },
            enemies: [
              { id: 'e1', name: 'Sicario (Pasillo)', x: 34, y: 44, hp: 70, maxHp: 70, dmg: 18, stunned: 0 },
              { id: 'e2', name: 'Sicario (Caja)', x: 58, y: 46, hp: 80, maxHp: 80, dmg: 20, stunned: 0 },
            ],
          },
          COMBAT_2: {
            title: 'Emboscada Nocturna',
            scene: 'bridge',
            location: 'Avenida del Puente',
            time: '00:25',
            nextNode: 'N2A_CASA_DECISION',
            envTarget: {
              id: 'neumaticos',
              name: 'Neumáticos de moto',
              hint: 'Disparo al entorno: derriba motocicletas',
              x: 64,
              y: 54,
              hp: 1,
              maxHp: 1,
              damageAll: 50,
              stunTurns: 2,
            },
            enemies: [
              { id: 'm1', name: 'Motorizado Izq.', x: 30, y: 46, hp: 75, maxHp: 75, dmg: 20, stunned: 0 },
              { id: 'm2', name: 'Motorizado Der.', x: 69, y: 40, hp: 85, maxHp: 85, dmg: 22, stunned: 0 },
            ],
          },
          COMBAT_3A: {
            title: 'Tiroteo en el Muelle Exterior',
            scene: 'warehouse',
            location: 'Muelle 7 · Puerto',
            time: '23:10',
            nextNode: 'N4_ROUTER',
            envTarget: {
              id: 'cadena',
              name: 'Cadena de carga',
              hint: 'Disparo al entorno: suelta el palé suspendido',
              x: 36,
              y: 28,
              hp: 1,
              maxHp: 1,
              damageAll: 55,
              stunTurns: 2,
            },
            enemies: [
              { id: 'd1', name: 'Vigía de Grúa', x: 28, y: 48, hp: 80, maxHp: 80, dmg: 20, stunned: 0 },
              { id: 'd2', name: 'Tirador Cuervo', x: 50, y: 44, hp: 90, maxHp: 90, dmg: 22, stunned: 0 },
              { id: 'd3', name: 'Escolta Puerta', x: 70, y: 49, hp: 80, maxHp: 80, dmg: 18, stunned: 0 },
            ],
          },
          COMBAT_3B: {
            title: 'Asalto al Patio de Contenedores',
            scene: 'warehouse',
            location: 'Patio de Contenedores',
            time: '23:20',
            nextNode: 'N4_ROUTER',
            envTarget: {
              id: 'cadena',
              name: 'Cadena de carga',
              hint: 'Disparo al entorno: aplasta cobertura enemiga',
              x: 36,
              y: 28,
              hp: 1,
              maxHp: 1,
              damageAll: 55,
              stunTurns: 2,
            },
            enemies: [
              { id: 'c1', name: 'Sicario Contenedor', x: 28, y: 49, hp: 85, maxHp: 85, dmg: 20, stunned: 0 },
              { id: 'c2', name: 'Sicario Flanco', x: 52, y: 45, hp: 90, maxHp: 90, dmg: 22, stunned: 0 },
              { id: 'c3', name: 'Guardia de Carga', x: 70, y: 48, hp: 80, maxHp: 80, dmg: 18, stunned: 0 },
            ],
          },
          COMBAT_4_TRANSFORMADOR: {
            title: 'Combate a Oscuras en el Almacén',
            scene: 'warehouse',
            location: 'Interior Almacén del Puerto',
            time: '23:45',
            nextNode: 'N4_FINAL_TRAGICO_1',
            envTarget: {
              id: 'transformador',
              name: 'Transformador eléctrico',
              hint: 'Disparo al entorno: apaga las luces y electrocuta',
              x: 70,
              y: 31,
              hp: 1,
              maxHp: 1,
              damageAll: 60,
              stunTurns: 2,
            },
            enemies: [
              { id: 'b1', name: 'Marcos Mendoza', x: 38, y: 48, hp: 100, maxHp: 100, dmg: 24, stunned: 0 },
              { id: 'b2', name: 'Comandante Vargas', x: 62, y: 46, hp: 105, maxHp: 105, dmg: 26, stunned: 0 },
            ],
          },
          COMBAT_4_DUELO: {
            title: 'Duelo a Sangre Fría',
            scene: 'warehouse',
            location: 'Interior Almacén del Puerto',
            time: '23:50',
            nextNode: 'N4_FINAL_TRAGICO_2',
            envTarget: {
              id: 'transformador',
              name: 'Transformador eléctrico',
              hint: 'Disparo al entorno: ciega a los objetivos',
              x: 70,
              y: 31,
              hp: 1,
              maxHp: 1,
              damageAll: 65,
              stunTurns: 2,
            },
            enemies: [
              { id: 'f1', name: 'Marcos Mendoza', x: 38, y: 48, hp: 95, maxHp: 95, dmg: 22, stunned: 0 },
              { id: 'f2', name: 'Comandante Vargas', x: 62, y: 46, hp: 100, maxHp: 100, dmg: 24, stunned: 0 },
            ],
          },
        };

        const STORY = {
          PROLOGO: {
            chapter: 'PRÓLOGO',
            location: 'Patrulla 14 · Distrito Norte',
            time: '21:40',
            scene: 'patrol',
            siren: true,
            exploreScene: 'patrol',
            lines: [
              {
                speaker: 'narrador',
                name: 'Narración',
                mood: 'neutral',
                dir: '(Lluvia golpea el techo de la patrulla)',
                text: 'El uniforme representa la justicia, pero quienes lo llevan también pueden ser víctimas de la corrupción.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Inspecciona el interior de la patrulla antes de bajar)',
                text: 'Antes de continuar, puedo acercarme a la patrulla y examinar la radio, el dibujo de Sofía y la factura. Después saldré hacia casa.',
              },
            ],
            next: 'N1_COCINA',
          },
          N1_COCINA: {
            chapter: 'CAPÍTULO 1',
            location: 'Casa de Mateo · Cocina',
            time: '21:55',
            scene: 'kitchen',
            exploreScene: 'kitchen',
            lines: [
              {
                speaker: 'elena',
                name: 'Elena',
                mood: 'triste',
                dir: '(Preparando té mientras Sofía tose en la sala)',
                text: 'Mateo, llegas agotado. Otra vez volvió a faltarle el aire esta tarde. La receta del nuevo tratamiento subió al doble.',
              },
              {
                speaker: 'sofia',
                name: 'Sofía',
                mood: 'neutral',
                dir: '(Se asoma con su mochila escolar y el inhalador azul)',
                text: 'Papá, ¿mañana sí vienes a buscarme al colegio? Mis compañeros dicen que los policías nunca tienen miedo.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Se arrodilla para acomodarle la mochila)',
                text: 'Claro que iré, campeona. Elena, revisemos las cuentas y el inhalador antes de que salga a cubrir el aviso del minimercado.',
              },
            ],
            next: 'N1_MINIMERCADO_INTRO',
          },
          N1_MINIMERCADO_INTRO: {
            chapter: 'CAPÍTULO 1',
            location: 'Minimercado del Barrio',
            time: '22:15',
            scene: 'minimarket',
            lines: [
              {
                speaker: 'sicario',
                name: 'Sicario de «Los Sombra»',
                mood: 'amenazante',
                dir: '(Apuntando al cajero con tatuaje de cuervo en el cuello)',
                text: '¡El impuesto de protección venció ayer! Y tú, policía, date la vuelta antes de que el barrio entero pague las consecuencias.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Desenfunda su arma reglamentaria y busca cobertura)',
                text: '¡Suelten las armas! Puedo moverme entre los pasillos, usar el entorno y pedir que se rindan.',
              },
            ],
            combatId: 'COMBAT_1',
          },
          N1_MINIMERCADO_POST: {
            chapter: 'CAPÍTULO 1',
            location: 'Minimercado del Barrio',
            time: '22:22',
            scene: 'minimarket',
            lines: [
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Asegura las esposas mientras suena el teléfono del precincto)',
                text: 'Dos hombres de «Los Sombra» reducidos. Apenas los subo a la patrulla, el Comandante Vargas ordena verme de inmediato en su despacho.',
              },
            ],
            next: 'N1_OFICINA_EXPLORAR',
          },
          N1_OFICINA_EXPLORAR: {
            chapter: 'CAPÍTULO 1',
            location: 'Oficina del Comandante Vargas',
            time: '22:40',
            scene: 'office',
            exploreScene: 'office',
            lines: [
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'neutral',
                dir: '(Sale al pasillo a responder una llamada)',
                text: 'No toques nada, Morales. Vuelvo en un minuto para hablar de tu futuro y el de tu hija.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Solo en la oficina durante unos segundos)',
                text: 'Tengo segundos para revisar la carpeta roja, ese sobre grueso sobre el escritorio y activar la grabadora de mi teléfono.',
              },
            ],
            next: 'N1_DECISION_1',
          },
          N1_DECISION_1: {
            chapter: 'CAPÍTULO 1',
            location: 'Oficina del Comandante Vargas',
            time: '22:43',
            scene: 'office',
            lines: [
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'amenazante',
                dir: '(Empuja el sobre de $5,000 hacia Mateo)',
                text: 'Cinco mil dólares ahora y un ascenso el lunes. Solo tienes que dejar pasar un camión de «Los Sombra» a las 23:00 y quemar esas denuncias. Piensa en el inhalador de Sofía.',
              },
            ],
            choices: [
              {
                label: 'Grabar en secreto y rechazar el soborno (Ruta del Bien)',
                style: 'primary',
                effect: (st) => {
                  st.ruta_bien = true;
                },
                next: 'N2A_ARCHIVO_INTRO',
              },
              {
                label: 'Aceptar el dinero por el bien de tu familia (Ruta del Mal)',
                style: 'moral-dark',
                effect: (st) => {
                  st.ruta_bien = false;
                },
                next: 'N2B_PUENTE',
              },
            ],
          },

          // === RAMA A ===
          N2A_ARCHIVO_INTRO: {
            chapter: 'CAPÍTULO 2',
            location: 'Archivo Central · Comisaría',
            time: '23:25',
            scene: 'archive',
            lines: [
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Susurrando tras la puerta metálica)',
                text: 'Vargas no sabe que grabé su oferta. Ahora necesito fotografiar las transferencias entre él y Marcos Mendoza en el archivador del fondo sin que el guardia de ronda me vea.',
              },
            ],
            stealth: true,
          },
          N2A_LLAMADA: {
            chapter: 'CAPÍTULO 2',
            location: 'Archivo Central · Comisaría',
            time: '23:45',
            scene: 'archive',
            lines: [
              {
                speaker: 'marcos',
                name: 'Marcos Mendoza',
                mood: 'amenazante',
                dir: '(Voz helada por el teléfono de Mateo)',
                text: 'Buen intento, agente Morales. Sabemos dónde estudia Sofía y a qué hora sale. Devuelve las fotos o mañana recogerás su mochila vacía.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Sale corriendo hacia la avenida bajo la lluvia)',
                text: '¡Maldito! Tengo que llegar a casa antes que ellos.',
              },
            ],
            next: 'N2A_EMBOSCADA_INTRO',
          },
          N2A_EMBOSCADA_INTRO: {
            chapter: 'CAPÍTULO 2',
            location: 'Avenida del Puente',
            time: '00:25',
            scene: 'bridge',
            lines: [
              {
                speaker: 'sicario',
                name: 'Sicario en Motocicleta',
                mood: 'amenazante',
                dir: '(Rugen dos motos cerrando el paso bajo la lluvia)',
                text: '¡Mendoza manda saludos! Entrega el teléfono ahora mismo.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Se cubre tras el pilar del puente)',
                text: 'Puedo usar los pilares como cobertura y llegar al paso seguro sin enfrentarme a todos.',
              },
            ],
            combatId: 'COMBAT_2',
          },
          N2A_CASA_DECISION: {
            chapter: 'CAPÍTULO 2',
            location: 'Casa de Mateo · Cocina',
            time: '01:10',
            scene: 'kitchen',
            lines: [
              {
                speaker: 'elena',
                name: 'Elena',
                mood: 'tenso',
                dir: '(Corre al ver el abrigo rasgado y el roce de bala)',
                text: '¡Mateo! ¿Qué pasó? Estás sangrando... Dime la verdad, ¿quién te hizo esto?',
              },
            ],
            choices: [
              {
                label: 'Contar toda la verdad a Elena y planear su huida con las pruebas',
                style: 'primary',
                effect: (st) => {
                  st.elena_aliada = true;
                },
                next: 'N3A_COLEGIO',
              },
              {
                label: 'Mentirle para no asustarla y ocultar el peligro',
                style: 'moral-dark',
                effect: (st) => {
                  st.elena_aliada = false;
                },
                next: 'N3A_COLEGIO',
              },
            ],
          },

          // === RAMA B ===
          N2B_PUENTE: {
            chapter: 'CAPÍTULO 2',
            location: 'Puente Sur · Retén Nocturno',
            time: '23:00',
            scene: 'bridge',
            lines: [
              {
                speaker: 'narrador',
                name: 'Narración',
                mood: 'neutral',
                dir: '(Los faros de un camión blindado cortan la niebla)',
                text: 'A las 23:00 en punto, Mateo levanta la barrera del puente. El dinero quema en su bolsillo mientras el contrabando entra sin obstáculos.',
              },
              {
                speaker: 'marcos',
                name: 'Marcos Mendoza',
                mood: 'amenazante',
                dir: '(Baja la ventanilla del camión antes de acelerar)',
                text: 'Bienvenido al negocio, suboficial. A las 7:00 AM plantarás esta bolsa de mercancía en el taller del mecánico Julián. Necesitamos un culpable para cerrar el expediente.',
              },
            ],
            next: 'N2B_TALLER_EXPLORAR',
          },
          N2B_TALLER_EXPLORAR: {
            chapter: 'CAPÍTULO 2',
            location: 'Taller Mecánico de Julián',
            time: '06:45',
            scene: 'garage',
            exploreScene: 'garage',
            lines: [
              {
                speaker: 'julian',
                name: 'Julián',
                mood: 'neutral',
                dir: '(Sirviendo café en dos tazas desportilladas)',
                text: '¡Mateo, qué sorpresa tan temprano! ¿Cómo sigue la pequeña Sofía? Si tu auto falla otra vez, aquí tienes mis herramientas y mi casa.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'triste',
                dir: '(Palpa el paquete oculto en su chaqueta)',
                text: 'Julián me ayudó cuando no tenía ni para el autobús... La patrulla de asalto llegará en diez minutos.',
              },
            ],
            next: 'N2B_DECISION_2B',
          },
          N2B_DECISION_2B: {
            chapter: 'CAPÍTULO 2',
            location: 'Taller Mecánico de Julián',
            time: '06:55',
            scene: 'garage',
            lines: [
              {
                speaker: 'julian',
                name: 'Julián',
                mood: 'tenso',
                dir: '(Nota el temblor en las manos de Mateo)',
                text: 'Hermano, estás pálido. ¿Ocurre algo en la comisaría?',
              },
            ],
            choices: [
              {
                label: 'Advertir a Julián de la trampa y darle dinero para que huya',
                style: 'primary',
                effect: (st) => {
                  st.remordimiento = true;
                },
                next: 'N3B_INTERNOS',
              },
              {
                label: 'Plantar la droga en su caja de herramientas y arrestarlo',
                style: 'moral-dark',
                effect: (st) => {
                  st.remordimiento = false;
                },
                next: 'N3B_INTERNOS',
              },
            ],
          },

          // === CAPÍTULO 3 ===
          N3A_COLEGIO: {
            chapter: 'CAPÍTULO 3',
            location: 'Entrada del Colegio San Marcos',
            time: '16:30',
            scene: 'school',
            lines: [
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'amenazante',
                dir: '(Apoyado junto al sedán negro frente a la reja)',
                text: 'Qué puntual, Morales. Marcos tiene un mensaje para ti: nos vemos solo tú y tus copias en el Almacén del Puerto a las 23:00.',
              },
              {
                speaker: 'marcos',
                name: 'Marcos Mendoza',
                mood: 'amenazante',
                dir: '(Observando el portón del colegio con sonrisa fría)',
                text: 'Si aparece una sola patrulla más, la pequeña no volverá a ver el patio de recreo.',
              },
            ],
            next: 'N3A_MUELLE_INTRO',
          },
          N3A_MUELLE_INTRO: {
            chapter: 'CAPÍTULO 3',
            location: 'Almacén del Puerto · Muelle Exterior',
            time: '23:10',
            scene: 'warehouse',
            lines: [
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Infiltrándose entre contenedores bajo la lluvia)',
                text: 'Tres hombres custodian la entrada del muelle. Los contenedores me dan cobertura. Buscaré una salida sin que nadie más salga herido.',
              },
            ],
            combatId: 'COMBAT_3A',
          },

          N3B_INTERNOS: {
            chapter: 'CAPÍTULO 3',
            location: 'Oficina de Asuntos Internos',
            time: '18:00',
            scene: 'office',
            lines: [
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'enojado',
                dir: '(Lanza un acta sobre el escritorio)',
                text: 'Asuntos Internos está husmeando en el envío del puente y en el taller. Vas a firmar esta confesión responsabilizándote de todo... porque Marcos ya tiene a Sofía en el almacén del puerto.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Firma con rabia y arrebata su arma de servicio)',
                text: '¡Si le tocan un pelo a mi hija, los entierro a los dos esta misma noche!',
              },
            ],
            next: 'N3B_CONTENEDORES_INTRO',
          },
          N3B_CONTENEDORES_INTRO: {
            chapter: 'CAPÍTULO 3',
            location: 'Patio de Contenedores · Puerto',
            time: '23:20',
            scene: 'warehouse',
            lines: [
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'tenso',
                dir: '(Avanza bajo el aguacero hacia el almacén principal)',
                text: 'Los hombres de «Los Sombra» bloquean el patio. Puedo rodearlos entre los contenedores y usar el transformador como distracción.',
              },
            ],
            combatId: 'COMBAT_3B',
          },

          // === CAPÍTULO 4 / CLÍMAX & DESENLACES ===
          N4_COMBAT_OSCURAS: {
            chapter: 'CAPÍTULO 4',
            location: 'Almacén del Puerto · Interior',
            time: '23:45',
            scene: 'warehouse',
            lines: [
              {
                speaker: 'marcos',
                name: 'Marcos Mendoza',
                mood: 'amenazante',
                dir: '(Con Elena y Sofía atadas detrás de los cajones)',
                text: 'Por callar para "protegerlas", las trajiste directo a nuestra mesa, Morales. Ahora suelta el arma.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Localiza el transformador eléctrico chispeando a la derecha)',
                text: '¡Elena, agáchate con Sofía! Voy a apagar todas las luces de este infierno.',
              },
            ],
            combatId: 'COMBAT_4_TRANSFORMADOR',
          },
          N4_DUELO_RAPIDO: {
            chapter: 'CAPÍTULO 4',
            location: 'Almacén del Puerto · Interior',
            time: '23:50',
            scene: 'warehouse',
            lines: [
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'amenazante',
                dir: '(Apuntando junto a Marcos y los maletines de dinero)',
                text: 'Creíste que podías jugar limpio después de ensuciarte las manos. Nadie vendrá por ti aquí, Mateo.',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'enojado',
                dir: '(Mirada fría sin retorno)',
                text: 'Entonces no dejaré testigos.',
              },
            ],
            combatId: 'COMBAT_4_DUELO',
          },
          N4_FINAL_BUENO_1: {
            chapter: 'CAPÍTULO 4',
            location: 'Almacén del Puerto',
            time: '23:40',
            scene: 'warehouse',
            siren: true,
            lines: [
              {
                speaker: 'elena',
                name: 'Elena',
                mood: 'tenso',
                dir: '(A salvo tras el cordón de unidades tácticas)',
                text: 'Hice exactamente lo que acordamos anoche, Mateo. Sofía y yo salimos antes del amanecer y entregué tus grabaciones y las fotos directo a la Fiscalía.',
              },
              {
                speaker: 'vargas',
                name: 'Comandante Vargas',
                mood: 'enojado',
                dir: '(Esposado bajo las luces rojas y azules de las patrullas)',
                text: '¡Esto no ha terminado, Morales! ¡Me oyes!',
              },
            ],
            endingKey: 'BUENO_1',
          },
          N4_FINAL_TRAGICO_1: {
            chapter: 'CAPÍTULO 4',
            location: 'Almacén del Puerto',
            time: '23:55',
            scene: 'warehouse',
            siren: true,
            lines: [
              {
                speaker: 'elena',
                name: 'Elena',
                mood: 'triste',
                dir: '(Sosteniendo a Mateo en el suelo mientras llegan las sirenas)',
                text: '¡Mateo, resiste! Los refuerzos ya están entrando... Sofía está a salvo, mírame, por favor...',
              },
              {
                speaker: 'mateo',
                name: 'Mateo',
                mood: 'triste',
                dir: '(Sonríe débilmente antes de cerrar los ojos)',
                text: 'Están... a salvo. Perdonen por... haber callado.',
              },
            ],
            endingKey: 'TRAGICO_1',
          },
          N4_FINAL_BUENO_2: {
            chapter: 'CAPÍTULO 4',
            location: 'Almacén del Puerto',
            time: '23:42',
            scene: 'warehouse',
            siren: true,
            lines: [
              {
                speaker: 'julian',
                name: 'Julián',
                mood: 'tenso',
                dir: '(Irrumpiendo junto a agentes federales por el portón)',
                text: '¡Aquí están, agentes! Mateo me salvó la vida esta mañana y me pidió que entregara todo a Asuntos Internos si no volvía.',
              },
              {
                speaker: 'sofia',
                name: 'Sofía',
                mood: 'triste',
                dir: '(Corre a abrazar a Mateo mientras arrestan a Marcos y Vargas)',
                text: '¡Papá! Sabía que ibas a venir por mí.',
              },
            ],
            endingKey: 'BUENO_2',
          },
          N4_FINAL_TRAGICO_2: {
            chapter: 'CAPÍTULO 4',
            location: 'Casa de Mateo · Cocina',
            time: '02:15',
            scene: 'kitchen',
            lines: [
              {
                speaker: 'narrador',
                name: 'Narración',
                mood: 'neutral',
                dir: '(Silencio absoluto en la cocina vacía)',
                text: 'Abatiste a Marcos y a Vargas en el puerto, tomaste el dinero y asumiste el mando como nuevo Comandante. Pero sobre la mesa solo quedan las llaves, el anillo de Elena y una carta: «Ya no reconozco al hombre que lleva ese uniforme».',
              },
            ],
            endingKey: 'TRAGICO_2',
          },
        };

        const ENDINGS = {
          BUENO_1: {
            type: 'good',
            kicker: 'FINAL BUENO 1 · RUTA DEL BIEN Y CONFIANZA',
            title: 'PLACA LIMPIA',
            body: 'Días después, en una plaza luminosa junto a la costa, Sofía corre sin ahogarse mientras Elena sostiene tu mano. Con Vargas y Marcos condenados tras las rejas y la Fiscalía financiando programas de salud policial, tu uniforme vuelve a significar honor.',
            reflection:
              'La integridad no se sostiene en soledad: confiar la verdad a quienes nos aman convierte el miedo en fortaleza compartida.',
          },
          TRAGICO_1: {
            type: 'tragic',
            kicker: 'FINAL TRÁGICO 1 · EL PRECIO DEL SILENCIO',
            title: 'EL HÉROE CAÍDO',
            body: 'El disparo al transformador cegó a los sicarios y permitió que Elena y Sofía escaparan ilesas, pero los proyectiles finales de Vargas alcanzaron a Mateo antes de la irrupción de los refuerzos. La ciudad le rindió honores póstumos, dejando una silla vacía en casa.',
            reflection:
              'Callar la verdad bajo la excusa de «proteger» a los nuestros los deja desarmados frente al peligro que intentamos ocultar.',
          },
          BUENO_2: {
            type: 'good',
            kicker: 'FINAL BUENO 2 · CAMINO DE EXPIACIÓN',
            title: 'REDENCIÓN',
            body: 'Gracias a la advertencia que diste a Julián, Asuntos Internos desmanteló la red de «Los Sombra» y rescató a Sofía intacta. Tras colaborar con la justicia, cumples una condena reducida de dos años en prisión, recibiendo cada domingo la visita serena de Elena y Sofía.',
            reflection:
              'Un error grave no define toda una vida si aún tienes el valor de detenerte antes del abismo y enmendar el rumbo.',
          },
          TRAGICO_2: {
            type: 'tragic',
            kicker: 'FINAL TRÁGICO 2 · CORRUPCIÓN ABSOLUTA',
            title: 'EL NUEVO COMANDANTE',
            body: 'Sin aliados ni escrúpulos, eliminaste a Marcos y a Vargas en el almacén, te quedaste con el botín y ocupaste la silla de Comandante. Tienes dinero de sobra, pero la cocina está helada: el anillo de bodas de Elena brilla junto a su carta de despedida.',
            reflection:
              'Quien justifica cada traición en nombre de los suyos termina perdiéndolos, convirtiéndose exactamente en el monstruo que juró combatir.',
          },
        };

        // Pure helper exported for unit testing & internal routing
        function resolveEndingKey(flags) {
          if (flags.ruta_bien) {
            return flags.elena_aliada ? 'BUENO_1' : 'TRAGICO_1';
          }
          return flags.remordimiento ? 'BUENO_2' : 'TRAGICO_2';
        }

        // =========================================================================
        // 5. GAME STATE & CORE ENGINE
        // =========================================================================

const data={HOTSPOTS,COMBATS,STORY,ENDINGS,resolveEndingKey};if(typeof module!=='undefined')module.exports=data;else root.GameStory=data;})(typeof window!=='undefined'?window:globalThis);