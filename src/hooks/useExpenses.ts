
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseAuth } from './useSupabaseAuth'
import { Expense } from '../types'

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSupabaseAuth()

  const fetchExpenses = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      const formattedExpenses = data.map(expense => ({
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        date: new Date(expense.date),
        createdAt: new Date(expense.created_at)
      }))

      setExpenses(formattedExpenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date.toISOString(),
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    const newExpense: Expense = {
      id: data.id,
      title: data.title,
      amount: data.amount,
      date: new Date(data.date),
      createdAt: new Date(data.created_at)
    }

    setExpenses(prev => [newExpense, ...prev])
    return newExpense
  }

  useEffect(() => {
    fetchExpenses()
  }, [user])

  return {
    expenses,
    loading,
    addExpense,
    refetch: fetchExpenses
  }
}
