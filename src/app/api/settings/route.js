import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET dynamic settings (Public)
export async function GET() {
  try {
    await connectDB();
    
    let settings = await Settings.findOne({ settingId: 'global' });
    
    if (!settings) {
      console.log('No global settings found. Creating defaults from schema...');
      settings = await Settings.create({
        settingId: 'global'
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('GET settings API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading settings' },
      { status: 500 }
    );
  }
}

// PUT/POST update settings (Admin only)
export async function PUT(req) {
  try {
    await connectDB();
    
    // Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const body = await req.json();

    let settings = await Settings.findOne({ settingId: 'global' });
    
    if (!settings) {
      settings = new Settings({ settingId: 'global' });
    }

    // Update settings fields safely
    if (body.hero) settings.hero = { ...settings.hero, ...body.hero };
    if (body.about) settings.about = { ...settings.about, ...body.about };
    if (body.stats) settings.stats = body.stats;
    if (body.tools) settings.tools = body.tools;
    if (body.skills) settings.skills = body.skills;
    if (body.timeline) settings.timeline = body.timeline;
    if (body.services) settings.services = body.services;
    if (body.packages) settings.packages = body.packages;
    if (body.contact) settings.contact = { ...settings.contact, ...body.contact };
    if (body.navbar) settings.navbar = { ...settings.navbar, ...body.navbar };

    const updatedSettings = await settings.save();

    return NextResponse.json({
      success: true,
      data: updatedSettings
    });

  } catch (error) {
    console.error('PUT settings API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating settings' },
      { status: 500 }
    );
  }
}
