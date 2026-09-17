'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }
    window.location.href = '/aluno'
  }

  return <main><section><div className="brand">PERSONAL BRUNO OLIVEIRA</div><h1>Área do <strong>aluno</strong></h1><p>Entre para acessar seu treino, cargas e evolução.</p><form className="login-card" onSubmit={handleSubmit}><label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>{message && <div className="error">{message}</div>}</form></section></main>
}
