# Sponsored Ads Management System

## Overview
The TestCraft platform now includes a comprehensive sponsored ads management system that allows Super Admins to create, modify, and control advertisements across the platform. The system includes increased ad sizes, better placement options, and detailed analytics.

**Currency**: All monetary values are displayed in Indian Rupees (₹) to align with the Indian market focus of the platform.

## Features

### 1. Super Admin Dashboard Integration
- **Sponsored Ads Management Section**: Dedicated section in the Super Admin dashboard
- **Full CRUD Operations**: Create, Read, Update, Delete sponsored advertisements
- **Real-time Analytics**: View clicks, impressions, CTR, and revenue data
- **Ad Settings Configuration**: Control global ad behavior and sizing

### 2. Enhanced Ad Sizes
The default ad sizes have been significantly increased for better visibility:

- **Banner**: 970x250px (increased from 728x120px)
- **Square**: 400x400px (increased from 350x350px)  
- **Leaderboard**: 1200x300px (increased from 970x250px)
- **Skyscraper**: 350x900px (increased from 300x800px)

### 3. Ad Placement Options
- **Home Page**: Large leaderboard ads on the main landing page
- **Dashboard**: Banner ads on user dashboards
- **Tests**: Leaderboard ads on mock test pages
- **Community**: Square ads in community sections
- **Sidebar**: Skyscraper ads in sidebar areas

### 4. Ad Management Features

#### Create New Ads
- Title and description
- Image URL or text-based ads
- Target URL for clicks
- Placement selection
- Priority setting (1-10)
- Budget allocation
- Start and end dates
- Active/inactive status

#### Edit Existing Ads
- Modify all ad properties
- Update targeting and placement
- Change budgets and schedules
- Toggle active status

#### Analytics & Tracking
- Click tracking
- Impression tracking
- CTR (Click-Through Rate) calculation
- Revenue tracking
- Performance metrics per ad

### 5. Global Ad Settings
- Enable/disable all ads platform-wide
- Control max ads per page
- Set ad refresh rates
- Configure whether to show ads to premium users
- Customize ad sizes for different placements
- Select ad network (Google AdSense, Custom, Direct Sales)

## API Endpoints

### Admin Endpoints (Super Admin Only)
- `GET /api/admin/sponsored-ads` - List all ads with analytics
- `POST /api/admin/sponsored-ads` - Create new ad
- `PUT /api/admin/sponsored-ads/[id]` - Update existing ad
- `DELETE /api/admin/sponsored-ads/[id]` - Delete ad
- `GET /api/admin/ad-settings` - Get global ad settings
- `POST /api/admin/ad-settings` - Update global ad settings

### Public Endpoints
- `GET /api/sponsored-ads/public` - Get active ads for display
- `GET /api/ad-settings/public` - Get public ad settings
- `POST /api/sponsored-ads/track` - Track ad clicks/impressions

## Components

### Admin Components
- `SponsoredAdsManagement` - Main admin interface
- Enhanced `SuperAdminDashboard` - Includes ad management section

### Display Components
- `AdBanner` - Enhanced ad display component with size options
- `SidebarAd` - Sidebar placement component
- `DashboardAd` - Dashboard placement component
- `CommunityAd` - Community placement component
- `TestAd` - Test page placement component

## Security Features
- Super Admin role verification
- Input validation and sanitization
- CORS protection
- Rate limiting on tracking endpoints

## Usage Instructions

### For Super Admins

1. **Access Ad Management**
   - Navigate to Super Admin Dashboard
   - Click "Show Sponsored Ads Control"

2. **Create New Ad**
   - Click "Create New Ad" button
   - Fill in ad details (title, description, image URL, target URL)
   - Select placement and set priority
   - Configure dates and budget
   - Save the ad

3. **Manage Existing Ads**
   - View all ads in the management interface
   - Use edit button to modify ad properties
   - Toggle active/inactive status with eye icon
   - Delete ads with trash icon

4. **Configure Global Settings**
   - Switch to "Ad Settings" tab
   - Enable/disable ads platform-wide
   - Set maximum ads per page
   - Configure ad refresh rates
   - Customize ad sizes
   - Select ad network

5. **Monitor Performance**
   - View analytics dashboard with total revenue, clicks, impressions
   - Check individual ad performance metrics
   - Monitor CTR and cost data

### For Developers

1. **Adding New Placement**
   ```tsx
   import { AdBanner } from "@/components/ui/ad-banner"
   
   <AdBanner placement="new-location" size="banner" />
   ```

2. **Custom Ad Sizes**
   - Update ad settings through admin interface
   - Sizes are dynamically applied to all ad components

3. **Tracking Integration**
   - Ad clicks and impressions are automatically tracked
   - Use tracking API for custom events if needed

## Database Schema (Recommended for Production)

### sponsored_ads table
```sql
CREATE TABLE sponsored_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  target_url VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  placement VARCHAR(50) NOT NULL,
  priority INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(12,2) DEFAULT 0, -- Increased precision for Indian Rupees
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cost DECIMAL(12,2) DEFAULT 0, -- Increased precision for Indian Rupees
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ad_settings table
```sql
CREATE TABLE ad_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ads_enabled BOOLEAN DEFAULT true,
  ad_network VARCHAR(100) DEFAULT 'Google AdSense',
  max_ads_per_page INTEGER DEFAULT 3,
  ad_refresh_rate INTEGER DEFAULT 30,
  show_ads_to_elite_users BOOLEAN DEFAULT false,
  ad_sizes JSONB DEFAULT '{"banner":{"width":970,"height":250},"square":{"width":400,"height":400},"leaderboard":{"width":1200,"height":300},"skyscraper":{"width":350,"height":900}}',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Future Enhancements
1. A/B testing for ads
2. Geographic targeting
3. User behavior targeting
4. Advanced analytics dashboard
5. Automated bid management
6. Integration with external ad networks
7. Revenue sharing with content creators
8. Real-time reporting dashboard

## Support
For technical support or feature requests related to the sponsored ads system, contact the development team or create an issue in the project repository.