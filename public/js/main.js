import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050814, 0.035);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(4.2, 2.4, 6.4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 3.2;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(0, 1.1, 0);

scene.add(new THREE.AmbientLight(0x4a5a88, 0.45));
const key = new THREE.PointLight(0x4df0ff, 28, 18);
key.position.set(2.5, 4, 3);
scene.add(key);
const fill = new THREE.PointLight(0x8b6cff, 16, 16);
fill.position.set(-3, 2, -2);
scene.add(fill);
const rim = new THREE.PointLight(0xffd56a, 8, 12);
rim.position.set(0, -1, 4);
scene.add(rim);

function makeStars(count, radius, size, color) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.4 + Math.random() * 0.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity: 0.9 });
  return new THREE.Points(geo, mat);
}
scene.add(makeStars(1800, 40, 0.035, 0xffffff));
scene.add(makeStars(400, 28, 0.07, 0x4df0ff));

const ringGeo = new THREE.RingGeometry(2.4, 2.55, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x4df0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.02;
scene.add(ring);
const ring2 = ring.clone();
ring2.scale.set(1.28, 1.28, 1.28);
ring2.material = ringMat.clone();
ring2.material.color.set(0x8b6cff);
ring2.material.opacity = 0.18;
scene.add(ring2);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(8, 64),
  new THREE.MeshStandardMaterial({ color: 0x0a1228, metalness: 0.4, roughness: 0.6, transparent: true, opacity: 0.55 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const bot = new THREE.Group();
bot.position.y = 1.15;
scene.add(bot);

function mat(color, emissive = 0x000000, emInt = 0) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.28, emissive, emissiveIntensity: emInt });
}

const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 0.7, 8, 16), mat(0x1b2748, 0x4df0ff, 0.12));
bot.add(body);
const chest = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), new THREE.MeshBasicMaterial({ color: 0x4df0ff }));
chest.position.set(0, 0.15, 0.52);
bot.add(chest);
const chestGlow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshBasicMaterial({ color: 0x4df0ff, transparent: true, opacity: 0.18 }));
chestGlow.position.set(0, 0.15, 0.5);
bot.add(chestGlow);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), mat(0x223058, 0x8b6cff, 0.15));
head.position.y = 0.95;
bot.add(head);
const visor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.18, 0.12), new THREE.MeshStandardMaterial({ color: 0x041018, emissive: 0x4df0ff, emissiveIntensity: 1.4, metalness: 0.2, roughness: 0.15 }));
visor.position.set(0, 0.98, 0.32);
bot.add(visor);
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
eyeL.position.set(-0.12, 0.98, 0.39);
const eyeR = eyeL.clone();
eyeR.position.x = 0.12;
bot.add(eyeL, eyeR);
const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8), mat(0x8b6cff, 0x8b6cff, 0.6));
antenna.position.set(0, 1.48, 0);
bot.add(antenna);
const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd56a }));
tip.position.set(0, 1.68, 0);
bot.add(tip);
const armGeo = new THREE.CapsuleGeometry(0.12, 0.45, 6, 10);
const armL = new THREE.Mesh(armGeo, mat(0x1b2748, 0x4df0ff, 0.08));
armL.position.set(-0.78, 0.15, 0);
armL.rotation.z = 0.35;
const armR = armL.clone();
armR.position.x = 0.78;
armR.rotation.z = -0.35;
bot.add(armL, armR);
const handL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), mat(0x4df0ff, 0x4df0ff, 0.4));
handL.position.set(-0.98, -0.18, 0.05);
const handR = handL.clone();
handR.position.x = 0.98;
bot.add(handL, handR);

const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color: 0x4df0ff, transparent: true, opacity: 0.55 }));
halo.rotation.x = Math.PI / 2.4;
halo.position.y = 0.2;
bot.add(halo);
const halo2 = halo.clone();
halo2.scale.set(0.78, 0.78, 0.78);
halo2.material = halo.material.clone();
halo2.material.color.set(0x8b6cff);
halo2.rotation.x = Math.PI / 1.7;
bot.add(halo2);

const moduleData = [
  { color: 0x4df0ff }, { color: 0x8b6cff }, { color: 0xffd56a }, { color: 0x3dff9a }, { color: 0xff6ad5 }
];
const modules3D = [];
const moduleGroup = new THREE.Group();
scene.add(moduleGroup);
moduleData.forEach((m, i) => {
  const g = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), new THREE.MeshStandardMaterial({ color: m.color, emissive: m.color, emissiveIntensity: 0.55, metalness: 0.3, roughness: 0.25, transparent: true, opacity: 0.92 }));
  const outline = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), new THREE.MeshBasicMaterial({ color: m.color, wireframe: true, transparent: true, opacity: 0.35 }));
  g.add(sphere, outline);
  g.userData = { step: i, color: m.color };
  moduleGroup.add(g);
  modules3D.push(g);
});

function makePanel(w, h, color) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }));
  const g = new THREE.Group();
  g.add(mesh, frame);
  return g;
}
const p1 = makePanel(1.4, 0.9, 0x4df0ff);
p1.position.set(-3.2, 1.8, -1.2);
p1.rotation.y = 0.5;
scene.add(p1);
const p2 = makePanel(1.1, 1.4, 0x8b6cff);
p2.position.set(3.4, 1.5, -0.6);
p2.rotation.y = -0.6;
scene.add(p2);

const dustGeo = new THREE.BufferGeometry();
const dustCount = 220;
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  dustPos[i * 3] = (Math.random() - 0.5) * 6;
  dustPos[i * 3 + 1] = Math.random() * 4;
  dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x4df0ff, size: 0.025, transparent: true, opacity: 0.55 }));
scene.add(dust);

const copy = {
  fr: {
    steps: [
      { title: 'Rencontrez <em>EduBot</em>', lead: 'Votre tuteur intelligent, disponible 24/7. Explorez le tutoriel en orbitant autour du robot, cliquez les modules holographiques et apprenez à maîtriser EduBot AI.', features: ['Conversations contextualisées', 'Upload de cours & syllabus', 'Parcours adaptatifs', 'Interaction vocale'] },
      { title: 'Votre <em>premier chat</em>', lead: 'Ouvrez EduBot et posez une question simple. Le bot répond en langage clair, adapté à votre niveau.', features: ['Démarrez par Bonjour', 'Posez une question de cours', 'Demandez un exemple', 'Reformulez si besoin'] },
      { title: 'Importez vos <em>documents</em>', lead: 'Glissez un syllabus, un PDF ou des notes. EduBot indexe le contenu et répond à partir de vos ressources.', features: ['PDF, slides, texte', 'Graphe de connaissances', 'Citations des sources', 'Plusieurs fichiers'] },
      { title: 'Parcours <em>personnalisé</em>', lead: 'EduBot détecte vos lacunes et construit un chemin : concepts, exercices, révision, évaluation.', features: ['Diagnostic initial', 'Étapes progressives', 'Quiz adaptatifs', 'Suivi de progression'] },
      { title: 'Parlez avec <em>votre voix</em>', lead: 'Activez le mode vocal. Posez vos questions à voix haute, EduBot répond et peut dicter un résumé.', features: ['Reconnaissance vocale', 'Réponses audio', 'Idéal en mobilité', 'Accessibilité'] }
    ],
    kicker: "Plateforme d'apprentissage IA",
    start: 'Lancer le tutoriel',
    orbit: 'Mode orbite',
    botHello: "Bonjour ! Je suis EduBot. Que souhaitez-vous apprendre aujourd'hui ?",
    replies: [
      'Bonne question. Commençons par les bases, puis je te donnerai un exemple concret.',
      "J'ai indexé tes documents. Voici l'idée principale, en 3 points clairs.",
      'Voici un mini-parcours : 1) concept  2) analogie  3) exercice rapide.',
      'Tu peux aussi me le demander à voix haute. Je reformule jusqu\'à ce que ce soit limpide.'
    ]
  },
  en: {
    steps: [
      { title: 'Meet <em>EduBot</em>', lead: 'Your 24/7 intelligent tutor. Orbit the robot, click the holographic modules and master EduBot AI.', features: ['Context-aware conversations', 'Course upload', 'Adaptive paths', 'Voice interaction'] },
      { title: 'Your <em>first chat</em>', lead: 'Open EduBot and ask something simple. The bot answers in plain language, tuned to your level.', features: ['Start with Hello', 'Ask a course question', 'Request an example', 'Rephrase if needed'] },
      { title: 'Import your <em>documents</em>', lead: 'Drop a syllabus, PDF or notes. EduBot indexes the content and answers from your materials.', features: ['PDF, slides, text', 'Knowledge graph', 'Source citations', 'Multiple files'] },
      { title: 'A <em>personal path</em>', lead: 'EduBot spots your gaps and builds a path: concepts, drills, review, then a short assessment.', features: ['Initial diagnostic', 'Progressive steps', 'Adaptive quizzes', 'Progress tracking'] },
      { title: 'Talk with <em>your voice</em>', lead: 'Turn on voice mode. Ask out loud. EduBot replies and can dictate a summary.', features: ['Speech recognition', 'Audio answers', 'Great on the go', 'Accessibility'] }
    ],
    kicker: 'AI learning platform',
    start: 'Start tutorial',
    orbit: 'Orbit mode',
    botHello: "Hi! I'm EduBot. What would you like to learn today?",
    replies: [
      "Good question. Let's start with the basics, then I'll give you a concrete example.",
      "I've indexed your documents. Here is the core idea, in 3 clear points.",
      'Here is a mini-path: 1) concept  2) analogy  3) quick exercise.',
      "You can also ask me out loud. I'll rephrase until it's crystal clear."
    ]
  }
};

let lang = 'fr';
let currentStep = 0;
let autoOrbit = true;

const titleEl = document.getElementById('title');
const leadEl = document.getElementById('lead');
const featuresEl = document.getElementById('features');
const stepInd = document.getElementById('stepInd');
const kickerEl = document.querySelector('[data-i18n="kicker"]');
const startBtn = document.getElementById('startBtn');
const orbitBtn = document.getElementById('orbitBtn');
const langBtn = document.getElementById('langBtn');
const chatDemo = document.getElementById('chatDemo');
const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function applyCopy() {
  const c = copy[lang];
  const s = c.steps[currentStep];
  titleEl.innerHTML = s.title;
  leadEl.textContent = s.lead;
  kickerEl.textContent = c.kicker;
  startBtn.textContent = c.start;
  orbitBtn.textContent = c.orbit;
  featuresEl.innerHTML = s.features.map((f, i) => `<li><span>0${i + 1}</span> ${f}</li>`).join('');
  stepInd.textContent = `0${currentStep + 1} / 05`;
  document.querySelectorAll('nav button').forEach((b, i) => b.classList.toggle('active', i === currentStep));
  document.querySelectorAll('.mod').forEach((m, i) => m.classList.toggle('active', i === currentStep));
}

function setStep(i) {
  currentStep = (i + 5) % 5;
  applyCopy();
}

document.querySelectorAll('nav button').forEach((b) => {
  b.addEventListener('click', () => setStep(Number(b.dataset.goto)));
});
document.querySelectorAll('.mod').forEach((m) => {
  m.addEventListener('click', () => setStep(Number(m.dataset.step)));
});
startBtn.addEventListener('click', () => { chatDemo.classList.add('open'); setStep(1); });
orbitBtn.addEventListener('click', () => { autoOrbit = !autoOrbit; controls.autoRotate = autoOrbit; });
langBtn.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  applyCopy();
  chatBody.innerHTML = `<div class="msg bot">${copy[lang].botHello}</div>`;
});
document.getElementById('closeChat').addEventListener('click', () => chatDemo.classList.remove('open'));
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatBody.insertAdjacentHTML('beforeend', `<div class="msg user">${text}</div>`);
  chatInput.value = '';
  const reply = copy[lang].replies[Math.floor(Math.random() * copy[lang].replies.length)];
  setTimeout(() => {
    chatBody.insertAdjacentHTML('beforeend', `<div class="msg bot">${reply}</div>`);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 500);
  chatBody.scrollTop = chatBody.scrollHeight;
});

controls.autoRotate = true;
controls.autoRotateSpeed = 0.55;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown', (ev) => {
  pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(modules3D, true);
  if (hits.length) {
    let obj = hits[0].object;
    while (obj && obj.userData.step === undefined) obj = obj.parent;
    if (obj) setStep(obj.userData.step);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  bot.position.y = 1.15 + Math.sin(t * 1.1) * 0.08;
  bot.rotation.y = Math.sin(t * 0.4) * 0.15;
  armL.rotation.z = 0.35 + Math.sin(t * 2) * 0.12;
  armR.rotation.z = -0.35 - Math.sin(t * 2 + 0.4) * 0.12;
  halo.rotation.z = t * 0.6;
  halo2.rotation.z = -t * 0.4;
  tip.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
  chestGlow.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
  modules3D.forEach((m, i) => {
    const a = t * 0.35 + (i / 5) * Math.PI * 2;
    const r = 2.55;
    m.position.set(Math.cos(a) * r, 1.15 + Math.sin(t * 1.3 + i) * 0.18, Math.sin(a) * r);
    m.rotation.y = t + i;
    m.rotation.x = t * 0.4;
    m.scale.setScalar(i === currentStep ? 1.25 : 1);
  });
  ring.rotation.z = t * 0.15;
  ring2.rotation.z = -t * 0.1;
  p1.position.y = 1.8 + Math.sin(t * 0.8) * 0.12;
  p2.position.y = 1.5 + Math.cos(t * 0.7) * 0.1;
  const dp = dust.geometry.attributes.position.array;
  for (let i = 1; i < dp.length; i += 3) {
    dp[i] += 0.004;
    if (dp[i] > 4.2) dp[i] = 0;
  }
  dust.geometry.attributes.position.needsUpdate = true;
  controls.update();
  renderer.render(scene, camera);
}

applyCopy();
animate();
