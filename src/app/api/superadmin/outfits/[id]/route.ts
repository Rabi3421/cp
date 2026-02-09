import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Outfit from '@/models/Outfit'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch single outfit by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const outfit = await Outfit.findById(id).populate(
      'celebrity',
      'name slug profileImage'
    )

    if (!outfit) {
      return NextResponse.json(
        { success: false, error: 'Outfit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: outfit,
    })
  } catch (error: any) {
    console.error('Error fetching outfit:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update outfit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify superadmin authentication
    const auth = authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check superadmin role
    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error || 'Forbidden' },
        { status: 403 }
      )
    }

    await dbConnect()
    const { id } = await params

    const body = await request.json()

    // Ensure seo structure exists and has defaults
    const defaultSeo = {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      canonicalUrl: '',
      noindex: false,
      nofollow: false,
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogType: 'product',
      ogSiteName: 'Celebrity Persona',
      ogUrl: '',
      ogImages: [],
      ogLocale: 'en_US',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterSite: '@celebritypersona',
      twitterCreator: '@celebritypersona',
      schemaType: 'Product',
      schemaJson: null,
      publishedTime: '',
      modifiedTime: '',
      authorName: '',
      tags: [],
      section: 'Celebrity Outfits',
      alternateLangs: [],
      prevUrl: '',
      nextUrl: '',
      canonicalAlternates: [],
      focusKeyword: '',
      structuredDataDepth: 'minimal',
      contentScore: 0,
      readabilityScore: 0,
      relatedTopics: [],
      searchVolume: 0,
      authorUrl: '',
    }

    body.seo = { ...(body.seo || {}), ...defaultSeo }

    // If slug is being updated, check for duplicates
    if (body.slug) {
      const existingOutfit = await Outfit.findOne({
        slug: body.slug,
        _id: { $ne: id },
      })
      if (existingOutfit) {
        return NextResponse.json(
          { success: false, error: 'Outfit with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Handle scheduled publishing
    if (body.status === 'scheduled' && body.publishAt) {
      body.isScheduled = true
    } else if (body.status !== 'scheduled') {
      body.isScheduled = false
      body.publishAt = null
    }

    const outfit = await Outfit.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('celebrity', 'name slug profileImage')

    if (!outfit) {
      return NextResponse.json(
        { success: false, error: 'Outfit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: outfit,
      message: 'Outfit updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating outfit:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete outfit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify superadmin authentication
    const auth = authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check superadmin role
    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error || 'Forbidden' },
        { status: 403 }
      )
    }

    await dbConnect()
    const { id } = await params

    const outfit = await Outfit.findByIdAndDelete(id)

    if (!outfit) {
      return NextResponse.json(
        { success: false, error: 'Outfit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Outfit deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting outfit:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
