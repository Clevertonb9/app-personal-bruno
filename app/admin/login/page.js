'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      setMessage('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, active')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profileError || !profile || profile.role !== 'admin' || profile.active === false) {
      await supabase.auth.signOut()
      setMessage('Este acesso não está autorizado para a área do Personal.')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <main>
      <section>
        <div className="brand">PERSONAL BRUNO OLIVEIRA</div>
        <h1>Área do <strong>Personal</strong></h1>
        <p>Acesse o painel para gerenciar seus alunos e treinos.</p>
        <form className="login-card" onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar no painel'}</button>
          {message && <div className="error">{message}</div>}
        </form>
      </section>
    </main>
  )
}
