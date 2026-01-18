# Google Maps API Loading Fix

## Issues Fixed

1. **Warning**: "Google Maps JavaScript API has been loaded directly without loading=async"
2. **Error**: "initMap is not a function"

## What Was Wrong

1. Google Maps was loaded globally in `_document.js` with a callback `initMap`
2. The `initMap` function was defined inside a component and expected a parameter
3. The script tried to call `window.initMap()` which didn't exist
4. Missing `loading=async` parameter in the URL

## Solution Applied

1. **Removed global script** from `_document.js` - Google Maps is now loaded only when needed
2. **Dynamic loading** in `restaurant/signUp.jsx` - Script loads when component mounts
3. **Added `loading=async`** parameter to the script URL
4. **Proper initialization** - `initMap` is called after script loads, not via callback

## Environment Variable Note

The code now supports both:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Next.js 14 recommended)
- `REACT_APP_GOOGLE` (legacy, for backward compatibility)

For Next.js 14, use `NEXT_PUBLIC_` prefix for client-side environment variables.

## Update Your `.env.local`

```env
# Use NEXT_PUBLIC_ prefix for Next.js 14 (client-side variables)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Or keep using REACT_APP_GOOGLE for backward compatibility
REACT_APP_GOOGLE=your_google_maps_api_key_here
```

## For Vercel Deployment

Add to Vercel environment variables:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (recommended)
- Or `REACT_APP_GOOGLE` (still works)

## Benefits

✅ No more warnings about async loading  
✅ No more "initMap is not a function" errors  
✅ Google Maps only loads when needed (better performance)  
✅ Proper error handling if script fails to load  
✅ Works with Next.js 14 best practices  

