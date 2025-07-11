
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
        totalSpent: customer.total_spent || 0,
        totalBills: customer.total_bills || 0,
        createdAt: new Date(customer.created_at)
      }))

      setCustomers(formattedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'totalBills'>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        credit: customerData.credit || 0,
        total_spent: 0,
        total_bills: 0,
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
      totalSpent: data.total_spent || 0,
      totalBills: data.total_bills || 0,
      createdAt: new Date(data.created_at)
    }

    setCustomers(prev => [newCustomer, ...prev])
    return newCustomer
  }

  const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error('User must be authenticated')

    const dbUpdates: any = {}
    if ('totalSpent' in updates) dbUpdates.total_spent = updates.totalSpent
    if ('totalBills' in updates) dbUpdates.total_bills = updates.totalBills
    if ('name' in updates) dbUpdates.name = updates.name
    if ('phone' in updates) dbUpdates.phone = updates.phone
    if ('address' in updates) dbUpdates.address = updates.address
    if ('credit' in updates) dbUpdates.credit = updates.credit

    const { error } = await supabase
      .from('customers')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ))
  }

  const updateCustomerSpending = async (customerId: string, billAmount: number) => {
    if (!user || !customerId) return

    try {
      // Get current customer data
      const { data: currentCustomer, error: fetchError } = await supabase
        .from('customers')
        .select('total_spent, total_bills, credit')
        .eq('id', customerId)
        .eq('user_id', user.id)
        .single()

      if (fetchError) throw fetchError

      const newTotalSpent = (currentCustomer.total_spent || 0) + billAmount
      const newTotalBills = (currentCustomer.total_bills || 0) + 1

      // Update customer spending
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          total_spent: newTotalSpent,
          total_bills: newTotalBills
        })
        .eq('id', customerId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Update local state
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { 
              ...customer, 
              totalSpent: newTotalSpent,
              totalBills: newTotalBills
            } 
          : customer
      ))
    } catch (error) {
      console.error('Error updating customer spending:', error)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [user])

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    updateCustomerSpending,
    refetch: fetchCustomers
  }
}
