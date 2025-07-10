
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseAuth } from './useSupabaseAuth'
import { Customer } from '../types'

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSupabaseAuth()

  const fetchCustomers = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedCustomers = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        credit: customer.credit,
        createdAt: new Date(customer.created_at)
      }))

      setCustomers(formattedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        credit: customerData.credit || 0,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    const newCustomer: Customer = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      credit: data.credit,
      createdAt: new Date(data.created_at)
    }

    setCustomers(prev => [newCustomer, ...prev])
    return newCustomer
  }

  const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error('User must be authenticated')

    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ))
  }

  useEffect(() => {
    fetchCustomers()
  }, [user])

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    refetch: fetchCustomers
  }
}
