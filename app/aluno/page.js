'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function Aluno(){
  const [email,setEmail]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const supabase=createClient()
    supabase.auth.getSession().then(({data})=>{
      if(!data.session){ window.location.href='/login'; return }
      setEmail(data.session.user.email || '')
      setLoading(false)
    })
  },[])

  async function sair(){
    const supabase=createClient()
    await supabase.auth.signOut()
    window.location.href='/login'
  }

  if(loading) return <main><section><p>Carregando sua área...</p></section></main>

  return <main><header><span className="brand">PERSONAL BRUNO</span><button onClick={sair}>Sair</button></header><section><p>Olá, {email} 👋</p><h1>Vamos treinar?</h1><div className="card"><h2>Treino de hoje</h2><p>Seu próximo treino estará disponível aqui.</p><Link href="/treino">Ver treino</Link></div></section></main>
}