import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planData = await request.json()
    const planId = params.id

    // In a real implementation, update in database
    const updatedPlan = {
      ...planData,
      id: planId,
      updatedAt: new Date().toISOString()
    }

    console.log('Updating subscription plan:', planId, updatedPlan)

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
      message: 'Subscription plan updated successfully'
    })
  } catch (error) {
    console.error('Error updating subscription plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id

    // In a real implementation, delete from database
    console.log('Deleting subscription plan:', planId)

    return NextResponse.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscription plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription plan' },
      { status: 500 }
    )
  }
}