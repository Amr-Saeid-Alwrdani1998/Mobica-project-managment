import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Item from '@/models/Item'

export async function GET() {
  try {
    await connectToDatabase()
    const items = await Item.find({})
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return new NextResponse('خطأ في جلب البيانات', { status: 500 })
  }
}
