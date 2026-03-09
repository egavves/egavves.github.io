#!/usr/bin/env python3
"""
Interactive Script to Update Website Publications
Prompts user for h-index, new publications, and news items
"""

import re
import os

WEBSITE_PATH = "/sessions/nice-jolly-goodall/mnt/egavves.github.io/index.html"

def main():
    print("\n" + "=" * 70)
    print("📚 WEBSITE PUBLICATIONS & NEWS UPDATE")
    print("=" * 70 + "\n")
    
    # Step 1: H-index confirmation
    print("STEP 1: H-INDEX CONFIRMATION")
    print("-" * 70)
    h_index_input = input("Enter your current h-index: ").strip()
    print(f"✓ H-index confirmed: {h_index_input}\n")
    
    # Step 2: New publications
    print("STEP 2: NEW PUBLICATIONS")
    print("-" * 70)
    print("Enter new publications (one per line, in format: YEAR | Title | Authors)")
    print("Leave blank when done.\n")
    
    publications = []
    counter = 1
    while True:
        pub_input = input(f"Publication {counter}: ").strip()
        if not pub_input:
            break
        
        parts = [p.strip() for p in pub_input.split('|')]
        if len(parts) >= 2:
            try:
                year = int(parts[0])
                title = parts[1]
                authors = parts[2] if len(parts) > 2 else "Gavves et al."
                venue = parts[3] if len(parts) > 3 else "Google Scholar"
                
                publications.append({
                    'year': year,
                    'title': title,
                    'authors': authors,
                    'venue': venue
                })
                counter += 1
            except ValueError:
                print("  Invalid format. Please use: YEAR | Title | Authors | Venue")
        else:
            print("  Invalid format. Please use: YEAR | Title | Authors")
    
    print(f"✓ Added {len(publications)} publication(s)\n")
    
    # Step 3: News items
    print("STEP 3: NEWS ITEMS")
    print("-" * 70)
    print("Enter news items (one per line).")
    print("Leave blank when done.\n")
    
    news_items = []
    counter = 1
    while True:
        news_input = input(f"News {counter}: ").strip()
        if not news_input:
            break
        
        news_items.append(news_input)
        counter += 1
    
    print(f"✓ Added {len(news_items)} news item(s)\n")
    
    # Step 4: Review and confirm
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"H-index: {h_index_input}")
    print(f"Publications to add: {len(publications)}")
    for pub in publications:
        print(f"  - [{pub['year']}] {pub['title']}")
    print(f"News items to add: {len(news_items)}")
    for news in news_items:
        print(f"  - {news}")
    print()
    
    confirm = input("Proceed with update? (yes/no): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("Update cancelled.")
        return False
    
    print("\n" + "=" * 70)
    print("UPDATING WEBSITE")
    print("=" * 70 + "\n")
    
    # Step 5: Update HTML
    try:
        with open(WEBSITE_PATH, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Update publications
        if publications:
            print("Adding publications...")
            pubs_js = "const pubs = [\n"
            
            for pub in publications:
                title_esc = pub['title'].replace('"', '\\"')
                authors_esc = pub['authors'].replace('"', '\\"')
                venue_esc = pub['venue'].replace('"', '\\"')
                pubs_js += f"    {{ year: {pub['year']}, title: \"{title_esc}\", authors: \"{authors_esc}\", venue: \"{venue_esc}\" }},\n"
            
            # Find and replace the pubs array
            match = re.search(r'const pubs = \[(.*?)\];', html_content, re.DOTALL)
            if match:
                old_pubs = f"const pubs = [{match.group(1)}];"
                # Preserve existing pubs and prepend new ones
                remaining_pubs = match.group(1).strip().rstrip(',')
                
                new_pubs_section = pubs_js + remaining_pubs + "\n    ];"
                html_content = html_content.replace(old_pubs, new_pubs_section)
                print(f"  ✓ Updated {len(publications)} publication(s)")
            else:
                print("  ⚠ Could not find pubs array in HTML")
        
        # Update news
        if news_items:
            print("Adding news items...")
            current_date = __import__('datetime').datetime.now().strftime('%b %Y')
            
            for news in news_items:
                news_html = f'''          <div class="news-item reveal">
            <span class="news-date">{current_date}</span>
            <p class="news-text">{news}</p>
          </div>
'''
                # Insert after the opening <div class="news-list">
                html_content = html_content.replace(
                    '<div class="news-list">',
                    f'<div class="news-list">\n{news_html}',
                    1
                )
            print(f"  ✓ Added {len(news_items)} news item(s)")
        
        # Write back
        with open(WEBSITE_PATH, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print("\n✅ Website updated successfully!")
        print("\nNext steps:")
        print("1. cd /sessions/nice-jolly-goodall/mnt/egavves.github.io")
        print("2. git add index.html")
        print("3. git commit -m 'Update publications from Scholar'")
        print("4. git push origin main")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = main()
    print("\n" + "=" * 70 + "\n")
    if success:
        print("Update complete! 🚀")
    else:
        print("Update failed or cancelled.")

