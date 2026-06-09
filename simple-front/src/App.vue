<script setup>
import { ref, onMounted, computed } from 'vue'

const users = ref([])
const loading = ref(true)
const error = ref(null)
const apiUrl = import.meta.env.VITE_API_URL || ''

const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

const avatarColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#14b8a6', '#06b6d4', '#3b82f6',
]

const avatarColor = (id) => avatarColors[(id - 1) % avatarColors.length]

const statusLabel = computed(() => {
  if (loading.value) return 'Connexion…'
  if (error.value) return 'Hors ligne'
  return 'Connecté'
})

const statusClass = computed(() => {
  if (loading.value) return 'pending'
  if (error.value) return 'error'
  return 'ok'
})

onMounted(async () => {
  if (!apiUrl) {
    loading.value = false
    error.value = 'VITE_API_URL non configurée sur Render'
    return
  }

  try {
    const res = await fetch(`${apiUrl}/users`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    users.value = await res.json()
  } catch (err) {
    error.value = err.message || 'Impossible de joindre l\'API'
    console.error('Erreur API :', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>

    <div class="container">
      <header class="hero">
        <div class="badge">
          <span class="dot" :class="statusClass"></span>
          {{ statusLabel }}
        </div>
        <h1>DevOps Mewo</h1>
        <p class="subtitle">
          Frontend Vue.js connecté à l'API Express + PostgreSQL sur Render
        </p>
      </header>

      <section class="card">
        <div class="card-header">
          <div>
            <h2>Utilisateurs</h2>
            <p class="card-desc">Données chargées depuis l'API en temps réel</p>
          </div>
          <span v-if="!loading && !error" class="count">{{ users.length }}</span>
        </div>

        <div v-if="loading" class="state">
          <div class="spinner"></div>
          <p>Chargement des utilisateurs…</p>
        </div>

        <div v-else-if="error" class="state error-state">
          <div class="error-icon">!</div>
          <p class="error-title">API inaccessible</p>
          <p class="error-msg">{{ error }}</p>
          <p class="error-hint">
            Vérifiez <code>VITE_API_URL</code> sur Render, puis appelez
            <code>/init</code> sur le backend.
          </p>
        </div>

        <ul v-else class="user-grid">
          <li v-for="u in users" :key="u.id" class="user-card">
            <div class="avatar" :style="{ background: avatarColor(u.id) }">
              {{ initials(u.name) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ u.name }}</span>
              <span class="user-id">ID #{{ u.id }}</span>
            </div>
          </li>
        </ul>

        <div v-if="!loading && !error && users.length === 0" class="state">
          <p>Aucun utilisateur trouvé.</p>
          <p class="error-hint">Visitez <code>{{ apiUrl }}/init</code> pour peupler la base.</p>
        </div>
      </section>

      <footer class="footer">
        <span>Vue 3</span>
        <span class="sep">·</span>
        <span>Express</span>
        <span class="sep">·</span>
        <span>PostgreSQL</span>
        <span class="sep">·</span>
        <span>Render</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 2rem 1.25rem 3rem;
}

.bg-shape {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  pointer-events: none;
  z-index: 0;
}

.shape-1 {
  width: 420px;
  height: 420px;
  background: #818cf8;
  top: -120px;
  right: -80px;
}

.shape-2 {
  width: 360px;
  height: 360px;
  background: #c084fc;
  bottom: -100px;
  left: -60px;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 1.25rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}

.dot.ok {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e88;
}

.dot.error {
  background: #ef4444;
  box-shadow: 0 0 8px #ef444488;
}

.dot.pending {
  background: #f59e0b;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

h1 {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 20px 50px -12px rgba(79, 70, 229, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.2rem;
}

.card-desc {
  font-size: 0.875rem;
  color: #94a3b8;
}

.count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.6rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 999px;
}

.user-grid {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  background: white;
  border-radius: 0.875rem;
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -8px rgba(99, 102, 241, 0.25);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
}

.user-id {
  font-size: 0.8rem;
  color: #94a3b8;
}

.state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state .error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fef2f2;
  color: #ef4444;
  font-weight: 700;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.error-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.error-hint {
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.6;
}

code {
  background: #f1f5f9;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #6366f1;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.sep {
  margin: 0 0.4rem;
}
</style>
