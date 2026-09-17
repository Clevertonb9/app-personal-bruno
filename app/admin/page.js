'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [name, setName] = useState('')
  const [students, setStudents] = useState([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        window.location.href = '/admin/login'
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role, active')
        .eq('id', sessionData.session.user.id)
        .maybeSingle()

      if (!profile || profile.role !== 'admin' || profile.active === false) {
        await supabase.auth.signOut()
        window.location.href = '/admin/login'
        return
      }

      const { data: studentRows } = await supabase
        .from('students')
        .select('id, full_name, email, goal, active, created_at')
        .eq('trainer_id', sessionData.session.user.id)
        .order('created_at', { ascending: false })

      setName(profile.full_name || 'Bruno')
      setStudents(studentRows || [])
      setAuthorized(true)
      setLoading(false)
    }

    load()
  }, [])

  async function sair() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (loading) return <main><section><p>Carregando painel...</p></section></main>
  if (!authorized) return null

  return (
    <main>
      <header>
        <span className="brand">PERSONAL BRUNO</span>
        <button onClick={sair}>Sair</button>
      </header>
      <section>
        <p>Olá, {name} 👋</p>
        <h1>Painel do <strong>Personal</strong></h1>
        <p>Gerencie seus alunos e acompanhe o processo de cada um.</p>

        <div className="admin-grid">
          <div className="card">
            <small>ALUNOS ATIVOS</small>
            <strong className="metric">{students.filter(s => s.active !== false).length}</strong>
          </div>
          <div className="card">
            <small>ALUNOS CADASTRADOS</small>
            <strong className="metric">{students.length}</strong>
          </div>
        </div>

        <div className="card">
          <div className="card-heading">
            <h2>Meus alunos</h2>
            <button type="button" disabled>Novo aluno</button>
          </div>
          {students.length === 0 ? (
            <p>Nenhum aluno cadastrado ainda. O próximo passo será criar o cadastro e vincular o treino.</p>
          ) : (
            <div className="student-list">
              {students.map(student => (
                <div className="student-row" key={student.id}>
                  <div>
                    <strong>{student.full_name}</strong>
                    <small>{student.email || 'Sem e-mail'}{student.goal ? ` • ${student.goal}` : ''}</small>
                  </div>
                  <span>{student.active === false ? 'Inativo' : 'Ativo'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Próximas funções</h2>
          <p>Cadastro de alunos, criação de treinos A/B/C/D, exercícios, séries, repetições, cargas e acompanhamento da evolução.</p>
        </div>
      </section>
    </main>
  )
}
