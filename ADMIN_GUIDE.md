# APEX AUTO ADMIN GUIDE

## Admin Access

**URL:** `http://localhost:3000/admin` (or your deployed URL + `/admin`)  
**Password:** `apex.auto.prints@1!.com`

---

## What You Can Do

### 1. PRODUCTS TAB
Manage all your products that appear on the website.

**Add New Product:**
1. Click "ADD PRODUCT"
2. Fill in:
   - Product Name
   - Current Price
   - Original Price (optional - for showing discounts)
   - Category (DIGITAL PRODUCTS, SHOES, CLOTHING, ACCESSORIES, NEW ARRIVALS)
   - Main Image URL
   - Additional Images (optional)
   - Description
   - **Buy URL** - **IMPORTANT:** Add your Etsy product link here!
3. Click "SAVE PRODUCT"

**Edit/Delete Products:**
- Click the edit icon to modify
- Click the trash icon to delete

---

### 2. ABOUT PAGE TAB
Edit the content that appears on your About page.

**Sections:**
- Hero Title
- Hero Description
- Mission Statement
- Values (4 cards with titles and descriptions)

---

### 3. COMPANY RULES TAB
Manage your company policies and rules.

**Features:**
- Add new rules
- Edit existing rules
- Delete rules
- Reorder by dragging (if implemented)

---

### 4. SOCIAL MEDIA TAB
Update your social media links.

**Platforms:**
- Instagram
- Pinterest
- Etsy Shop
- Threads

These links appear on your homepage in the "FOLLOW US" section.

---

### 5. ETSY SYNC TAB
Instructions for syncing your Etsy products to your website.

**How It Works:**
1. Go to your Etsy shop
2. Copy product details (name, price, images, description)
3. Go to PRODUCTS tab
4. Add each product manually
5. **IMPORTANT:** In the "Buy URL" field, paste your Etsy product link
6. When users click "BUY NOW" on your website, they'll be redirected to Etsy

**Why Manual?**
Etsy's API requires complex approval processes and OAuth flows. Manual entry is simpler and gives you full control over what appears on your site.

---

## Product Display on Website

### Homepage
- Products rotate in the featured showcase
- Shows product image, name, price, and discount (if any)
- "BUY NOW" button redirects to your Etsy listing (if Buy URL is provided)

### Products Page
- Grid view of all products
- Filter by category
- Click product to view details
- "BUY NOW" redirects to Etsy

---

## Social Media Integration

### Current Setup
Your website displays social media buttons on the homepage that link to:
- Instagram
- Pinterest
- Etsy Shop
- Threads

### How to Update Links
1. Go to Admin → SOCIAL MEDIA tab
2. Update the URLs
3. Click "SAVE SOCIAL MEDIA"
4. Links update immediately on the homepage

---

## Best Practices

### Product Management
- **Use high-quality images** - Recommended: 1200x1200px or larger
- **Write clear descriptions** - Help customers understand what they're buying
- **Set accurate prices** - Match your Etsy prices
- **Always include Buy URL** - Direct customers to your Etsy shop
- **Use categories** - Makes browsing easier

### Etsy Integration
- **Keep prices in sync** - Update both Etsy and your website when prices change
- **Match product names** - Use the same names on both platforms
- **Link to specific products** - Use the full Etsy product URL, not just your shop URL
- **Example Buy URL:** `https://www.etsy.com/listing/123456789/your-product-name`

### Images
- **Host on reliable services** - Use Etsy's image URLs or upload to Firebase Storage
- **Optimize for web** - Compress images to load faster
- **Use consistent dimensions** - Square images work best (1:1 ratio)

---

## Troubleshooting

### Products Not Showing
- Check if product is saved in Firebase
- Verify image URLs are accessible
- Clear browser cache and reload

### Buy Button Not Working
- Ensure Buy URL is filled in
- Check URL format (must start with `https://`)
- Test the Etsy link directly in browser

### Social Media Links Not Working
- Verify URLs in SOCIAL MEDIA tab
- Make sure URLs include `https://`
- Save changes after editing

### Can't Login
- Password is: `apex.auto.prints@1!.com`
- Clear browser cache
- Try incognito/private browsing mode

---

## Firebase Data Structure

Your data is stored in Firebase Firestore:

```
/products
  /{productId}
    - name
    - price
    - originalPrice
    - discountPercentage
    - category
    - image
    - images[]
    - description
    - buyUrl
    - createdAt
    - updatedAt

/settings
  /about
    - heroTitle
    - heroDescription
    - mission
    - values[]
    
  /companyRules
    - rules[]
    
  /socialMedia
    - instagram
    - pinterest
    - etsy
    - threads
```

---

## Future Enhancements

Possible features to add later:
- Bulk product import from CSV
- Automatic Etsy sync (requires API approval)
- Product inventory tracking
- Order management
- Customer reviews
- Email notifications
- Analytics dashboard

---

## Support

If you need help:
1. Check this guide first
2. Review the SETUP_GUIDE.md for technical details
3. Check Firebase Console for data issues
4. Test in incognito mode to rule out cache issues

---

## Quick Reference

| Action | Location | Notes |
|--------|----------|-------|
| Add Product | Admin → PRODUCTS → ADD PRODUCT | Include Etsy Buy URL |
| Edit Social Links | Admin → SOCIAL MEDIA | Save after changes |
| Update About Page | Admin → ABOUT PAGE | Changes reflect immediately |
| Sync Etsy Products | Admin → ETSY SYNC | Manual process |
| Change Password | components/admin-auth.tsx | Requires code edit |

---

**Remember:** Your website showcases your products, but all purchases happen on Etsy. Make sure every product has a Buy URL pointing to your Etsy listing!
