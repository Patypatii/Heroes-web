# Fix ERR_TOO_MANY_REDIRECTS for Custom Domain

## Problem
Your custom domain `heroesmf.it.com` is causing an `ERR_TOO_MANY_REDIRECTS` error because the app is configured with the wrong base path.

## Root Cause
The Vite config was set to `base: '/Heroes-web/'` which is correct for `patypatii.github.io/Heroes-web/`, but custom domains need `base: '/'` (root path).

## Solution

### Step 1: Deploy with the Correct Configuration

Run the custom domain deployment script:

**For Windows:**
```bash
cd web
deploy-custom-domain.bat
```

**For Linux/Mac:**
```bash
cd web
chmod +x deploy-custom-domain.sh
./deploy-custom-domain.sh
```

### Step 2: Verify DNS Settings

Make sure your DNS is configured correctly. Check your domain registrar settings:

#### Option A: Using A Records (Recommended)
Add these A records for `heroesmf.it.com`:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### Option B: Using CNAME Record
Add a CNAME record:
```
heroesmf.it.com -> patypatii.github.io
```

**Note:** If using a root domain (no www), use A records. If using a subdomain (www.heroesmf.it.com), use CNAME.

### Step 3: Configure GitHub Pages

1. Go to your GitHub repository: https://github.com/patypatii/Heroes-web
2. Navigate to **Settings** → **Pages**
3. Under "Custom domain", enter: `heroesmf.it.com`
4. Click **Save**
5. Wait for DNS check to complete (green checkmark)
6. Enable **Enforce HTTPS** once the DNS check passes

### Step 4: Clear Browser Cache

After deployment:
1. Clear your browser cache and cookies
2. Try accessing the site in an incognito/private window
3. Test URL: https://heroesmf.it.com
4. Test privacy policy: https://heroesmf.it.com/privacy

## Troubleshooting

### If you still get redirect errors:

1. **Wait for DNS propagation** (can take up to 48 hours, usually 10-30 minutes)
   - Check DNS propagation: https://dnschecker.org/#A/heroesmf.it.com

2. **Verify CNAME file is deployed**
   - Visit: https://patypatii.github.io/Heroes-web/CNAME
   - Should show: `heroesmf.it.com`

3. **Check GitHub Pages status**
   - Go to repository Settings → Pages
   - Should show: "Your site is published at https://heroesmf.it.com"

4. **Disable HTTPS temporarily**
   - In GitHub Pages settings, uncheck "Enforce HTTPS"
   - Try accessing http://heroesmf.it.com
   - Re-enable HTTPS after it works

5. **Clear all browser data**
   ```
   Chrome: Settings → Privacy and security → Clear browsing data
   Firefox: Settings → Privacy & Security → Clear Data
   Edge: Settings → Privacy, search, and services → Clear browsing data
   ```

### If you need to switch back to GitHub Pages subdirectory:

1. Use the regular build and deploy:
   ```bash
   npm run build
   deploy-to-github.bat
   ```

2. Remove custom domain from GitHub Pages settings

3. The app will work at: https://patypatii.github.io/Heroes-web/

## Technical Details

### What Changed:

1. **Vite Config** (`vite.config.ts`)
   - Now uses conditional base path
   - Custom domain: `base: '/'`
   - GitHub Pages subdirectory: `base: '/Heroes-web/'`

2. **Build Scripts** (`package.json`)
   - Added `build:custom-domain` script
   - Sets environment variable for correct base path

3. **Deployment Scripts**
   - `deploy-custom-domain.bat/sh` - For custom domain
   - `deploy-to-github.bat/sh` - For GitHub Pages subdirectory

4. **GitHub Pages Files**
   - `404.html` - Handles SPA routing for direct URLs
   - `.nojekyll` - Prevents Jekyll processing
   - `CNAME` - Specifies custom domain

## Testing Checklist

- [ ] Build completes without errors
- [ ] CNAME file is in the deployment
- [ ] DNS check passes in GitHub Pages settings
- [ ] Home page loads: https://heroesmf.it.com
- [ ] Privacy policy loads: https://heroesmf.it.com/privacy
- [ ] Terms page loads: https://heroesmf.it.com/terms
- [ ] No redirect loops
- [ ] HTTPS works (green padlock)

## Support

If you continue to have issues:

1. Check GitHub Pages deployment status
2. Verify DNS records with your domain registrar
3. Wait for full DNS propagation (up to 48 hours)
4. Test from different networks/devices
5. Contact GitHub Support if the issue persists

## Quick Reference

- **Custom Domain**: https://heroesmf.it.com
- **GitHub Pages**: https://patypatii.github.io/Heroes-web/
- **Repository**: https://github.com/patypatii/Heroes-web
- **DNS Checker**: https://dnschecker.org/#A/heroesmf.it.com
