
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseAuth } from './useSupabaseAuth'
import { Bill, BillItem } from '../types'

export const useBills = (updateCustomerSpending?: (customerId: string, amount: number) => Promise<void>) => {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSupabaseAuth()

  const fetchBills = async () => {
    if (!user) return

    try {
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select(`
          *,
          bill_items (
            id,
            product_id,
            product_name,
            qty,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (billsError) throw billsError

      const formattedBills = billsData.map(bill => ({
        id: bill.id,
        customerId: bill.customer_id,
        customerName: bill.customer_name,
        date: new Date(bill.date),
        total: bill.total,
        paymentMethod: bill.payment_method as 'Cash' | 'Credit' | 'Digital',
        status: bill.status as 'paid' | 'unpaid' | 'partial',
        items: bill.bill_items.map((item: any) => ({
          productId: item.product_id,
          productName: item.product_name,
          qty: item.qty,
          price: item.price
        })) as BillItem[],
        createdAt: new Date(bill.created_at)
      }))

      setBills(formattedBills)
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const addBill = async (billData: Omit<Bill, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      // Check stock availability before creating bill
      for (const item of billData.items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .eq('user_id', user.id)
          .single()

        if (productError) throw productError
        
        if (product.stock < item.qty) {
          throw new Error(`Not enough stock for ${item.productName}. Available: ${product.stock}, Required: ${item.qty}`)
        }
      }

      // Insert bill
      const { data: billResult, error: billError } = await supabase
        .from('bills')
        .insert({
          customer_id: billData.customerId,
          customer_name: billData.customerName,
          date: billData.date.toISOString(),
          total: billData.total,
          payment_method: billData.paymentMethod,
          status: billData.status || 'paid',
          user_id: user.id
        })
        .select()
        .single()

      if (billError) throw billError

      // Insert bill items
      const billItemsData = billData.items.map(item => ({
        bill_id: billResult.id,
        product_id: item.productId,
        product_name: item.productName,
        qty: item.qty,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItemsData)

      if (itemsError) throw itemsError

      // Update product stock
      for (const item of billData.items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          product_id: item.productId,
          quantity_sold: item.qty
        })
        if (stockError) console.error('Error updating stock:', stockError)
      }

      // Update customer spending if customer is selected
      if (billData.customerId && updateCustomerSpending) {
        await updateCustomerSpending(billData.customerId, billData.total)
      }

      const newBill: Bill = {
        id: billResult.id,
        customerId: billResult.customer_id,
        customerName: billResult.customer_name,
        date: new Date(billResult.date),
        total: billResult.total,
        paymentMethod: billResult.payment_method as 'Cash' | 'Credit' | 'Digital',
        status: billResult.status as 'paid' | 'unpaid' | 'partial',
        items: billData.items,
        createdAt: new Date(billResult.created_at)
      }

      setBills(prev => [newBill, ...prev])
      return newBill
    } catch (error) {
      console.error('Error adding bill:', error)
      throw error
    }
  }

  const updateBill = async (billId: string, updates: Partial<Omit<Bill, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const updateData: any = {}
      if (updates.customerId !== undefined) updateData.customer_id = updates.customerId
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName
      if (updates.date !== undefined) updateData.date = updates.date.toISOString()
      if (updates.total !== undefined) updateData.total = updates.total
      if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod
      if (updates.status !== undefined) updateData.status = updates.status

      const { error } = await supabase
        .from('bills')
        .update(updateData)
        .eq('id', billId)
        .eq('user_id', user.id)

      if (error) throw error

      setBills(prev => prev.map(bill => 
        bill.id === billId ? { ...bill, ...updates } : bill
      ))
    } catch (error) {
      console.error('Error updating bill:', error)
      throw error
    }
  }

  const deleteBill = async (billId: string) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      // Get bill items to restore stock
      const { data: billItems, error: itemsError } = await supabase
        .from('bill_items')
        .select('product_id, qty')
        .eq('bill_id', billId)

      if (itemsError) throw itemsError

      // Restore stock for each item
      for (const item of billItems) {
        // Get current stock
        const { data: product, error: getError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .eq('user_id', user.id)
          .single()

        if (getError) {
          console.error('Error getting current stock:', getError)
          continue
        }

        // Update stock by adding back the quantity
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: product.stock + item.qty,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id)
          .eq('user_id', user.id)

        if (stockError) console.error('Error restoring stock:', stockError)
      }

      // Delete bill items first
      const { error: deleteItemsError } = await supabase
        .from('bill_items')
        .delete()
        .eq('bill_id', billId)

      if (deleteItemsError) throw deleteItemsError

      // Delete bill
      const { error: deleteBillError } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId)
        .eq('user_id', user.id)

      if (deleteBillError) throw deleteBillError

      setBills(prev => prev.filter(bill => bill.id !== billId))
    } catch (error) {
      console.error('Error deleting bill:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchBills()
  }, [user])

  return {
    bills,
    loading,
    addBill,
    updateBill,
    deleteBill,
    refetch: fetchBills
  }
}
