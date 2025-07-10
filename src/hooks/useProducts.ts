
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseAuth } from './useSupabaseAuth'
import { Product } from '../types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSupabaseAuth()

  const fetchProducts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedProducts = data.map(product => ({
        id: product.id,
        productName: product.product_name,
        purchasePrice: product.purchase_price,
        retailPrice: product.retail_price,
        stock: product.stock,
        createdAt: new Date(product.created_at)
      }))

      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: productData.productName,
        purchase_price: productData.purchasePrice,
        retail_price: productData.retailPrice,
        stock: productData.stock,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    const newProduct: Product = {
      id: data.id,
      productName: data.product_name,
      purchasePrice: data.purchase_price,
      retailPrice: data.retail_price,
      stock: data.stock,
      createdAt: new Date(data.created_at)
    }

    setProducts(prev => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error('User must be authenticated')

    const updateData: any = {}
    if (updates.productName) updateData.product_name = updates.productName
    if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice
    if (updates.retailPrice !== undefined) updateData.retail_price = updates.retailPrice
    if (updates.stock !== undefined) updateData.stock = updates.stock

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ))
  }

  const deleteProduct = async (id: string) => {
    if (!user) throw new Error('User must be authenticated')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    setProducts(prev => prev.filter(product => product.id !== id))
  }

  useEffect(() => {
    fetchProducts()
  }, [user])

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  }
}
